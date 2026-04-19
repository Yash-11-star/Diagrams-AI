import json
import re
import xml.etree.ElementTree as ET
from typing import List
import time
import logging

import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
from openai import OpenAI, RateLimitError as OpenAIRateLimitError
from diagram_modules.registry import get_diagram_prompt_module
from models import (
    ArchitectureDiagramIR,
    ArchitectureEdge,
    ArchitectureLayer,
    ArchitectureNode,
    GraphDiagramIR,
    GraphNode,
    SequenceDiagramIR,
    SequenceMessageStep,
    SequenceNoteStep,
    SequenceDividerStep,
    dump_diagram_document,
    parse_diagram_document,
)

logger = logging.getLogger(__name__)

BASE_INSTRUCTIONS = """You are a diagram generation engine. You will be told EXACTLY what diagram type to generate.
You MUST generate the specific diagram type requested — do NOT default to a generic flowchart.
Output ONLY a valid JSON object — no markdown, no code fences, no explanation.
The JSON must have exactly two keys: "nodes" and "edges".
Default node schema: {"id": "<snake_case_unique>", "label": "<human readable label>", "type": "<MUST be from the allowed types listed below>"}
ERD node schema: {"id": "<snake_case_unique>", "label": "<TableName>", "type": "entity", "fields": ["col_name DataType [PK/FK/UNIQUE]", ...]}

CLASS DIAGRAM NODE SCHEMA — CRITICAL:
  {"id": "<snake_case_unique>", "label": "<ClassName ONLY — NO attributes here>", "type": "class|interface|abstract|enum",
   "fields": ["- attr: Type", ...], "methods": ["+ method(param: Type): ReturnType", ...]}
  !! The "label" field must contain ONLY the class name (e.g. "User", "OrderService").
  !! NEVER put attributes or methods into "label". They belong ONLY in "fields" and "methods".
  !! Example of WRONG output: "label": "User - userId: int | login(): void"  ← FORBIDDEN
  !! Example of CORRECT output: "label": "User", "fields": ["- userId: int"], "methods": ["+ login(): void"]

Each edge: {"source": "<node_id>", "target": "<node_id>", "label": "<optional label>"}
Hard rules:
- ONLY use the node types explicitly listed in the diagram-specific rules below. Do NOT invent other types.
- Every id must be unique snake_case.
- Every edge source and target must reference an existing node id.
- Produce a complete, realistic diagram with enough detail to be useful.
- Output raw JSON only. Do not wrap in ```json or any other formatting.
"""

SEQUENCE_BASE_INSTRUCTIONS = """You are a UML sequence diagram generation engine.
You MUST output a strict sequence diagram document, not a graph.
Output ONLY a valid JSON object — no markdown, no code fences, no explanation.

The JSON must follow EXACTLY this schema:
{
  "kind": "sequence",
  "schemaVersion": 2,
  "participants": [
    { "id": "<snake_case_unique>", "name": "<Participant Name>", "role": "actor|participant|system" }
  ],
  "steps": [
    { "id": "<snake_case_unique>", "kind": "message", "from": "<participant_id>", "to": "<participant_id>", "messageType": "sync|async|return|self", "label": "<message text>" },
    { "id": "<snake_case_unique>", "kind": "note", "label": "<note text>", "participantId": "<optional participant_id>", "align": "left|right|over" },
    { "id": "<snake_case_unique>", "kind": "divider", "label": "<divider text>" }
  ],
  "activations": [
    { "id": "<snake_case_unique>", "participantId": "<participant_id>", "startStepId": "<step_id>", "endStepId": "<step_id>" }
  ],
  "fragments": [
    { "id": "<snake_case_unique>", "kind": "fragment", "fragmentType": "loop|alt|opt|par", "label": "<text>", "startStepId": "<step_id>", "endStepId": "<step_id>", "participantIds": ["<participant_id>", "..."], "branchLabel": "<optional text>" }
  ]
}

Hard rules:
- Participants MUST be unique and represent lifelines only.
- Time flows ONLY by the order of items in "steps".
- Every message MUST be between participants using their ids.
- Use messageType="self" only when from == to.
- Activation and fragment references MUST point to existing participant ids and step ids.
- Output raw JSON only.
"""

