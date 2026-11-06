# silo-translations

The user-interface strings for every Silo client (web and admin, Apple, Android, Roku) in one
English catalog, with its translations. Generators turn the catalog into each platform's own
format. Each merge to `main` publishes a release that clients install with a pinned sync
script.

## Layout

```
locales.json          languages, their per-platform identifiers, and the platforms that ship
                      each one (`platforms`; omitted means all)
catalog/en.arb        English source with metadata; developers edit this
catalog/<lang>.arb    translations: key -> message
state/<lang>.json     per key: fingerprint of the English the value was written for, hash of
                      the value, who wrote it (opus or human)
glossary.csv          fixed renderings of product terms per language
style/<lang>.md       tone and formality per language
sources/              vendored inputs (silo-server's settings manifest, pinned)
tools/                TypeScript tools run directly by Node 22.18 or newer
tests/                validator table tests, generator goldens, platform acceptance tests
```

## Commands

```sh
npm ci
make fmt                        # rewrite catalog/*.arb and state/*.json in the canonical layout
make check                      # validate the catalog (and its layout); errors fail, warnings print
make test                       # all tests
make ci                         # typecheck + check + test (what CI runs)
make generate OUT=<dir>         # write every platform's files under <dir>
make golden                     # rewrite tests/golden after an intended generator change
make import-settings-manifest REPO=<silo-server checkout> REF=<rev>
make translate LOCALE=<tag>|all [DRY_RUN=1]    # maintainers only; see CONTRIBUTING.md
```

The aapt2 acceptance test needs the Android SDK (`ANDROID_HOME`, or `~/Android/Sdk`). It is
skipped locally when the SDK is missing and required in CI.

## Generated output

`make generate OUT=<dir>` writes one tree per platform. Each tree is laid out relative to that
client's repository root, and it is exactly what the platform's release tarball contains.

