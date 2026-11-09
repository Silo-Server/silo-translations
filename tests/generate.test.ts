// Golden tests: the fixture catalog's output for every platform must match tests/golden/
// byte for byte. Regenerate with `make golden` after an intended change, then review the diff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { generateAll } from "../tools/generate.ts";
import { escapeAndroid } from "../tools/gen/android.ts";
import { json, literalBidi } from "../tools/gen/common.ts";
import { xcodeJson } from "../tools/gen/apple.ts";
import { entry, FIXTURE, makeRepo, REPO } from "./helpers.ts";

const GOLDEN = join(REPO, "tests/golden");

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

const platforms = generateAll(FIXTURE, "test");

for (const [platform, files] of platforms) {
  test(`golden: ${platform}`, () => {
    const want = listFiles(join(GOLDEN, platform)).map((f) => relative(join(GOLDEN, platform), f)).sort();
    assert.deepEqual([...files.keys()].sort(), want, "generated file list");
    for (const [path, content] of files) {
      assert.equal(content, readFileSync(join(GOLDEN, platform, path), "utf8"), `${platform}/${path}`);
    }
  });
}

test("an apostrophe after a placeholder reaches every platform as a literal", () => {
  const root = makeRepo({ en: entry("a.b", "group {n}'s rules", { placeholders: { n: { type: "String" } } }) });
  const out = generateAll(root, "test");
  assert.equal(JSON.parse(out.get("roku")!.get("locale/en_US/strings.json")!)["a.b"], "group {n}'s rules");
  assert.match(out.get("android")!.get("android-shared/src/androidMain/res/values/strings_catalog.xml")!, /group %1\$s\\'s rules/);
  assert.equal(JSON.parse(out.get("apple")!.get("iosApp/iosApp/Localizable.xcstrings")!).strings["a.b"].localizations.en.stringUnit.value, "group %1$@'s rules");
  assert.deepEqual(JSON.parse(out.get("web")!.get("web/src/locales/en.json")!)["a.b"].at(-1), { type: 0, value: "'s rules" });
  assert.match(JSON.parse(out.get("roku")!.get("locale/en_XA/strings.json")!)["a.b"], /^«ĝŕöûþ \{n\}'š ŕûļéš~+»$/);
});

test("android: a plural whose English one prints no number ignores ImpliedQuantity in every language (D76)", () => {
  const COUNT = { description: "Test string. {count}: the number.", placeholders: { count: { type: "int" } } };
  const root = makeRepo({
    en: {
      ...entry("a.vote", "{count, plural, one {VOTE} other {VOTES}}", COUNT),
      ...entry("a.items", "{count, plural, one {# item} other {# items}}", COUNT),
    },
    fr: {
      "a.vote": "{count, plural, one {VOTE} many {VOTES} other {VOTES}}",
      "a.items": "{count, plural, one {# élément} many {# d’éléments} other {# éléments}}",
    },
    de: { "a.items": "{count, plural, one {# Element} other {# Elemente}}" },
  });
  const android = generateAll(root, "test").get("android")!;
  const file = (dir: string) => android.get(`android-shared/src/androidMain/res/${dir}/strings_catalog.xml`)!;
  for (const dir of ["values", "values-fr"]) {
    const xml = file(dir);
    assert.match(xml, /<resources xmlns:tools="http:\/\/schemas\.android\.com\/tools">/, dir);
    assert.equal(xml.match(/xmlns:tools/g)!.length, 1, `${dir}: namespace once`);
    assert.match(xml, /<plurals name="a_vote" tools:ignore="ImpliedQuantity">/, dir);
    assert.match(xml, /<plurals name="a_items">/, dir);
  }
  // A file with no such plural declares no tools namespace.
  assert.match(file("values-de"), /<resources>\n/);
});

test("pseudo: en-XA lengthens text inside a tag too", () => {
  const root = makeRepo({ en: entry("a.b", "<b>Hello world</b>", { "x-platforms": ["web"] }) });
  const ast = JSON.parse(generateAll(root, "test").get("web")!.get("web/src/locales/en-XA.json")!)["a.b"] as { value?: string }[];
  // 11 visible characters: about 40% longer is 5 tildes before the closing bracket.
  assert.equal(ast.at(-1)!.value, "~~~~~⟧");
});

test("android: control characters XML can't hold become \\u escapes", () => {
  assert.equal(escapeAndroid("x\u000by\rz", false), "x\\u000by\\u000dz");
});

const BIDI = "\u061C\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069";

test("bidi: no generated file holds a literal bidi control, and each platform escapes them", () => {
  for (const [platform, files] of platforms) assert.deepEqual(literalBidi(files), [], platform);
  const text = (platform: string, path: string) => platforms.get(platform)!.get(path)!;
  assert.match(text("web", "web/src/locales/ar.json"), /\\u2068/);
  assert.match(text("roku", "locale/en_US/strings.json"), /Shared by \\u2068\{name\}\\u2069/);
  assert.match(text("apple", "iosApp/iosApp/Localizable.xcstrings"), /\\u2068%1\$@\\u2069\\u200F/);
  assert.match(text("android", "android-shared/src/androidMain/res/values-ar/strings_catalog.xml"), /\\u2068%1\$s\\u2069\\u200f/);
});

test("bidi: escaped JSON parses to the same strings", () => {
  const value = { [`k${BIDI}`]: `a${BIDI}b`, list: [BIDI] };
  assert.doesNotMatch(json(value), /[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/);
  assert.deepEqual(JSON.parse(json(value)), value);
  assert.deepEqual(JSON.parse(xcodeJson(value)), value);
  assert.equal(escapeAndroid(BIDI, false), BIDI.split("").map((c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`).join(""));
});

test("bidi: make check's scan names a file with a literal bidi control", () => {
  assert.deepEqual(literalBidi(new Map([["ok.json", "\\u200F"], ["bad.json", "x\u2067y"]])), [{ path: "bad.json", codePoint: "U+2067" }]);
});