DIAGRAM_TYPE_HINTS: dict[str, str] = {
    "flowchart": (
        "DIAGRAM TYPE: Flowchart. Generate a step-by-step process flowchart.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | input_output\n"
        "  start = entry point of the flow (one per diagram)\n"
        "  end = exit/termination (can be multiple)\n"
        "  process = an action or step\n"
        "  decision = a yes/no branch (diamond shape)\n"
        "  input_output = data input or output\n"
        "Show a clear linear flow with conditional branches where relevant."
    ),
    "process_flow": (
        "DIAGRAM TYPE: Process Flow. Generate a detailed process flow diagram.\n"
        "ALLOWED node types (use ONLY these): start | end | process | input_output\n"
        "  start = process begins\n"
        "  end = process ends\n"
        "  process = each step in the process\n"
        "  input_output = data or materials entering/leaving a step\n"
        "Show every step sequentially with inputs and outputs."
    ),
    "workflow": (
        "DIAGRAM TYPE: Workflow. Generate a workflow showing who does what.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | actor\n"
        "  actor = a person, role, or department performing tasks\n"
        "  process = a task or activity\n"
        "  decision = a routing choice\n"
        "  start/end = workflow boundaries\n"
        "Connect actor nodes to their tasks. Show handoffs between actors."
    ),
    "user_flow": (
        "DIAGRAM TYPE: User Flow. Generate a UX user flow diagram.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | input_output\n"
        "  start = user entry point (landing, app open)\n"
        "  end = goal completion or exit\n"
        "  process = a screen, page, or UI state the user sees\n"
        "  decision = a user choice or conditional routing\n"
        "  input_output = form or data entry\n"
        "Show every screen transition and decision a user encounters."
    ),
    "process_map": (
        "DIAGRAM TYPE: Process Map. Generate a cross-functional process map.\n"
        "ALLOWED node types (use ONLY these): start | end | process | actor | decision\n"
        "  actor = a team, department, or role (swim lane header)\n"
        "  process = a task owned by that actor\n"
        "  decision = a gateway or approval\n"
        "Map actors to their steps; show handoffs with labeled edges."
    ),
    "architecture": (
        "DIAGRAM TYPE: System Architecture. Generate a software architecture diagram.\n"
        "ALLOWED node types (use ONLY these): process | storage | queue | actor | input_output\n"
        "  actor = external client, user, or third-party system\n"
        "  process = a service, microservice, API, or application\n"
        "  storage = a database, cache, or file store\n"
        "  queue = a message queue, event bus, or pub/sub topic\n"
        "  input_output = an external API call or data interface\n"
        "Do NOT use start/end/decision. Show all services, databases, and their data flows."
    ),
    "system_arch": (
        "DIAGRAM TYPE: Detailed System Architecture. Generate a comprehensive system architecture.\n"
        "ALLOWED node types (use ONLY these): process | storage | queue | actor | input_output\n"
        "  actor = external user, browser, mobile app, third-party\n"
        "  process = every internal service, microservice, API gateway, function\n"
        "  storage = every database (SQL, NoSQL), cache (Redis), blob store\n"
        "  queue = message queues, Kafka topics, SQS, event buses\n"
        "  input_output = CDN, webhook, external API\n"
        "Include load balancers, auth services, monitoring. Label edges with protocols (HTTP, gRPC, AMQP)."
    ),
    "sequence": (
        "DIAGRAM TYPE: Sequence Diagram. Generate a strict UML sequence document.\n"
        "Participants MUST be lifelines only. Use roles actor | participant | system.\n"
        "Use ordered steps for top-to-bottom time flow.\n"
        "Every interaction MUST be a step with kind='message' and messageType='sync|async|return|self'.\n"
        "Add activations when a participant is actively processing between two steps.\n"
        "Add fragments only when the prompt clearly implies loop, alt, opt, or par blocks.\n"
        "Do NOT output generic nodes or edges for sequence diagrams."
    ),
    "uml": (
        "DIAGRAM TYPE: UML Class Diagram. Generate a UML class/object diagram.\n"
        "ALLOWED node types (use ONLY these): actor | process | decision | storage\n"
        "  process = a class (label: ClassName with key attributes)\n"
        "  actor = an interface or abstract class\n"
        "  storage = a data object or value object\n"
        "  decision = an enumeration\n"
        "Edge labels should show relationship type: inherits, implements, uses, has, contains."
    ),
    "state": (
        "DIAGRAM TYPE: State Machine Diagram. Generate a finite state machine.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision\n"
        "  start = initial state\n"
        "  end = final/accepting state\n"
        "  process = each named state the system can be in\n"
        "  decision = a fork or join in concurrent state machines\n"
        "Edge labels MUST be the transition trigger/event (e.g. 'submit', 'timeout', 'cancel'). "
        "Do NOT use actor/storage/queue."
    ),
    "use_case": (
        "DIAGRAM TYPE: Use Case Diagram. Generate a UML use case diagram.\n"
        "ALLOWED node types (use ONLY these): actor | process\n"
        "  actor = external actor (user role, external system) — shown as stick figures\n"
        "  process = a use case (action the system performs for an actor)\n"
        "Edge labels: 'includes', 'extends', or 'association'. "
        "Do NOT use start/end/decision/storage. Each use case should be a verb phrase."
    ),
    "erd": (
        "DIAGRAM TYPE: Developer-Friendly Database ERD.\n"
        "Generate an IMPLEMENTATION-ORIENTED database ERD — this is for software developers, NOT academic Chen notation.\n\n"
        "CRITICAL RULES — violation will produce an unusable diagram:\n"
        "  1. DO NOT generate oval attribute nodes.\n"
        "  2. DO NOT generate diamond relationship nodes.\n"
        "  3. DO NOT generate floating attribute shapes.\n"
        "  4. Every entity is a SINGLE self-contained table node with ALL its columns embedded in 'fields'.\n\n"
        "ALLOWED node type: ONLY 'entity' (one type only).\n"
        "REQUIRED node schema (use EXACTLY this format):\n"
        '  {"id": "snake_case_table", "label": "TableName", "type": "entity", "fields": ["col DataType CONSTRAINT", ...]}\n\n'
        "FIELD FORMAT: 'column_name DataType [PK] [FK] [UNIQUE] [NOT NULL]'\n"
        "  Examples:\n"
        "    'user_id INT PK'\n"
        "    'email VARCHAR(255) UNIQUE NOT NULL'\n"
        "    'department_id INT FK'\n"
        "    'price DECIMAL(10,2) NOT NULL'\n"
        "    'created_at TIMESTAMP DEFAULT NOW()'\n\n"
        "EDGE FORMAT: {\"source\": \"table_a\", \"target\": \"table_b\", \"label\": \"1:N\"}\n"
        "  — label is cardinality ONLY: 1:1, 1:N, or N:M\n"
        "  — source is the 'one' side for 1:N (e.g. User → Orders is User 1:N Orders, edge from users→orders)\n\n"
        "JUNCTION TABLES: For N:M relationships, create an explicit junction table node.\n"
        "  Example: Students N:M Courses → create 'enrollments' table with enrollment_id PK, student_id FK, course_id FK.\n"
        "  Add two 1:N edges: students→enrollments and courses→enrollments. Do NOT draw an N:M edge directly.\n\n"
        "GENERATION TARGETS:\n"
        "  — Generate 4-8 realistic entity tables\n"
        "  — Each entity must have exactly 1 PK field\n"
        "  — Include 3-8 fields per entity (realistic columns with correct SQL data types)\n"
        "  — FK fields must correspond to PK fields in referenced tables\n"
        "  — Use standard SQL data types: INT, BIGINT, VARCHAR(n), TEXT, DECIMAL(p,s), BOOLEAN, TIMESTAMP, UUID, DATE\n"
    ),
    "data_flow": (
        "DIAGRAM TYPE: Data Flow Diagram (DFD). Generate a Yourdon-style DFD.\n"
        "ALLOWED node types (use ONLY these): process | storage | actor | input_output\n"
        "  actor = external entity (source or sink of data, outside the system)\n"
        "  process = a process that transforms data (numbered, e.g. '1.0 Validate Order')\n"
        "  storage = a data store (e.g. 'D1: Customer DB', 'D2: Orders')\n"
        "  input_output = a data flow label node if needed\n"
        "Do NOT use start/end/decision. Label every edge with the data flow name."
    ),
    "network": (
        "DIAGRAM TYPE: Network Topology Diagram. Generate a network infrastructure diagram.\n"
        "ALLOWED node types (use ONLY these): process | storage | actor | queue\n"
        "  actor = end devices (workstation, laptop, mobile, printer)\n"
        "  process = network devices (router, switch, firewall, load balancer, access point)\n"
        "  storage = servers, NAS, SAN, databases\n"
        "  queue = network zones (DMZ, VLAN, subnet — use as grouping node)\n"
        "Do NOT use start/end/decision. Label edges with protocol and speed (e.g. 'Ethernet 1Gbps', 'WAN', 'HTTPS')."
    ),
    "aws": (
        "DIAGRAM TYPE: AWS Architecture Diagram. Generate an AWS cloud architecture.\n"
        "ALLOWED node types (use ONLY these): process | storage | queue | actor | input_output\n"
        "  actor = end user, browser, mobile client, on-premises system\n"
        "  process = compute services: EC2, Lambda, ECS, EKS, Elastic Beanstalk, API Gateway, CloudFront, ALB/NLB\n"
        "  storage = data services: S3, RDS, DynamoDB, ElastiCache, EFS, Redshift, Aurora\n"
        "  queue = messaging: SQS, SNS, EventBridge, Kinesis, MQ\n"
        "  input_output = external integrations, Route53, ACM, IAM, Cognito\n"
        "Use real AWS service names as labels. Show VPCs, subnets conceptually via labels on edges."
    ),
    "azure": (
        "DIAGRAM TYPE: Azure Architecture Diagram. Generate a Microsoft Azure cloud architecture.\n"
        "ALLOWED node types (use ONLY these): process | storage | queue | actor | input_output\n"
        "  actor = end user, client app, on-premises\n"
        "  process = compute: App Service, Azure Functions, AKS, API Management, Azure CDN, Application Gateway\n"
        "  storage = data: Azure SQL, Cosmos DB, Blob Storage, Redis Cache, Data Lake, Synapse\n"
        "  queue = messaging: Service Bus, Event Hubs, Event Grid, Storage Queue\n"
        "  input_output = Azure AD, Key Vault, Monitor, external APIs\n"
        "Use real Azure service names as labels."
    ),
    "terraform": (
        "DIAGRAM TYPE: Terraform Infrastructure Diagram. Generate a Terraform resource dependency graph.\n"
        "ALLOWED node types (use ONLY these): process | storage | actor\n"
        "  actor = Terraform provider or module (e.g. 'provider: aws', 'module: vpc')\n"
        "  process = a Terraform resource (e.g. 'aws_instance.web', 'aws_security_group.app')\n"
        "  storage = a Terraform data source or backend state\n"
        "Edge labels show dependency direction (depends_on, references). "
        "Do NOT use start/end/decision/queue."
    ),
    "kubernetes": (
        "DIAGRAM TYPE: Kubernetes Architecture Diagram. Generate a Kubernetes cluster diagram.\n"
        "ALLOWED node types (use ONLY these): process | storage | actor | queue\n"
        "  actor = external user, Ingress, external DNS, cloud load balancer\n"
        "  process = Kubernetes workload objects: Deployment, Pod, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob, Service, Ingress Controller\n"
        "  storage = PersistentVolume, PersistentVolumeClaim, ConfigMap, Secret, StorageClass\n"
        "  queue = namespace (as a grouping concept node)\n"
        "Do NOT use start/end/decision. Show pod-to-service-to-ingress relationships clearly."
    ),
    "org_chart": (
        "DIAGRAM TYPE: Organizational Chart. Generate a company org chart.\n"
        "ALLOWED node types (use ONLY these): actor | process\n"
        "  actor = individual person or role (e.g. 'CEO', 'Engineering Manager', 'John Smith')\n"
        "  process = a department or team (e.g. 'Engineering', 'Marketing', 'Sales')\n"
        "Do NOT use start/end/decision/storage. Edges show reporting relationships top-down. "
        "Edge label should be the relationship (e.g. 'reports to', 'manages')."
    ),
    "swimlane": (
        "DIAGRAM TYPE: Swimlane Diagram. Generate a cross-functional swimlane diagram.\n"
        "ALLOWED node types (use ONLY these): actor | process | decision | start | end\n"
        "  actor = swimlane header (each department/role gets one actor node)\n"
        "  process = a task in that lane\n"
        "  decision = a gateway or approval step\n"
        "  start/end = process boundaries\n"
        "Group actor nodes first, then connect them to their tasks via edges."
    ),
    "bpmn": (
        "DIAGRAM TYPE: BPMN Business Process Diagram. Generate a BPMN 2.0-style diagram.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | actor | queue\n"
        "  start = BPMN start event (circle)\n"
        "  end = BPMN end event\n"
        "  process = BPMN task (rectangle)\n"
        "  decision = BPMN gateway (XOR, AND, OR — note which in label)\n"
        "  actor = BPMN pool or lane (participant)\n"
        "  queue = BPMN intermediate event or message\n"
        "Model real BPMN semantics: tasks, gateways, events, pools."
    ),
    "user_journey": (
        "DIAGRAM TYPE: User Journey Map. Generate a customer journey map.\n"
        "ALLOWED node types (use ONLY these): actor | process | decision | input_output\n"
        "  actor = the user persona or customer segment\n"
        "  process = a stage/touchpoint/action in the journey (e.g. 'Discovers product', 'Adds to cart')\n"
        "  decision = a moment of choice or consideration\n"
        "  input_output = an emotion, pain point, or opportunity (e.g. 'Feeling: Frustrated', 'Opportunity: Simplify checkout')\n"
        "Show the journey chronologically. Edge labels = journey phase name."
    ),
    "block": (
        "DIAGRAM TYPE: Block Diagram. Generate a high-level block/component diagram.\n"
        "ALLOWED node types (use ONLY these): process | storage | input_output | actor\n"
        "  process = a functional block or component\n"
        "  storage = a memory, buffer, or data store block\n"
        "  input_output = an interface, port, or external signal\n"
        "  actor = an external system or user\n"
        "Keep it high-level. Label edges with signal names, data types, or protocols."
    ),
    "mermaid": (
        "DIAGRAM TYPE: General Diagram. Generate a well-structured flowchart or diagram.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | input_output | actor | storage | queue\n"
        "Choose the most appropriate node types for the described content."
    ),
    "plantuml": (
        "DIAGRAM TYPE: General Diagram. Generate a comprehensive, well-structured diagram.\n"
        "ALLOWED node types (use ONLY these): actor | process | storage | decision | start | end\n"
        "Choose the most appropriate node types for the described content."
    ),
    # ── New types ────────────────────────────────────────────────────────────
    "class": (
        "DIAGRAM TYPE: UML Class Diagram.\n"
        "CRITICAL RULE: Each class node MUST have separate 'fields' (attributes) and 'methods' arrays.\n"
        "Do NOT put attributes or methods inside the 'label' field — label is the class name ONLY.\n\n"
        "ALLOWED node types:\n"
        "  class      = concrete class\n"
        "  interface  = interface (use type 'interface')\n"
        "  abstract   = abstract class (use type 'abstract')\n"
        "  enum       = enumeration (use type 'enum'; list enum constants in 'fields', no 'methods')\n\n"
        "NODE SCHEMA (use EXACTLY this format for class/interface/abstract):\n"
        "  {\"id\": \"snake_case\", \"label\": \"ClassName\", \"type\": \"class\",\n"
        "   \"fields\": [\"-attr: Type\", ...], \"methods\": [\"+method(params): ReturnType\", ...]}\n\n"
        "Attribute format in 'fields': 'visibility name: Type [= default]'\n"
        "  visibility symbols: + (public)  - (private)  # (protected)  ~ (package)\n"
        "  Examples: '- memberId: int'  '+ name: String'  '# balance: double'  '- items: List<Item>'\n\n"
        "Method format in 'methods': 'visibility name(param: Type, ...): ReturnType'\n"
        "  Examples: '+ borrowBook(book: Book): boolean'  '- hashPassword(pwd: String): String'\n"
        "  '+ getTotal(): double'  '# validate(): void'\n\n"
        "EDGE LABELS — use EXACTLY one of these relationship keywords:\n"
        "  extends    = inheritance / generalization (solid line, hollow triangle)\n"
        "  implements = realization (dashed line, hollow triangle)\n"
        "  composes   = composition — strong ownership, lifecycle dependency (filled diamond)\n"
        "  aggregates = aggregation — weak ownership, independent lifecycle (hollow diamond)\n"
        "  uses       = dependency — one class uses another (dashed arrow)\n"
        "  associates = association — general navigable relationship (plain arrow)\n"
        "  Add multiplicity in the label when meaningful: 'composes 1..*' or 'aggregates 0..*'\n\n"
        "GENERATION REQUIREMENTS:\n"
        "  - Generate 4-8 classes/interfaces\n"
        "  - Each class: 2-5 attributes, 1-4 methods (realistic OOP naming)\n"
        "  - Include at least one inheritance or interface implementation\n"
        "  - Include at least one composition or aggregation\n"
        "  - Abstract methods: suffix with ' {abstract}' e.g. '+ draw(): void {abstract}'\n"
        "  - Static members: suffix with ' {static}' e.g. '+ getInstance(): Singleton {static}'\n"
        "  - Do NOT invent node types other than class/interface/abstract/enum\n"
        "  - Do NOT use start/end/process/decision/actor/storage/queue/input_output\n"
    ),
    "component": (
        "DIAGRAM TYPE: UML Component Diagram. Generate a component/module diagram.\n"
        "ALLOWED node types (use ONLY these): process | actor | storage | queue\n"
        "  process = a software component or module\n"
        "  actor = an interface (provided or required)\n"
        "  storage = a data repository or configuration\n"
        "  queue = a package or namespace grouping\n"
        "Edge labels show dependency type: 'uses', 'provides', 'depends on', 'imports'.\n"
        "Do NOT use start/end/decision/input_output."
    ),
    "deployment": (
        "DIAGRAM TYPE: UML Deployment Diagram. Generate a deployment/infrastructure diagram.\n"
        "ALLOWED node types (use ONLY these): storage | actor | process | input_output\n"
        "  storage = a physical or virtual server node (e.g. 'Web Server', 'DB Server', 'Container')\n"
        "  actor = a device or client (e.g. 'Browser', 'Mobile Device', 'IoT Sensor')\n"
        "  process = an execution environment (e.g. 'Docker', 'JVM', 'Node.js Runtime')\n"
        "  input_output = a deployed artifact (e.g. 'app.jar', 'nginx', 'React Build')\n"
        "Edge labels show communication paths: 'HTTP', 'JDBC', 'TCP/IP', 'deploys'.\n"
        "Do NOT use start/end/decision/queue."
    ),
    "cloud_arch": (
        "DIAGRAM TYPE: Cloud Architecture Diagram. Generate a cloud infrastructure architecture.\n"
        "ALLOWED node types (use ONLY these): actor | process | storage | queue | input_output\n"
        "  actor = end user, browser, mobile client, on-premises system\n"
        "  process = compute/networking: Load Balancer, API Gateway, App Server, Lambda Function, Container, CDN\n"
        "  storage = managed data services: PostgreSQL RDS, DynamoDB, Redis Cache, S3/Blob Storage, Data Warehouse\n"
        "  queue = messaging/eventing: Message Queue, Event Bus, Pub/Sub Topic, Stream\n"
        "  input_output = external integrations: Third-party API, OAuth Provider, Payment Gateway, DNS\n"
        "Use cloud-provider-agnostic labels or real service names (S3, Lambda, RDS, etc.).\n"
        "Label edges with protocols (HTTPS, gRPC, AMQP). Do NOT use start/end/decision."
    ),
    "cicd": (
        "DIAGRAM TYPE: CI/CD Pipeline Diagram. Generate a CI/CD pipeline diagram.\n"
        "ALLOWED node types (use ONLY these): start | end | process | decision | storage | input_output\n"
        "  start = trigger event (e.g. 'Git Push', 'PR Created', 'Merge to main')\n"
        "  process = a pipeline stage or job (e.g. 'Build', 'Unit Tests', 'Integration Tests', 'Docker Build', 'Deploy')\n"
        "  decision = a gate or condition (e.g. 'Tests Pass?', 'Manual Approval', 'Coverage > 80%?')\n"
        "  storage = an environment or artifact store (e.g. 'Staging', 'Production', 'Artifact Registry')\n"
        "  input_output = a tool or service (e.g. 'GitHub Actions', 'Jenkins', 'SonarQube', 'Slack Notification')\n"
        "  end = successful deployment or failure notification\n"
        "Show the full pipeline from trigger to deployment with all stages and gates."
    ),
}


