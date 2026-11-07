// D71: Apple's English fallback for an untranslated plural is selected by the app language's plural
// rules, so englishFor re-keys English to that language's categories.
import { test } from "node:test";
import assert from "node:assert/strict";
import { englishFor } from "../tools/gen/apple.ts";
import { analyze, TYPE, type MessageFormatElement } from "../tools/lib/icu.ts";

const text = (elements: MessageFormatElement[]) =>
  elements.map((e) => (e.type === TYPE.literal ? e.value : e.type === TYPE.pound ? "#" : `{${(e as { value: string }).value}}`)).join("");

function forms(message: string, cldr: string): Record<string, string> {
  const a = englishFor(analyze(message, true), cldr, "en");
  assert.equal(a.shape?.kind, "plural");
  return Object.fromEntries([...(a.shape as { forms: Map<string, MessageFormatElement[]> }).forms].map(([c, el]) => [c, text(el)]));
}

const PARTS = "{count, plural, one {# part} other {# parts}}";
const DELETE = "{count, plural, one {Delete download} other {Delete # downloads}}";

test("apple fallback: Spanish keeps one for 1 and uses other for many", () => {
  assert.deepEqual(forms(PARTS, "es"), { one: "# part", many: "# parts", other: "# parts" });
});

test("apple fallback: a category spanning English one and other takes the form that prints the count", () => {
  // French one is 0 and 1; English says "Delete 0 downloads" but "Delete download" for 1.
  assert.deepEqual(forms(DELETE, "fr"), { one: "Delete # downloads", many: "Delete # downloads", other: "Delete # downloads" });
  // Japanese has only other.
  assert.deepEqual(forms(DELETE, "ja"), { other: "Delete # downloads" });
});

test("apple fallback: Arabic one is English one; zero, two, few, many and other are English other", () => {
  assert.deepEqual(forms(PARTS, "ar"), { zero: "# parts", one: "# part", two: "# parts", few: "# parts", many: "# parts", other: "# parts" });
});

test("apple fallback: a non-plural message is unchanged", () => {
  const a = analyze("Cancel", true);
  assert.equal(englishFor(a, "ja", "en"), a);
});
