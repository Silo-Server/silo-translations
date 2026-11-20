// Right-to-left output: keeps the symbols at the edge of a Latin name on the name's side.
//
// In a right-to-left paragraph the Unicode Bidi Algorithm gives a neutral character between a
// Latin name and the surrounding text the paragraph's direction, so "HDR10+" draws as "+HDR10",
// "/activate" as "activate/" and ".json" as "json.". The catalog stores the text in reading
// order and the style guides keep bidi controls out of it, so the generator adds a left-to-right
// mark (U+200E) at such an edge, in literal text only. Placeholders and rich-text tag contents
// (web's <code> paths, for one, which people copy) are left to the clients, which render them.
import { analyzeAst, type Analysis } from "../lib/icu.ts";
import { isShared } from "../lib/catalog.ts";
import type { CheckedCatalog } from "../lib/check.ts";
import { BIDI_CONTROL } from "./common.ts";
import { mapLiterals } from "./pseudo.ts";

const LRM = "\u200E";
// Text between whitespace and bidi controls.
const TOKEN = new RegExp(`(?:(?!${BIDI_CONTROL.source})\\S)+`, "gu");
// What may come before a name: quotes and opening brackets (Hebrew opens with ” too), a Hebrew
// or Arabic prefix joined by a hyphen, maqaf or tatweel (ב-, שב-, لـ), or one Arabic letter
// written straight onto it (وEmby). A whole word (סיסמה#PIN) is not a prefix.
const LEAD = /^(?:[([{«»“”„‘’"'`]|[\p{Script=Hebrew}\p{Script=Arabic}]{1,3}[-\u05BE\u0640]|\p{Script=Arabic}(?=[\p{Script=Latin}0-9]))+/u;
// What may come after it: sentence punctuation, closing brackets and quotes. These belong to the
// right-to-left sentence and stay where the algorithm puts them.
const TRAIL = /[.,:;!?…،؛؟)\]}«»“”’‘"'`]+$/u;
// A name: Latin letters and the digits and symbols between them, no letters of another script.
const NAME = /^(?=.*\p{Script=Latin})(?:\p{Script=Latin}|[^\p{L}\p{Script=Hebrew}\p{Script=Arabic}])+$/u;
// Parentheses around nothing but a name hold one name, spaces and all: "(shift+. / shift+,)".
const GROUP = /\(([^()]*)\)/g;

/** The name with a left-to-right mark on each edge that isn't a letter (or, at the end, a digit). */
function markEdges(name: string): string {
  const before = /^\p{Script=Latin}/u.test(name) ? "" : LRM;
  const after = /(?:\p{Script=Latin}|[0-9])$/u.test(name) ? "" : LRM;
  return `${before}${name}${after}`;
}

/** Marks each Latin name in right-to-left text so its edge symbols stay on its side. */
export function markLatinNames(text: string): string {
  const grouped = text.replace(GROUP, (group, inner: string) => (NAME.test(inner) ? `(${markEdges(inner)})` : group));
  return grouped.replace(TOKEN, (token) => {
    const lead = LEAD.exec(token)?.[0] ?? "";
    const rest = token.slice(lead.length);
    const trail = TRAIL.exec(rest)?.[0] ?? "";
    const head = rest.slice(0, rest.length - trail.length);
    // An ellipsis right after a symbol continues the name ("lists/…"); after a letter it ends the sentence.
    const ellipsis = trail.startsWith("…") && /[^\p{L}\p{N}]$/u.test(head) ? "…" : "";
    const name = head + ellipsis;
    return NAME.test(name) ? `${lead}${markEdges(name)}${trail.slice(ellipsis.length)}` : token;
  });
}

/** Valid translations as generators write them: right-to-left languages with their names marked. */
export function outputTranslations({ locales, catalog, valid }: CheckedCatalog): Map<string, Map<string, Analysis>> {
  const out = new Map(valid);
  for (const locale of locales.targets) {
    const messages = valid.get(locale.tag);
    if (locale.dir !== "rtl" || !messages) continue;
    const marked = new Map<string, Analysis>();
    for (const [key, a] of messages) {
      const ast = mapLiterals(a.ast, markLatinNames, { intoTags: false });
      marked.set(key, analyzeAst(ast, isShared(catalog.byKey.get(key)!)));
    }
    out.set(locale.tag, marked);
  }
  return out;
}