REFINEMENT_TEMPLATES: dict[str, str] = {
    "system_arch": (
        "You are an expert software architect. Transform the user's rough description into a precise system architecture specification.\n\n"
        "Structure your output covering:\n"
        "1. ACTORS: Who uses the system (end users, admins, external clients, mobile apps)\n"
        "2. FRONTEND: Client applications (web app, mobile, CLI, etc.)\n"
        "3. API LAYER: API gateway, BFF, REST/GraphQL endpoints\n"
        "4. SERVICES: Backend microservices, monolith modules, or serverless functions\n"
        "5. DATA LAYER: Databases (SQL/NoSQL), caches (Redis), file storage, data warehouses\n"
        "6. MESSAGING: Queues, event buses, pub/sub topics (if applicable)\n"
        "7. EXTERNAL: Third-party services, OAuth providers, payment gateways, CDNs\n"
        "8. KEY DATA FLOWS: Main connections between components with protocol hints (HTTP, gRPC, AMQP)\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Be specific — use real technology names where obvious (e.g. 'PostgreSQL', 'Redis', 'Stripe', 'Auth0'). "
        "Output ONLY the improved architecture specification. No preamble, no explanation."
    ),
    "sequence": (
        "You are an expert in distributed systems and API design. Transform the user's prompt into a precise sequence diagram specification.\n\n"
        "Structure your output as:\n"
        "1. PARTICIPANTS: Every actor and system in the interaction (User, Frontend, Auth Service, API Server, Database, Cache, etc.)\n"
        "2. TRIGGER: The initial event that starts the sequence\n"
        "3. SEQUENCE STEPS (in exact order):\n"
        "   - Step N: [Caller] → [Receiver]: methodName(params)\n"
        "   - Step N return: [Receiver] → [Caller]: responseValue\n"
        "4. CONDITIONALS: If/else branches (e.g. 'if token invalid → return 401')\n"
        "5. LOOPS: Repeated steps (e.g. 'retry up to 3 times on failure')\n"
        "6. NOTES: Important timing constraints or side effects\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use realistic API call names and parameter names. Include request and response steps. "
        "Output ONLY the step-by-step interaction specification."
    ),
    "erd": (
        "You are an expert database architect. Transform the user's description into a precise relational database schema specification.\n"
        "This will be used to generate a developer-friendly ERD (NOT academic Chen notation).\n\n"
        "Structure your output as follows:\n\n"
        "1. DATABASE TABLES: For each table, list:\n"
        "   - Table name (PascalCase)\n"
        "   - All columns with: column_name  DataType  [PK] [FK → ReferencedTable] [UNIQUE] [NOT NULL]\n"
        "   Format each column on its own line.\n\n"
        "   Example:\n"
        "   Users\n"
        "     user_id     INT          PK\n"
        "     email       VARCHAR(255) UNIQUE NOT NULL\n"
        "     name        VARCHAR(100) NOT NULL\n"
        "     role        VARCHAR(20)  DEFAULT 'user'\n"
        "     created_at  TIMESTAMP    DEFAULT NOW()\n\n"
        "2. RELATIONSHIPS:\n"
        "   TableA --[1:N]--> TableB  (describe the business rule)\n"
        "   TableA --[N:M]--> TableB  → junction table: JunctionName\n"
        "   TableA --[1:1]--> TableB\n\n"
        "3. JUNCTION TABLES (for N:M): Fully specify each junction table:\n"
        "   JunctionName\n"
        "     junction_id  INT  PK\n"
        "     table_a_id   INT  FK → TableA\n"
        "     table_b_id   INT  FK → TableB\n"
        "     (any additional columns)\n\n"
        "4. BUSINESS RULES: Key constraints and integrity rules\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Requirements:\n"
        "- Every table must have exactly one primary key column\n"
        "- Use correct SQL data types: INT, BIGINT, VARCHAR(n), TEXT, DECIMAL(p,s), BOOLEAN, TIMESTAMP, UUID, DATE\n"
        "- FK columns must reference a PK in another table\n"
        "- Use realistic, production-quality column names (snake_case)\n"
        "- Generate 4-8 tables with 3-8 columns each\n"
        "Output ONLY the schema specification. No preamble, no commentary."
    ),
    "flowchart": (
        "You are an expert process analyst. Transform the user's prompt into a precise flowchart specification.\n\n"
        "Structure your output as:\n"
        "1. START: The trigger or entry point of the process\n"
        "2. STEPS: Each process step in sequence\n"
        "3. DECISIONS: Each branch point with YES and NO paths\n"
        "4. LOOPS: Any retry or repeat cycles\n"
        "5. INPUTS/OUTPUTS: Data entering or leaving the process\n"
        "6. END: All possible exit points\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Be specific about step names. Output ONLY the flowchart specification."
    ),
    "class": (
        "You are an expert OOP architect. Transform the user's prompt into a precise UML class diagram specification.\n\n"
        "Structure your output covering ALL of the following:\n\n"
        "1. CLASSES: For each concrete class:\n"
        "   ClassName (PascalCase)\n"
        "     Attributes (UML notation):\n"
        "       - fieldName: Type [= defaultValue]\n"
        "       (visibility: + public  - private  # protected  ~ package)\n"
        "     Methods (UML notation):\n"
        "       + methodName(param: Type, ...): ReturnType\n"
        "       Mark abstract methods with {abstract}, static with {static}\n\n"
        "2. INTERFACES: For each interface:\n"
        "   <<interface>> InterfaceName\n"
        "     Methods (all implicitly public abstract):\n"
        "       + methodName(param: Type): ReturnType\n\n"
        "3. ABSTRACT CLASSES: For each abstract class:\n"
        "   <<abstract>> ClassName\n"
        "     Attributes and methods (some methods marked {abstract})\n\n"
        "4. ENUMERATIONS: For each enum:\n"
        "   <<enum>> EnumName\n"
        "     Constants: VALUE_ONE, VALUE_TWO, ...\n\n"
        "5. RELATIONSHIPS (use UML terminology):\n"
        "   - ChildClass extends ParentClass (generalization)\n"
        "   - ConcreteClass implements InterfaceName (realization)\n"
        "   - ClassA composes ClassB [multiplicity] (composition, strong ownership)\n"
        "   - ClassA aggregates ClassB [multiplicity] (aggregation, weak ownership)\n"
        "   - ClassA uses ClassB (dependency)\n"
        "   - ClassA associates ClassB [multiplicity] (association)\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Requirements:\n"
        "- 4-8 classes/interfaces\n"
        "- Each class: 2-5 attributes + 1-4 methods (realistic OOP names)\n"
        "- At least 1 inheritance or implementation relationship\n"
        "- At least 1 composition or aggregation relationship\n"
        "- Multiplicity where relevant: 1, 0..1, *, 1..*\n"
        "Output ONLY the class diagram specification. No preamble."
    ),
    "cloud_arch": (
        "You are an expert cloud architect. Transform the user's prompt into a precise cloud architecture specification.\n\n"
        "Structure your output covering:\n"
        "1. USERS & CLIENTS: Who accesses the system\n"
        "2. EDGE LAYER: CDN, DNS, WAF, Load Balancer\n"
        "3. COMPUTE LAYER: App servers, containers, serverless functions, API gateway\n"
        "4. DATA LAYER: Databases, caches, object storage, data pipeline\n"
        "5. MESSAGING: Queues, event streams, pub/sub\n"
        "6. SECURITY: Auth, secrets management, VPC/networking\n"
        "7. MONITORING: Logging, metrics, alerting services\n"
        "8. EXTERNAL: Third-party integrations\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use specific cloud service names where applicable. Output ONLY the architecture specification."
    ),
    "cicd": (
        "You are an expert DevOps engineer. Transform the user's prompt into a precise CI/CD pipeline specification.\n\n"
        "Structure your output as:\n"
        "1. TRIGGER: What starts the pipeline (push to branch, PR, tag, schedule)\n"
        "2. STAGES (in order with their steps):\n"
        "   - Stage name\n"
        "   - Steps within the stage\n"
        "   - Success/failure conditions\n"
        "3. QUALITY GATES: Code coverage thresholds, approval requirements, test minimums\n"
        "4. ENVIRONMENTS: Dev, Staging, Production — deployment strategy for each\n"
        "5. NOTIFICATIONS: Slack, email, PagerDuty alerts on failure\n"
        "6. ROLLBACK: How failures are handled\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Name stages and tools realistically. Output ONLY the pipeline specification."
    ),
    "use_case": (
        "You are an expert systems analyst. Transform the user's prompt into a precise use case diagram specification.\n\n"
        "Structure your output as:\n"
        "1. SYSTEM BOUNDARY: The name of the system\n"
        "2. ACTORS: All external actors (users, roles, external systems)\n"
        "3. USE CASES: For each use case:\n"
        "   - Name (verb phrase, e.g. 'Login', 'Place Order', 'Generate Report')\n"
        "   - Primary actor\n"
        "   - Any include/extend relationships\n"
        "4. RELATIONSHIPS:\n"
        "   - Actor → Use Case (association)\n"
        "   - Use Case «includes» Use Case\n"
        "   - Use Case «extends» Use Case\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Output ONLY the use case specification."
    ),
    "user_flow": (
        "You are an expert UX designer. Transform the user's prompt into a precise user flow specification.\n\n"
        "Structure your output as:\n"
        "1. ENTRY POINTS: How users enter the flow (landing page, notification, direct URL)\n"
        "2. SCREENS: Each screen/page the user sees\n"
        "3. DECISIONS: Each choice point (login required?, item in cart?, etc.)\n"
        "4. ACTIONS: Key user actions (click, submit, tap)\n"
        "5. HAPPY PATH: The primary successful journey\n"
        "6. EDGE CASES: Error states, empty states, retry flows\n"
        "7. EXIT POINTS: Where the flow ends (success, abandon, error)\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use screen names as they would appear in a real app. Output ONLY the user flow specification."
    ),
    "user_journey": (
        "You are an expert UX researcher. Transform the user's prompt into a precise user journey map specification.\n\n"
        "Structure your output as:\n"
        "1. PERSONA: The user type and their goal\n"
        "2. JOURNEY STAGES: The major phases (e.g. Awareness → Consideration → Purchase → Onboarding → Retention)\n"
        "3. FOR EACH STAGE:\n"
        "   - User actions (what they do)\n"
        "   - Touchpoints (where: website, email, app, support)\n"
        "   - Emotions (how they feel: excited, confused, frustrated, satisfied)\n"
        "   - Pain points (what's difficult)\n"
        "   - Opportunities (what could be improved)\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Be empathetic and realistic. Output ONLY the journey map specification."
    ),
    "network": (
        "You are an expert network engineer. Transform the user's prompt into a precise network diagram specification.\n\n"
        "Structure your output as:\n"
        "1. INTERNET/WAN: External connectivity\n"
        "2. PERIMETER: Firewalls, DMZ, WAF\n"
        "3. NETWORK ZONES: VLANs, subnets with IP ranges\n"
        "4. DEVICES: For each device:\n"
        "   - Type (router, switch, server, workstation, AP)\n"
        "   - Name/hostname\n"
        "   - IP address if relevant\n"
        "5. CONNECTIONS: Links between devices with protocol and speed\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use realistic hostnames and IP schemes. Output ONLY the network specification."
    ),
    "data_flow": (
        "You are an expert data architect. Transform the user's prompt into a precise Data Flow Diagram (DFD) specification.\n\n"
        "Structure your output as:\n"
        "1. EXTERNAL ENTITIES: Systems or users outside the system boundary\n"
        "2. PROCESSES: Numbered processes (1.0, 2.0, etc.) that transform data\n"
        "3. DATA STORES: Named data stores (D1, D2, etc.) where data persists\n"
        "4. DATA FLOWS: For each flow:\n"
        "   - From → To: Data name\n"
        "   - Example: User → 1.0 Validate Order: order_request\n"
        "5. SYSTEM BOUNDARY: What's inside vs outside the system\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use Yourdon-style DFD conventions. Output ONLY the DFD specification."
    ),
    "component": (
        "You are an expert software architect. Transform the user's prompt into a precise component diagram specification.\n\n"
        "Structure your output as:\n"
        "1. COMPONENTS: Each software component/module with its responsibility\n"
        "2. INTERFACES: Provided and required interfaces for each component\n"
        "3. PACKAGES: How components are grouped into packages/namespaces\n"
        "4. DEPENDENCIES: Which component depends on which, and why\n"
        "5. EXTERNAL SYSTEMS: External components/services the system depends on\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use realistic component and interface names. Output ONLY the component specification."
    ),
    "deployment": (
        "You are an expert infrastructure engineer. Transform the user's prompt into a precise deployment diagram specification.\n\n"
        "Structure your output as:\n"
        "1. NODES: Physical or virtual machines/containers\n"
        "   - Type (server, VM, container, cloud instance)\n"
        "   - Name and specs if relevant\n"
        "2. EXECUTION ENVIRONMENTS: Runtime environments on each node (Docker, JVM, OS)\n"
        "3. ARTIFACTS: Software artifacts deployed on each node (JAR, WAR, Docker image, static files)\n"
        "4. COMMUNICATION PATHS: How nodes communicate (protocol, port)\n"
        "5. EXTERNAL SERVICES: Cloud services, managed databases, CDNs\n\n"
        "User's prompt: {user_prompt}\n\n"
        "Use realistic infrastructure naming. Output ONLY the deployment specification."
    ),
}

