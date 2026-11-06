// A language ships on a platform only with at least one valid translation in that platform's
// scope; otherwise no file is generated for it there.
import { test } from "node:test";
import assert from "node:assert/strict";
import { generateAll } from "../tools/generate.ts";
import { entry, makeRepo } from "./helpers.ts";

test("shipped: per platform, valid translations only", () => {
  const root = makeRepo({
    en: { ...entry("a.web", "Web", { "x-platforms": ["web"] }), ...entry("a.all", "All {name}", { placeholders: { name: { type: "String" } } }) },
    es: { "@@locale": "es", "a.web": "Web" }, // web-only key: ships on web only
    de: { "@@locale": "de", "a.all": "Alle" }, // stale (drops {name}): ships nowhere
    fr: { "@@locale": "fr", "a.all": "Tous {name}" }, // ships everywhere
  });
  const out = generateAll(root, "test");
  const web = [...out.get("web")!.keys()].filter((p) => p.endsWith(".json")).map((p) => p.split("/").pop());
  assert.deepEqual(web.sort(), ["ar-XB.json", "en-XA.json", "en.json", "es.json", "fr.json"]);
  assert.deepEqual(JSON.parse(out.get("roku")!.get("locale/languages.json")!), { languages: ["en_US", "fr"], pseudo: ["en_XA"] });
  assert.match(out.get("android")!.get("android-shared/silo-locales.properties")!, /\nphone=en,fr\ntv=en,fr\n/);
  const apple = JSON.parse(out.get("apple")!.get("iosApp/iosApp/Localizable.xcstrings")!).strings;
  assert.deepEqual(Object.keys(apple["a.all"].localizations), ["en", "fr"]);
  assert.match(out.get("web")!.get("web/src/locales/keys.ts")!, /tag: "es"/);
  assert.doesNotMatch(out.get("web")!.get("web/src/locales/keys.ts")!, /tag: "de"/);
});