| Platform | Files under `<dir>/<platform>/` |
|---|---|
| web | `web/src/locales/<tag>.json` (FormatJS AST, one per language and pseudo-locale), `web/src/locales/keys.ts` (`MessageKey` type, `LOCALES`: the shipped languages then the pseudo-locales, with `dir` and `pseudo`; `SOURCE_LOCALE`) |
| apple | `iosApp/iosApp/Localizable.xcstrings` (all languages, every entry `extractionState: manual`), `iosApp/InfoPlist/{iOS,tvOS,macOS}/InfoPlist.xcstrings` (each app's Info.plist strings, keyed by plist key; always written, empty when an app has none) |
| android | `android-shared/src/androidMain/res/values{,-<qualifier>}/strings_catalog.xml` (next to hand-written `strings.xml`, never replacing it), `android-shared/silo-locales.properties` (each app's languages as resource qualifiers, for `androidResources.localeFilters`) |
| roku | `locale/<folder>/strings.json` (one per language and pseudo-locale), `locale/languages.json` (`{"languages": [shipped folders], "pseudo": [folders]}`), `source/util/pluralRules.bs`, `i18n-charsets/<folder>.txt` (every character that language's strings use, sorted, for the font subset step; outside `locale/` and `fonts/`, so not packaged) |

`<dir>/.silo-translations-out` holds the version the files were generated as: the release
version, or `local-<commit>` (with `-dirty` when the catalog or tools have uncommitted changes).
A language file holds only the keys translated in that language; clients fall back to
English.

**Shipped languages.** A language ships on a platform when `locales.json` allows it there and it
has at least one valid translation of a key in that platform's scope; English always ships. Only
shipped languages get files, so clients read the list instead of hard-coding one:

| Platform | Shipped list |
|---|---|
| web | `LOCALES` in `keys.ts` (entries with `pseudo: false`) |
| apple | the String Catalog's localizations, which become the bundle's (`Bundle.main.localizations`). On Apple only app strings count: a language with nothing but translated `apple.infoPlist.*` prompts doesn't ship, and its prompts are left out too |
| android | the `values-<qualifier>` directories (so AGP's generated `localeConfig`), and per app `silo-locales.properties` |
| roku | `locale/languages.json` |

Separately from translations, `locales.json` can keep a language off a platform: Roku doesn't
ship `ar`
(no right-to-left or Arabic shaping in SceneGraph) or `ar-XB` yet. On Android, `platforms`
can name one app (`android-phone`, `android-tv`). Both apps read `android-shared`'s
resources, so the language is still generated, and the app that doesn't ship it leaves it out
with `localeFilters` from `silo-locales.properties`. Nothing uses that today: `ar` ships on both
Android apps, the TV app with its current left-to-right layout. (The test fixture holds `ar` back
on the TV app to keep the capability covered.)

Pseudo-locales (`en-XA` accented and about 40% longer inside `⟦ ⟧`, `ar-XB` right-to-left) are
generated for web and Roku only, for debug builds. Android uses AAPT's own
(`pseudoLocalesEnabled`), and Apple uses Xcode's pseudolanguages.

## Installing in a client

Clients vendor `tools/sync-translations.sh` as `scripts/sync-translations` and commit both the
generated files and `.silo-translations` (platform, version, tarball SHA-256).

```sh
scripts/sync-translations --platform roku --version 2026.11.06-abc1234   # first time
scripts/sync-translations --version <newer>                              # update
scripts/sync-translations                                                # reinstall the pin
scripts/sync-translations --local ~/src/silo-translations                # before a release exists
```

The repository is private, so downloads use `gh release download` and need `gh` signed in
with read access. `SILO_TRANSLATIONS_PUBLIC=1` switches to `curl` once it is public. The script
verifies the checksum and unpacks into a temporary directory before touching the client,
rejects links and paths outside the tree, and writes `.silo-translations` last. Each tree carries
`.silo-translations-files`, the list of generated paths; after installing, sync removes the files
the previous list named and the new one doesn't (a language that stopped shipping), and nothing
else. A client installed before lists existed is pruned by the platform's output paths in the
table above. Sync refuses any listed path that passes through a symlink in the client.

## Keys

- Segments joined by `.`. Each segment matches `[a-z0-9][A-Za-z0-9_]*`, and the first starts
  with a letter. Write named segments in lowerCamel: `home.section.continueWatching`.
- A segment that comes from a server identifier (a setting key, an enum value, an extra type)
  keeps the identifier as it is, with `-` changed to `_`, so a client can build the key from
  the value it has: `catalog.extra.behind_the_scenes`,
  `settingsManifest.ui.theme.option.midnight_cinema`.
- `common.*` holds vocabulary every platform shares. Other namespaces follow the feature.
- Android names replace `.` with `_` (`home_section_continueWatching`). Apple's String Catalog
  uses the key, and Xcode generates a symbol that joins the segments in lowerCamel, with a
  capital after each `_` and after a digit (`home.section.continueWatching` →
  `.homeSectionContinueWatching`, `requests.reason.not_found` → `.requestsReasonNotFound`). Web and Roku use the key
  itself. The validator rejects keys that collide on any platform: Android names, Apple
  symbols (`home.sectionTitle` and `homeSection.title`), Roku plural entries, and Roku's
  case-insensitive lookup.
- Info.plist strings (permission prompts) are `apple.infoPlist.<ios|tvos|macos>.<name>` with
  `"x-platforms": ["apple"]` and the plist key verbatim in `x-plistKey`, for example
  `apple.infoPlist.ios.nsLocalNetworkUsageDescription` with `"x-plistKey":
  "NSLocalNetworkUsageDescription"`. The app segment chooses the catalog; each app's prompts
  are separate keys because their English differs. They take no placeholders and never reach
  `Localizable.xcstrings`.
- A key that is not a plural can't end in a plural category (`zero one two few many other`),
  since Roku writes plurals as `key.<category>`.
- `settingsManifest.*` keys are imported from silo-server's settings manifest
  (`label`, `description`, `unsetLabel`, `option.<value>`). Change them in silo-server. Each kind
  is scoped to the clients that render it (`MANIFEST_PLATFORMS` in
  `tools/import-settings-manifest.ts`): web and Apple all of them, Android only `unsetLabel`,
  Roku none.

## Messages

`en.arb` entries carry metadata:

```json
"catalog.seasons": "{count, plural, one {# Season} other {# Seasons}}",
"@catalog.seasons": {
  "description": "Number of seasons on a series page.",
  "placeholders": { "count": { "type": "int" } },
  "x-platforms": ["roku", "android"],
  "x-maxLength": 20
}
```

- `description` is required: where the text appears and what each placeholder holds. When a
  key with two or more placeholders reaches Apple or Android, the description names them as
  `{name}` in argument order (`"{series}: series name; {episode}: episode number."`). Apple
  symbols and Android `getString` take unlabeled positional arguments, and the description
  becomes the symbol's doc comment.
- `placeholders` declares every argument with a type, `String`, `int` or `double`. Names match
  `[a-z][a-z0-9_]*`. Their order here is the positional order on Android (`%1$s`) and Apple
  (`%1$@`), so never reorder existing placeholders.
- `x-platforms` limits a key to some of `web`, `apple`, `android`, `roku`; omitted means all.
- `x-maxLength` is a character budget; translations over it get a warning.

Keys that reach Apple, Android or Roku use a shared subset of ICU MessageFormat: text,
`{name}` arguments, and at most one `plural` that spans the whole message, on an `int`
argument, with exactly the CLDR categories of the language and `#` for the number. No
`select`, `selectordinal`, `=N`, `offset`, typed arguments (`{n, number}`, dates) or tags.
Callers format dates, sizes and durations and pass them as `String`. Web-only keys may also
use `select` and rich-text tags. Prefer the apostrophe `’`. An ASCII `'` is accepted where ICU
reads it literally (`Couldn't`, `{name}'s`) and rejected right before `{`, `}`, `#`, `|`, `<` or
another `'`, where ICU (and FormatJS, for `<`) reads it as the start of an escape.

## Platform mapping

| | Web | Apple | Android | Roku |
|---|---|---|---|---|
| String | `{name}` | `%1$@` | `%1$s` | `{name}` |
| int | `{name}` | `%1$lld` (`Int`) | `%1$d` | `{name}` |
| double | `{name}` | `%1$lf` (`Double`) | `%1$f` | `{name}` |
| plural | ICU | `variations.plural` with positional arguments; `%#@count@` with a substitution and `%arg` when another number is present or an English form doesn't print the count (`{count_text}`, `one {VOTE}`, "Delete download"). English decides for every language; a translation with no number in any form also gets a substitution. Xcode labels a substitution's count: `.playerProgress(count: 3, 10)` | `<plurals>`, `#` as `%N$d` | `key.<category>` entries, `#` as `{count}` |
| literal `%` | `%` | `%%` when the message has arguments | `%%` when it has arguments, else `formatted="false"` | `%` |

Roku plural contract: a translated plural always carries every category of its language, so
`key.other` in a language's own file means the plural is translated there. The client takes a
plural from the language's table only when that table has `key.other`, choosing the category
with `pluralRules.category(<folder>, count)`; otherwise it uses English's entries with
English's category. `i18n.load` therefore keeps the language table apart from English.

## License

AGPL-3.0, like the Silo clients.