# Fall back to flowchart refinement for unknown types
def get_refinement_template(diagram_type: str) -> str:
    return REFINEMENT_TEMPLATES.get(diagram_type, REFINEMENT_TEMPLATES["flowchart"])


def build_system_prompt(diagram_type: str = "flowchart") -> str:
    module = get_diagram_prompt_module(diagram_type)
    hint = module.generation_hint if module else DIAGRAM_TYPE_HINTS.get(diagram_type, DIAGRAM_TYPE_HINTS["flowchart"])
    if diagram_type == "sequence":
        return SEQUENCE_BASE_INSTRUCTIONS + "\n\n" + hint
    return BASE_INSTRUCTIONS + "\n\n" + hint

# Keep a default for backward compatibility
SYSTEM_INSTRUCTIONS = build_system_prompt("flowchart")

GRAPH_EDIT_INSTRUCTIONS = """You are a diagram editing engine.
You will receive a JSON diagram IR and a modification instruction.
Apply the modification to the diagram and output the updated diagram as raw JSON only.
Preserve all existing nodes and edges unless explicitly told to remove them.
The JSON must follow the same schema: {"nodes": [...], "edges": [...]}.

CRITICAL — if the diagram contains class/interface/abstract/enum nodes:
- "label" = class name ONLY (e.g. "User", "OrderService") — never attributes or methods
- Attributes belong in "fields": ["- attr: Type", ...]
- Methods belong in "methods": ["+ method(params): ReturnType", ...]
- WRONG: "label": "User - userId: int | login(): void"
- CORRECT: "label": "User", "fields": ["- userId: int"], "methods": ["+ login(): void"]

Output raw JSON only — no markdown, no explanation.
"""

