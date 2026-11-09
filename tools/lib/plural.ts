import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const plurals = require("cldr-core/supplemental/plurals.json") as {
  supplemental: {
    version: { _unicodeVersion: string; _cldrVersion: string };
    "plurals-type-cardinal": Record<string, Record<string, string>>;
  };
};

export const CLDR_VERSION = plurals.supplemental.version._cldrVersion;
export const CATEGORY_ORDER = ["zero", "one", "two", "few", "many", "other"] as const;
export type Category = (typeof CATEGORY_ORDER)[number];

function rulesFor(cldr: string): Record<string, string> {
  const rules = plurals.supplemental["plurals-type-cardinal"][cldr];
  if (!rules) throw new Error(`CLDR has no cardinal plural rules for ${cldr}`);
  return rules;
}

/** The categories a language uses, in CLDR order. */
export function categoriesFor(cldr: string): Category[] {
  const rules = rulesFor(cldr);
  return CATEGORY_ORDER.filter((c) => `pluralRule-count-${c}` in rules);
}

// Rule grammar (UTS #35 "Language Plural Rules"), samples after "@" ignored:
//   condition     = and_condition ("or" and_condition)*
//   and_condition = relation ("and" relation)*
//   relation      = operand ("%" value)? ("=" | "!=") range_list
//   range_list    = (value | value ".." value) ("," ...)*

type Range = [number, number];
interface Relation {
  operand: string;
  mod?: number;
  negated: boolean;
  ranges: Range[];
}
type Condition = Relation[][]; // or of ands

function parseRule(text: string): Condition {
  const body = text.split("@")[0]!.trim();
  if (body === "") return [];
  return body.split(/\s+or\s+/).map((and) =>
    and.split(/\s+and\s+/).map((rel) => {
      const m = /^([nivwftce])\s*(?:%\s*(\d+))?\s*(!=|=)\s*([\d.,\s]+)$/.exec(rel.trim());
      if (!m) throw new Error(`unsupported CLDR plural relation: ${rel}`);
      const ranges = m[4]!.split(",").map((part): Range => {
        const [lo, hi] = part.trim().split("..").map(Number);
        return [lo!, hi ?? lo!];
      });
      return { operand: m[1]!, mod: m[2] ? Number(m[2]) : undefined, negated: m[3] === "!=", ranges };
    }),
  );
}

/** Operands for a whole number: n = i = |x|; every fraction and exponent operand is 0. */
function operand(name: string, n: number): number {
  return name === "n" || name === "i" ? Math.abs(n) : 0;
}

function holds(rel: Relation, n: number): boolean {
  let x = operand(rel.operand, n);
  if (rel.mod !== undefined) x %= rel.mod;
  const inside = rel.ranges.some(([lo, hi]) => x >= lo && x <= hi);
  return rel.negated ? !inside : inside;
}

/** The CLDR category of the whole number `n` in a language. */
export function categoryOf(cldr: string, n: number): Category {
  const rules = rulesFor(cldr);
  for (const cat of CATEGORY_ORDER) {
    if (cat === "other") continue;
    const text = rules[`pluralRule-count-${cat}`];
    if (text === undefined) continue;
    if (parseRule(text).some((and) => and.every((rel) => holds(rel, n)))) return cat;
  }
  return "other";
}

/** The `@integer` samples CLDR gives for a category, expanded (`2~16` → 2..16; `…` and `c` forms dropped). */
export function integerSamples(cldr: string, cat: Category): number[] {
  const text = rulesFor(cldr)[`pluralRule-count-${cat}`] ?? "";
  const m = /@integer([^@]*)/.exec(text);
  if (!m) return [];
  const out: number[] = [];
  for (const part of m[1]!.split(",")) {
    const p = part.trim();
    if (p === "" || p === "…" || p.includes("c") || p.includes("e")) continue;
    const [lo, hi] = p.split("~").map(Number);
    for (let x = lo!; x <= (hi ?? lo!); x++) out.push(x);
  }
  return out;
}

/** Wraps an expression in parentheses when it combines terms with `op`. */
const group = (expr: string, op: "and" | "or") => (expr.includes(` ${op} `) ? `(${expr})` : expr);

/** One relation as BrightScript; `x` is `n` or `(n mod m)`. */
function relationExpr(rel: Relation): string {
  const x = rel.mod !== undefined ? `(n mod ${rel.mod})` : "n";
  if (rel.negated) {
    // Outside every range: each value excluded, each span outside its bounds.
    return rel.ranges.map(([lo, hi]) => (lo === hi ? `${x} <> ${lo}` : `(${x} < ${lo} or ${x} > ${hi})`)).join(" and ");
  }
  const alts = rel.ranges.map(([lo, hi]) => (lo === hi ? `${x} = ${lo}` : `${x} >= ${lo} and ${x} <= ${hi}`));
  return alts.length === 1 ? alts[0]! : alts.map((a) => group(a, "and")).join(" or ");
}

/**
 * The condition for a category as a BrightScript boolean expression over the whole
 * number `n`, with the operands that are always 0 for whole numbers folded away, and no
 * parentheses around the whole expression (bslint's code-style rule). Returns "true" or
 * "false" when the condition is constant.
 */
export function brightScriptCondition(cldr: string, cat: Category): string {
  const text = rulesFor(cldr)[`pluralRule-count-${cat}`];
  if (text === undefined) return "false";
  const ors: string[] = [];
  for (const and of parseRule(text)) {
    const parts: string[] = [];
    let constFalse = false;
    for (const rel of and) {
      if (rel.operand !== "n" && rel.operand !== "i") {
        if (!holds(rel, 0)) constFalse = true;
        continue;
      }
      parts.push(relationExpr(rel));
    }
    if (constFalse) continue;
    if (parts.length === 0) return "true";
    ors.push(parts.length === 1 ? parts[0]! : parts.map((p) => group(p, "or")).join(" and "));
  }
  if (ors.length === 0) return "false";
  return ors.length === 1 ? ors[0]! : ors.map((o) => group(o, "and")).join(" or ");
}
