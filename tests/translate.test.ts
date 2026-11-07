// make translate: key selection, the human-edit guard, retries and the files it writes, with
// a stand-in for Claude Code (tests/bin/fake-claude.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fingerprint, makeBatches, select, valueHash, type State, type Work } from "../tools/translate.ts";
import type { SourceEntry } from "../tools/lib/catalog.ts";
import { canonicalText } from "../tools/lib/format.ts";
import { entry, makeRepo, REPO, writeArb } from "./helpers.ts";

const e = (key: string, message: string, description = "Test string."): SourceEntry => ({ key, message, description, placeholders: [], platforms: ["web"] });

test("translate: selection and human-edit guard", () => {
  const a = e("a.missing", "One");
  const b = e("a.human", "Two");
  const c = e("a.machine", "Three");
  const d = e("a.edited", "Four");
  const f = e("a.changed", "Five");
  const g = e("a.editedChanged", "Six");
  const h = e("a.described", "Seven", "Now a verb");
  const old = (entry: SourceEntry, value: string, by: "opus" | "human" = "opus") => ({ source: fingerprint(entry), value: valueHash(value), by });
  const state: State = {
    "a.machine": old(c, "Tres"),
    "a.edited": old(d, "Cuatro"),
    "a.changed": old({ ...f, message: "Old five" }, "Cinco"),
    "a.editedChanged": old({ ...g, message: "Old six" }, "Seis"),
    "a.described": old({ ...h, description: "An adjective" }, "Siete"),
  };
  const translations = new Map([
    ["a.human", "Dos"],
    ["a.machine", "Tres"],
    ["a.edited", "Cuatro (corregido)"],
    ["a.changed", "Cinco"],
    ["a.editedChanged", "Seis (corregido)"],
    ["a.described", "Siete"],
  ]);
  const work = select([a, b, c, d, f, g, h], translations, state, new Set(translations.keys()));
  assert.deepEqual(
    work.map((w) => [w.entry.key, w.reason, w.previous]),
    [
      ["a.missing", "missing", undefined],
      ["a.changed", "source-changed", "Cinco"],
      ["a.editedChanged", "human-edit-source-changed", "Seis (corregido)"],
      ["a.described", "source-changed", "Siete"],
    ],
  );
  // A translation with no state is a person's: recorded, not retranslated.
  assert.deepEqual(state["a.human"], { source: fingerprint(b), value: valueHash("Dos"), by: "human" });
  // An edited value with unchanged English is kept and recorded as human.
  assert.equal(state["a.edited"]!.by, "human");
  assert.equal(state["a.edited"]!.value, valueHash("Cuatro (corregido)"));
  // A human value stays human even when it equals the last machine value hash later.
  assert.equal(select([b], new Map([["a.human", "Dos"]]), state, new Set(["a.human"])).length, 0);
  // A value that no longer validates against English is retranslated, whoever wrote it.
  assert.deepEqual(select([b], new Map([["a.human", "Dos {x}"]]), state, new Set()).map((w) => w.reason), ["invalid"]);
});

function run(root: string, ...args: string[]) {
  return runEnv(root, {}, ...args);
}

