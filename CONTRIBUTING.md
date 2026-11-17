# Contributing

## Fixing or adding a translation

Most translations here were written by a model (Claude Opus) and nobody has reviewed them
yet. Corrections from people who speak the language are the most useful contribution.

1. Open `catalog/<lang>.arb` for your language (`locales.json` lists them all). Each line is a
   key and its translation.
2. Find the English and the context in `catalog/en.arb`: the same key, plus
   `@key.description`, which says where the text appears and what each `{placeholder}` holds.
3. Read `style/<lang>.md` (tone, formality) and the language's column in `glossary.csv`
   (fixed renderings of product terms).
4. Edit the value. A missing key is fine: the app shows English for it.
5. Run `npm ci` and `make check`, or let CI run it on your pull request.

Rules the check enforces:

- Keep every `{placeholder}` exactly as in English. You can move them; don't rename or drop
  them.
- A plural keeps its structure and lists exactly your language's CLDR categories, which the
  "Plurals and numbers" section of `style/<lang>.md` names with examples. Write `#` where the
  number goes: `{count, plural, one {# temporada} many {# de temporadas} other {# temporadas}}`.
- Use the typographic apostrophe `’`, not `'`.
- Keep within `x-maxLength` when the English entry has one (TV screens have little room).

Once you edit a translation, `make translate` treats it as yours and doesn't overwrite it. If
the English later changes, `make translate` retranslates it and lists it for review in the pull
request that changes the English. Send translation fixes as their own pull request, apart from
English changes.

## Adding or changing English

New strings come with the client change that uses them. Add the key, message and metadata to
`catalog/en.arb` (rules in the README), run `make check`, and open a pull request. Before it
merges, a maintainer runs `make translate-pr PR=<number>`, which adds the translations of the new
and changed keys to the same pull request as a separate commit, so English and translations are
reviewed apart. Until then CI's `translations-complete` check fails; that is expected.
Merge it before the client change: the merge publishes a release the client then syncs, and a
release must not leave a shipped language with missing keys. Don't write the translations by
hand.

Changing an English message, its description or its placeholders marks every translation of
it for retranslation. When the change adds, removes or renames a placeholder, `make check`
warns about each translation that no longer matches and leaves it out of the generated files
(English shows instead). The warning doesn't block your pull request; the maintainer's
`make translate` commit in it retranslates those keys. Keep English byte-identical when moving
strings out of a client.

Don't edit `settingsManifest.*` keys; change the label in silo-server and run
`make import-settings-manifest`.

## Adding keys from a client branch

When you extract strings from a client while other branches do the same:

1. Branch from `feat/seed-catalog` (from `main` once the seed has merged).
2. Add keys only in the namespaces your area owns, such as `player.*` for the player. Leave
   other areas' keys and `common.*` alone; propose shared vocabulary in its own small change.
3. Run `make fmt`. Every `catalog/*.arb` and `state/*.json` file has one canonical layout:
   `@@locale` first, then keys in code-point order, each `@key` block right after its key,
   2-space JSON with a trailing newline. Branches that add keys in different namespaces then
   mostly touch different lines. Two new namespaces that sort into the same gap (say
   `downloads.*` and `ebooks.*` between `diagnostics.*` and `filters.*`) still conflict: keep
   both sides of the conflict, then run `make fmt` and `make check`.
4. Run `make check`. It fails on a file that isn't in the canonical layout, or that repeats a key
   (a merge can leave one twice; only the last would count, so remove the extra by hand).
5. Generate into the client from your branch:
   `scripts/sync-translations --platform <web|apple|android|roku> --local <this checkout>`.
   The client records `version=local-<commit>`, with `-dirty` when your catalog changes are
   not committed yet; commit them first so the client points at a real commit.

## Maintainers: translating a pull request

The translation pass runs on a maintainer machine with Claude Code signed in
(`claude -p --model claude-opus-5-5`). CI never runs it and holds no Anthropic credential.

