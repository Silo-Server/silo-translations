import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locales } from "./locales.ts";

export const PLATFORMS = ["web", "apple", "android", "roku"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLACEHOLDER_TYPES = ["String", "int", "double"] as const;
export type PlaceholderType = (typeof PLACEHOLDER_TYPES)[number];

export interface Placeholder {
  name: string;
  type: PlaceholderType;
}

export interface SourceEntry {
  key: string;
  message: string;
  description: string;
  /** In declaration order; this order is the positional order on Android and Apple. */
  placeholders: Placeholder[];
  platforms: Platform[];
  maxLength?: number;
  /** Info.plist key (`apple.infoPlist.*` keys only), verbatim, e.g. NSLocalNetworkUsageDescription. */
  plistKey?: string;
}

export interface Issue {
  level: "error" | "warning";
  file: string;
  key?: string;
  message: string;
  /** "layout": the file's formatting (make fmt), which only make check enforces. */
  rule?: "layout";
}

export interface Catalog {
  sourceFile: string;
  entries: SourceEntry[];
  byKey: Map<string, SourceEntry>;
  /** Language tag -> key -> message, for every target language that has a file. */
  translations: Map<string, Map<string, string>>;
  issues: Issue[];
}

export const KEY_PATTERN = /^[a-z][A-Za-z0-9_]*(\.[a-z0-9][A-Za-z0-9_]*)*$/;
export const PLACEHOLDER_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function readJson(file: string, issues: Issue[]): Record<string, unknown> | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    issues.push({ level: "error", file, message: `not valid JSON: ${(e as Error).message}` });
    return undefined;
  }
  if (!isObject(parsed)) {
    issues.push({ level: "error", file, message: "top level must be an object" });
    return undefined;
  }
  return parsed;
}

export function catalogPath(root: string, tag: string): string {
  return join(root, "catalog", `${tag}.arb`);
}