SEQUENCE_EDIT_INSTRUCTIONS = """You are a UML sequence diagram editing engine.
You will receive a structured sequence diagram document plus a modification instruction.
Apply the edit while preserving strict UML sequence semantics and output ONLY valid JSON.

The JSON MUST keep this schema:
{
  "kind": "sequence",
  "schemaVersion": 2,
  "participants": [...],
  "steps": [...],
  "activations": [...],
  "fragments": [...]
}

Critical rules:
- Participants remain lifelines only.
- Step order defines time order; never encode time with coordinates.
- Messages are only "sync", "async", "return", or "self".
- Notes and dividers stay in the ordered "steps" array.
- Activations and fragments must reference existing steps and participants.
- Keep existing participants, steps, activations, and fragments unless the instruction changes them.

Output raw JSON only — no markdown, no explanation.
"""

ARCHITECTURE_EDIT_INSTRUCTIONS = """You are a system architecture diagram editing engine.
You will receive a structured architecture document plus a modification instruction.
Apply the edit while preserving the architecture schema and output ONLY valid JSON.

The JSON MUST keep this schema:
{
  "kind": "architecture",
  "schemaVersion": 1,
  "layers": [...],
  "nodes": [...],
  "edges": [...]
}

Critical rules:
- Layers are first-class editable containers. Keep "layers" as ordered objects with name, description, order, height, style, and childNodeIds.
- Nodes stay in "nodes" and must keep "layerId" membership in sync with the layer they belong to.
- Relationships stay in "edges" and must preserve sourceId, targetId, relationshipType, direction, routing, and style.
- Do not collapse this document into a generic graph.
- Keep existing layers, nodes, and edges unless the instruction changes them.

Output raw JSON only — no markdown, no explanation.
"""


def build_edit_instructions(diagram_type: str) -> str:
    if diagram_type == "sequence":
        return SEQUENCE_EDIT_INSTRUCTIONS
    if diagram_type == "system_arch":
        return ARCHITECTURE_EDIT_INSTRUCTIONS
    module = get_diagram_prompt_module(diagram_type)
    if module:
        return GRAPH_EDIT_INSTRUCTIONS + "\n\n" + module.edit_instructions
    return GRAPH_EDIT_INSTRUCTIONS

_INTER_VARIANT_SLEEP = 4
_MAX_RETRIES = 3
_RETRY_BASE_SLEEP = 15


class RateLimitError(Exception):
    """Raised when the LLM API is still rate-limiting after all retries."""


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?", "", raw, flags=re.IGNORECASE).strip()
    raw = re.sub(r"```$", "", raw).strip()
    return raw


def _is_gemini_rate_limit(exc: Exception) -> bool:
    if isinstance(exc, ResourceExhausted):
        return True
    msg = str(exc).lower()
    return "429" in msg or "resource_exhausted" in msg or "quota" in msg


# ------------------------------------------------------------------ #
# Backend implementations
# ------------------------------------------------------------------ #

class _GeminiBackend:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

    def call(self, system: str, prompt: str, temperature: float) -> str:
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=system,
            generation_config={"temperature": temperature, "max_output_tokens": 4096},
        )
        sleep = _RETRY_BASE_SLEEP
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                response = model.generate_content(prompt)
                return response.text
            except Exception as exc:
                if _is_gemini_rate_limit(exc):
                    if attempt == _MAX_RETRIES:
                        raise RateLimitError(
                            f"Gemini API rate limit exceeded after {_MAX_RETRIES} retries. "
                            "Please wait a moment and try again."
                        ) from exc
                    logger.warning("Gemini rate limit (attempt %d/%d). Sleeping %ds.", attempt, _MAX_RETRIES, sleep)
                    time.sleep(sleep)
                    sleep *= 2
                else:
                    raise


class _OpenAIBackend:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def call(self, system: str, prompt: str, temperature: float) -> str:
        sleep = _RETRY_BASE_SLEEP
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4.1-2025-04-14",
                    messages=[
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=temperature,
                    max_tokens=4096,
                )
                return response.choices[0].message.content
            except OpenAIRateLimitError as exc:
                if attempt == _MAX_RETRIES:
                    raise RateLimitError(
                        f"OpenAI rate limit exceeded after {_MAX_RETRIES} retries. "
                        "Please wait a moment and try again."
                    ) from exc
                logger.warning("OpenAI rate limit (attempt %d/%d). Sleeping %ds.", attempt, _MAX_RETRIES, sleep)
                time.sleep(sleep)
                sleep *= 2
            except Exception:
                raise


# ------------------------------------------------------------------ #
# DiagramService — auto-selects backend based on which key is provided
# ------------------------------------------------------------------ #

