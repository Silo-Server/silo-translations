// Golden tests: the fixture catalog's output for every platform must match tests/golden/
// byte for byte. Regenerate with `make golden` after an intended change, then review the diff.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { generateAll } from "../tools/generate.ts";
import { escapeAndroid } from "../tools/gen/android.ts";
import { json, literalBidi } from "../tools/gen/common.ts";
import { xcodeJson } from "../tools/gen/apple.ts";
import { entry, FIXTURE, makeRepo, REPO } from "./helpers.ts";

const GOLDEN = join(REPO, "tests/golden");

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? listFiles(p) : [p];
  });
}

const platforms = generateAll(FIXTURE, "test");

for (const [platform, files] of platforms) {
  test(`golden: ${platform}`, () => {
    const want = listFiles(join(GOLDEN, platform)).map((f) => relative(join(GOLDEN, platform), f)).sort();
    assert.deepEqual([...files.keys()].sort(), want, "generated file list");
    for (const [path, content] of files) {
      assert.equal(content, readFileSync(join(GOLDEN, platform, path), "utf8"), `${platform}/${path}`);
    }
  });
}

test("an apostrophe after a placeholder reaches every platform as a literal", () => {
  const root = makeRepo({ en: entry("a.b", "group {n}'s rules", { placeholders: { n: { type: "String" } } }) });
  const out = generateAll(root, "test");
  assert.equal(JSON.parse(out.get("roku")!.get("locale/en_US/strings.json")!)["a.b"], "group {n}'s rules");
  assert.match(out.get("android")!.get("android-shared/src/androidMain/res/values/strings_catalog.xml")!, /group %1\$s\\'s rules/);
  assert.equal(JSON.parse(out.get("apple")!.get("iosApp/iosApp/Localizable.xcstrings")!).strings["a.b"].localizations.en.stringUnit.value, "group %1$@'s rules");
  assert.deepEqual(JSON.parse(out.get("web")!.get("web/src/locales/en.json")!)["a.b"].at(-1), { type: 0, value: "'s rules" });
  assert.match(JSON.parse(out.get("roku")!.get("locale/en_XA/strings.json")!)["a.b"], /^«ĝŕöûþ \{n\}'š ŕûļéš~+»$/);
});

test("android: a plural whose English one prints no number ignores ImpliedQuantity in every language (D76)", () => {
  const COUNT = { description: "Test string. {count}: the number.", placeholders: { count: { type: "int" } } };
  const root = makeRepo({
    en: {
      ...entry("a.vote", "{count, plural, one {VOTE} other {VOTES}}", COUNT),
      ...entry("a.items", "{count, plural, one {# item} other {# items}}", COUNT),
    },
    fr: {
      "a.vote": "{count, plural, one {VOTE} many {VOTES} other {VOTES}}",
      "a.items": "{count, plural, one {# élément} many {# d’éléments} other {# éléments}}",
    },
    de: { "a.items": "{count, plural, one {# Element} other {# Elemente}}" },
  });
  const android = generateAll(root, "test").get("android")!;
  const file = (dir: string) => android.get(`android-shared/src/androidMain/res/${dir}/strings_catalog.xml`)!;
  for (const dir of ["values", "values-fr"]) {
    const xml = file(dir);
    assert.match(xml, /<resources xmlns:tools="http:\/\/schemas\.android\.com\/tools">/, dir);
    assert.equal(xml.match(/xmlns:tools/g)!.length, 1, `${dir}: namespace once`);
    assert.match(xml, /<plurals name="a_vote" tools:ignore="ImpliedQuantity">/, dir);
    assert.match(xml, /<plurals name="a_items">/, dir);
  }
  // A file with no such plural declares no tools namespace.
  assert.match(file("values-de"), /<resources>\n/);
});

test("pseudo: en-XA lengthens text inside a tag too", () => {
  const root = makeRepo({ en: entry("a.b", "<b>Hello world</b>", { "x-platforms": ["web"] }) });
  const ast = JSON.parse(generateAll(root, "test").get("web")!.get("web/src/locales/en-XA.json")!)["a.b"] as { value?: string }[];
  // 11 visible characters: about 40% longer is 5 tildes before the closing bracket.
  assert.equal(ast.at(-1)!.value, "~~~~~⟧");
});

test("android: control characters XML can't hold become \\u escapes", () => {
  assert.equal(escapeAndroid("x\u000by\rz", false), "x\\u000by\\u000dz");
});

const BIDI = "\u061C\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2066\u2067\u2068\u2069";

test("bidi: no generated file holds a literal bidi control, and each platform escapes them", () => {
  for (const [platform, files] of platforms) assert.deepEqual(literalBidi(files), [], platform);
  const text = (platform: string, path: string) => platforms.get(platform)!.get(path)!;
  assert.match(text("web", "web/src/locales/ar.json"), /\\u2068/);
  assert.match(text("roku", "locale/en_US/strings.json"), /Shared by \\u2068\{name\}\\u2069/);
  assert.match(text("apple", "iosApp/iosApp/Localizable.xcstrings"), /\\u2068%1\$@\\u2069\\u200F/);
  assert.match(text("android", "android-shared/src/androidMain/res/values-ar/strings_catalog.xml"), /\\u2068%1\$s\\u2069\\u200f/);
});

test("bidi: escaped JSON parses to the same strings", () => {
  const value = { [`k${BIDI}`]: `a${BIDI}b`, list: [BIDI] };
  assert.doesNotMatch(json(value), /[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/);
  assert.deepEqual(JSON.parse(json(value)), value);
  assert.deepEqual(JSON.parse(xcodeJson(value)), value);
  assert.equal(escapeAndroid(BIDI, false), BIDI.split("").map((c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`).join(""));
});

test("bidi: right-to-left output keeps a Latin name's edge symbols on its side", () => {
  const LRM = "\u200E";
  // [key, English, Arabic or Hebrew, what the generator writes]
  const cases: [string, string, Record<string, string>, Record<string, string>][] = [
    ["a.hdr", "Detect HDR10+ Video", { ar: "اكتشاف فيديو HDR10+", he: "זיהוי סרטוני HDR10+" }, { ar: `اكتشاف فيديو HDR10+${LRM}`, he: `זיהוי סרטוני HDR10+${LRM}` }],
    ["a.comma", "Silo detected HDR10+, once", { ar: "اكتشف Silo تنسيق HDR10+، مرة", he: "Silo זיהה HDR10+, פעם" }, { ar: `اكتشف Silo تنسيق HDR10+${LRM}، مرة`, he: `Silo זיהה HDR10+${LRM}, פעם` }],
    ["a.pin", "needs #PIN", { ar: "يتطلب #PIN", he: "נדרש #PIN" }, { ar: `يتطلب ${LRM}#PIN`, he: `נדרש ${LRM}#PIN` }],
    ["a.ip", "such as 192.168.x.x or localhost.", { ar: "مثل 192.168.x.x أو localhost.", he: "כמו 192.168.x.x או localhost." }, { ar: `مثل ${LRM}192.168.x.x أو localhost.`, he: `כמו ${LRM}192.168.x.x או localhost.` }],
    ["a.prefix", "a name after a prefix", { ar: "ملف وHDR10+ الخاص", he: "קובץ ה-.nfo של הכותר" }, { ar: `ملف وHDR10+${LRM} الخاص`, he: `קובץ ה-${LRM}.nfo של הכותר` }],
    ["a.keys", "Speed (shift+. / shift+,)", { ar: "السرعة (shift+. / shift+,)", he: "מהירות (shift+. / shift+,)" }, { ar: `السرعة (shift+${LRM}. / shift+${LRM},${LRM})`, he: `מהירות (shift+${LRM}. / shift+${LRM},${LRM})` }],
    ["a.url", "such as https://mdblist.com/lists/…", { ar: "مثل https://mdblist.com/lists/…", he: "למשל https://mdblist.com/lists/…" }, { ar: `مثل https://mdblist.com/lists/…${LRM}`, he: `למשל https://mdblist.com/lists/…${LRM}` }],
    ["a.paren", "a list (https://mdblist.com/lists/…).", { ar: "قائمة (https://mdblist.com/lists/…).", he: "רשימה (https://mdblist.com/lists/…)." }, { ar: `قائمة (https://mdblist.com/lists/…${LRM}).`, he: `רשימה (https://mdblist.com/lists/…${LRM}).` }],
    ["a.and", "the .srt and .nfo files", { ar: "ملفات .srt و.nfo", he: "קובצי .srt ו-.nfo" }, { ar: `ملفات ${LRM}.srt و${LRM}.nfo`, he: `קובצי ${LRM}.srt ו-${LRM}.nfo` }],
    ["a.quoted", "an example (“HDR10+”)", { ar: "مثال («HDR10+»)", he: "דוגמה (”HDR10+”)" }, { ar: `مثال («HDR10+${LRM}»)`, he: `דוגמה (”HDR10+${LRM}”)` }],
    ["a.para", "Turn on (HDR10+\u2029) Back", { ar: "تشغيل (HDR10+\u2029) رجوع", he: "הפעל (HDR10+\u2029) חזור" }, { ar: `تشغيل (HDR10+${LRM}\u2029) رجوع`, he: `הפעל (HDR10+${LRM}\u2029) חזור` }],
    ["a.nel", "Turn on (HDR10+\u0085) Back", { ar: "تشغيل (HDR10+\u0085) رجوع", he: "הפעל (HDR10+\u0085) חזור" }, { ar: `تشغيل (HDR10+${LRM}\u0085) رجوع`, he: `הפעל (HDR10+${LRM}\u0085) חזור` }],
    ["a.lines", "Turn on (HDR10+\n) Back", { ar: "تشغيل (HDR10+\n) رجوع", he: "הפעל (HDR10+\n) חזור" }, { ar: `تشغيل (HDR10+${LRM}\n) رجوع`, he: `הפעל (HDR10+${LRM}\n) חזור` }],
    // Unchanged: a word joined by #, quotes around a name, a name ending a sentence or an ellipsis, digits a letter follows.
    ["a.word", "password#PIN.", { ar: "كلمة المرور#PIN.", he: "סיסמה#PIN." }, { ar: "كلمة المرور#PIN.", he: "סיסמה#PIN." }],
    ["a.quote", "On the “Bot” page", { ar: "في صفحة «Bot»", he: "בדף ”Bot”" }, { ar: "في صفحة «Bot»", he: "בדף ”Bot”" }],
    ["a.end", "Updated Silo.", { ar: "تم تحديث Silo.", he: "Silo עודכן." }, { ar: "تم تحديث Silo.", he: "Silo עודכן." }],
    ["a.loading", "Loading API…", { ar: "جارٍ تحميل API…", he: "טוען API…" }, { ar: "جارٍ تحميل API…", he: "טוען API…" }],
    ["a.quotedEnd", "an example (“Silo”.)", { ar: "مثال («Silo».)", he: "דוגמה (”Silo”.)" }, { ar: "مثال («Silo».)", he: "דוגמה (”Silo”.)" }],
    ["a.quotedStop", "an example (“HDR10+”,)", { ar: "مثال («HDR10+».)", he: "דוגמה (”HDR10+”,)" }, { ar: `مثال («HDR10+${LRM}».)`, he: `דוגמה (”HDR10+${LRM}”,)` }],
    ["a.quotedName", "the (“Bot”) page", { ar: "صفحة («Bot»)", he: "הדף (”Bot”)" }, { ar: "صفحة («Bot»)", he: "הדף (”Bot”)" }],
    ["a.res", "New in 4K and 1080p", { ar: "جديد بدقة 4K و1080p", he: "חדש ב-4K וב-1080p" }, { ar: "جديد بدقة 4K و1080p", he: "חדש ב-4K וב-1080p" }],
  ];
  const root = makeRepo({
    en: Object.assign({}, ...cases.map(([key, en]) => entry(key, en))),
    ar: Object.fromEntries(cases.map(([key, , tr]) => [key, tr.ar])),
    he: Object.fromEntries(cases.map(([key, , tr]) => [key, tr.he])),
  });
  const out = generateAll(root, "test");
  for (const tag of ["ar", "he"]) {
    const web = JSON.parse(out.get("web")!.get(`web/src/locales/${tag}.json`)!) as Record<string, { value: string }[]>;
    for (const [key, , , want] of cases) assert.equal(web[key]!.map((el) => el.value).join(""), want[tag], `${tag} ${key}`);
  }
  const android = out.get("android")!.get("android-shared/src/androidMain/res/values-iw/strings_catalog.xml")!;
  assert.match(android, /<string name="a_hdr">זיהוי סרטוני HDR10\+\\u200e<\/string>/);
});

test("bidi: right-to-left output leaves <code> as written and marks names in other tags", () => {
  const root = makeRepo({
    en: entry("a.code", "Map <code>/srv/media</code> to <b>/media</b>", { "x-platforms": ["web"] }),
    ar: { "a.code": "اربط <code>/srv/media</code> بـ <b>/media</b>" },
  });
  const ast = JSON.parse(generateAll(root, "test").get("web")!.get("web/src/locales/ar.json")!)["a.code"];
  assert.deepEqual(ast, [
    { type: 0, value: "اربط " },
    { type: 8, value: "code", children: [{ type: 0, value: "/srv/media" }] },
    { type: 0, value: " بـ " },
    { type: 8, value: "b", children: [{ type: 0, value: "\u200E/media" }] },
  ]);
});

test("bidi: right-to-left output leaves an edge that runs into a placeholder unmarked", () => {
  const PLACEHOLDERS = { host: { type: "String" }, tag: { type: "String" }, query: { type: "String" }, site: { type: "String" } };
  const en = "Open https://{host}/activate or #{tag}, https://example.test/?{query} or https://{site, select, main {example.com} other {example.org}}/x";
  const he = "פתח את https://{host}/activate או #{tag}, https://example.test/?{query} או https://{site, select, main {example.com} other {example.org}}/x";
  const root = makeRepo({
    en: entry("a.url", en, { description: "Test string. {host}: a host. {tag}: a tag. {query}: a query. {site}: a site.", placeholders: PLACEHOLDERS, "x-platforms": ["web"] }),
    he: { "a.url": he },
  });
  const ast = JSON.parse(generateAll(root, "test").get("web")!.get("web/src/locales/he.json")!)["a.url"];
  assert.doesNotMatch(JSON.stringify(ast), /\u200e/i);
});

test("bidi: a branch or tag edge followed by sentence punctuation still gets its mark", () => {
  const root = makeRepo({
    en: {
      ...entry("a.tagged", "Open https://<b>{host}</b>/x, or <b>HDR10+</b>.", { description: "Test string. {host}: a host.", placeholders: { host: { type: "String" } }, "x-platforms": ["web"] }),
      ...entry("a.branch", "{kind, select, hdr {HDR10+} other {DV}}.", { description: "Test string. {kind}: a format.", placeholders: { kind: { type: "String" } }, "x-platforms": ["web"] }),
    },
    he: { "a.tagged": "פתח את https://<b>{host}</b>/x, או <b>HDR10+</b>.", "a.branch": "{kind, select, hdr {HDR10+} other {DV}}." },
  });
  const web = JSON.parse(generateAll(root, "test").get("web")!.get("web/src/locales/he.json")!);
  const text = (ast: unknown): string => JSON.stringify(ast);
  // No mark where the URL runs into the tagged placeholder; one after HDR10+ before the full stop.
  assert.doesNotMatch(text(web["a.tagged"]).split("HDR10+")[0]!, /\u200E/);
  assert.match(text(web["a.tagged"]), /HDR10\+\u200E/);
  assert.match(text(web["a.branch"]), /HDR10\+\u200E/);
});

test("bidi: a long run of Latin symbols or spaces doesn't make the patterns backtrack", () => {
  const roman = `${"Ⅻ".repeat(40)}א`;
  const spaced = `(A${" ".repeat(200_000)}B)`;
  const root = makeRepo({
    en: { ...entry("a.roman", "XII", { "x-platforms": ["web"] }), ...entry("a.spaced", "A B", { "x-platforms": ["web"] }) },
    he: { "a.roman": roman, "a.spaced": spaced },
  });
  // A backtracking pattern hangs instead of failing, and a test's own timeout can't interrupt
  // synchronous code, so the generator runs in a child process with a time limit.
  const generate = pathToFileURL(join(REPO, "tools/generate.ts")).href;
  const script = `import { generateAll } from ${JSON.stringify(generate)};
process.stdout.write(generateAll(${JSON.stringify(root)}, "test").get("web").get("web/src/locales/he.json"));`;
  const run = spawnSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8", timeout: 5_000, maxBuffer: 1 << 26 });
  assert.equal(run.status, 0, run.error?.message ?? run.stderr);
  const web = JSON.parse(run.stdout);
  assert.deepEqual(web["a.roman"], [{ type: 0, value: roman }]);
  assert.deepEqual(web["a.spaced"], [{ type: 0, value: spaced }]);
});

test("bidi: make check's scan names a file with a literal bidi control", () => {
  assert.deepEqual(literalBidi(new Map([["ok.json", "\\u200F"], ["bad.json", "x\u2067y"]])), [{ path: "bad.json", codePoint: "U+2067" }]);
});
