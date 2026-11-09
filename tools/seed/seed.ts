// One-off seed of catalog/en.arb from silo-roku and silo-android (plan item 0.8). Kept in the
// repository so the seed can be reproduced and reviewed; remove it once clients have migrated.
//
//   node tools/seed/seed.ts draft --roku <checkout> --android <checkout> --out <draft.json>
//   node tools/seed/seed.ts apply --draft <draft.json> --descriptions <dir> --reports <dir>
//
// draft reads origin/main of both checkouts (git show; nothing in them changes), converts every
// string to ICU, folds Roku's three plural schemes and Android's <plurals>, applies the renames
// decisions D11 needs, maps Android names to dotted keys, and merges an Android string into a
// Roku key when the English is identical and the Roku key is in common.* or the same feature
// namespace. apply adds the descriptions and placeholder names written from the call sites,
// writes catalog/en.arb, and writes the old-name -> new-key maps both clients need.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { decodeResources, findSdk } from "../lib/aapt.ts";
import type { Platform, PlaceholderType } from "../lib/catalog.ts";
import { canonicalArb, jsonText } from "../lib/format.ts";

const ROKU_STRINGS = "locale/en_US/strings.json";
const ANDROID_FILES = [
  "android-shared/src/androidMain/res/values/strings.xml",
  "androidApp/src/androidMain/res/values/strings.xml",
  "androidTvApp/src/androidMain/res/values/strings.xml",
];

export interface DraftPlaceholder {
  name: string;
  type: PlaceholderType;
}
export interface DraftEntry {
  key: string;
  message: string;
  placeholders: DraftPlaceholder[];
  platforms: Platform[];
  /** Old Roku keys folded into this entry (plural forms carry their category). */
  roku: { old: string; form?: string }[];
  /** Old Android names, with the module files they came from. */
  android: { old: string; modules: string[] }[];
  /** XML comment above the Android resource, if any. */
  androidComment?: string;
  /** True when Android placeholders still have generated names (argN) to replace. */
  needsNames?: boolean;
}

// --- Roku ----------------------------------------------------------------------------------

/** Roku's plural pairs (D11): base key -> its forms, and the count argument. */
const ROKU_PLURALS: { key: string; arg: string; forms: Record<string, string> }[] = [
  { key: "pin.lockout", arg: "minutes", forms: { one: "pin.lockout.one", other: "pin.lockout.other" } },
  { key: "catalog.seasons", arg: "count", forms: { one: "catalog.seasonsOne", other: "catalog.seasonsOther" } },
  { key: "search.result", arg: "count", forms: { one: "search.resultOne", other: "search.resultOther" } },
  { key: "collections.item", arg: "count", forms: { one: "collections.itemOne", other: "collections.itemOther" } },
  { key: "boxSets.film", arg: "count", forms: { one: "boxSets.filmOne", other: "boxSets.filmOther" } },
  { key: "rowPage.item", arg: "count", forms: { one: "rowPage.itemOne", other: "rowPage.itemOther" } },
  { key: "person.count", arg: "count", forms: { one: "person.countOne", other: "person.countOther" } },
  { key: "personal.count", arg: "count", forms: { one: "personal.countOne", other: "personal.countOther" } },
  { key: "subtitleSearch.resultCount", arg: "count", forms: { one: "subtitleSearch.resultCountOne", other: "subtitleSearch.resultCount" } },
  { key: "settings.accounts.profileCount", arg: "count", forms: { one: "settings.accounts.oneProfile", other: "settings.accounts.profiles" } },
  { key: "settings.connection.age.minutes", arg: "count", forms: { one: "settings.connection.age.minutes.one", other: "settings.connection.age.minutes.other" } },
  { key: "settings.connection.age.hours", arg: "count", forms: { one: "settings.connection.age.hours.one", other: "settings.connection.age.hours.other" } },
  { key: "settings.connection.age.days", arg: "count", forms: { one: "settings.connection.age.days.one", other: "settings.connection.age.days.other" } },
  { key: "settings.connection.retry", arg: "count", forms: { one: "settings.connection.retry.one", other: "settings.connection.retry.other" } },
  { key: "watchParty.hero.voting", arg: "count", forms: { one: "watchParty.hero.voting.one", other: "watchParty.hero.voting.other" } },
  { key: "watchParty.ballot.votes", arg: "count", forms: { one: "watchParty.ballot.votes.one", other: "watchParty.ballot.votes.other" } },
];

