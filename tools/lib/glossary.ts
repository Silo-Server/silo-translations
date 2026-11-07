import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface GlossaryTerm {
  term: string;
  note: string;
  /** Language tag -> required rendering; absent or empty means no fixed rendering. */
  renderings: Map<string, string>;
}

/** RFC 4180 CSV: quoted fields may hold commas, quotes ("") and newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f !== ""));
}

export function loadGlossary(root: string): GlossaryTerm[] {
  const file = join(root, "glossary.csv");
  if (!existsSync(file)) return [];
  const [header, ...rows] = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
  if (!header || header[0] !== "term" || header[1] !== "note") {
    throw new Error("glossary.csv must start with the columns term,note");
  }
  return rows.map((r) => ({
    term: r[0]!,
    note: r[1] ?? "",
    renderings: new Map(header.slice(2).map((tag, i) => [tag, r[i + 2] ?? ""] as const).filter(([, v]) => v !== "")),
  }));
}

/** Lower case without accents, for comparing a translation with a glossary rendering. */
function fold(s: string, tag: string): string {
  return s.toLocaleLowerCase(tag).normalize("NFD").replace(/\p{M}/gu, "");
}

/**
 * Whether a translation uses a glossary rendering. A rendering may list accepted forms separated
 * by "|" (singular and plural, "colección|colecciones"); comparison ignores case and accents.
 */
export function usesRendering(message: string, rendering: string, tag: string): boolean {
  const text = fold(message, tag);
  return rendering.split("|").some((form) => form.trim() !== "" && text.includes(fold(form.trim(), tag)));
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Glossary terms that occur in the English text as whole words, case-insensitively. */
export function termsIn(glossary: GlossaryTerm[], english: string): GlossaryTerm[] {
  return glossary.filter((g) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(g.term)}($|[^\\p{L}\\p{N}])`, "iu").test(english));
}