function runEnv(root: string, env: Record<string, string>, ...args: string[]) {
  return execFileSync(process.execPath, [join(REPO, "tools/translate.ts"), "--root", root, ...args], {
    encoding: "utf8",
    env: { ...process.env, SILO_CLAUDE_BIN: join(REPO, "tests/bin/fake-claude.mjs"), FAKE_CLAUDE_LOG: join(root, "prompts.log"), SILO_TRANSLATE_RETRY_MS: "0", ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

const catalog = () => ({
  en: {
    ...entry("common.cancel", "Cancel"),
    ...entry("common.flaky", "Hi {name}", { placeholders: { name: { type: "String" } } }),
    ...entry("common.broken", "Broken"),
    ...entry("catalog.seasons", "{count, plural, one {# season} other {# seasons}}", { placeholders: { count: { type: "int" } } }),
    ...entry("common.kept", "Kept"),
  },
  es: { "@@locale": "es", "common.kept": "Conservado" },
});

test("translate: writes catalog, state and PR body; retries once; keeps human values", () => {
  const root = makeRepo(catalog());
  mkdirSync(join(root, "style"));
  writeFileSync(join(root, "style/es.md"), "Use tú.\n");
  run(root, "--locale", "es");
  const es = JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"));
  assert.deepEqual(es, {
    "@@locale": "es",
    "common.cancel": "ES Cancel",
    "common.flaky": "ES Hi {name}",
    "catalog.seasons": "{count, plural, one {ES # season} many {ES # seasons} other {ES # seasons}}",
    "common.kept": "Conservado",
  });
  // Both files come out in the canonical layout make check requires.
  for (const f of ["catalog/es.arb", "state/es.json"]) {
    const text = readFileSync(join(root, f), "utf8");
    assert.equal(canonicalText(text, f.startsWith("state") ? "state" : "arb"), text, f);
  }
  const state = JSON.parse(readFileSync(join(root, "state/es.json"), "utf8")) as State;
  assert.equal(state["common.cancel"]!.by, "opus");
  assert.equal(state["common.cancel"]!.model, "claude-opus-5-5");
  assert.equal(state["common.kept"]!.by, "human");
  assert.equal(state["common.broken"], undefined);
  const body = readFileSync(join(root, "out/translate-pr-body.md"), "utf8");
  assert.match(body, /\| es \| 3 \| 1 \|/);
  assert.match(body, /es `common.broken`: ICU parse error/);
  const prompts = readFileSync(join(root, "prompts.log"), "utf8");
  assert.match(prompts, /Use tú\./);
  assert.match(prompts, /one, many, other/);
  assert.match(prompts, /problemsWithLastAttempt/);

  // Second run: only the key that failed is sent again; the catalog is unchanged.
  const before = readFileSync(join(root, "catalog/es.arb"), "utf8");
  writeFileSync(join(root, "prompts.log"), "");
  run(root, "--locale", "es");
  assert.equal(readFileSync(join(root, "catalog/es.arb"), "utf8"), before);
  const sent = readFileSync(join(root, "prompts.log"), "utf8")
    .split("\n=====\n")
    .filter(Boolean)
    .flatMap((p) => (JSON.parse(p.slice(p.indexOf("Strings to translate:") + 21)) as { key: string }[]).map((i) => i.key));
  assert.deepEqual([...new Set(sent)], ["common.broken"]);
});

test("translate: a human edit whose English changed is retranslated and listed", () => {
  const root = makeRepo(catalog());
  run(root, "--locale", "es");
  const esPath = join(root, "catalog/es.arb");
  const es = JSON.parse(readFileSync(esPath, "utf8"));
  es["common.cancel"] = "Cancelar";
  writeArb(esPath, es);
  const enPath = join(root, "catalog/en.arb");
  const en = JSON.parse(readFileSync(enPath, "utf8"));
  en["common.cancel"] = "Cancel now";
  writeArb(enPath, en);
  run(root, "--locale", "es");
  assert.equal(JSON.parse(readFileSync(esPath, "utf8"))["common.cancel"], "ES Cancel now");
  assert.match(readFileSync(join(root, "out/translate-pr-body.md"), "utf8"), /\| es \| `common.cancel` \| Cancelar \| ES Cancel now \|/);
});

test("translate: --dry-run sends one batch and writes nothing", () => {
  const root = makeRepo(catalog());
  const out = run(root, "--locale", "es", "--dry-run");
  const parsed = JSON.parse(out);
  assert.equal(parsed.accepted["common.cancel"], "ES Cancel");
  assert.ok(parsed.failed["common.broken"]);
  assert.equal(JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"))["common.cancel"], undefined);
  assert.ok(!existsSync(join(root, "state")));
  assert.ok(!existsSync(join(root, "out")));
});

test("translate: an empty Weblate unit is translated, not kept", () => {
  const cat = catalog();
  const root = makeRepo({ en: cat.en, es: { "@@locale": "es", "common.cancel": "", "common.kept": "Conservado" } });
  run(root, "--locale", "es");
  assert.equal(JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"))["common.cancel"], "ES Cancel");
  assert.doesNotMatch(readFileSync(join(root, "out/translate-pr-body.md"), "utf8"), /changed during the run/);
});

test("translate: an English placeholder change does not block the run that repairs it", () => {
  const root = makeRepo(catalog());
  run(root, "--locale", "es");
  const enPath = join(root, "catalog/en.arb");
  const en = JSON.parse(readFileSync(enPath, "utf8"));
  en["common.flaky"] = "Hi {name} on {server}";
  en["@common.flaky"] = { description: "Test string. {name}: who; {server}: where.", placeholders: { name: { type: "String" }, server: { type: "String" } } };
  writeArb(enPath, en);
  run(root, "--locale", "es");
  assert.equal(JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"))["common.flaky"], "ES Hi {name} on {server}");
});

test("translate: an empty answer keeps the existing value and is reported", () => {
  const cat = catalog();
  const root = makeRepo({ en: { ...cat.en, ...entry("common.empty", "Cancel now") }, es: { "@@locale": "es", "common.empty": "Abbrechen" } });
  // No state: the value is a person's, so change the English to make it due for retranslation.
  run(root, "--locale", "es");
  const enPath = join(root, "catalog/en.arb");
  const en = JSON.parse(readFileSync(enPath, "utf8"));
  en["common.empty"] = "Cancel right now";
  writeArb(enPath, en);
  run(root, "--locale", "es");
  assert.equal(JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"))["common.empty"], "Abbrechen");
  assert.match(readFileSync(join(root, "out/translate-pr-body.md"), "utf8"), /es `common.empty`: no translation returned/);
});

test("translate: batches keep namespaces together", () => {
  const w = (key: string): Work => ({ entry: e(key, "x"), reason: "missing" });
  const keys = [...Array.from({ length: 3 }, (_, i) => `a.k${i}`), ...Array.from({ length: 4 }, (_, i) => `b.k${i}`), ...Array.from({ length: 5 }, (_, i) => `web.admin.x.k${i}`), "web.admin.y.k0"];
  const batches = makeBatches(keys.reverse().map(w), 4).map((b) => b.map((x) => x.entry.key));
  assert.deepEqual(batches, [
    ["a.k0", "a.k1", "a.k2"],
    ["b.k0", "b.k1", "b.k2", "b.k3"],
    ["web.admin.x.k0", "web.admin.x.k1", "web.admin.x.k2", "web.admin.x.k3"],
    ["web.admin.x.k4"],
    ["web.admin.y.k0"],
  ]);
});

test("translate: each batch is written as it finishes, so a failed run resumes", () => {
  const cat = catalog();
  const root = makeRepo({ en: { ...cat.en, ...entry("zzz.crash", "Crash me") }, es: cat.es });
  runEnv(root, { FAKE_CLAUDE_CRASH: "1", SILO_TRANSLATE_BATCH_SIZE: "4" }, "--locale", "es", "--jobs", "2");
  const es = JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"));
  assert.equal(es["common.cancel"], "ES Cancel");
  assert.equal(es["zzz.crash"], undefined);
  assert.match(readFileSync(join(root, "out/translate-pr-body.md"), "utf8"), /`zzz.crash`: call failed/);
  const log = readFileSync(join(root, "out/translate-es.log.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  assert.ok(log.some((b) => b.failed["zzz.crash"]));
  assert.ok(log.some((b) => b.firstAttempt["common.flaky"]), "the first attempt's placeholder loss is logged");
  // Rerun without the failure: only the missing key is sent.
  writeFileSync(join(root, "prompts.log"), "");
  run(root, "--locale", "es");
  assert.equal(JSON.parse(readFileSync(join(root, "catalog/es.arb"), "utf8"))["zzz.crash"], "ES Crash me");
  const resent = readFileSync(join(root, "prompts.log"), "utf8").split("\n=====\n").filter(Boolean)
    .flatMap((p) => (JSON.parse(p.slice(p.indexOf("Strings to translate:") + 21)) as { key: string }[]).map((i) => i.key));
  assert.ok(resent.includes("zzz.crash") && !resent.includes("common.cancel"), JSON.stringify(resent));
});

test("translate: --retranslate resends Opus values under a prefix and keeps a person's", () => {
  const root = makeRepo(catalog());
  run(root, "--locale", "es");
  writeFileSync(join(root, "prompts.log"), "");
  run(root, "--locale", "es", "--retranslate", "common.,catalog.");
  const sent = readFileSync(join(root, "prompts.log"), "utf8").split("\n=====\n").filter(Boolean)
    .flatMap((p) => (JSON.parse(p.slice(p.indexOf("Strings to translate:") + 21)) as { key: string }[]).map((i) => i.key));
  assert.ok(sent.includes("common.cancel") && sent.includes("catalog.seasons"));
  assert.ok(!sent.includes("common.kept"), "the person's value is not resent");
});
