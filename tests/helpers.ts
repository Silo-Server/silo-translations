import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { canonicalArb, jsonText } from "../tools/lib/format.ts";

export const REPO = resolve(import.meta.dirname, "..");
export const FIXTURE = join(REPO, "tests/fixtures/basic");

type Arb = Record<string, unknown>;

/** A throwaway catalog repo with the real locales.json and the given ARB files and glossary. */
export function makeRepo(arbs: Record<string, Arb>, glossary?: string): string {
  const root = mkdtempSync(join(tmpdir(), "silo-translations-test-"));
  cpSync(join(REPO, "locales.json"), join(root, "locales.json"));
  mkdirSync(join(root, "catalog"));
  for (const [tag, content] of Object.entries(arbs)) {
    writeArb(join(root, "catalog", `${tag}.arb`), content);
  }
  if (glossary) writeFileSync(join(root, "glossary.csv"), glossary);
  return root;
}

/** An en.arb entry plus its metadata. */
export function entry(key: string, message: string, meta: Record<string, unknown> = {}): Arb {
  return { [key]: message, [`@${key}`]: { description: "Test string.", ...meta } };
}

/** Writes an ARB file in the canonical layout, as make fmt would. */
export function writeArb(file: string, content: Record<string, unknown>): void {
  writeFileSync(file, jsonText(canonicalArb(content)));
}
