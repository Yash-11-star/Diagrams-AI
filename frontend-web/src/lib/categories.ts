export interface Category {
  label: string;
  icon: string;
  diagrams: string[];


  id: string;
  purpose: string;
  color: string;
  backendType: string;

  {
    label: "Core Diagrams",
    icon: "Layers",
    diagrams: ["system_arch", "flowchart", "sequence", "erd", "class"],
  {
    label: "Scalable Systems",
    icon: "Network",
    diagrams: ["component", "deployment", "data_flow"],
  {
    label: "Product & UX",
    icon: "MousePointer2",
    diagrams: ["use_case", "user_flow", "user_journey"],
  {
    label: "DevOps & Cloud",
    icon: "Cloud",
    diagrams: ["cloud_arch", "network", "cicd"],
];
export const DIAGRAM_TYPES: Record<string, DiagramMeta> = {
  system_arch: {
    label: "System Architecture",
    icon: "Server",
    categoryId: "core",
  },
    id: "flowchart",
    purpose: "Logic, process steps, and branch decisions",
    color: "indigo",
    backendType: "flowchart",
  sequence: {
    label: "Sequence Diagram",
    icon: "ArrowLeftRight",
    categoryId: "core",
  },
    id: "erd",
    purpose: "Entities, attributes, and relationships",
    color: "amber",
    backendType: "erd",
  class: {
    label: "Class Diagram",
    icon: "Code2",
    categoryId: "core",
  },
  component: {
    label: "Component Diagram",
    icon: "Puzzle",
    categoryId: "scalable",
  },
    id: "deployment",
    purpose: "Hardware nodes and software artifacts",
    color: "purple",
    backendType: "deployment",
  data_flow: {
    label: "Data Flow Diagram",
    icon: "Share2",
    categoryId: "scalable",
  },
  use_case: {
    label: "Use Case Diagram",
    icon: "User",
    categoryId: "product_ux",
  },
    id: "user_flow",
    purpose: "Screens, decisions, and navigation paths",
    color: "teal",
    backendType: "user_flow",
  user_journey: {
    label: "User Journey Map",
    icon: "Map",
    categoryId: "product_ux",
  },
  cloud_arch: {
    label: "Cloud Architecture",
    icon: "Cloud",
    categoryId: "devops_cloud",
  },
    id: "network",
    purpose: "Routers, switches, and topology",
    color: "red",
    backendType: "network",
  cicd: {
    label: "CI/CD Pipeline",
    icon: "Workflow",
    categoryId: "devops_cloud",
  },

export function getCategoryById(id: string): Category | undefined {
}
export function getDiagramsByCategory(categoryId: string): DiagramMeta[] {
  if (!category) return [];
}
export function getDiagramMeta(diagramId: string): DiagramMeta | undefined {
}

  CategoryColor,
> = {
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  violet: {
    border: "border-violet-200",
    iconBg: "bg-violet-100",
  },
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  orange: {
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },

  string,
> = {
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700",  iconBg: "bg-indigo-100" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   iconBg: "bg-amber-100" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  iconBg: "bg-violet-100" },
  fuchsia: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", iconBg: "bg-fuchsia-100" },
  teal:    { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700",    iconBg: "bg-teal-100" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700",  iconBg: "bg-orange-100" },
  yellow:  { bg: "bg-yellow-50",  border: "border-yellow-200",  text: "text-yellow-700",  iconBg: "bg-yellow-100" },