/**
 * Count messages with no singular form today (SR audit). Each becomes a plural on `arg` whose
 * forms are both the current English, so English renders byte-identically and other
 * languages get the forms they need.
 */
const ROKU_COUNTS: Record<string, string> = {
  "player.audio.skipBack": "seconds",
  "player.audio.skipForward": "seconds",
  "companion.completed.bodyAccounts": "count",
  "settings.diagnostics.count": "count",
  "filters.selected": "count",
  "library.filterSpoken": "count",
  "subtitleSearch.downloads": "count",
  "person.countMore": "count",
  "personal.countMore": "count",
  "watchParty.connection.here": "count",
  "watchParty.presence.ready": "total",
  "watchParty.presence.watching": "total",
  "boxSets.watchedCard": "count",
  "boxSets.watchedFact": "count",
};

/** Keys that are not plurals but end in a plural category (D11). */
const ROKU_RENAMES: Record<string, string> = {
  "catalog.extra.other": "catalog.extra.otherExtra",
  "settings.connection.transport.other": "settings.connection.transport.otherNetwork",
  "watchParty.hint.notReady.one": "watchParty.hint.notReady.oneName",
  "watchParty.hint.notReady.two": "watchParty.hint.notReady.twoNames",
  "watchParty.hint.notReady.more": "watchParty.hint.notReady.moreNames",
};

function placeholdersIn(message: string): string[] {
  return [...new Set([...message.matchAll(/\{([a-z][a-z0-9_]*)\}/g)].map((m) => m[1]!))];
}

/** A plural form from one English form: the literal count "1" becomes #, {arg} becomes #. */
function form(text: string, arg: string, isOne: boolean): string {
  let out = text.replaceAll(`{${arg}}`, "#");
  if (isOne && !out.includes("#")) out = out.replace(/(^|[^\d])1(?!\d)/, "$1#");
  return out;
}

function rokuEntries(strings: Record<string, string>): DraftEntry[] {
  const folded = new Map<string, (typeof ROKU_PLURALS)[number]>();
  for (const p of ROKU_PLURALS) for (const old of Object.values(p.forms)) folded.set(old, p);
  const out: DraftEntry[] = [];
  for (const [old, text] of Object.entries(strings)) {
    const plural = folded.get(old);
    if (plural) {
      if (out.some((e) => e.key === plural.key)) continue; // emitted at its first form
      const one = form(strings[plural.forms.one!]!, plural.arg, true);
      const other = form(strings[plural.forms.other!]!, plural.arg, false);
      const message = `{${plural.arg}, plural, one {${one}} other {${other}}}`;
      const names = placeholdersIn(Object.values(plural.forms).map((k) => strings[k]).join(" ")).filter((n) => n !== plural.arg);
      out.push({
        key: plural.key,
        message,
        placeholders: [...names.map((name) => ({ name, type: "String" as const })), { name: plural.arg, type: "int" }],
        platforms: ["roku"],
        roku: Object.entries(plural.forms).map(([f, k]) => ({ old: k, form: f })),
        android: [],
      });
      continue;
    }
    const countArg = ROKU_COUNTS[old];
    const key = ROKU_RENAMES[old] ?? old;
    const names = placeholdersIn(text);
    if (countArg) {
      const body = form(text, countArg, false);
      out.push({
        key,
        message: `{${countArg}, plural, one {${body}} other {${body}}}`,
        placeholders: names.map((name) => ({ name, type: name === countArg ? "int" : "String" })),
        platforms: ["roku"],
        roku: [{ old, form: "plural" }],
        android: [],
      });
      continue;
    }
    out.push({ key, message: text, placeholders: names.map((name) => ({ name, type: "String" })), platforms: ["roku"], roku: [{ old }], android: [] });
  }
  return out;
}

// --- Android -------------------------------------------------------------------------------

