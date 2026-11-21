// Right-to-left output: keeps the symbols at the edge of a Latin name on the name's side.
//
// In a right-to-left paragraph the Unicode Bidi Algorithm gives a neutral character between a
// Latin name and the surrounding text the paragraph's direction, so "HDR10+" draws as "+HDR10",
// "/activate" as "activate/" and ".json" as "json.". The catalog stores the text in reading
// order and the style guides keep bidi controls out of it, so the generator adds a left-to-right
// mark (U+200E) at such an edge, in literal text only. Placeholders and <code> contents (commands
// and paths people copy, where a mark would end up in the pasted text) are left to the clients.
import { analyzeAst, TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";
import { isShared } from "../lib/catalog.ts";
import type { CheckedCatalog } from "../lib/check.ts";
import { BIDI_CONTROL } from "./common.ts";
import { mapLiterals } from "./pseudo.ts";

const LRM = "\u200E";
// Text between whitespace, paragraph separators and bidi controls.
const TOKEN = new RegExp(`(?:(?!${BIDI_CONTROL.source})[^\\s\\u001C-\\u001E\\u0085])+`, "gu");
// What may come before a name: quotes and opening brackets (Hebrew opens with ” too), a Hebrew
// or Arabic prefix joined by a hyphen, maqaf or tatweel (ב-, שב-, لـ), or one Arabic letter
// written straight onto it (وEmby, و.nfo). A whole word (סיסמה#PIN) is not a prefix.
const LEAD = /^(?:[([{«»“”„‘’"'`]|[\p{Script=Hebrew}\p{Script=Arabic}]{1,3}[-\u05BE\u0640]|\p{Script=Arabic}(?=\p{Script=Latin}|[^\s\p{L}\p{M}]))+/u;
// What may come after it: sentence punctuation, closing brackets and quotes. These belong to the
// right-to-left sentence and stay where the algorithm puts them.
const TRAIL = /[.,:;!?…،؛؟)\]}«»“”’‘"'`]+$/u;
// A name: Latin letters and the digits and symbols between them, no letters of another script.
// The two branches don't overlap, so a long run can't make the match backtrack.
const NAME = /^(?=.*\p{Script=Latin})(?:\p{Script=Latin}|[^\p{L}\p{Script=Latin}\p{Script=Hebrew}\p{Script=Arabic}])+$/u;
// Parentheses within one paragraph around nothing but a name hold one name, spaces and all:
// "(shift+. / shift+,)". Quotes or Arabic punctuation inside belong to the sentence, so such a
// group is left to the token pass; a bidi control inside means the text sets its own direction.
const GROUP = /\(([^()«»“”„‘’"'`،؛؟\n\r\u001C-\u001E\u0085\u2029]*)\)/g;
// Tags whose text is a literal value people copy; the client lays these out.
const VERBATIM_TAGS: ReadonlySet<string> = new Set(["code"]);
// Elements whose printed text joins the text around it ({host} in "https://{host}/activate").
const VALUES: ReadonlySet<TYPE> = new Set([TYPE.argument, TYPE.number, TYPE.date, TYPE.time, TYPE.pound, TYPE.select, TYPE.plural]);

// Where a name stops: what may open text before it, and what may follow it in the sentence.
const OPENS = /[\s([{«»“”„‘’"'`]/u;
const ENDS = /[\s.,:;!?…،؛؟)\]}«»“”’‘"'`]/u;

/** Whether the element on one side of a literal continues the token at that edge. */
function continues(el: MessageFormatElement | undefined, side: "before" | "after"): boolean {
  if (el === undefined) return false;
  if (el.type === TYPE.tag) return continues(side === "before" ? el.children.at(-1) : el.children[0], side);
  // Literal text beyond a branch or tag edge: a space, quote or sentence punctuation ends the name.
  if (el.type === TYPE.literal) {
    const edge = side === "before" ? el.value.slice(-1) : el.value.slice(0, 1);
    return edge !== "" && !(side === "before" ? OPENS : ENDS).test(edge);
  }
  return VALUES.has(el.type);
}

/** Which edges of a literal run straight into a placeholder's value. */
interface Joined {
  before: boolean;
  after: boolean;
}
const UNJOINED: Joined = { before: false, after: false };

/**
 * The name with a left-to-right mark on each edge that isn't a letter. Digits a letter follows
 * (4K, 1080p) and a final digit already read with the name, so they get none. An edge that runs
 * into a placeholder gets none either: the name continues into a value only the client knows,
 * and a mark there would end up inside it (a copied URL, for one).
 */
function markEdges(name: string, joined = UNJOINED): string {
  const before = joined.before || /^[0-9]*\p{Script=Latin}/u.test(name) ? "" : LRM;
  const after = joined.after || /(?:\p{Script=Latin}|[0-9])$/u.test(name) ? "" : LRM;
  return `${before}${name}${after}`;
}

/** Marks each Latin name in right-to-left text so its edge symbols stay on its side. */
export function markLatinNames(text: string, joined = UNJOINED): string {
  const grouped = text.replace(GROUP, (group, inner: string) =>
    NAME.test(inner) && !BIDI_CONTROL.test(inner) ? `(${markEdges(inner)})` : group,
  );
  const marked = grouped.replace(TOKEN, (token, offset: number) => {
    const lead = LEAD.exec(token)?.[0] ?? "";
    const rest = token.slice(lead.length);
    const trail = TRAIL.exec(rest)?.[0] ?? "";
    const head = rest.slice(0, rest.length - trail.length);
    // An ellipsis right after a symbol continues the name ("lists/…"); after a letter it ends the sentence.
    const ellipsis = trail.startsWith("…") && /[^\p{L}\p{N}]$/u.test(head) ? "…" : "";
    const name = head + ellipsis;
    if (!NAME.test(name)) return token;
    const edges = {
      before: joined.before && offset === 0 && lead === "",
      after: joined.after && offset + token.length === grouped.length,
    };
    return `${lead}${markEdges(name, edges)}${trail.slice(ellipsis.length)}`;
  });
  // Both passes can mark one edge, and the catalog may already carry a mark there: one is enough.
  return marked.replace(/\u200E{2,}/g, LRM);
}

/** One literal of a message, with whatever its neighbours continue at its edges left unmarked. */
function markLiteral(text: string, prev?: MessageFormatElement, next?: MessageFormatElement): string {
  return markLatinNames(text, { before: continues(prev, "before"), after: continues(next, "after") });
}

/** Valid translations as generators write them: right-to-left languages with their names marked. */
export function outputTranslations({ locales, catalog, valid }: CheckedCatalog): Map<string, Map<string, Analysis>> {
  const out = new Map(valid);
  for (const locale of locales.targets) {
    const messages = valid.get(locale.tag);
    if (locale.dir !== "rtl" || !messages) continue;
    const marked = new Map<string, Analysis>();
    for (const [key, a] of messages) {
      const ast = mapLiterals(a.ast, markLiteral, VERBATIM_TAGS);
      marked.set(key, analyzeAst(ast, isShared(catalog.byKey.get(key)!)));
    }
    out.set(locale.tag, marked);
  }
  return out;
}
