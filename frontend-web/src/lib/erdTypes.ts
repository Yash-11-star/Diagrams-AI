
export interface ERDField {
  name: string;
  isPK: boolean;
  isNullable: boolean;
  defaultValue?: string;
}
export type TableStyle = "regular" | "weak" | "associative";
export interface ERDTableData {
  nodeType: string;
  tableStyle?: TableStyle;

  "PK", "FK", "UNIQUE", "NOT", "NULL", "DEFAULT",
]);
export function parseFieldString(s: string, index: number = 0): ERDField {
  const name = parts[0] ?? "col";
  const isFK = parts.includes("FK");
  const notIdx = parts.indexOf("NOT");
  const isNullable = !isPK && !hasNotNull;
  const defaultValue = defaultIdx > -1 ? parts.slice(defaultIdx + 1).join(" ") : undefined;
  const typeWords = parts.slice(1).filter((p) => !CONSTRAINT_WORDS.has(p));

    id: `f_${name}_${index}_${Math.random().toString(36).slice(2, 5)}`,
    dataType,
    isFK,
    isUnique,
  };

  const parts = [f.name, f.dataType];
  if (f.isFK) parts.push("FK");
  if (!f.isNullable && !f.isPK) parts.push("NOT NULL");
  return parts.join(" ");

  kind: "regular" | "pk" | "fk" = "regular",
): ERDField {
    id: `f_new_${Date.now()}_${index}`,
    dataType: "INT",
    isFK: kind === "fk",
    isUnique: kind === "pk",
  return base;
