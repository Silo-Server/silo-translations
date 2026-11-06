// The canonical layout (make fmt) and its enforcement in make check.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { canonicalArb, canonicalText, compareCodePoints, duplicateKeys } from "../tools/lib/format.ts";
import { checkRepository } from "../tools/lib/check.ts";
import { generateAll } from "../tools/generate.ts";
import { entry, makeRepo, REPO } from "./helpers.ts";

test("format: @@locale first, keys in code-point order, @key after its key", () => {
  const arb = {
    "z.last": "Z",
    "@z.last": { description: "z", placeholders: { b: { type: "String" }, a: { type: "String" } } },
    "@@x-generated": "tool",
    "a.b": "B",
    "@orphan.only": { description: "no message" },
    "a.B": "upper",
    "@a.b": { description: "b" },
    "@@locale": "en",
  };
  assert.deepEqual(Object.keys(canonicalArb(arb)), ["@@locale", "@@x-generated", "a.B", "a.b", "@a.b", "@orphan.only", "z.last", "@z.last"]);
  // Metadata keeps its own field order: placeholder order is positional.
  assert.deepEqual(Object.keys((canonicalArb(arb)["@z.last"] as { placeholders: object }).placeholders), ["b", "a"]);
});

test("format: code points, not UTF-16 units", () => {
  // U+FF61 sorts before U+1F600, though its UTF-16 unit is larger than the surrogate 0xD83D.
  assert.ok(compareCodePoints("｡", "\u{1F600}") < 0);
  assert.ok("｡" > "\u{1F600}");
  assert.ok(compareCodePoints("a", "ab") < 0);
});

test("format: canonical text is 2-space JSON with a trailing newline, and stable", () => {
  const text = canonicalText('{"b":"2","@@locale":"en","a":"1"}', "arb")!;
  assert.equal(text, '{\n  "@@locale": "en",\n  "a": "1",\n  "b": "2"\n}\n');
  assert.equal(canonicalText(text, "arb"), text);
  assert.equal(canonicalText('{"b":{"z":1},"a":2}', "state"), '{\n  "a": 2,\n  "b": {\n    "z": 1\n  }\n}\n');
  assert.equal(canonicalText("[1]", "arb"), undefined);
});

test("format: repeated keys are found in any object, not in strings or arrays", () => {
  assert.deepEqual(duplicateKeys('{"a": "1", "b": {"x": 2, "x": 3}, "c": "say \\"a\\": x", "a": "4"}'), ["b > x", "a"]);
  assert.deepEqual(duplicateKeys('{"@k": {"placeholders": {"n": {}}, "placeholders": {}}}'), ["@k > placeholders"]);
  assert.deepEqual(duplicateKeys('{"a": ["a", "a"], "b": "a", "c": [{"x": 1}, {"x": 2}]}'), []);
  assert.deepEqual(duplicateKeys('["a", "a"]'), []);
  assert.deepEqual(duplicateKeys('{"a": "b", "c'), []); // not JSON: the parse error is reported instead
});

test("check: a broken ARB outside locales.json is reported", () => {
  const root = makeRepo({ en: entry("a.x", "A") });
  writeFileSync(join(root, "catalog/pt-PT.arb"), '{"a": "b", "c');
  assert.ok(checkRepository(root).issues.some((i) => i.file.endsWith("pt-PT.arb") && i.message === "not a JSON object"));
});

test("generate ignores layout, make check does not", () => {
  const root = makeRepo({ en: entry("a.x", "A") });
  writeFileSync(join(root, "catalog/en.arb"), JSON.stringify({ "@@locale": "en", ...entry("a.x", "A") }, null, 4));
  const issues = checkRepository(root).issues;
  assert.ok(issues.length === 1 && issues[0]!.rule === "layout", JSON.stringify(issues));
  assert.doesNotThrow(() => generateAll(root, "test"));
});

test("check: a non-canonical ARB or state file is an error that names make fmt", () => {
  const root = makeRepo({ en: { ...entry("b.x", "B"), ...entry("a.x", "A") } });
  assert.deepEqual(checkRepository(root).issues, []);
  const en = join(root, "catalog/en.arb");
  writeFileSync(en, JSON.stringify({ "@@locale": "en", ...entry("b.x", "B"), ...entry("a.x", "A") }, null, 2) + "\n");
  mkdirSync(join(root, "state"));
  writeFileSync(join(root, "state/es.json"), '{"z": {}, "a": {}}');
  const errors = checkRepository(root).issues.map((i) => `${i.file.slice(root.length)}: ${i.message}`);
  assert.ok(errors.some((e) => e.startsWith("/catalog/en.arb:") && e.includes("run make fmt")), JSON.stringify(errors));
  assert.ok(errors.some((e) => e.startsWith("/state/es.json:") && e.includes("run make fmt")), JSON.stringify(errors));
});

test("check and fmt: a repeated key is an error and is never rewritten", () => {
  const root = makeRepo({ en: entry("a.x", "A") });
  const en = join(root, "catalog/en.arb");
  const text = readFileSync(en, "utf8").replace('"a.x": "A",', '"a.x": "A",\n  "a.x": "Again",');
  writeFileSync(en, text);
  assert.ok(checkRepository(root).issues.some((i) => i.message.startsWith("repeats a.x")));
  const r = spawnSync(process.execPath, [join(REPO, "tools/fmt.ts"), root], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /repeats a\.x/);
  assert.equal(readFileSync(en, "utf8"), text);
});

test("fmt: rewrites catalog and state files into the canonical layout", () => {
  const root = makeRepo({ en: entry("a.x", "A") });
  writeFileSync(join(root, "catalog/en.arb"), JSON.stringify({ ...entry("b.x", "B"), "@@locale": "en", ...entry("a.x", "A") }));
  mkdirSync(join(root, "state"));
  writeFileSync(join(root, "state/de.json"), '{"b.x":{"source":"1"},"a.x":{"source":"2"}}');
  const r = spawnSync(process.execPath, [join(REPO, "tools/fmt.ts"), root], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(checkRepository(root).issues, []);
  assert.deepEqual(Object.keys(JSON.parse(readFileSync(join(root, "state/de.json"), "utf8"))), ["a.x", "b.x"]);
});
