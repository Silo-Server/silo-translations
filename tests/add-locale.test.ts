// make add-locale: the locales.json line, glossary column and style template for a new language.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { addToLocalesJson, newLocale, setGlossaryColumn } from "../tools/add-locale.ts";
import { loadLocales } from "../tools/lib/locales.ts";
import { entry, makeRepo, REPO, testSlotPort } from "./helpers.ts";

test("add-locale: derives the identifiers the existing languages use", () => {
  const real = JSON.parse(readFileSync(join(REPO, "locales.json"), "utf8")) as { locales: { tag: string; name: string }[] };
  for (const tag of ["pt-BR", "zh-Hant", "zh-Hans", "ar", "uk", "nb"]) {
    const line = real.locales.find((l) => l.tag === tag)!;
    assert.deepEqual(newLocale(tag, { name: line.name }), line, tag);
  }
});

test("add-locale: right-to-left and scripts Roku's fonts lack stay off Roku; Android's old codes", () => {
  assert.deepEqual(newLocale("he"), { tag: "he", name: "עברית", dir: "rtl", cldr: "he", android: "values-iw", roku: "he", platforms: ["web", "apple", "android"] });
  assert.deepEqual(newLocale("hi").platforms, ["web", "apple", "android"]);
  assert.equal(newLocale("id").android, "values-in");
  assert.equal(newLocale("el").platforms, undefined, "Roku's Inter subset has Greek");
  assert.equal(newLocale("vi").platforms, undefined);
  assert.deepEqual(newLocale("pt-PT"), { tag: "pt-PT", name: "Português europeu", dir: "ltr", cldr: "pt-PT", android: "values-pt-rPT", roku: "pt_PT" });
  assert.throws(() => newLocale("pt-pt"), /write the tag as pt-PT/);
});

test("add-locale: appends one line to locales.json and keeps the rest as written", () => {
  const before = readFileSync(join(REPO, "locales.json"), "utf8");
  const after = addToLocalesJson(before, newLocale("hu"));
  const added = after.split("\n").filter((l) => !before.split("\n").includes(l));
  assert.deepEqual(added, [
    `    { "tag": "ar", "name": "العربية", "dir": "rtl", "cldr": "ar", "android": "values-ar", "roku": "ar", "platforms": ["web", "apple", "android"] },`,
    `    { "tag": "hu", "name": "Magyar", "dir": "ltr", "cldr": "hu", "android": "values-hu", "roku": "hu" }`,
  ]);
  assert.throws(() => addToLocalesJson(after, newLocale("hu")), /already in locales.json/);
});

test("add-locale: sets one glossary column and leaves the others byte for byte", () => {
  const text = readFileSync(join(REPO, "glossary.csv"), "utf8");
  const out = setGlossaryColumn(text, "hu", new Map([["Silo", "Silo"]]));
  const original = text.split("\n");
  out.split("\n").forEach((line, i) => {
    if (!original[i]) return assert.equal(line, original[i]);
    const added = i === 0 ? "hu" : original[i]!.startsWith("Silo,") ? "Silo" : "";
    assert.equal(line, `${original[i]},${added}`, `line ${i + 1}`);
  });
  assert.throws(() => setGlossaryColumn(text, "hu", new Map([["Nope", "x"]])), /not glossary terms: Nope/);
  assert.throws(() => setGlossaryColumn("term,note\n\"a\",b\n", "hu"), /layout/);
});

test("add-locale: the CLI writes the files, and translate waits for the style guide and glossary", () => {
  const root = makeRepo({ en: entry("a.b", "Hello") }, "term,note,es\nSilo,Product name,Silo\n");
  cpSync(join(REPO, "locales.json"), join(root, "locales.json"));
  const cli = (...args: string[]) => execFileSync(process.execPath, [join(REPO, "tools/add-locale.ts"), "--root", root, ...args], { encoding: "utf8" });
  cli("hu");
  assert.equal(loadLocales(root).targets.at(-1)!.tag, "hu");
  const style = readFileSync(join(root, "style/hu.md"), "utf8");
  assert.match(style, /^# Hungarian \(hu\)/);
  assert.match(style, /`one`: 1\n/);
  assert.match(style, /TODO\(add-locale\)/);
  assert.equal(readFileSync(join(root, "glossary.csv"), "utf8"), "term,note,es,hu\nSilo,Product name,Silo,\n");

  const translate = () =>
    execFileSync(process.execPath, [join(REPO, "tools/translate.ts"), "--root", root, "--locale", "hu"], {
      encoding: "utf8",
      env: { ...process.env, SILO_CLAUDE_BIN: join(REPO, "tests/bin/fake-claude.mjs"), SILO_TRANSLATE_SLOT_PORT: String(testSlotPort()) },
      stdio: ["ignore", "pipe", "pipe"],
    });
  assert.throws(translate, (e: { stderr: string }) => /style\/hu.md still has TODO\(add-locale\)/.test(e.stderr) && /glossary.csv has no hu renderings/.test(e.stderr));

  writeFileSync(join(root, "style/hu.md"), "# Hungarian (hu)\n");
  writeFileSync(join(root, "hu.csv"), "term,rendering\nSilo,Silo\n");
  cli("hu", "--glossary", join(root, "hu.csv"));
  assert.equal(readFileSync(join(root, "glossary.csv"), "utf8"), "term,note,es,hu\nSilo,Product name,Silo,Silo\n");
  translate();
  assert.equal(JSON.parse(readFileSync(join(root, "catalog/hu.arb"), "utf8"))["a.b"], "ES Hello");
});
