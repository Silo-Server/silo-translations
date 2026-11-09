// Key-level three-way merge of ARB files, for integrating catalog branches whose history forked
// from an older seed. Each key is one unit (the message plus its @key metadata).
//
//   node tools/merge-arb.ts --base <file> --ours <file> --theirs <file> [--out <file>] [--keep-our-descriptions]
//
//   theirs == base           keep ours
//   ours == base             take theirs (including a removal)
//   ours == theirs           keep it
//   both changed             field by field: a field changed on one side takes that side,
//                            x-platforms is the union (omitted means every platform), and of
//                            two rewritten descriptions the one containing the other wins
//   --keep-our-descriptions: two independently rewritten descriptions keep ours, reported
//                            under "descriptions" (without it they are a conflict)
//   otherwise                a conflict: ours is kept and the key is reported
//
// Writes the result in the canonical layout and prints a JSON report to stdout
// ({ added, changed, removed, widened, descriptions, conflicts }). Exit 0 even with conflicts; the caller
// decides.
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { PLATFORMS } from "./lib/catalog.ts";
import { canonicalArb, jsonText } from "./lib/format.ts";

type Arb = Record<string, unknown>;
interface Unit {
  message?: unknown;
  meta?: Record<string, unknown>;
}

function units(arb: Arb): Map<string, Unit> {
  const out = new Map<string, Unit>();
  for (const [k, v] of Object.entries(arb)) {
    if (k.startsWith("@@")) continue;
    const key = k.startsWith("@") ? k.slice(1) : k;
    const u = out.get(key) ?? {};
    if (k.startsWith("@")) u.meta = v as Record<string, unknown>;
    else u.message = v;
    out.set(key, u);
  }
  return out;
}

/**
 * Compares units (or metadata) regardless of field order at the top level. Values inside a field
 * keep their order: placeholder order is positional on Android and Apple.
 */
function norm(v: unknown): string {
  if (v === undefined) return "undefined";
  if (v === null || typeof v !== "object" || Array.isArray(v)) return JSON.stringify(v);
  const o = v as Record<string, unknown>;
  return JSON.stringify(Object.keys(o).sort().map((k) => [k, k === "meta" ? norm(o[k]) : o[k]]));
}
const same = (a: unknown, b: unknown) => norm(a) === norm(b);

/** The union of two x-platforms lists; omitted means every platform. */
function unitePlatforms(a: unknown, b: unknown): string[] | undefined {
  if (a === undefined || b === undefined) return undefined;
  const union = PLATFORMS.filter((p) => (a as string[]).includes(p) || (b as string[]).includes(p));
  return union.length === PLATFORMS.length ? undefined : union;
}

/** The one-sided value of a field in a three-way merge, or undefined when both sides changed it. */
function oneSided<T>(base: T, ours: T, theirs: T): { value: T } | undefined {
  if (same(ours, theirs) || same(theirs, base)) return { value: ours };
  if (same(ours, base)) return { value: theirs };
  return undefined;
}

/**
 * Field-by-field merge of a key both sides changed: each field changed on one side only takes
 * that side, x-platforms is the union, and a description both sides rewrote keeps the one that
 * contains the other. Returns undefined when the message or another field changed on both sides,
 * and `clash` when the two descriptions are independent rewrites (ours is kept).
 */
function fieldMerge(b: Unit | undefined, o: Unit, t: Unit): { unit: Unit; clash: boolean } | undefined {
  const message = oneSided(b?.message, o.message, t.message);
  if (!message) return undefined;
  const bm = b?.meta ?? {};
  const om = o.meta ?? {};
  const tm = t.meta ?? {};
  const meta: Record<string, unknown> = {};
  let clash = false;
  for (const field of new Set([...Object.keys(om), ...Object.keys(tm)])) {
    let value: unknown;
    if (field === "x-platforms") value = unitePlatforms(om[field], tm[field]);
    else {
      const v = oneSided(bm[field], om[field], tm[field]);
      if (v) value = v.value;
      else if (field === "description" && typeof om[field] === "string" && typeof tm[field] === "string") {
        const [od, td] = [om[field] as string, tm[field] as string];
        if (od.includes(td)) value = od;
        else if (td.includes(od)) value = td;
        else {
          value = od;
          clash = true;
        }
      } else return undefined;
    }
    if (value !== undefined) meta[field] = value;
  }
  return { unit: { message: message.value, meta }, clash };
}

export interface MergeReport {
  added: string[];
  changed: string[];
  removed: string[];
  /** Both sides changed the key; merged field by field (platforms united, one-sided fields taken). */
  widened: string[];
  /** Descriptions both sides rewrote independently: merged otherwise, our description kept. */
  descriptions: { key: string; ours?: Unit; theirs?: Unit; base?: Unit }[];
  conflicts: { key: string; ours?: Unit; theirs?: Unit; base?: Unit }[];
  /** Keys that existed here whose English or placeholders the merge changed (for review). */
  englishChanged: string[];
}

export function mergeArb(base: Arb, ours: Arb, theirs: Arb, keepOurDescriptions = false): { result: Arb; report: MergeReport } {
  const b = units(base);
  const o = units(ours);
  const t = units(theirs);
  const report: MergeReport = { added: [], changed: [], removed: [], widened: [], descriptions: [], conflicts: [], englishChanged: [] };
  const result = new Map(o);
  for (const key of new Set([...b.keys(), ...t.keys()])) {
    const bu = b.get(key);
    const ou = o.get(key);
    const tu = t.get(key);
    if (same(tu, bu)) continue;
    if (same(ou, bu)) {
      if (tu === undefined) {
        result.delete(key);
        report.removed.push(key);
      } else {
        result.set(key, tu);
        (bu === undefined ? report.added : report.changed).push(key);
      }
      continue;
    }
    if (same(ou, tu)) continue;
    const m = ou && tu ? fieldMerge(bu, ou, tu) : undefined;
    if (m && (!m.clash || keepOurDescriptions)) {
      result.set(key, m.unit);
      if (m.clash) report.descriptions.push({ key, ours: ou, theirs: tu, base: bu });
      else report.widened.push(key);
      continue;
    }
    report.conflicts.push({ key, ours: ou, theirs: tu, base: bu });
  }
  for (const [key, ou] of o) {
    const ru = result.get(key);
    if (ru && (!same(ou.message, ru.message) || !same(ou.meta?.placeholders, ru.meta?.placeholders))) report.englishChanged.push(key);
  }
  const arb: Arb = {};
  for (const [k, v] of Object.entries(ours)) if (k.startsWith("@@")) arb[k] = v;
  for (const [key, u] of result) {
    if (u.message !== undefined) arb[key] = u.message;
    if (u.meta !== undefined) arb[`@${key}`] = u.meta;
  }
  return { result: canonicalArb(arb), report };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { base: { type: "string" }, ours: { type: "string" }, theirs: { type: "string" }, out: { type: "string" }, "keep-our-descriptions": { type: "boolean" } },
  });
  const read = (f: string) => JSON.parse(readFileSync(f, "utf8")) as Arb;
  const { result, report } = mergeArb(read(values.base!), read(values.ours!), read(values.theirs!), values["keep-our-descriptions"]);
  writeFileSync(values.out ?? values.ours!, jsonText(result));
  console.log(JSON.stringify(report, null, 1));
}
