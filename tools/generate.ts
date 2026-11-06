// make generate OUT=<dir>: validates, then writes <dir>/<platform>/... for web, apple,
// android and roku. Each platform tree is laid out relative to that client's repo root.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { checkRepository, formatIssue } from "./lib/check.ts";
import type { GenInput, Files } from "./gen/common.ts";
import { generateWeb } from "./gen/web.ts";
import { generateApple } from "./gen/apple.ts";
import { generateAndroid } from "./gen/android.ts";
import { generateRoku } from "./gen/roku.ts";
import { pseudoMessages } from "./gen/pseudo.ts";

export const GENERATORS = { web: generateWeb, apple: generateApple, android: generateAndroid, roku: generateRoku };
const MARKER = ".silo-translations-out";

/** Generates every platform's files in memory. Throws when the catalog has errors. */
export function generateAll(root: string, version: string): Map<string, Files> {
  const checked = checkRepository(root);
  const errors = checked.issues.filter((i) => i.level === "error");
  if (errors.length) {
    throw new Error(`catalog has ${errors.length} errors:\n${errors.map((i) => formatIssue(root, i)).join("\n")}`);
  }
  const entries = checked.catalog.entries.filter((e) => checked.english.has(e.key));
  const input: GenInput = {
    version,
    locales: checked.locales,
    entries,
    english: checked.english,
    translations: checked.valid,
    pseudo: new Map(checked.locales.pseudo.map((l) => [l.tag, pseudoMessages(l, entries, checked.english)])),
  };
  return new Map(Object.entries(GENERATORS).map(([platform, gen]) => [platform, gen(input)]));
}

/** `local-<commit>` with `-dirty` when catalog inputs have uncommitted changes. */
export function localVersion(root: string): string {
  const git = (...args: string[]) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
  const sha = git("rev-parse", "--short=12", "HEAD");
  const dirty = git("status", "--porcelain", "--", "catalog", "locales.json", "tools", "package-lock.json") !== "";
  return `local-${sha}${dirty ? "-dirty" : ""}`;
}

/** Writes the trees under `out`; the marker file holds the version (sync --local reads it). */
export function writeOutput(out: string, platforms: Map<string, Files>, version = ""): void {
  if (existsSync(out) && readdirSync(out).length > 0) {
    if (!existsSync(join(out, MARKER))) {
      throw new Error(`${out} is not empty and was not made by make generate; choose an empty or new directory`);
    }
    for (const platform of platforms.keys()) rmSync(join(out, platform), { recursive: true, force: true });
  }
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, MARKER), version);
  for (const [platform, files] of platforms) {
    for (const [path, content] of files) {
      const file = join(out, platform, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { out: { type: "string" }, version: { type: "string" }, root: { type: "string" } } });
  if (!values.out) {
    console.error("usage: node tools/generate.ts --out <dir> [--version <version>] [--root <catalog repo>]");
    process.exit(2);
  }
  const root = resolve(values.root ?? resolve(import.meta.dirname, ".."));
  try {
    const version = values.version || localVersion(root);
    const out = resolve(values.out);
    writeOutput(out, generateAll(root, version), version);
    console.log(`generated ${version} into ${out}`);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