/** Android name prefixes -> key namespaces. First match wins; the rest is joined in lowerCamel. */
const ANDROID_PREFIXES: [string, string][] = [
  ["settings_buffering_quality_", "settings.bufferingQuality."],
  ["settings_connection_transport_", "settings.connection.transport."],
  ["settings_connection_age_", "settings.connection.age."],
  ["settings_connection_", "settings.connection."],
  ["settings_intro_skip_", "settings.introSkip."],
  ["settings_learned_limit_", "settings.learnedLimit."],
  ["settings_rate_", "settings.rate."],
  ["sign_in_tv_error_", "signInTv.error."],
  ["sign_in_tv_", "signInTv."],
  ["tv_pair_error_", "tvPair.error."],
  ["tv_pairing_card_", "tvPairing.card."],
  ["tv_pairing_chip_", "tvPairing.chip."],
  ["tv_pairing_", "tvPairing."],
  ["tv_setup_", "tvSetup."],
  ["tv_signin_error_", "tvSignIn.error."],
  ["tv_signin_form_", "tvSignIn.form."],
  ["tv_signin_status_", "tvSignIn.status."],
  ["tv_signin_action_", "tvSignIn.action."],
  ["tv_signin_network_", "tvSignIn.network."],
  ["tv_signin_step_", "tvSignIn.step."],
  ["tv_signin_", "tvSignIn."],
  ["companion_", "companion."],
  ["change_account_", "changeAccount."],
  ["buffering_quality_prompt_", "bufferingQuality.prompt."],
  ["buffering_quality_", "bufferingQuality."],
  ["intro_skip_pill_", "introSkip.pill."],
  ["login_replace_", "loginReplace."],
  ["remote_battery_", "remote.battery."],
  ["remote_replace_", "remote.replace."],
  ["account_sign_out_", "account.signOut."],
  ["account_downloads_", "account.downloads."],
  ["account_profiles_", "account.profiles."],
  ["accounts_remove_", "accounts.remove."],
  ["action_", "common."],
];
// Names whose mechanical key would end in a plural category (D11), say something other than
// the Roku key of the same name, or need a namespace.
const ANDROID_EXACT: Record<string, string> = {
  loading: "status.loading",
  error_generic: "status.errorGeneric",
  empty_generic: "status.emptyGeneric",
  coming_soon: "status.comingSoon",
  settings_connection_transport_other: "settings.connection.transport.otherNetwork",
  action_back: "common.navigateBack",
  action_sign_out: "common.signOutTitle",
  accounts_add_account: "accounts.addAccountOnServer",
  accounts_add_server: "accounts.addAServer",
  settings_connection_not_saved: "settings.connection.notSavedShort",
};

const camel = (tokens: string[]) => tokens.map((t, i) => (i === 0 ? t : t.charAt(0).toUpperCase() + t.slice(1))).join("");

export function androidKey(name: string): string {
  if (ANDROID_EXACT[name]) return ANDROID_EXACT[name];
  for (const [prefix, ns] of ANDROID_PREFIXES) if (name.startsWith(prefix)) return ns + camel(name.slice(prefix.length).split("_"));
  const [first, ...rest] = name.split("_");
  return rest.length ? `${first}.${camel(rest)}` : `common.${first}`;
}

const SPEC_TYPE: Record<string, PlaceholderType> = { s: "String", d: "int", f: "double" };

/** An Android format string as ICU with generated argument names (arg1, arg2, ...). */
export function androidToIcu(text: string): { message: string; args: Map<number, PlaceholderType> } {
  const args = new Map<number, PlaceholderType>();
  let next = 1;
  const message = text.replace(/%(?:(\d+)\$)?([sdf%])/g, (_, pos: string | undefined, spec: string) => {
    if (spec === "%") return "%";
    const n = pos ? Number(pos) : next++;
    args.set(n, SPEC_TYPE[spec]!);
    return `{arg${n}}`;
  });
  return { message, args };
}

/** The XML comment directly above each resource (the last one before it). */
function comments(xml: string): Map<string, string> {
  const out = new Map<string, string>();
  let last: string | undefined;
  for (const m of xml.matchAll(/<!--([\s\S]*?)-->|<(string|plurals)\s+name="([^"]+)"/g)) {
    if (m[1] !== undefined) last = m[1].replace(/\s+/g, " ").trim();
    else {
      if (last) out.set(m[3]!, last);
      last = undefined;
    }
  }
  return out;
}

