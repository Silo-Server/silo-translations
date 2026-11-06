// Copies settings labels from silo-server's contracts/settings/v1/manifest.json into en.arb as
// settingsManifest.<settingKey>.{label,description,unsetLabel,option.<value>}.
//
//   --repo <silo-server checkout> --ref <rev>   vendor the manifest at that commit, then import
//   (no arguments)                              re-import from the vendored copy
//   --check                                     fail when en.arb differs from the vendored copy
//
// Key segments are the setting key and enum value with "-" changed to "_", so clients build
// the key from the setting they render. Keys under settingsManifest.* are owned by this tool:
// edit the label in silo-server, not here.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { canonicalArb, jsonText } from "./lib/format.ts";

export const PREFIX = "settingsManifest.";
const MANIFEST_PATH = "contracts/settings/v1/manifest.json";

interface Definition {
  key: string;
  label: string;
  description: string;
  unset_label?: string;
  value_schema: { type: string; values?: { value: string | number; label?: string }[] };
}
interface Manifest {
  revision: number;
  definitions: Definition[];
}

export function segment(id: string | number): string {
  return String(id).replace(/-/g, "_");
}

/**
 * Which clients render each kind of manifest text. Web and Apple render labels, descriptions
 * and option labels from the manifest; Android renders only the unset label (its other settings
 * text comes from its own strings); Roku renders none. Widen a list when a client starts reading
 * that text.
 */
export const MANIFEST_PLATFORMS = {
  label: ["web", "apple"],
  description: ["web", "apple"],
  option: ["web", "apple"],
  unsetLabel: ["web", "apple", "android"],
} as const;

/** The settingsManifest.* entries (message and metadata) a manifest produces, in manifest order. */
export function manifestEntries(manifest: Manifest): [string, unknown][] {
  const out: [string, unknown][] = [];
  const add = (kind: keyof typeof MANIFEST_PLATFORMS, key: string, message: string, description: string) => {
    out.push([key, message], [`@${key}`, { description, "x-platforms": [...MANIFEST_PLATFORMS[kind]] }]);
  };
  for (const d of manifest.definitions) {
    const base = `${PREFIX}${d.key.split(".").map(segment).join(".")}`;
    const where = `the ${d.key} setting`;
    add("label", `${base}.label`, d.label, `Label of ${where} in settings screens. From the server's settings manifest.`);
    add("description", `${base}.description`, d.description, `Help text under ${where}. From the server's settings manifest.`);
    if (d.unset_label) add("unsetLabel", `${base}.unsetLabel`, d.unset_label, `Choice for ${where} that leaves it unset. From the server's settings manifest.`);
    for (const v of d.value_schema.values ?? []) {
      if (v.label === undefined) continue;
      add("option", `${base}.option.${segment(v.value)}`, v.label, `Choice "${v.value}" for ${where}. From the server's settings manifest.`);
    }
  }
  return out;
}

/** en.arb with every settingsManifest.* entry replaced by the manifest's, in the canonical layout. */
export function applyManifest(arb: Record<string, unknown>, manifest: Manifest): Record<string, unknown> {
  const isOwned = (k: string) => k.startsWith(PREFIX) || k.startsWith(`@${PREFIX}`);
  const kept = Object.entries(arb).filter(([k]) => !isOwned(k));
  return canonicalArb(Object.fromEntries([...kept, ...manifestEntries(manifest)]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { repo: { type: "string" }, ref: { type: "string" }, check: { type: "boolean" } } });
  const root = resolve(import.meta.dirname, "..");
  const vendored = join(root, "sources/settings-manifest.json");
  const lock = join(root, "sources/settings-manifest.lock");
  const enPath = join(root, "catalog/en.arb");

  if (values.repo || values.ref) {
    if (!values.repo || !values.ref) {
      console.error("--repo and --ref go together");
      process.exit(2);
    }
    const git = (...a: string[]) => execFileSync("git", ["-C", values.repo!, ...a], { encoding: "utf8" });
    const commit = git("rev-parse", "--verify", `${values.ref}^{commit}`).trim();
    const text = git("show", `${commit}:${MANIFEST_PATH}`);
    mkdirSync(join(root, "sources"), { recursive: true });
    writeFileSync(vendored, text);
    const revision = (JSON.parse(text) as Manifest).revision;
    writeFileSync(lock, `repository=Silo-Server/silo-server\npath=${MANIFEST_PATH}\ncommit=${commit}\nrevision=${revision}\n`);
  }

  if (!existsSync(vendored)) {
    if (values.check) process.exit(0); // nothing vendored yet: nothing can drift
    console.error("no vendored manifest; run with --repo <silo-server checkout> --ref <rev> first");
    process.exit(2);
  }
  const manifest = JSON.parse(readFileSync(vendored, "utf8")) as Manifest;
  const current = readFileSync(enPath, "utf8");
  const next = jsonText(applyManifest(JSON.parse(current), manifest));
  if (values.check) {
    // Compare with the current file in canonical form, so a layout difference (make check
    // reports it) is not mistaken for manifest drift.
    if (next !== jsonText(canonicalArb(JSON.parse(current)))) {
      console.error("catalog/en.arb settingsManifest.* entries differ from sources/settings-manifest.json; run make import-settings-manifest");
      process.exit(1);
    }
    process.exit(0);
  }
  writeFileSync(enPath, next);
  console.log(`imported ${manifestEntries(manifest).length / 2} settingsManifest entries (manifest revision ${manifest.revision})`);
}
