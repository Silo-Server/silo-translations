import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PLATFORMS, type Platform } from "./catalog.ts";

export interface Locale {
  /** BCP 47 tag; also the web and Apple identifier. */
  tag: string;
  name: string;
  dir: "ltr" | "rtl";
  /** Key into CLDR's plural data (`pt` for `pt-BR`, `zh` for `zh-Hans`). */
  cldr: string;
  /** Android resource directory (`values`, `values-pt-rBR`, `values-b+zh+Hans`). */
  android: string;
  /** Roku `locale/<folder>/`. */
  roku: string;
  /**
   * Where the language ships; omitted means everywhere. `android` means both Android apps;
   * `android-phone` or `android-tv` holds it back on the other one.
   */
  platforms?: LocalePlatform[];
}

export const ANDROID_APPS = ["phone", "tv"] as const;
export type AndroidApp = (typeof ANDROID_APPS)[number];
export type LocalePlatform = Platform | `android-${AndroidApp}`;
const LOCALE_PLATFORMS: readonly string[] = [...PLATFORMS, ...ANDROID_APPS.map((a) => `android-${a}`)];

export interface PseudoLocale extends Omit<Locale, "android"> {
  kind: "accented" | "bidi";
}

export interface Locales {
  source: Locale;
  /** Every language in the catalog, source first. */
  all: Locale[];
  /** Languages other than the source. */
  targets: Locale[];
  pseudo: PseudoLocale[];
}

/** True when the platform ships the language (and so gets generated files for it). */
export function shipsOn(locale: Locale | PseudoLocale, platform: Platform): boolean {
  if (platform === "android") return androidApps(locale).length > 0;
  return !locale.platforms || locale.platforms.includes(platform);
}

/** The Android apps that ship the language. Both read android-shared's resources. */
export function androidApps(locale: Locale | PseudoLocale): AndroidApp[] {
  const p = locale.platforms;
  return ANDROID_APPS.filter((app) => !p || p.includes("android") || p.includes(`android-${app}`));
}

export function loadLocales(root: string): Locales {
  const raw = JSON.parse(readFileSync(join(root, "locales.json"), "utf8")) as {
    source: string;
    locales: Locale[];
    pseudo: PseudoLocale[];
  };
  const source = raw.locales.find((l) => l.tag === raw.source);
  if (!source) throw new Error(`locales.json: source ${raw.source} is not in locales`);
  if (source.platforms) throw new Error("locales.json: the source language ships on every platform");
  for (const l of [...raw.locales, ...raw.pseudo]) {
    if (l.platforms && (l.platforms.length === 0 || l.platforms.some((p) => !LOCALE_PLATFORMS.includes(p)))) {
      throw new Error(`locales.json: ${l.tag} platforms must be a non-empty list of ${LOCALE_PLATFORMS.join(", ")}`);
    }
  }
  return {
    source,
    all: [source, ...raw.locales.filter((l) => l !== source)],
    targets: raw.locales.filter((l) => l !== source),
    pseudo: raw.pseudo,
  };
}