For a pull request that adds or changes English, run this from an up-to-date checkout of `main`:

```sh
make translate-pr PR=<number>
```

It checks out the pull request in `out/pr/<number>`, translates what every language is missing
or has stale, runs `make check` and `make check-complete` on the result, commits `catalog/` and
`state/` as `chore(translations): <subject> in every language` (the subject comes from the pull
request title; `SUBJECT=` overrides it), pushes the commit to the pull request's branch and puts
the per-language table in its description. Only this checkout's tools run: nothing from the pull
request (its `Makefile`, tools or dependencies) runs on the machine signed in to Claude Code. A
pull request that changes anything besides `catalog/*.arb` and `state/*.json` stops until you
have reviewed those changes; then run it again with `REVIEWED=1`. One that adds a symbolic link
is refused outright, since the pass writes through it. A fork's pull request needs
"Allow edits by maintainers"; otherwise use `NO_PUSH=1` and hand the commit over.

If keys are still untranslated after the pass (each failed key is sent again, up to three
rounds in all), or a key whose English changed still has the translation written for the old
English, the command lists them and commits nothing. Run it again: only those keys are sent, and
an interrupted run resumes in the same worktree. Check the "please review" table it prints for
values a person wrote that the English change replaced.

How the pass works: it picks the keys that are missing or whose English changed, sends them to
Claude Code in batches of about 100 with their descriptions, the style guide, glossary terms and
existing translations from the same area, validates every result, and retries failures. The
batches of all languages share one pool of `JOBS` calls (default 4). Every call also takes one of
`SILO_TRANSLATE_MAX_CALLS` slots (default 6) shared by every run on the machine, so several
pull requests translated at once don't multiply the load; a run waits for a free slot. A slot is
a local port from `SILO_TRANSLATE_SLOT_PORT` (default 47360) on, which a killed run frees at once. Values a
person edited are kept.

The pass on its own, for a branch you are on (a new language, or after a glossary or style guide
change), is `make translate`:

```sh
git switch -c chore/opus-pass
make translate LOCALE=all RETRANSLATE=<prefixes>     # or LOCALE=hu or LOCALE=hu,ro
make check check-complete
git add catalog state && git commit -m "chore(translations): opus pass"
gh pr create --title "chore(translations): opus pass" --body-file out/translate-pr-body.md
```

`DRY_RUN=1` sends only the first batch and prints the result without writing anything.

## Maintainers: adding a language

```sh
make add-locale TAG=hu                      # NAME="Bahasa Indonesia" where the default reads oddly
```

This adds the language's line to `locales.json`, with identifiers derived from the tag (CLDR
plural key, Android directory, including Android's old codes `iw` and `in` for Hebrew and
Indonesian, Roku folder, direction). Right-to-left languages and scripts that Roku's fonts don't
have (anything but Latin, Greek and Cyrillic) are kept off Roku; `PLATFORMS=web,apple,android`
keeps any language off Roku, whose package has a size budget. It also adds an empty `glossary.csv`
column and writes `style/<tag>.md` from a template: the plural section comes from CLDR, and every
`TODO(add-locale)` section is yours to write, modelled on the guide of the closest language.
Fill the glossary column with `make add-locale TAG=hu GLOSSARY=<file>` (a `term,rendering` CSV);
rerun it the same way when a rebase conflicts in `glossary.csv`. `make translate` refuses the
language until the style guide has no `TODO(add-locale)` left and the glossary column has
renderings.

Then run `make translate LOCALE=hu` (about 250 batches for the whole catalog) and
`make check check-complete`, and open one pull request with the setup and the translations as
separate commits. Merge it soon: until it does, English pull requests merged meanwhile need
`make translate LOCALE=hu` again on the branch.

## Changing the tools

`make ci` must pass. Generator changes update `tests/golden` with `make golden`; review the
diff, since every client gets it. Keep the output layout in the README stable: clients and
their CI depend on those paths.
