// Pseudo-locales built from English: en-XA (accented, about 40% longer, wrapped in brackets that
// mark where each string starts and ends) and ar-XB (each text run forced right-to-left).
// Placeholders are kept as they are.
import { analyzeAst, TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";
import { isShared, type SourceEntry } from "../lib/catalog.ts";
import type { PseudoLocale } from "../lib/locales.ts";

const ACCENTS: Record<string, string> = Object.fromEntries(
  [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((c, i) => [c, [..."åƀçđéƒĝĥîĵķļɱñöþǫŕšţûṽŵẋýžÅƁÇĐÉƑĜĤÎĴĶĻṀÑÖÞǪŔŠŢÛṼŴẊÝŽ"][i]!]),
);
const RLO = "\u202E";
const PDF = "\u202C";
const RLM = "\u200F";

function mapLiterals(elements: MessageFormatElement[], f: (s: string) => string): MessageFormatElement[] {
  return elements.map((el) => {
    if (el.type === TYPE.literal) return { ...el, value: f(el.value) };
    if (el.type === TYPE.plural || el.type === TYPE.select) {
      const options = Object.fromEntries(Object.entries(el.options).map(([k, o]) => [k, { ...o, value: mapLiterals(o.value, f) }]));
      return { ...el, options } as MessageFormatElement;
    }
    if (el.type === TYPE.tag) return { ...el, children: mapLiterals(el.children, f) };
    return el;
  });
}

/** Joins adjacent literal elements, as the parser would, so the output matches a parsed message. */
function mergeLiterals(elements: MessageFormatElement[]): MessageFormatElement[] {
  const out: MessageFormatElement[] = [];
  for (const el of elements) {
    let next = el;
    if (el.type === TYPE.plural || el.type === TYPE.select) {
      const options = Object.fromEntries(Object.entries(el.options).map(([k, o]) => [k, { ...o, value: mergeLiterals(o.value) }]));
      next = { ...el, options } as MessageFormatElement;
    } else if (el.type === TYPE.tag) next = { ...el, children: mergeLiterals(el.children) };
    const last = out[out.length - 1];
    if (next.type === TYPE.literal && last?.type === TYPE.literal) out[out.length - 1] = { ...last, value: last.value + next.value };
    else out.push(next);
  }
  return out;
}

/** Visible text length: literals, tag contents, and the longest branch of a select or plural. */
function textLength(elements: MessageFormatElement[]): number {
  return elements.reduce((n, el) => {
    if (el.type === TYPE.literal) return n + [...el.value].length;
    if (el.type === TYPE.tag) return n + textLength(el.children);
    if (el.type === TYPE.plural || el.type === TYPE.select) {
      return n + Math.max(0, ...Object.values(el.options).map((o) => textLength(o.value)));
    }
    return n;
  }, 0);
}

function lit(value: string): MessageFormatElement {
  return { type: TYPE.literal, value };
}

/**
 * en-XA's brackets. Web uses ⟦ ⟧, which English never contains. Roku's Inter font has no glyph for
 * them (QR saw NO GLYPH boxes on the device), so Roku uses « », which Inter has.
 */
export type Brackets = readonly [open: string, close: string];
export const BRACKETS: Brackets = ["⟦", "⟧"];
export const ROKU_BRACKETS: Brackets = ["«", "»"];

function accentedForm(elements: MessageFormatElement[], [open, close]: Brackets): MessageFormatElement[] {
  const body = mapLiterals(elements, (s) => [...s].map((c) => ACCENTS[c] ?? c).join(""));
  const pad = "~".repeat(Math.ceil(textLength(elements) * 0.4));
  return [lit(open), ...body, lit(`${pad}${close}`)];
}

function bidiForm(elements: MessageFormatElement[]): MessageFormatElement[] {
  return [lit(RLM), ...mapLiterals(elements, (s) => (s.trim() ? `${RLO}${s}${PDF}` : s))];
}

/** The pseudo-locale message for every valid English message. */
export function pseudoMessages(
  locale: PseudoLocale,
  entries: SourceEntry[],
  english: Map<string, Analysis>,
  brackets: Brackets = BRACKETS,
): Map<string, Analysis> {
  const form = (elements: MessageFormatElement[]) => (locale.kind === "accented" ? accentedForm(elements, brackets) : bidiForm(elements));
  const out = new Map<string, Analysis>();
  for (const entry of entries) {
    const en = english.get(entry.key);
    if (!en) continue;
    // A whole-message plural is transformed per form so the plural stays outermost.
    const top = en.ast.length === 1 && en.ast[0]!.type === TYPE.plural ? en.ast[0]! : undefined;
    let ast: MessageFormatElement[];
    if (top && top.type === TYPE.plural) {
      const options = Object.fromEntries(Object.entries(top.options).map(([k, o]) => [k, { ...o, value: form(o.value) }]));
      ast = [{ ...top, options }];
    } else {
      ast = form(en.ast);
    }
    out.set(entry.key, analyzeAst(mergeLiterals(ast), isShared(entry)));
  }
  return out;
}
