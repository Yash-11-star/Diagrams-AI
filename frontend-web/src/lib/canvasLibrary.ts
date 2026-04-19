export interface ShapeItem {
  label: string;
  irType: string;
  width?: number;
  description?: string;

  id: string;
  hint: string;
  arrowType?: "filled" | "open" | "none" | "triangle";
}
export interface CanvasLibrary {
  defaultEdgeType: string;
  edgeTypes?: EdgeTypeItem[];


    defaultEdgeType: "smoothstep",
      { id: "user",     label: "User / Client",  nodeType: "actorNode",   irType: "actor",        defaultLabel: "User" },
      { id: "api",      label: "API Gateway",     nodeType: "processNode", irType: "process",      defaultLabel: "API Gateway" },
      { id: "db",       label: "Database",        nodeType: "storageNode", irType: "storage",      defaultLabel: "Database" },
      { id: "queue",    label: "Message Queue",   nodeType: "queueNode",   irType: "queue",        defaultLabel: "Message Queue" },
      { id: "ext",      label: "External API",    nodeType: "ioNode",      irType: "input_output", defaultLabel: "External API" },
    ],

    defaultEdgeType: "flowEdge",
      { id: "start",    label: "Start",        nodeType: "startNode",   irType: "start",        defaultLabel: "Start",     width: 140, height: 44 },
      { id: "process",  label: "Process",      nodeType: "processNode", irType: "process",      defaultLabel: "Process Step" },
      { id: "io",       label: "Input / Output",nodeType: "ioNode",     irType: "input_output", defaultLabel: "Input / Output" },
  },
  sequence: {
    shapes: [
      { id: "system",   label: "System",       nodeType: "processNode", irType: "process", defaultLabel: "System" },
    ],

    defaultEdgeType: "smoothstep",
      {
        label: "Entity / Table",
        irType: "entity",
        description: "A regular database table",
        height: 120,
      {
        label: "Weak Entity",
        irType: "weak",
        description: "A weak entity dependent on another table",
        height: 120,
      {
        label: "Junction Table",
        irType: "associative",
        description: "An associative table for N:M relationships",
        height: 120,
    ],

    defaultEdgeType: "smoothstep",
      { id: "class",     label: "Class",     nodeType: "classNode",     irType: "class",     defaultLabel: "ClassName",     width: 220, height: 160 },
      { id: "abstract",  label: "Abstract",  nodeType: "abstractNode",  irType: "abstract",  defaultLabel: "AbstractClass", width: 220, height: 160 },
    ],

    defaultEdgeType: "flowEdge",
      { id: "component", label: "Component",  nodeType: "processNode", irType: "process", defaultLabel: "Component" },
      { id: "package",   label: "Package",    nodeType: "storageNode", irType: "storage", defaultLabel: "Package" },
    ],
      { id: "dependency",  label: "Dependency",  hint: "Uses / depends on",          edgeStyle: "dashed", arrowType: "open"   },
      { id: "association",  label: "Association", hint: "Generic connection",          edgeStyle: "solid",  arrowType: "none"   },
  },
  deployment: {
    shapes: [
      { id: "device",   label: "Device",       nodeType: "actorNode",   irType: "actor",        defaultLabel: "Device" },
      { id: "env",      label: "Exec. Env",    nodeType: "processNode", irType: "process",      defaultLabel: "Docker / JVM" },
    edgeTypes: [
      { id: "communicate", label: "Communication",    hint: "Network communication path",    edgeStyle: "dashed", arrowType: "open"   },
  },
  data_flow: {
    shapes: [
      { id: "datastore", label: "Data Store",      nodeType: "storageNode", irType: "storage", defaultLabel: "D1: Store" },
    ],
      { id: "dataflow",     label: "Data Flow",   hint: "Labeled data movement",      edgeStyle: "solid",  arrowType: "filled" },
    ],

    defaultEdgeType: "flowEdge",
      { id: "actor",   label: "Actor",           nodeType: "actorNode",           irType: "actor",           defaultLabel: "Actor" },
      { id: "system",  label: "System Boundary", nodeType: "useCaseBoundaryNode", irType: "system_boundary", defaultLabel: "System" },
    edgeTypes: [
      { id: "include",     label: "<<include>>",   hint: "Required inclusion",       edgeStyle: "dashed", arrowType: "open" },
      { id: "generalization", label: "Generalization", hint: "Actor / use case inheritance", edgeStyle: "solid", arrowType: "triangle" },
  },
  user_flow: {
    shapes: [
      { id: "screen",   label: "Screen",    nodeType: "processNode", irType: "process",  defaultLabel: "Screen" },
      { id: "end",      label: "End",       nodeType: "endNode",     irType: "end",      defaultLabel: "End" },
  },
  user_journey: {
    shapes: [
      { id: "touchpoint",  label: "Touchpoint",  nodeType: "actorNode",   irType: "actor",        defaultLabel: "Touchpoint" },
      { id: "opportunity", label: "Opportunity", nodeType: "startNode",   irType: "start",        defaultLabel: "Opportunity" },
  },
  cloud_arch: {
    shapes: [
      { id: "lb",      label: "Load Balancer",  nodeType: "processNode", irType: "process",      defaultLabel: "Load Balancer" },
      { id: "db",      label: "Managed DB",     nodeType: "storageNode", irType: "storage",      defaultLabel: "Cloud DB" },
      { id: "queue",   label: "Queue / Bus",    nodeType: "queueNode",   irType: "queue",        defaultLabel: "SQS / Bus" },
    ],
      { id: "request",  label: "Request",   hint: "Synchronous request / response", edgeStyle: "solid",  arrowType: "filled" },
      { id: "two_way",  label: "Two-way",   hint: "Bidirectional data exchange",    edgeStyle: "solid",  arrowType: "filled", direction: "two_way" },
  },
  network: {
    shapes: [
      { id: "switch",   label: "Switch",      nodeType: "processNode", irType: "process", defaultLabel: "Switch" },
      { id: "server",   label: "Server",      nodeType: "storageNode", irType: "storage", defaultLabel: "Server" },
      { id: "internet", label: "Internet",    nodeType: "queueNode",   irType: "queue",   defaultLabel: "Internet" },
    edgeTypes: [
      { id: "directed",  label: "Directed",     hint: "Directional traffic flow",         edgeStyle: "solid",  arrowType: "filled" },
    ],

    defaultEdgeType: "flowEdge",
      { id: "trigger", label: "Trigger",     nodeType: "startNode",   irType: "start",        defaultLabel: "Push / PR" },
      { id: "step",    label: "Step",        nodeType: "ioNode",      irType: "input_output", defaultLabel: "npm test" },
      { id: "env",     label: "Environment", nodeType: "storageNode", irType: "storage",      defaultLabel: "Production" },
    ],
};
export function getCanvasLibrary(diagramType: string): CanvasLibrary {
}
