// Table tests for every validator rule. Each case is a small catalog and the issues it must
// produce (substring match); an empty list means the catalog is valid.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRepository } from "../tools/lib/check.ts";
import { entry, makeRepo } from "./helpers.ts";

const COUNT = { placeholders: { count: { type: "int" } } };
const NAME = { placeholders: { name: { type: "String" } } };
const SEASONS = "{count, plural, one {# season} other {# seasons}}";

interface Case {
  name: string;
  en: Record<string, unknown>;
  tr?: Record<string, Record<string, unknown>>;
  glossary?: string;
  errors?: string[];
  warnings?: string[];
}

const cases: Case[] = [
  { name: "valid simple, placeholder and plural", en: { ...entry("a.b", "Hi"), ...entry("a.c", "Hi {name}", NAME), ...entry("a.d", SEASONS, COUNT) } },
  { name: "missing metadata", en: { "a.b": "Hi" }, errors: ["missing @metadata"] },
  { name: "empty description", en: entry("a.b", "Hi", { description: " " }), errors: ["description is required"] },
  { name: "unknown metadata field", en: entry("a.b", "Hi", { type: "text" }), errors: ["unknown metadata field type"] },
  { name: "metadata without message", en: { ...entry("a.b", "Hi"), "@a.c": { description: "x" } }, errors: ["metadata without a message"] },
  { name: "non-string message", en: { "a.b": 3, "@a.b": { description: "x" } }, errors: ["message must be a string"] },
  { name: "key syntax: uppercase first segment", en: entry("Home.title", "Hi"), errors: ["key must match"] },
  { name: "key syntax: hyphen", en: entry("ui.theme.midnight-cinema", "Hi"), errors: ["key must match"] },
  { name: "key syntax: server identifiers allowed", en: { ...entry("catalog.extra.behind_the_scenes", "B"), ...entry("settings.option.480p", "480p") } },
  { name: "ICU parse error", en: entry("a.b", "Hi {name", NAME), errors: ["ICU parse error"] },
  { name: "placeholder not declared", en: entry("a.b", "Hi {name}"), errors: ["placeholders declared (none) differ from those used (name)"] },
  { name: "placeholder declared but unused", en: entry("a.b", "Hi", NAME), errors: ["differ from those used (none)"] },
  { name: "placeholder without type", en: entry("a.b", "Hi {name}", { placeholders: { name: {} } }), errors: ["needs a type"] },
  { name: "placeholder name not lowercase", en: entry("a.b", "Hi {userName}", { placeholders: { userName: { type: "String" } } }), errors: ["placeholder name userName"] },
  { name: "plural arg must be int", en: entry("a.b", SEASONS, { placeholders: { count: { type: "double" } } }), errors: ["must be declared as int"] },
  { name: "plural must span the message", en: entry("a.b", `Has ${SEASONS}`, COUNT), errors: ["plural must span the whole message"] },
  { name: "nested plural", en: entry("a.b", "{count, plural, one {{count, plural, one {x} other {y}}} other {z}}", COUNT), errors: ["nested plurals"] },
  { name: "exact match", en: entry("a.b", "{count, plural, =0 {none} one {# x} other {# y}}", COUNT), errors: ["exact plural matches"] },
  { name: "offset", en: entry("a.b", "{count, plural, offset:1 one {# x} other {# y}}", COUNT), errors: ["offset"] },
  { name: "English plural categories", en: entry("a.b", "{count, plural, other {# seasons}}", COUNT), errors: ["needs exactly the en categories one other"] },
  { name: "selectordinal", en: entry("a.b", "{count, selectordinal, one {#st} other {#th}}", COUNT), errors: ["selectordinal"] },
  { name: "select in shared key", en: entry("a.b", "{name, select, a {A} other {B}}", NAME), errors: ["select is allowed only in web-only keys"] },
  { name: "tag in shared key", en: entry("a.b", "Go <b>now</b>"), errors: ["tags are allowed only in web-only keys"] },
  {
    name: "select and tags in web-only key",
    en: entry("a.b", "{name, select, a {A} other {<b>B</b>}}", { ...NAME, "x-platforms": ["web"] }),
  },
  { name: "typed argument", en: entry("a.b", "{count, number}", COUNT), errors: ["not allowed; format it in the caller"] },
  { name: "ASCII apostrophe before a brace", en: entry("a.b", "Don'{name}", NAME), errors: ["ASCII apostrophe"] },
  { name: "ASCII apostrophe after a brace", en: entry("a.b", "{name}'s list", NAME), errors: ["ASCII apostrophe"] },
  { name: "ASCII apostrophe in a word is fine", en: entry("a.b", "Couldn't connect") },
  { name: "bad x-platforms", en: entry("a.b", "Hi", { "x-platforms": ["tv"] }), errors: ["x-platforms must be"] },
  { name: "bad x-maxLength", en: entry("a.b", "Hi", { "x-maxLength": 0 }), errors: ["x-maxLength must be"] },
  { name: "Android name collision", en: { ...entry("a.b_c", "x"), ...entry("a_b.c", "y") }, errors: ["Android name a_b_c collides with a.b_c"] },
  {
    name: "Android collision ignored outside Android scope",
    en: { ...entry("a.b_c", "x", { "x-platforms": ["roku"] }), ...entry("a_b.c", "y", { "x-platforms": ["android"] }) },
  },
  { name: "Roku plural expansion collision (case-insensitive)", en: { ...entry("a.b.oNe", "x"), ...entry("a.b", SEASONS, COUNT) }, errors: ["Roku name a.b.one collides with a.b.oNe"] },
  { name: "Roku case-insensitive collision", en: { ...entry("a.bC", "x"), ...entry("a.bc", "y") }, errors: ["Roku name a.bc collides with a.bC"] },
  { name: "Apple symbol collision", en: { ...entry("home.sectionTitle", "x"), ...entry("homeSection.title", "y") }, errors: ["Apple symbol homeSectionTitle collides with home.sectionTitle"] },
  {
    name: "Apple collision ignored outside Apple scope",
    en: { ...entry("home.sectionTitle", "x", { "x-platforms": ["web"] }), ...entry("homeSection.title", "y") },
  },
  { name: "non-plural key ending in a category", en: entry("catalog.extra.other", "Extra"), errors: ['cannot end in the plural category "other"'] },
  { name: "plural key ending in a category is fine", en: entry("a.many", SEASONS, COUNT) },
  {
    name: "two placeholders need their order in the description",
    en: entry("a.b", "{a} and {b}", { description: "Shows {b} then {a}.", placeholders: { a: { type: "String" }, b: { type: "String" } } }),
    errors: ["description must name the placeholders in argument order: {a}, {b}"],
  },
  {
    name: "two placeholders named in order",
    en: entry("a.b", "{b} and {a}", { description: "{a}: first name; {b}: second name.", placeholders: { a: { type: "String" }, b: { type: "String" } } }),
  },
  {
    name: "argument order not required for web-only keys",
    en: entry("a.b", "{a} and {b}", { placeholders: { a: { type: "String" }, b: { type: "String" } }, "x-platforms": ["web"] }),
  },
  // Translations
  { name: "valid translation", en: entry("a.c", "Hi {name}", NAME), tr: { es: { "a.c": "Hola {name}" } } },
  { name: "orphan translation key", en: entry("a.b", "Hi"), tr: { es: { "a.x": "Hola" } }, errors: ["key is not in en.arb"] },
  { name: "metadata in a translation", en: entry("a.b", "Hi"), tr: { de: { "a.b": "Hallo", "@a.b": {} } }, errors: ["translations carry no metadata"] },
  { name: "wrong @@locale", en: entry("a.b", "Hi"), tr: { de: { "@@locale": "es", "a.b": "Hallo" } }, errors: ["@@locale must be de"] },
  { name: "file-level @@ metadata in a translation", en: entry("a.b", "Hi"), tr: { de: { "@@locale": "de", "@@last_modified": "2026-11-06", "a.b": "Hallo" } } },
  {
    name: "max length adds each select's longest branch",
    en: entry("a.b", "{a, select, x {12345} other {}}{b, select, y {12345} other {}}", { placeholders: { a: { type: "String" }, b: { type: "String" } }, "x-platforms": ["web"], "x-maxLength": 8 }),
    tr: { de: { "a.b": "{a, select, x {12345} other {}}{b, select, y {12345} other {}}" } },
    warnings: ["longer than x-maxLength 8"],
  },
  {
    name: "glossary with a byte-order mark",
    en: entry("a.b", "Continue Watching"),
    tr: { de: { "a.b": "Weiterschauen" } },
    glossary: "\uFEFFterm,note,de\nContinue Watching,Home row,Weiterschauen\n",
  },
  { name: "empty translation is missing, not an error", en: entry("a.b", "Hi"), tr: { de: { "a.b": "" } } },
  { name: "translation placeholder renamed", en: entry("a.c", "Hi {name}", NAME), tr: { es: { "a.c": "Hola {nombre}" } }, warnings: ["placeholders (nombre) differ from English (name)"] },
  { name: "translation drops a placeholder", en: entry("a.c", "Hi {name}", NAME), tr: { fr: { "a.c": "Salut" } }, warnings: ["placeholders (none) differ"] },
  { name: "translation not a plural", en: entry("a.d", SEASONS, COUNT), tr: { de: { "a.d": "{count} Staffeln" } }, warnings: ["must be one too"] },
  {
    name: "translation plural on another arg",
    en: entry("a.d", "{count, plural, one {# of {n}} other {# of {n}}}", { description: "{count}: done; {n}: total.", placeholders: { count: { type: "int" }, n: { type: "int" } } }),
    tr: { de: { "a.d": "{n, plural, one {{count} von #} other {{count} von #}}" } },
    warnings: ["plurals select on n; English selects on count"],
  },
  { name: "Spanish needs many", en: entry("a.d", SEASONS, COUNT), tr: { es: { "a.d": "{count, plural, one {# temporada} other {# temporadas}}" } }, errors: ["es categories one many other"] },
  {
    name: "Arabic needs all six",
    en: entry("a.d", SEASONS, COUNT),
    tr: { ar: { "a.d": "{count, plural, one {موسم} other {# موسم}}" } },
    errors: ["ar categories zero one two few many other"],
  },
  {
    name: "Arabic with all six",
    en: entry("a.d", SEASONS, COUNT),
    tr: { ar: { "a.d": "{count, plural, zero {لا} one {موسم} two {موسمان} few {# مواسم} many {# موسمًا} other {# موسم}}" } },
  },
  { name: "Japanese has only other", en: entry("a.d", SEASONS, COUNT), tr: { ja: { "a.d": "{count, plural, other {#シーズン}}" } } },
  { name: "Japanese with one", en: entry("a.d", SEASONS, COUNT), tr: { ja: { "a.d": SEASONS } }, errors: ["ja categories other"] },
  { name: "pt-BR uses CLDR pt", en: entry("a.d", SEASONS, COUNT), tr: { "pt-BR": { "a.d": "{count, plural, one {# temporada} many {# de temporadas} other {# temporadas}}" } } },
  { name: "translation adds a tag", en: entry("a.b", "Go", { "x-platforms": ["web"] }), tr: { de: { "a.b": "<b>Los</b>" } }, warnings: ["tags (b) differ"] },
  {
    name: "web translation that moves the plural to another argument",
    en: entry("a.b", "{count, plural, one {{name}: # item} other {{name}: # items}}", { placeholders: { name: { type: "String" }, count: { type: "int" } }, "x-platforms": ["web"] }),
    tr: { es: { "a.b": "{name, plural, one {{count}: # elemento} many {{count}: # de elementos} other {{count}: # elementos}}" } },
    warnings: ["plurals select on name; English selects on count; left out until retranslated"],
  },
  { name: "translation select in web key", en: entry("a.b", "{name}", { ...NAME, "x-platforms": ["web"] }), tr: { de: { "a.b": "{name, select, a {A} other {B}}" } } },
  { name: "max length warning", en: entry("a.b", "Hi", { "x-maxLength": 5 }), tr: { de: { "a.b": "Hallo Welt" } }, warnings: ["longer than x-maxLength 5"] },
  {
    name: "glossary warning",
    en: entry("a.b", "Continue Watching"),
    tr: { de: { "a.b": "Weiter ansehen" }, es: { "a.b": "Seguir viendo" } },
    glossary: "term,note,de,es\nContinue Watching,Home row,Weiterschauen,Seguir viendo\n",
    warnings: ['glossary: "Continue Watching" should be "Weiterschauen"'],
  },
];

for (const c of cases) {
  test(`validator: ${c.name}`, () => {
    const root = makeRepo({ en: c.en, ...(c.tr ?? {}) }, c.glossary);
    const { issues } = checkRepository(root);
    const errors = issues.filter((i) => i.level === "error").map((i) => `${i.key ?? ""}: ${i.message}`);
    const warnings = issues.filter((i) => i.level === "warning").map((i) => `${i.key ?? ""}: ${i.message}`);
    for (const want of c.errors ?? []) assert.ok(errors.some((e) => e.includes(want)), `missing error "${want}" in ${JSON.stringify(errors)}`);
    if (!c.errors) assert.deepEqual(errors, []);
    for (const want of c.warnings ?? []) assert.ok(warnings.some((w) => w.includes(want)), `missing warning "${want}" in ${JSON.stringify(warnings)}`);
    if (!c.warnings) assert.deepEqual(warnings, []);
  });
}