/** Loads `catalog/en.arb` and every target language's ARB. Shape problems become issues. */
export function loadCatalog(root: string, locales: Locales): Catalog {
  const issues: Issue[] = [];
  const sourceFile = catalogPath(root, locales.source.tag);
  const entries: SourceEntry[] = [];
  const byKey = new Map<string, SourceEntry>();
  const raw = readJson(sourceFile, issues) ?? {};

  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("@")) {
      if (key === "@@locale" || key.startsWith("@@")) continue;
      if (!(key.slice(1) in raw)) {
        issues.push({ level: "error", file: sourceFile, key: key.slice(1), message: "metadata without a message" });
      }
      continue;
    }
    const at = (msg: string) => issues.push({ level: "error", file: sourceFile, key, message: msg });
    if (typeof value !== "string") {
      at("message must be a string");
      continue;
    }
    const meta = raw[`@${key}`];
    const entry: SourceEntry = { key, message: value, description: "", placeholders: [], platforms: [...PLATFORMS] };
    if (meta === undefined) {
      at("missing @metadata with a description");
    } else if (!isObject(meta)) {
      at("@metadata must be an object");
    } else {
      for (const field of Object.keys(meta)) {
        if (!["description", "placeholders", "x-platforms", "x-maxLength", "x-plistKey"].includes(field)) {
          at(`unknown metadata field ${field}`);
        }
      }
      if (typeof meta.description === "string" && meta.description.trim() !== "") {
        entry.description = meta.description;
      } else {
        at("description is required");
      }
      if (meta.placeholders !== undefined) {
        if (!isObject(meta.placeholders)) {
          at("placeholders must be an object");
        } else {
          for (const [name, p] of Object.entries(meta.placeholders)) {
            const type = isObject(p) ? p.type : undefined;
            if (!PLACEHOLDER_TYPES.includes(type as PlaceholderType)) {
              at(`placeholder ${name} needs a type of ${PLACEHOLDER_TYPES.join(", ")}`);
              continue;
            }
            if (!PLACEHOLDER_NAME_PATTERN.test(name)) {
              at(`placeholder name ${name} must match ${PLACEHOLDER_NAME_PATTERN}`);
            }
            entry.placeholders.push({ name, type: type as PlaceholderType });
          }
        }
      }
      const platforms = meta["x-platforms"];
      if (platforms !== undefined) {
        if (
          !Array.isArray(platforms) ||
          platforms.length === 0 ||
          platforms.some((p) => !PLATFORMS.includes(p as Platform)) ||
          new Set(platforms).size !== platforms.length
        ) {
          at(`x-platforms must be a non-empty list of distinct ${PLATFORMS.join(", ")}`);
        } else {
          entry.platforms = PLATFORMS.filter((p) => platforms.includes(p));
        }
      }
      const plistKey = meta["x-plistKey"];
      if (plistKey !== undefined) {
        if (typeof plistKey === "string") entry.plistKey = plistKey;
        else at("x-plistKey must be a string");
      }
      const maxLength = meta["x-maxLength"];
      if (maxLength !== undefined) {
        if (typeof maxLength === "number" && Number.isInteger(maxLength) && maxLength > 0) {
          entry.maxLength = maxLength;
        } else {
          at("x-maxLength must be a positive integer");
        }
      }
    }
    if (!KEY_PATTERN.test(key)) at(`key must match ${KEY_PATTERN}`);
    entries.push(entry);
    byKey.set(key, entry);
  }

  const translations = new Map<string, Map<string, string>>();
  for (const locale of locales.targets) {
    const file = catalogPath(root, locale.tag);
    if (!existsSync(file)) continue;
    const data = readJson(file, issues);
    if (!data) continue;
    const messages = new Map<string, string>();
    for (const [key, value] of Object.entries(data)) {
      if (key === "@@locale") {
        if (value !== locale.tag) issues.push({ level: "error", file, message: `@@locale must be ${locale.tag}` });
        continue;
      }
      if (key.startsWith("@@")) continue; // file-level metadata other ARB tools write
      if (key.startsWith("@")) {
        issues.push({ level: "error", file, key, message: "translations carry no metadata; edit en.arb" });
        continue;
      }
      if (typeof value !== "string") {
        issues.push({ level: "error", file, key, message: "message must be a string" });
        continue;
      }
      if (!byKey.has(key)) {
        issues.push({ level: "error", file, key, message: "key is not in en.arb" });
        continue;
      }
      if (value === "") continue; // Weblate writes empty strings for untranslated units.
      messages.set(key, value);
    }
    translations.set(locale.tag, messages);
  }

  return { sourceFile, entries, byKey, translations, issues };
}

/** Apple apps with their own Info.plist, and the folder each one's InfoPlist.xcstrings lives in. */
export const INFO_PLIST_APPS = { ios: "iOS", tvos: "tvOS", macos: "macOS" } as const;
export type InfoPlistApp = keyof typeof INFO_PLIST_APPS;
export const INFO_PLIST_PREFIX = "apple.infoPlist.";
export const PLIST_KEY_PATTERN = /^[A-Z][A-Za-z0-9]*$/;

/** True for Info.plist strings (apple.infoPlist.*), which go to InfoPlist.xcstrings only. */
export function isInfoPlist(entry: SourceEntry): boolean {
  return entry.key.startsWith(INFO_PLIST_PREFIX);
}

/** The app an apple.infoPlist.<app>.<name> key belongs to, or undefined when the shape is wrong. */
export function infoPlistApp(entry: SourceEntry): InfoPlistApp | undefined {
  const parts = entry.key.slice(INFO_PLIST_PREFIX.length).split(".");
  return isInfoPlist(entry) && parts.length === 2 && Object.hasOwn(INFO_PLIST_APPS, parts[0]!) ? (parts[0] as InfoPlistApp) : undefined;
}

export function inScope(entry: SourceEntry, platform: Platform): boolean {
  return entry.platforms.includes(platform);
}

/** True when the key reaches a platform other than web, so the shared ICU subset applies. */
export function isShared(entry: SourceEntry): boolean {
  return entry.platforms.some((p) => p !== "web");
}