function androidEntries(repo: string): DraftEntry[] {
  const sdk = findSdk();
  if (!sdk) throw new Error("the seed decodes Android strings with aapt2; install the Android SDK");
  const byName = new Map<string, DraftEntry>();
  for (const file of ANDROID_FILES) {
    const module = file.split("/")[0]!;
    const xml = execFileSync("git", ["-C", repo, "show", `origin/main:${file}`], { encoding: "utf8" });
    const res = mkdtempSync(join(tmpdir(), "silo-seed-res-"));
    mkdirSync(join(res, "values"));
    writeFileSync(join(res, "values/strings.xml"), xml);
    const decoded = decodeResources(sdk, res);
    const notes = comments(xml);
    const groups = new Map<string, Map<string, string>>();
    for (const [id, value] of decoded) {
      const [name, , quantity] = id.split("|");
      if (!groups.has(name!)) groups.set(name!, new Map());
      groups.get(name!)!.set(quantity!, value);
    }
    for (const [name, values] of groups) {
      const existing = byName.get(name);
      if (existing) {
        existing.android[0]!.modules.push(module);
        continue;
      }
      let message: string;
      let args: Map<number, PlaceholderType>;
      if (values.has("")) ({ message, args } = androidToIcu(values.get("")!));
      else {
        args = new Map();
        const forms: string[] = [];
        let countArg = 0;
        for (const [q, v] of values) {
          const c = androidToIcu(v);
          for (const [n, t] of c.args) args.set(n, t);
          forms.push(`${q} {${c.message}}`);
        }
        const count = [...args].find(([, t]) => t === "int");
        if (!count) throw new Error(`android plurals ${name} has no %d count argument`);
        countArg = count[0];
        message = `{arg${countArg}, plural, ${forms.map((f) => f.replaceAll(`{arg${countArg}}`, "#")).join(" ")}}`;
      }
      const positions = [...args.keys()].sort((a, b) => a - b);
      byName.set(name, {
        key: androidKey(name),
        message,
        placeholders: positions.map((n) => ({ name: `arg${n}`, type: args.get(n)! })),
        platforms: ["android"],
        roku: [],
        android: [{ old: name, modules: [module] }],
        androidComment: notes.get(name),
        needsNames: positions.length > 0,
      });
    }
  }
  return [...byName.values()];
}

// --- merge ---------------------------------------------------------------------------------

