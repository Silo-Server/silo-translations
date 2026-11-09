// Proof for the seed: through the rename maps, every old Roku key and Android name renders the
// same English from the generated files as from the original ones.
//
//   node tools/seed/verify.ts --roku <checkout> --android <checkout> --reports <dir>
//
// Roku: the generated locale/en_US/strings.json entry equals the original text; a folded plural
// form equals the original form with the count filled in (1 for "one"). Android: aapt2 decodes
// both the original strings.xml files and the generated strings_catalog.xml, and both format the
// same with sample arguments (positional %1$s and non-positional %s are equivalent).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { decodeResources, findSdk } from "../lib/aapt.ts";
import { generateAll, writeOutput } from "../generate.ts";

const { values } = parseArgs({ options: { roku: { type: "string" }, android: { type: "string" }, reports: { type: "string" } } });
const root = resolve(import.meta.dirname, "../..");
const failures: string[] = [];
const platforms = generateAll(root, "seed-verify");

// Roku
const rokuOriginal = JSON.parse(execFileSync("git", ["-C", values.roku!, "show", "origin/main:locale/en_US/strings.json"], { encoding: "utf8" })) as Record<string, string>;
const rokuGenerated = JSON.parse(platforms.get("roku")!.get("locale/en_US/strings.json")!) as Record<string, string>;
const rokuMap = JSON.parse(readFileSync(join(values.reports!, "A-rename-roku.json"), "utf8")) as Record<string, { key: string; kind: string; form?: string }>;
let rokuChecked = 0;
for (const [old, text] of Object.entries(rokuOriginal)) {
  const m = rokuMap[old];
  rokuChecked++;
  if (!m) {
    if (rokuGenerated[old] !== text) failures.push(`roku ${old}: ${JSON.stringify(rokuGenerated[old])} != ${JSON.stringify(text)}`);
    continue;
  }
  if (m.kind === "renamed") {
    if (rokuGenerated[m.key] !== text) failures.push(`roku ${old} -> ${m.key}: ${JSON.stringify(rokuGenerated[m.key])}`);
    continue;
  }
  // Plural: the original form either carries {arg} or, in a "one" form, a literal 1.
  const arb = JSON.parse(readFileSync(join(root, "catalog/en.arb"), "utf8")) as Record<string, string>;
  const arg = /^\{([a-z][a-z0-9_]*), plural,/.exec(arb[m.key]!)![1]!;
  const forms = m.form === "plural" ? ["one", "other"] : [m.form!];
  for (const f of forms) {
    const gen = rokuGenerated[`${m.key}.${f}`];
    const ok = gen === text || (f === "one" && gen?.replace(`{${arg}}`, "1") === text);
    if (!ok) failures.push(`roku ${old} -> ${m.key}.${f}: ${JSON.stringify(gen)} vs ${JSON.stringify(text)}`);
  }
}

// Android
const sdk = findSdk();
if (!sdk) throw new Error("needs the Android SDK for aapt2");
const androidMap = JSON.parse(readFileSync(join(values.reports!, "A-rename-android.json"), "utf8")) as Record<string, { key: string; name: string }>;
const original = new Map<string, string>();
for (const file of ["android-shared", "androidApp", "androidTvApp"]) {
  const xml = execFileSync("git", ["-C", values.android!, "show", `origin/main:${file}/src/androidMain/res/values/strings.xml`], { encoding: "utf8" });
  const res = mkdtempSync(join(tmpdir(), "silo-verify-"));
  mkdirSync(join(res, "values"));
  writeFileSync(join(res, "values/strings.xml"), xml);
  for (const [id, v] of decodeResources(sdk, res)) original.set(id, v);
}
const out = mkdtempSync(join(tmpdir(), "silo-verify-gen-"));
writeOutput(join(out, "gen"), new Map([["android", platforms.get("android")!]]));
const generated = decodeResources(sdk, join(out, "gen/android/android-shared/src/androidMain/res"));

/** Formats like java.util.Formatter for %s %d %f, positional or not, with fixed sample arguments. */
function format(s: string): string {
  let next = 0;
  return s.replace(/%(?:(\d+)\$)?([sdf%])/g, (_, pos: string | undefined, spec: string) => {
    if (spec === "%") return "%";
    const n = pos ? Number(pos) : ++next;
    return spec === "s" ? `<arg${n}>` : spec === "d" ? String(n * 7) : (n * 1.5).toFixed(6);
  });
}

let androidChecked = 0;
for (const [id, value] of original) {
  const [name, , quantity] = id.split("|");
  const m = androidMap[name!];
  androidChecked++;
  if (!m) {
    failures.push(`android ${name}: not in the rename map`);
    continue;
  }
  const gen = generated.get(`${m.name}||${quantity}`);
  if (gen === undefined) failures.push(`android ${name} -> ${m.name} (${quantity || "string"}): missing`);
  else if (format(gen) !== format(value)) failures.push(`android ${name} -> ${m.name}: ${JSON.stringify(gen)} vs ${JSON.stringify(value)}`);
}

console.log(`roku: ${rokuChecked} keys checked; android: ${androidChecked} values checked (${new Set([...original.keys()].map((k) => k.split("|")[0])).size} names)`);
if (failures.length) {
  console.log(failures.join("\n"));
  process.exit(1);
}
console.log("all English renders identically");
