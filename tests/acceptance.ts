// Platform acceptance, shared by native.test.ts (fixture) and catalog.test.ts (real catalog):
// each generated tree goes through that platform's own tooling.
// - web: intl-messageformat (what react-intl uses) formats every AST; English matches the
//   source message formatted directly, and rich-text tags reach their handlers.
// - android: aapt2 compiles and links the resources, and the values AAPT decoded match the
//   expected text (escaping, spaces, placeholders) for every key and language.
// - apple: the String Catalog is JSON with the structure Xcode reads (no Xcode on Linux), and
//   every shipped language has every key, English where it has no translation (D71).
// Roku's bsc compile and run is in plural.test.ts.
// aapt2 is skipped when the Android SDK is missing, except in CI.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { IntlMessageFormat } from "intl-messageformat";
import { generateAll, writeOutput } from "../tools/generate.ts";
import { androidName, checkRepository } from "../tools/lib/check.ts";
import { render } from "../tools/gen/common.ts";
import type { Analysis } from "../tools/lib/icu.ts";
import { PLIST_KEY_PATTERN, type SourceEntry } from "../tools/lib/catalog.ts";
import { decodeResources, findSdk } from "../tools/lib/aapt.ts";

/** Runs the acceptance checks for any catalog root; the seed branch reuses this on the real catalog. */
export function acceptance(root: string, name: string) {
  const checked = checkRepository(root);
  const platforms = generateAll(root, "test");
  const sample = (e: SourceEntry) =>
    Object.fromEntries(e.placeholders.map((p) => [p.name, p.type === "String" ? `<${p.name}>` : 3]));

  test(`${name}: web ASTs format with intl-messageformat`, () => {
    const web = platforms.get("web")!;
    for (const [path, content] of web) {
      if (!path.endsWith(".json")) continue;
      const tag = path.split("/").pop()!.replace(/\.json$/, "");
      const messages = JSON.parse(content) as Record<string, unknown>;
      for (const [key, ast] of Object.entries(messages)) {
        const entry = checked.catalog.byKey.get(key)!;
        const values: Record<string, unknown> = sample(entry);
        for (const t of checked.english.get(key)!.tags) values[t] = (chunks: string[]) => `[${t}:${chunks.join("")}]`;
        const fmt = new IntlMessageFormat(ast as never, tag);
        const out = fmt.format(values);
        if (tag === checked.locales.source.tag) {
          assert.deepEqual(out, new IntlMessageFormat(entry.message, tag).format(values), `${key}`);
        }
      }
    }
  });

  test(`${name}: apple String Catalog structure`, () => {
    const xc = JSON.parse(platforms.get("apple")!.get("iosApp/iosApp/Localizable.xcstrings")!);
    assert.equal(xc.sourceLanguage, "en");
    assert.equal(xc.version, "1.0");
    // Every string unit has one state: "translated" for a valid translation (or English itself),
    // "needs_review" for the English value written where a language has none (D71).
    const units = (l: Record<string, unknown>, state?: string): string[] => {
      const out: string[] = [];
      const walk = (v: unknown) => {
        if (v && typeof v === "object") {
          const o = v as Record<string, unknown>;
          if (o.stringUnit) {
            const u = o.stringUnit as Record<string, unknown>;
            if (state) assert.equal(u.state, state);
            assert.equal(typeof u.value, "string");
            out.push(u.value as string);
          }
          for (const [k, x] of Object.entries(o)) if (k !== "stringUnit") walk(x);
        }
      };
      walk(l);
      return out;
    };
    const strings = Object.entries(xc.strings as Record<string, Record<string, unknown>>);
    const shipped = new Set(strings.flatMap(([, s]) => Object.keys(s.localizations as object)));
    for (const [key, s] of strings) {
      assert.equal(s.extractionState, "manual", key);
      assert.equal(typeof s.comment, "string", key);
      const locs = s.localizations as Record<string, Record<string, unknown>>;
      // Apple shows the raw key for a key missing from the app language, so none may be missing.
      assert.deepEqual(Object.keys(locs).sort(), [...shipped].sort(), `${key}: every shipped language`);
      const source = checked.locales.source.tag;
      for (const [tag, loc] of Object.entries(locs)) {
        const translated = tag === source || checked.valid.get(tag)?.has(key) === true;
        units(loc, translated ? "translated" : "needs_review");
        if (!translated) {
          // English, re-keyed to the language's plural categories (englishFor).
          const english = new Set(units(locs[source]!));
          for (const v of units(loc)) assert.ok(english.has(v), `${key} ${tag}: English fallback ${v}`);
        }
      }
      for (const [tag, loc] of Object.entries(locs)) {
        const keys = Object.keys(loc).sort().join(",");
        assert.ok(["stringUnit", "variations", "stringUnit,substitutions"].includes(keys), `${key} ${tag}: ${keys}`);
        if (loc.substitutions) {
          for (const sub of Object.values(loc.substitutions as Record<string, Record<string, unknown>>)) {
            assert.equal(typeof sub.argNum, "number");
            assert.equal(sub.formatSpecifier, "lld");
          }
        }
        if (!checked.catalog.byKey.get(key)!.placeholders.length) continue; // no formatting, % is literal
        for (const v of units(loc)) assert.doesNotMatch(v.replace(/%%/g, ""), /%(?!(\d+\$)?(@|lld|lf)|arg|#@)/, `${key} ${tag}: ${v}`);
      }
    }
  });

  test(`${name}: apple InfoPlist catalogs are keyed by plist key`, () => {
    for (const dir of ["iOS", "tvOS", "macOS"]) {
      const xc = JSON.parse(platforms.get("apple")!.get(`iosApp/InfoPlist/${dir}/InfoPlist.xcstrings`)!);
      assert.equal(xc.sourceLanguage, "en");
      for (const [key, s] of Object.entries(xc.strings as Record<string, Record<string, unknown>>)) {
        assert.match(key, PLIST_KEY_PATTERN, `${dir} ${key}`);
        assert.equal(s.extractionState, "manual");
      }
    }
  });

  const sdk = findSdk();
  const skip = !sdk ? (process.env.CI ? false : "Android SDK not found") : false;

  test(`${name}: android resources compile, link and decode as expected`, { skip }, () => {
    assert.ok(sdk, "Android SDK required in CI");
    const dir = mkdtempSync(join(tmpdir(), "silo-native-"));
    writeOutput(join(dir, "out"), new Map([["android", platforms.get("android")!]]));
    const got = decodeResources(sdk, join(dir, "out/android/android-shared/src/androidMain/res"));

    const languages = [
      { config: "", messages: checked.english },
      ...checked.locales.targets.map((l) => ({ config: aaptConfig(l.android), messages: checked.valid.get(l.tag) })),
    ];
    let count = 0;
    for (const entry of checked.catalog.entries) {
      if (!entry.platforms.includes("android")) continue;
      for (const { config, messages } of languages) {
        const a = messages?.get(entry.key);
        if (!a) continue;
        for (const [form, text] of expectedAndroid(entry, a)) {
          const id = `${androidName(entry.key)}|${config}|${form}`;
          assert.equal(got.get(id), text, id);
          count++;
        }
      }
    }
    assert.equal(got.size, count, "every decoded value was expected");
  });
}

/** aapt2's config label for a values directory (values-pt-rBR -> pt-rBR). */
function aaptConfig(dir: string): string {
  return dir.replace(/^values-?/, "");
}

/** Independent statement of what Android's Resources must return for a message (before formatting). */
function expectedAndroid(entry: SourceEntry, a: Analysis): [string, string][] {
  const pos = new Map(entry.placeholders.map((p, i) => [p.name, i + 1]));
  const spec = { String: "s", int: "d", double: "f" } as const;
  const arg = (n: string) => `%${pos.get(n)}$${spec[entry.placeholders[pos.get(n)! - 1]!.type]}`;
  const shape = a.shape!;
  if (shape.kind === "simple") {
    const formatted = entry.placeholders.length > 0;
    return [["", render(shape.elements, { literal: (t) => (formatted ? t.replace(/%/g, "%%") : t), arg, pound: () => "" })]];
  }
  return [...shape.forms].map(([cat, els]) => [cat, render(els, { literal: (t) => t.replace(/%/g, "%%"), arg, pound: () => arg(shape.arg) })]);
}