class DiagramService:
    def __init__(self, gemini_api_key: str = "", openai_api_key: str = ""):
        if openai_api_key:
            self._backend = _OpenAIBackend(openai_api_key)
            logger.info("Using OpenAI backend (gpt-4o-mini)")
        elif gemini_api_key:
            self._backend = _GeminiBackend(gemini_api_key)
            logger.info("Using Gemini backend (gemini-2.0-flash)")
        else:
            raise ValueError("Provide either GEMINI_API_KEY or GPT_API_KEY in environment.")

    def _call(self, system: str, prompt: str, temperature: float = 0.3) -> str:
        return self._backend.call(system, prompt, temperature)

    def _generate_one(self, prompt: str, diagram_type: str = "flowchart") -> dict:
        system = build_system_prompt(diagram_type)
        logger.info("Generating diagram | type=%s | prompt_preview=%s", diagram_type, prompt[:80])
        raw_text = self._call(system, prompt, temperature=0.3)
        raw = _clean_json(raw_text)
        data = json.loads(raw)
        ir = parse_diagram_document(data)
        return dump_diagram_document(ir)

    def generate_variants(self, prompt: str, n: int = 1, diagram_type: str = "flowchart") -> List[dict]:
        variants = []
        for i in range(n):
            variation_hint = (
                "" if i == 0
                else (
                    f" Generate an alternative structural variant #{i+1} with different interaction structure, branching, or participant granularity."
                    if diagram_type == "sequence"
                    else f" Generate an alternative structural variant #{i+1} with a different layout or grouping."
                )
            )
            diagram = self._generate_one(prompt + variation_hint, diagram_type=diagram_type)
            variants.append(diagram)
            if i < n - 1:
                time.sleep(_INTER_VARIANT_SLEEP)
        return variants

    def refine_prompt(self, prompt: str, diagram_type: str = "flowchart") -> str:
        """Use LLM to transform a rough user prompt into a structured diagram specification."""
        template = get_refinement_template(diagram_type)
        filled = template.format(user_prompt=prompt, diagram_type=diagram_type)
        system = (
            "You are a diagram specification expert. "
            "Transform the user's rough prompt into a precise, structured diagram construction specification. "
            "Be specific, realistic, and thorough. Output ONLY the improved specification — no preamble, no commentary."
        )
        logger.info("Refining prompt | type=%s", diagram_type)
        return self._call(system, filled, temperature=0.2)

    def edit_diagram(self, diagram: dict, instruction: str, diagram_type: str = "flowchart") -> dict:
        payload = (
            f"Current diagram:\n{json.dumps(diagram, indent=2)}\n\n"
            f"Modification instruction: {instruction}"
        )
        raw_text = self._call(build_edit_instructions(diagram_type), payload, temperature=0.2)
        raw = _clean_json(raw_text)
        data = json.loads(raw)
        ir = parse_diagram_document(data)
        return dump_diagram_document(ir)

    def normalize_sequence_graph(self, diagram: dict) -> dict:
        graph = GraphDiagramIR(**diagram)

        def role_for_node(node: GraphNode) -> str:
            if node.type.lower() == "actor":
                return "actor"
            lowered = node.label.lower()
            if any(token in lowered for token in ["service", "server", "api", "db", "database", "gateway", "frontend", "backend", "socket", "notification", "cache"]):
                return "system"
            return "participant"

        def infer_message_type(label: str, source: str, target: str) -> str:
            lowered = label.lower()
            if source == target:
                return "self"
            if any(token in lowered for token in ["return", "response", "result", "ack", "ok", "success"]):
                return "return"
            if any(token in lowered for token in ["emit", "publish", "notify", "event", "async", "enqueue"]):
                return "async"
            return "sync"

        participant_nodes = [node for node in graph.nodes if node.type.lower() != "process"]
        if not participant_nodes:
            participant_nodes = graph.nodes

        participants = [
            {
                "id": node.id,
                "name": node.label,
                "role": role_for_node(node),
            }
            for node in participant_nodes
        ]
        participant_ids = {participant["id"] for participant in participants}

        steps = []
        consumed_edges: set[tuple[str, str, str]] = set()
        for node in graph.nodes:
            if node.type.lower() != "process":
                continue
            incoming = [edge for edge in graph.edges if edge.target == node.id and edge.source in participant_ids]
            outgoing = [edge for edge in graph.edges if edge.source == node.id and edge.target in participant_ids]
            if not incoming or not outgoing:
                continue

            source = incoming[0].source
            target = outgoing[0].target
            label = node.label or outgoing[0].label or incoming[0].label or "message()"
            steps.append({
                "id": node.id,
                "kind": "message",
                "from": source,
                "to": target,
                "messageType": infer_message_type(label, source, target),
                "label": label,
            })
            consumed_edges.add((incoming[0].source, incoming[0].target, incoming[0].label or ""))
            consumed_edges.add((outgoing[0].source, outgoing[0].target, outgoing[0].label or ""))

        for index, edge in enumerate(graph.edges):
            if edge.source not in participant_ids or edge.target not in participant_ids:
                continue
            key = (edge.source, edge.target, edge.label or "")
            if key in consumed_edges:
                continue
            label = edge.label or "message()"
            steps.append({
                "id": f"step_{index}",
                "kind": "message",
                "from": edge.source,
                "to": edge.target,
                "messageType": infer_message_type(label, edge.source, edge.target),
                "label": label,
            })

        normalized = {
            "kind": "sequence",
            "schemaVersion": 2,
            "participants": participants,
            "steps": steps,
            "activations": [],
            "fragments": [],
        }
        return dump_diagram_document(parse_diagram_document(normalized))

    # ------------------------------------------------------------------ #
    # Mermaid export
    # ------------------------------------------------------------------ #
    def to_mermaid(self, diagram: dict) -> str:
        ir = parse_diagram_document(diagram)

        def safe_label(text: str) -> str:
            """Strip characters that break Mermaid syntax."""
            return (text.replace('"', "'")
                        .replace("#", "")
                        .replace("|", "/")
                        .replace("{", "(")
                        .replace("}", ")")
                        .strip())

        _MERMAID_RESERVED = {
            "end", "start", "subgraph", "style", "default", "class",
            "classDef", "click", "linkStyle", "direction", "graph",
            "flowchart", "sequenceDiagram", "stateDiagram",
        }

        def safe_id(node_id: str) -> str:
            """Ensure node ID is a valid Mermaid identifier."""
            sanitized = re.sub(r"[^a-zA-Z0-9_]", "_", node_id)
            if sanitized.lower() in _MERMAID_RESERVED:
                sanitized = sanitized + "_node"
            return sanitized

        if isinstance(ir, SequenceDiagramIR):
            id_map = {participant.id: safe_id(participant.id) for participant in ir.participants}
            lines = ["sequenceDiagram"]
            for participant in ir.participants:
                keyword = "actor" if participant.role == "actor" else "participant"
                lines.append(f"    {keyword} {id_map[participant.id]} as {safe_label(participant.name)}")

            step_index = {step.id: index for index, step in enumerate(ir.steps)}
            activations_by_start: dict[int, list[str]] = {}
            activations_by_end: dict[int, list[str]] = {}
            for activation in ir.activations:
                start_index = step_index.get(activation.startStepId)
                end_index = step_index.get(activation.endStepId)
                if start_index is None or end_index is None:
                    continue
                activations_by_start.setdefault(start_index, []).append(activation.participantId)
                activations_by_end.setdefault(end_index, []).append(activation.participantId)

            fragments_by_start: dict[int, list] = {}
            fragments_by_end: dict[int, list] = {}
            for fragment in ir.fragments:
                start_index = step_index.get(fragment.startStepId)
                end_index = step_index.get(fragment.endStepId)
                if start_index is None or end_index is None:
                    continue
                fragments_by_start.setdefault(start_index, []).append(fragment)
                fragments_by_end.setdefault(end_index, []).append(fragment)

            for index, step in enumerate(ir.steps):
                for fragment in sorted(fragments_by_start.get(index, []), key=lambda item: step_index[item.endStepId], reverse=True):
                    lines.append(f"    {fragment.fragmentType} {safe_label(fragment.label)}".rstrip())

                if isinstance(step, SequenceMessageStep):
                    source = id_map[step.from_]
                    target = id_map[step.to]
                    arrow = "->>"
                    if step.messageType == "async":
                        arrow = "-)"
                    elif step.messageType == "return":
                        arrow = "-->>"
                    elif step.messageType == "self":
                        arrow = "->>"
                    lines.append(f"    {source}{arrow}{target}: {safe_label(step.label)}")
                elif isinstance(step, SequenceNoteStep):
                    if step.participantId and step.participantId in id_map:
                        align = step.align or "right"
                        lines.append(f"    Note {align} of {id_map[step.participantId]}: {safe_label(step.label)}")
                    elif ir.participants:
                        lines.append(f"    Note over {id_map[ir.participants[0].id]}: {safe_label(step.label)}")
                elif isinstance(step, SequenceDividerStep):
                    lines.append(f"    == {safe_label(step.label)} ==")

                for participant_id in activations_by_start.get(index, []):
                    lines.append(f"    activate {id_map[participant_id]}")
                for participant_id in activations_by_end.get(index, []):
                    lines.append(f"    deactivate {id_map[participant_id]}")
                for fragment in sorted(fragments_by_end.get(index, []), key=lambda item: step_index[item.startStepId]):
                    lines.append("    end")

            return "\n".join(lines)

        if isinstance(ir, ArchitectureDiagramIR):
            layer_id_map = {layer.id: safe_id(layer.id) for layer in ir.layers}
            node_id_map = {node.id: safe_id(node.id) for node in ir.nodes}
            lines = [
                "%%{init: {'flowchart': {'curve': 'linear', 'htmlLabels': false}}}%%",
                "flowchart TB",
            ]

            def architecture_shape(node: ArchitectureNode) -> str:
                template = {
                    "actor": "([LABEL])",
                    "storage": "[(LABEL)]",
                    "queue": "[[LABEL]]",
                    "input_output": "[/LABEL/]",
                }.get(node.type.lower(), "[LABEL]")
                return template.replace("LABEL", f'"{safe_label(node.label)}"')

            ordered_layers = sorted(ir.layers, key=lambda layer: layer.order)
            assigned_node_ids = set()
            for layer in ordered_layers:
                lines.append(f'    subgraph {layer_id_map[layer.id]}["{safe_label(layer.name)}"]')
                lines.append("        direction LR")
                layer_nodes = [node for node in ir.nodes if node.layerId == layer.id]
                for node in sorted(layer_nodes, key=lambda item: item.layout.order if item.layout else 0):
                    assigned_node_ids.add(node.id)
                    lines.append(f"        {node_id_map[node.id]}{architecture_shape(node)}")
                lines.append("    end")

            for node in ir.nodes:
                if node.id in assigned_node_ids:
                    continue
                lines.append(f"    {node_id_map[node.id]}{architecture_shape(node)}")

            for layer in ordered_layers:
                lines.append(
                    f"    style {layer_id_map[layer.id]} fill:{layer.style.background},stroke:{layer.style.border},stroke-width:1px,color:#334155"
                )

            for edge in ir.edges:
                src = node_id_map.get(edge.sourceId)
                tgt = node_id_map.get(edge.targetId)
                if not src or not tgt or src == tgt:
                    continue
                connector = "-.->" if edge.relationshipType in {"event_flow", "async_message", "dependency"} or edge.style.dashed else "-->"
                label = safe_label(edge.label)
                lines.append(f"    {src} {connector}|{label}| {tgt}" if label else f"    {src} {connector} {tgt}")

            return "\n".join(lines)

        shape_map = {
            "start":        "([LABEL])",
            "end":          "([LABEL])",
            "process":      "[LABEL]",
            "decision":     "{LABEL}",
            "input_output": "[/LABEL/]",
            "queue":        "[[LABEL]]",
            "storage":      "[(LABEL)]",
            "actor":        "(LABEL)",
        }
        default_shape = "[LABEL]"

        def node_shape(node: GraphNode) -> str:
            template = shape_map.get(node.type.lower(), default_shape)
            return template.replace("LABEL", f'"{safe_label(node.label)}"')

        # Build an ID remap in case any IDs needed sanitising
        id_map = {n.id: safe_id(n.id) for n in ir.nodes}

        lines = [
            "%%{init: {'flowchart': {'curve': 'basis', 'htmlLabels': false}}}%%",
            "flowchart TD",
        ]

        for node in ir.nodes:
            lines.append(f"    {id_map[node.id]}{node_shape(node)}")

        starts    = [id_map[n.id] for n in ir.nodes if n.type.lower() == "start"]
        ends      = [id_map[n.id] for n in ir.nodes if n.type.lower() == "end"]
        decisions = [id_map[n.id] for n in ir.nodes if n.type.lower() == "decision"]
        if starts:
            lines.append(f"    style {starts[0]} fill:#2E74B5,color:#fff,stroke:#1F3864")
        for e in ends:
            lines.append(f"    style {e} fill:#375623,color:#fff,stroke:#1F3864")
        for d in decisions:
            lines.append(f"    style {d} fill:#FFC000,color:#000,stroke:#C47A00")

        node_ids = set(id_map.values())
        for edge in ir.edges:
            src, tgt = id_map.get(edge.source, edge.source), id_map.get(edge.target, edge.target)
            # Skip self-loops — they cause the "suitable point" layout error
            if src == tgt or src not in node_ids or tgt not in node_ids:
                continue
            if edge.label:
                lines.append(f'    {src} -- "{safe_label(edge.label)}" --> {tgt}')
            else:
                lines.append(f"    {src} --> {tgt}")

        return "\n".join(lines)

    # ------------------------------------------------------------------ #
    # draw.io XML export
    # ------------------------------------------------------------------ #
    def to_drawio(self, diagram: dict) -> str:
        ir = parse_diagram_document(diagram)

        root = ET.Element("mxGraphModel")
        root_cell = ET.SubElement(ET.SubElement(root, "root"), "mxCell")
        root_cell.set("id", "0")
        parent_cell = ET.SubElement(root.find("root"), "mxCell")
        parent_cell.set("id", "1")
        parent_cell.set("parent", "0")
        rxml = root.find("root")

        if isinstance(ir, SequenceDiagramIR):
            header_width = 150
            header_height = 42
            lane_gap = 180
            left_padding = 90
            top_padding = 28
            lifeline_top = 94
            row_height = 64
            bottom_padding = 72
            activation_width = 14

            participant_index = {participant.id: index for index, participant in enumerate(ir.participants)}
            step_index = {step.id: index for index, step in enumerate(ir.steps)}

            def lane_center(participant_id: str) -> int:
                return left_padding + participant_index[participant_id] * lane_gap + header_width // 2

            def step_center(step_id: str) -> int:
                return lifeline_top + step_index[step_id] * row_height + row_height // 2

            for participant in ir.participants:
                left = lane_center(participant.id) - header_width // 2
                header = ET.SubElement(rxml, "mxCell")
                header.set("id", participant.id)
                header.set("value", participant.name)
                header.set("style", "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;fontStyle=1;")
                header.set("vertex", "1")
                header.set("parent", "1")
                geo = ET.SubElement(header, "mxGeometry")
                geo.set("x", str(left))
                geo.set("y", str(top_padding))
                geo.set("width", str(header_width))
                geo.set("height", str(header_height))
                geo.set("as", "geometry")

                lifeline = ET.SubElement(rxml, "mxCell")
                lifeline.set("id", f"{participant.id}_lifeline")
                lifeline.set("value", "")
                lifeline.set("style", "shape=line;strokeColor=#94a3b8;dashed=1;html=1;")
                lifeline.set("vertex", "1")
                lifeline.set("parent", "1")
                life_geo = ET.SubElement(lifeline, "mxGeometry")
                life_geo.set("x", str(lane_center(participant.id)))
                life_geo.set("y", str(lifeline_top))
                life_geo.set("width", "1")
                life_geo.set("height", str(max(len(ir.steps), 1) * row_height + bottom_padding // 2))
                life_geo.set("as", "geometry")

            for fragment in ir.fragments:
                start_idx = step_index.get(fragment.startStepId)
                end_idx = step_index.get(fragment.endStepId)
                if start_idx is None or end_idx is None:
                    continue
                span_ids = fragment.participantIds or [participant.id for participant in ir.participants]
                if not span_ids:
                    continue
                left = lane_center(span_ids[0]) - header_width // 2 - 12
                right = lane_center(span_ids[-1]) + header_width // 2 + 12
                top = lifeline_top + start_idx * row_height - 12
                bottom = lifeline_top + end_idx * row_height + row_height + 12

                cell = ET.SubElement(rxml, "mxCell")
                cell.set("id", fragment.id)
                cell.set("value", f"{fragment.fragmentType.upper()} {fragment.label}".strip())
                cell.set("style", "rounded=0;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#cbd5e1;")
                cell.set("vertex", "1")
                cell.set("parent", "1")
                geo = ET.SubElement(cell, "mxGeometry")
                geo.set("x", str(left))
                geo.set("y", str(top))
                geo.set("width", str(right - left))
                geo.set("height", str(bottom - top))
                geo.set("as", "geometry")

            for activation in ir.activations:
                start_idx = step_index.get(activation.startStepId)
                end_idx = step_index.get(activation.endStepId)
                if start_idx is None or end_idx is None or activation.participantId not in participant_index:
                    continue
                cell = ET.SubElement(rxml, "mxCell")
                cell.set("id", activation.id)
                cell.set("value", "")
                cell.set("style", "rounded=0;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#60a5fa;")
                cell.set("vertex", "1")
                cell.set("parent", "1")
                geo = ET.SubElement(cell, "mxGeometry")
                geo.set("x", str(lane_center(activation.participantId) - activation_width // 2))
                geo.set("y", str(lifeline_top + start_idx * row_height + 10))
                geo.set("width", str(activation_width))
                geo.set("height", str((end_idx - start_idx + 1) * row_height - 20))
                geo.set("as", "geometry")

            for index, step in enumerate(ir.steps):
                if isinstance(step, SequenceMessageStep):
                    edge = ET.SubElement(rxml, "mxCell")
                    edge.set("id", step.id)
                    edge.set("value", step.label)
                    edge_style = "endArrow=block;html=1;rounded=0;"
                    if step.messageType == "async":
                        edge_style = "endArrow=open;html=1;rounded=0;"
                    elif step.messageType == "return":
                        edge_style = "endArrow=open;html=1;rounded=0;dashed=1;"
                    edge.set("style", edge_style)
                    edge.set("edge", "1")
                    edge.set("parent", "1")
                    geo = ET.SubElement(edge, "mxGeometry")
                    geo.set("relative", "1")
                    geo.set("as", "geometry")
                    source_point = ET.SubElement(geo, "mxPoint")
                    source_point.set("x", str(lane_center(step.from_)))
                    source_point.set("y", str(lifeline_top + index * row_height + row_height // 2))
                    source_point.set("as", "sourcePoint")
                    target_point = ET.SubElement(geo, "mxPoint")
                    if step.messageType == "self":
                        target_point.set("x", str(lane_center(step.from_) + 50))
                    else:
                        target_point.set("x", str(lane_center(step.to)))
                    target_point.set("y", str(lifeline_top + index * row_height + row_height // 2))
                    target_point.set("as", "targetPoint")
                elif isinstance(step, SequenceNoteStep):
                    left = lane_center(step.participantId) - 40 if step.participantId in participant_index else left_padding
                    cell = ET.SubElement(rxml, "mxCell")
                    cell.set("id", step.id)
                    cell.set("value", step.label)
                    cell.set("style", "shape=note;whiteSpace=wrap;html=1;fillColor=#fef3c7;strokeColor=#f59e0b;")
                    cell.set("vertex", "1")
                    cell.set("parent", "1")
                    geo = ET.SubElement(cell, "mxGeometry")
                    geo.set("x", str(left))
                    geo.set("y", str(lifeline_top + index * row_height + 10))
                    geo.set("width", "140")
                    geo.set("height", "34")
                    geo.set("as", "geometry")
                elif isinstance(step, SequenceDividerStep):
                    cell = ET.SubElement(rxml, "mxCell")
                    cell.set("id", step.id)
                    cell.set("value", step.label)
                    cell.set("style", "shape=line;html=1;strokeColor=#cbd5e1;verticalLabelPosition=middle;verticalAlign=middle;labelBackgroundColor=#ffffff;")
                    cell.set("vertex", "1")
                    cell.set("parent", "1")
                    geo = ET.SubElement(cell, "mxGeometry")
                    geo.set("x", str(left_padding))
                    geo.set("y", str(lifeline_top + index * row_height + row_height // 2))
                    geo.set("width", str(max(len(ir.participants) - 1, 0) * lane_gap + header_width))
                    geo.set("height", "1")
                    geo.set("as", "geometry")

            return ET.tostring(root, encoding="unicode", xml_declaration=False)

        if isinstance(ir, ArchitectureDiagramIR):
            left_padding = 40
            top_padding = 32
            layer_width = 1180
            layer_gap = 28
            header_height = 46
            node_gap = 34
            inner_top = 76
            default_layer_height = 176

            def node_size(node_type: str) -> tuple[int, int]:
                lowered = node_type.lower()
                if lowered == "actor":
                    return (132, 60)
                if lowered == "storage":
                    return (158, 82)
                if lowered == "queue":
                    return (172, 58)
                if lowered == "input_output":
                    return (172, 58)
                return (184, 62)

            node_style_map = {
                "process": "rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#94a3b8;",
                "storage": "shape=cylinder3;whiteSpace=wrap;html=1;fillColor=#fff7ed;strokeColor=#f97316;",
                "queue": "shape=mxgraph.flowchart.queue;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#64748b;dashed=1;",
                "actor": "shape=mxgraph.basic.person;whiteSpace=wrap;html=1;fillColor=#ecfeff;strokeColor=#06b6d4;",
                "input_output": "shape=parallelogram;whiteSpace=wrap;html=1;fillColor=#f5f3ff;strokeColor=#8b5cf6;",
            }
            edge_style_map = {
                "primary": "rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#2563eb;strokeWidth=2.2;endArrow=block;",
                "secondary": "rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#94a3b8;strokeWidth=1.5;endArrow=block;",
                "event": "rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#d97706;strokeWidth=2;dashed=1;endArrow=block;",
                "auth": "rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#7c3aed;strokeWidth=2;endArrow=open;",
                "external": "rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#0f766e;strokeWidth=1.8;endArrow=block;",
                "observability": "rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#475569;strokeWidth=1.6;dashed=1;endArrow=block;",
            }

            ordered_layers = sorted(ir.layers, key=lambda layer: layer.order)
            node_positions: dict[str, tuple[int, int, int, int]] = {}
            current_y = top_padding

            for layer in ordered_layers:
                layer_cell = ET.SubElement(rxml, "mxCell")
                layer_cell.set("id", layer.id)
                layer_cell.set("value", f"{layer.name}\\n{layer.description}".strip())
                layer_cell.set(
                    "style",
                    f"rounded=1;whiteSpace=wrap;html=1;container=1;collapsible=0;fillColor={layer.style.background};strokeColor={layer.style.border};"
                )
                layer_cell.set("vertex", "1")
                layer_cell.set("parent", "1")
                layer_geo = ET.SubElement(layer_cell, "mxGeometry")
                layer_geo.set("x", str(left_padding))
                layer_geo.set("y", str(current_y))
                layer_geo.set("width", str(layer_width))
                layer_geo.set("height", str(max(layer.height, default_layer_height)))
                layer_geo.set("as", "geometry")

                layer_nodes = sorted(
                    [node for node in ir.nodes if node.layerId == layer.id],
                    key=lambda item: item.layout.order if item.layout else 0,
                )
                total_width = sum(node_size(node.type)[0] for node in layer_nodes) + max(len(layer_nodes) - 1, 0) * node_gap
                cursor_x = left_padding + max((layer_width - total_width) // 2, 28)

                for node in layer_nodes:
                    width, height = node_size(node.type)
                    node_cell = ET.SubElement(rxml, "mxCell")
                    node_cell.set("id", node.id)
                    node_cell.set("value", node.label)
                    node_cell.set("style", node_style_map.get(node.type.lower(), node_style_map["process"]))
                    node_cell.set("vertex", "1")
                    node_cell.set("parent", "1")
                    geo = ET.SubElement(node_cell, "mxGeometry")
                    geo.set("x", str(cursor_x))
                    geo.set("y", str(current_y + inner_top))
                    geo.set("width", str(width))
                    geo.set("height", str(height))
                    geo.set("as", "geometry")
                    node_positions[node.id] = (cursor_x, current_y + inner_top, width, height)
                    cursor_x += width + node_gap

                current_y += max(layer.height, default_layer_height) + layer_gap

            unassigned = [node for node in ir.nodes if not node.layerId]
            cursor_x = left_padding + 24
            for node in unassigned:
                width, height = node_size(node.type)
                node_cell = ET.SubElement(rxml, "mxCell")
                node_cell.set("id", node.id)
                node_cell.set("value", node.label)
                node_cell.set("style", node_style_map.get(node.type.lower(), node_style_map["process"]))
                node_cell.set("vertex", "1")
                node_cell.set("parent", "1")
                geo = ET.SubElement(node_cell, "mxGeometry")
                geo.set("x", str(cursor_x))
                geo.set("y", str(current_y))
                geo.set("width", str(width))
                geo.set("height", str(height))
                geo.set("as", "geometry")
                node_positions[node.id] = (cursor_x, current_y, width, height)
                cursor_x += width + node_gap

            for edge in ir.edges:
                if edge.sourceId not in node_positions or edge.targetId not in node_positions:
                    continue
                edge_cell = ET.SubElement(rxml, "mxCell")
                edge_cell.set("id", edge.id)
                edge_cell.set("value", edge.label)
                edge_style = edge_style_map.get(edge.style.token, edge_style_map["secondary"])
                if edge.routing.mode == "straight":
                    edge_style = edge_style.replace("orthogonalLoop=1;", "")
                if edge.direction == "two_way":
                    edge_style += "startArrow=block;"
                edge_cell.set("style", edge_style)
                edge_cell.set("edge", "1")
                edge_cell.set("parent", "1")
                edge_cell.set("source", edge.sourceId)
                edge_cell.set("target", edge.targetId)
                geo = ET.SubElement(edge_cell, "mxGeometry")
                geo.set("relative", "1")
                geo.set("as", "geometry")

            return ET.tostring(root, encoding="unicode", xml_declaration=False)

        style_map = {
            "start":        "ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;",
            "end":          "ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;",
            "process":      "rounded=1;whiteSpace=wrap;html=1;",
            "decision":     "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;",
            "input_output": "shape=parallelogram;whiteSpace=wrap;html=1;",
            "queue":        "shape=mxgraph.flowchart.queue;whiteSpace=wrap;html=1;",
            "storage":      "shape=cylinder3;whiteSpace=wrap;html=1;",
            "actor":        "shape=mxgraph.basic.person;whiteSpace=wrap;html=1;",
        }
        default_style = "rounded=1;whiteSpace=wrap;html=1;"

        col_width, row_height, x_start, y_start, padding = 160, 60, 40, 40, 20
        nodes_per_col = max(4, len(ir.nodes) // 3 + 1)

        for idx, node in enumerate(ir.nodes):
            col = idx // nodes_per_col
            row = idx % nodes_per_col
            x = x_start + col * (col_width + padding * 4)
            y = y_start + row * (row_height + padding)

            cell = ET.SubElement(rxml, "mxCell")
            cell.set("id", node.id)
            cell.set("value", node.label)
            cell.set("style", style_map.get(node.type.lower(), default_style))
            cell.set("vertex", "1")
            cell.set("parent", "1")
            geo = ET.SubElement(cell, "mxGeometry")
            geo.set("x", str(x))
            geo.set("y", str(y))
            geo.set("width", str(col_width))
            geo.set("height", str(row_height))
            geo.set("as", "geometry")

        for i, edge in enumerate(ir.edges):
            cell = ET.SubElement(rxml, "mxCell")
            cell.set("id", f"edge_{i}")
            cell.set("value", edge.label or "")
            cell.set("style", "edgeStyle=orthogonalEdgeStyle;html=1;")
            cell.set("edge", "1")
            cell.set("source", edge.source)
            cell.set("target", edge.target)
            cell.set("parent", "1")
            geo = ET.SubElement(cell, "mxGeometry")
            geo.set("relative", "1")
            geo.set("as", "geometry")

        return ET.tostring(root, encoding="unicode", xml_declaration=False)
