
export type Visibility = "+" | "-" | "#" | "~";

  id: string;
  name: string;
  defaultValue?: string;
  isAbstract: boolean;

  id: string;
  name: string;
  returnType: string;
  isAbstract: boolean;

  label: string;
  classKind: ClassKind;
  methods: ClassMethod[];


  const idx = VISIBILITY_CYCLE.indexOf(v);
}
export const VISIBILITY_TITLE: Record<Visibility, string> = {
  "-": "private",
  "~": "package",

function isVisChar(c: string): c is Visibility {
}
export function parseAttributeString(s: string, index: number): ClassAttribute {
  const visibility: Visibility = isVisChar(trimmed[0]) ? (trimmed[0] as Visibility) : "+";

  const isAbstract = rest.includes("{abstract}");

  const name = (colonIdx > -1 ? clean.slice(0, colonIdx) : clean).trim();

  const type = (eqIdx > -1 ? afterColon.slice(0, eqIdx) : afterColon).trim();

    id: `a_${index}_${Math.random().toString(36).slice(2, 5)}`,
    name: name || "attribute",
    defaultValue,
    isAbstract,
}
export function parseMethodString(s: string, index: number): ClassMethod {
  const visibility: Visibility = isVisChar(trimmed[0]) ? (trimmed[0] as Visibility) : "+";

  const isAbstract = rest.includes("{abstract}");

  const parenClose = clean.lastIndexOf(")");
  const parameters =
      ? clean.slice(parenOpen + 1, parenClose).trim()

  const colonIdx = afterClose.indexOf(":");

    id: `m_${index}_${Math.random().toString(36).slice(2, 5)}`,
    name: name || "method",
    returnType: returnType || "void",
    isAbstract,
}

  let s = `${a.visibility} ${a.name}: ${a.type}`;
  if (a.isStatic) s += " {static}";
  return s;

  let s = `${m.visibility} ${m.name}(${m.parameters}): ${m.returnType}`;
  if (m.isAbstract) s += " {abstract}";
}

  return {
    visibility: "-",
    type: "String",
    isAbstract: false,
}
export function blankMethod(index: number = 0): ClassMethod {
    id: `m_new_${Date.now()}_${index}`,
    name: "method",
    returnType: "void",
    isAbstract: false,
}
export function kindStereotype(kind: ClassKind): string | null {
  if (kind === "abstract") return "«abstract»";
  return null;