/** English with placeholder names erased, so Roku and Android text can be compared. */
function shape(message: string): string {
  return message.replace(/\{[a-z][a-z0-9_]*(, plural,)?/g, (m, p) => (p ? "{N, plural," : "{")).replace(/\{\}/g, "{}");
}

const namespaceOf = (key: string) => key.split(".").slice(0, 2).join(".");

export function draft(rokuRepo: string, androidRepo: string): { entries: DraftEntry[]; mergeCandidates: string[] } {
  const roku = rokuEntries(JSON.parse(execFileSync("git", ["-C", rokuRepo, "show", `origin/main:${ROKU_STRINGS}`], { encoding: "utf8" })));
  const android = androidEntries(androidRepo);
  const byShape = new Map<string, DraftEntry[]>();
  for (const e of roku) byShape.set(shape(e.message), [...(byShape.get(shape(e.message)) ?? []), e]);
  const entries = [...roku];
  const mergeCandidates: string[] = [];
  for (const a of android) {
    const matches = byShape.get(shape(a.message)) ?? [];
    // Generic vocabulary merges into Roku's common.*; anything else only within one feature.
    const target =
      matches.find((r) => r.key.startsWith("common.") && a.placeholders.length === 0) ??
      matches.find((r) => namespaceOf(r.key) === namespaceOf(a.key) && r.android.length === 0);
    const sameArity = (r: DraftEntry) => placeholdersIn(r.message.replace(/\{(\w+), plural,/, "{$1}")).length === a.placeholders.length;
    if (target && sameArity(target) && target.android.length > 0 && a.placeholders.length === 0) {
      target.android.push(...a.android); // a second Android name for the same common word
      continue;
    }
    if (target && sameArity(target) && target.android.length === 0) {
      // Pair Android's positional arguments with the Roku names by order of appearance.
      const order = (m: string) => [...m.matchAll(/\{([a-z][a-z0-9_]*)(?:\}|, plural)/g)].map((x) => x[1]!);
      const rokuNames = order(target.message);
      const androidNames = order(a.message);
      const rename = new Map(androidNames.map((n, i) => [n, rokuNames[i]!]));
      target.placeholders = a.placeholders.map((p) => ({ name: rename.get(p.name)!, type: p.type }));
      target.platforms = ["android", "roku"];
      target.android = a.android;
      target.androidComment = a.androidComment;
      continue;
    }
    if (matches.length) mergeCandidates.push(`${a.android[0]!.old} = ${matches.map((m) => m.key).join(", ")} (${JSON.stringify(a.message)})`);
    entries.push(a);
  }
  const seen = new Map<string, DraftEntry>();
  for (const e of entries) {
    const other = seen.get(e.key);
    if (other) throw new Error(`key ${e.key} from ${e.android[0]?.old ?? e.roku[0]?.old} collides with ${other.roku[0]?.old ?? other.android[0]?.old}; add it to ANDROID_EXACT`);
    seen.set(e.key, e);
  }
  return { entries, mergeCandidates };
}

// --- apply ---------------------------------------------------------------------------------

export interface Described {
  description: string;
  /** Generated Android argument name (argN) -> real name. */
  placeholders?: Record<string, string>;
}

export function apply(entries: DraftEntry[], described: Record<string, Described>): { arb: Record<string, unknown>; roku: Record<string, unknown>; android: Record<string, unknown>; missing: string[] } {
  const arb: Record<string, unknown> = { "@@locale": "en" };
  const roku: Record<string, unknown> = {};
  const android: Record<string, unknown> = {};
  const missing: string[] = [];
  for (const e of entries) {
    const d = described[e.key];
    if (!d) missing.push(e.key);
    let message = e.message;
    let placeholders = e.placeholders;
    if (e.needsNames && d?.placeholders) {
      const map = d.placeholders;
      for (const [from, to] of Object.entries(map)) message = message.replace(new RegExp(`\\{${from}(?=[},])`, "g"), `{${to}`);
      placeholders = placeholders.map((p) => ({ ...p, name: map[p.name] ?? p.name }));
    }
    const meta: Record<string, unknown> = { description: d?.description ?? "" };
    if (placeholders.length) meta.placeholders = Object.fromEntries(placeholders.map((p) => [p.name, { type: p.type }]));
    if (e.platforms.length < 2) meta["x-platforms"] = e.platforms;
    if (!e.key.startsWith("common.") && e.platforms.length >= 2) meta["x-platforms"] = e.platforms;
    arb[e.key] = message;
    arb[`@${e.key}`] = meta;
    for (const r of e.roku) {
      if (r.old !== e.key || r.form) roku[r.old] = r.form ? { key: e.key, kind: "plural", form: r.form } : { key: e.key, kind: "renamed" };
    }
    for (const a of e.android) {
      android[a.old] = {
        key: e.key,
        name: e.key.replaceAll(".", "_"),
        kind: e.roku.length ? "merged" : "renamed",
        modules: a.modules,
        ...(placeholders.length ? { arguments: placeholders.map((p) => p.name) } : {}),
      };
    }
  }
  return { arb, roku, android, missing };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [command, ...rest] = process.argv.slice(2);
  const { values } = parseArgs({
    args: rest,
    options: {
      roku: { type: "string" },
      android: { type: "string" },
      out: { type: "string" },
      draft: { type: "string" },
      descriptions: { type: "string" },
      reports: { type: "string" },
    },
  });
  const root = resolve(import.meta.dirname, "../..");
  if (command === "draft") {
    const { entries, mergeCandidates } = draft(values.roku!, values.android!);
    writeFileSync(values.out!, JSON.stringify({ entries, mergeCandidates }, null, 1) + "\n");
    console.log(`${entries.length} entries; ${mergeCandidates.length} merge candidates left separate`);
  } else if (command === "apply") {
    const { entries } = JSON.parse(readFileSync(values.draft!, "utf8")) as { entries: DraftEntry[] };
    const described: Record<string, Described> = {};
    for (const f of readdirSync(values.descriptions!).filter((f) => f.endsWith(".json")).sort()) {
      Object.assign(described, JSON.parse(readFileSync(join(values.descriptions!, f), "utf8")));
    }
    const { arb, roku, android, missing } = apply(entries, described);
    writeFileSync(join(root, "catalog/en.arb"), jsonText(canonicalArb(arb)));
    mkdirSync(values.reports!, { recursive: true });
    writeFileSync(join(values.reports!, "A-rename-roku.json"), JSON.stringify(roku, null, 2) + "\n");
    writeFileSync(join(values.reports!, "A-rename-android.json"), JSON.stringify(android, null, 2) + "\n");
    console.log(`wrote ${entries.length} keys; ${missing.length} without a description`);
    if (missing.length) console.log(missing.join("\n"));
  } else {
    console.error("usage: seed.ts draft|apply ...");
    process.exit(2);
  }
}
