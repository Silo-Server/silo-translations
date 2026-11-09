import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeArb } from "../tools/merge-arb.ts";

const e = (key: string, message: string, meta: Record<string, unknown> = {}) => ({ [key]: message, [`@${key}`]: { description: "d", ...meta } });

test("merge-arb: adds, changes, removals, widening and conflicts", () => {
  const base = { "@@locale": "en", ...e("a.keep", "A"), ...e("a.mine", "M"), ...e("a.theirs", "T"), ...e("a.gone", "G"), ...e("a.wide", "W", { "x-platforms": ["roku"] }), ...e("a.clash", "C") };
  const ours = { ...base, ...e("a.mine", "M2"), ...e("a.wide", "W", { "x-platforms": ["android", "roku"] }), ...e("a.clash", "C ours"), ...e("b.oursNew", "N") };
  const theirs = { ...base, ...e("a.theirs", "T2"), ...e("a.wide", "W", { "x-platforms": ["web", "roku"] }), ...e("a.clash", "C theirs"), ...e("c.new", "New"), ...e("b.oursNew", "N") };
  delete (theirs as Record<string, unknown>)["a.gone"];
  delete (theirs as Record<string, unknown>)["@a.gone"];
  const { result, report } = mergeArb(base, ours, theirs);
  assert.equal(result["a.mine"], "M2");
  assert.equal(result["a.theirs"], "T2");
  assert.equal(result["a.gone"], undefined);
  assert.equal(result["c.new"], "New");
  assert.deepEqual((result["@a.wide"] as { "x-platforms": string[] })["x-platforms"], ["web", "android", "roku"]);
  assert.equal(result["a.clash"], "C ours");
  assert.deepEqual(report.added, ["c.new"]);
  assert.deepEqual(report.changed, ["a.theirs"]);
  assert.deepEqual(report.removed, ["a.gone"]);
  assert.deepEqual(report.widened, ["a.wide"]);
  assert.deepEqual(report.conflicts.map((c) => c.key), ["a.clash"]);
  assert.equal(Object.keys(result)[0], "@@locale");
});

test("merge-arb: a widening to every platform drops x-platforms; a description change is a conflict", () => {
  const base = e("a.x", "X", { "x-platforms": ["roku"] });
  const ours = e("a.x", "X", { "x-platforms": ["roku", "android"] });
  const theirs = e("a.x", "X", { "x-platforms": ["web", "apple", "roku"] });
  assert.equal((mergeArb(base, ours, theirs).result["@a.x"] as Record<string, unknown>)["x-platforms"], undefined);
  // A description changed on one side only is taken, with the platforms united.
  const other = e("a.x", "X", { "x-platforms": ["web", "roku"], description: "changed" });
  assert.deepEqual(mergeArb(base, ours, other).result["@a.x"], { description: "changed", "x-platforms": ["web", "android", "roku"] });
});

test("merge-arb: with keepOurDescriptions, a description clash keeps ours and unites platforms", () => {
  const base = e("a.x", "X", { "x-platforms": ["roku"] });
  const ours = e("a.x", "X", { "x-platforms": ["roku", "web"], description: "ours" });
  const theirs = e("a.x", "X", { "x-platforms": ["android", "roku"], description: "theirs" });
  assert.deepEqual(mergeArb(base, ours, theirs).report.conflicts.map((c) => c.key), ["a.x"]);
  const { result, report } = mergeArb(base, ours, theirs, true);
  assert.deepEqual(result["@a.x"], { description: "ours", "x-platforms": ["web", "android", "roku"] });
  assert.deepEqual(report.descriptions.map((c) => c.key), ["a.x"]);
  // Theirs also changed the English (one-sided): taken, and listed for review.
  const english = e("a.x", "Y", { "x-platforms": ["android", "roku"], description: "theirs" });
  const r2 = mergeArb(base, ours, english, true);
  assert.equal(r2.result["a.x"], "Y");
  assert.deepEqual(r2.report.englishChanged, ["a.x"]);
  // Both changed the English differently: a conflict.
  const both = e("a.x", "Z", { "x-platforms": ["roku", "web"], description: "ours" });
  assert.deepEqual(mergeArb(base, both, english, true).report.conflicts.map((c) => c.key), ["a.x"]);
});

test("merge-arb: field order doesn't matter, placeholder order does", () => {
  const base = { "a.x": "{a} {b}", "@a.x": { description: "d", placeholders: { a: { type: "String" }, b: { type: "String" } } } };
  const reordered = { "@a.x": { placeholders: { a: { type: "String" }, b: { type: "String" } }, description: "d" }, "a.x": "{a} {b}" };
  assert.deepEqual(mergeArb(base, base, reordered).report, { added: [], changed: [], removed: [], widened: [], descriptions: [], conflicts: [], englishChanged: [] });
  const swapped = { "a.x": "{a} {b}", "@a.x": { description: "d", placeholders: { b: { type: "String" }, a: { type: "String" } } } };
  assert.deepEqual(mergeArb(base, base, swapped).report.changed, ["a.x"]);
});

test("merge-arb: field by field, one-sided fields win and a containing description wins", () => {
  const base = e("a.x", "X", { "x-platforms": ["roku"] });
  // ours widened only; theirs widened and rewrote the description: take theirs' description.
  const ours = e("a.x", "X", { "x-platforms": ["roku", "android"] });
  const theirs = e("a.x", "X", { "x-platforms": ["roku", "apple"], description: "Roku and Apple use." });
  const { result, report } = mergeArb(base, ours, theirs);
  assert.deepEqual(result["@a.x"], { description: "Roku and Apple use.", "x-platforms": ["apple", "android", "roku"] });
  assert.deepEqual(report.widened, ["a.x"]);
  // both rewrote; theirs extends ours: the longer one.
  const o2 = e("a.x", "X", { description: "d Android." });
  const t2 = e("a.x", "X", { description: "d Android. Apple." });
  assert.equal((mergeArb(base, o2, t2).result["@a.x"] as { description: string }).description, "d Android. Apple.");
  // placeholders changed on both sides differently: a conflict.
  const p1 = e("a.x", "X", { placeholders: { n: { type: "int" } } });
  const p2 = e("a.x", "X", { placeholders: { n: { type: "String" } } });
  assert.deepEqual(mergeArb(base, p1, p2).report.conflicts.map((c) => c.key), ["a.x"]);
  // placeholders changed on one side only: taken.
  assert.deepEqual((mergeArb(base, ours, { ...e("a.x", "X", { "x-platforms": ["roku"], placeholders: { n: { type: "String" } } }) }).result["@a.x"] as Record<string, unknown>).placeholders, { n: { type: "String" } });
});
