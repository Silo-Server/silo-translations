// Pseudo-locales built from English: en-XA (accented, about 40% longer, wrapped in ⟦ ⟧) and
// ar-XB (each text run forced right-to-left). Placeholders are kept as they are.
import { printAST } from "@formatjs/icu-messageformat-parser/printer.js";
import { analyze, TYPE, type Analysis, type MessageFormatElement } from "../lib/icu.ts";
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

function textLength(elements: MessageFormatElement[]): number {
  return elements.reduce((n, el) => n + (el.type === TYPE.literal ? [...el.value].length : 0), 0);
}

function lit(value: string): MessageFormatElement {
  return { type: TYPE.literal, value };
}

function accentedForm(elements: MessageFormatElement[]): MessageFormatElement[] {
  const body = mapLiterals(elements, (s) => [...s].map((c) => ACCENTS[c] ?? c).join(""));
  const pad = "~".repeat(Math.ceil(textLength(elements) * 0.4));
  return [lit("⟦"), ...body, lit(`${pad}⟧`)];
}

function bidiForm(elements: MessageFormatElement[]): MessageFormatElement[] {
  return [lit(RLM), ...mapLiterals(elements, (s) => (s.trim() ? `${RLO}${s}${PDF}` : s))];
}

/** The pseudo-locale message for every valid English message. */
export function pseudoMessages(
  locale: PseudoLocale,
  entries: SourceEntry[],
  english: Map<string, Analysis>,
): Map<string, Analysis> {
  const form = locale.kind === "accented" ? accentedForm : bidiForm;
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
    out.set(entry.key, analyze(printAST(ast), isShared(entry)));
  }
  return out;
}
