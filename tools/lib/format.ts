// The canonical layout of catalog/*.arb and state/*.json, so parallel branches that add keys
// merge without conflicts at the end of the file:
//   - ARB: "@@locale" first, then other "@@" file metadata, then every key in code-point order,
//     each followed directly by its "@key" block. Metadata blocks keep their own field order
//     (placeholder order is positional on Android and Apple).
//   - state: keys in code-point order.
//   - JSON with 2-space indentation and a trailing newline.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Compares strings by Unicode code point (plain `<` compares UTF-16 code units). */
export function compareCodePoints(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = x[i]!.codePointAt(0)! - y[i]!.codePointAt(0)!;
    if (d !== 0) return d;
  }
  return x.length - y.length;
}

export function canonicalArb(arb: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if ("@@locale" in arb) out["@@locale"] = arb["@@locale"];
  const fileMeta = Object.keys(arb).filter((k) => k.startsWith("@@") && k !== "@@locale").sort(compareCodePoints);
  for (const k of fileMeta) out[k] = arb[k];
  // A "@key" without its message still sorts by the key it describes.
  const keys = new Set(Object.keys(arb).filter((k) => !k.startsWith("@@")).map((k) => (k.startsWith("@") ? k.slice(1) : k)));
  for (const key of [...keys].sort(compareCodePoints)) {
    if (key in arb) out[key] = arb[key];
    if (`@${key}` in arb) out[`@${key}`] = arb[`@${key}`];
  }
  return out;
}

export function canonicalState<T>(state: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.keys(state).sort(compareCodePoints).map((k) => [k, state[k]!]));
}

/**
 * Keys that occur twice in the same object, at any depth, as paths (`a.x`, `@a.x > placeholders`).
 * JSON.parse keeps only the last, so a merge that leaves a key or a metadata field twice would
 * silently lose one value; fmt and check refuse such a file. Text that isn't valid JSON gives
 * none (the parse error is reported instead).
 */
export function duplicateKeys(text: string): string[] {
  try {
    JSON.parse(text);
  } catch {
    return [];
  }
  // One frame per open object or array; objects track their keys and whether a key comes next.
  const stack: { keys?: Set<string>; path: string; expectKey: boolean; last?: string }[] = [];
  const dups: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    const top = stack[stack.length - 1];
    if (c === '"') {
      let j = i + 1;
      while (text[j] !== '"') j += text[j] === "\\" ? 2 : 1;
      if (top?.keys && top.expectKey) {
        const key = JSON.parse(text.slice(i, j + 1)) as string;
        const path = top.path ? `${top.path} > ${key}` : key;
        if (top.keys.has(key)) dups.push(path);
        top.keys.add(key);
        top.last = path;
        top.expectKey = false;
      }
      i = j;
    } else if (c === "{" || c === "[") {
      stack.push({ keys: c === "{" ? new Set() : undefined, path: top?.last ?? top?.path ?? "", expectKey: c === "{" });
    } else if (c === "}" || c === "]") stack.pop();
    else if (c === "," && top?.keys) top.expectKey = true;
  }
  return dups;
}

/** Layout problems of one ARB or state file; empty when it is canonical. */
export function layoutProblems(text: string, kind: "arb" | "state"): { problems: string[]; parsed: boolean } {
  const dups = duplicateKeys(text);
  const canonical = canonicalText(text, kind);
  const problems = dups.length ? [`repeats ${dups.join(", ")} (only the last one counts); remove the extra by hand`] : [];
  if (canonical === undefined) problems.push("not a JSON object");
  else if (!dups.length && canonical !== text) problems.push("not in the canonical layout (sorted keys, @key after its key, 2-space JSON); run make fmt");
  return { problems, parsed: canonical !== undefined };
}

export function jsonText(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}

/** The canonical text of an ARB or state file, or undefined when it isn't a JSON object. */
export function canonicalText(text: string, kind: "arb" | "state"): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return undefined;
  const obj = parsed as Record<string, unknown>;
  return jsonText(kind === "arb" ? canonicalArb(obj) : canonicalState(obj));
}

/** Every file the canonical layout applies to. */
export function formattedFiles(root: string): { file: string; kind: "arb" | "state" }[] {
  const list = (dir: string, ext: string, kind: "arb" | "state") =>
    existsSync(join(root, dir))
      ? readdirSync(join(root, dir))
          .filter((f) => f.endsWith(ext))
          .sort()
          .map((f) => ({ file: join(root, dir, f), kind }))
      : [];
  return [...list("catalog", ".arb", "arb"), ...list("state", ".json", "state")];
}
