# Contributing

## Fixing or adding a translation

Most translations here were written by a model (Claude Opus) and nobody has reviewed them
yet. Corrections from people who speak the language are the most useful contribution.

1. Open `catalog/<lang>.arb` for your language: `es`, `de`, `fr`, `pt-BR`, `ja`, `zh-Hans`
   or `ar`. Each line is a key and its translation.
2. Find the English and the context in `catalog/en.arb`: the same key, plus
   `@key.description`, which says where the text appears and what each `{placeholder}` holds.
3. Read `style/<lang>.md` (tone, formality) and the language's column in `glossary.csv`
   (fixed renderings of product terms).
4. Edit the value. A missing key is fine: the app shows English for it.
5. Run `npm ci` and `make check`, or let CI run it on your pull request.

Rules the check enforces:

- Keep every `{placeholder}` exactly as in English. You can move them; don't rename or drop
  them.
- A plural keeps its structure and lists exactly your language's categories:

  | Language | Categories |
  |---|---|
  | `de` | `one other` |
  | `es`, `fr`, `pt-BR` | `one many other` (`many` is for whole millions: “1 000 000 de saisons”) |
  | `ja`, `zh-Hans` | `other` |
  | `ar` | `zero one two few many other` |

  Write `#` where the number goes: `{count, plural, one {# temporada} many {# de temporadas} other {# temporadas}}`.
- Use the typographic apostrophe `’`, not `'`.
- Keep within `x-maxLength` when the English entry has one (TV screens have little room).

Once you edit a translation, `make translate` treats it as yours and doesn't overwrite it. If
the English later changes, the next translation pass retranslates it and lists it in its pull
request for review.

## Adding or changing English

New strings come with the client change that uses them. Add the key, message and metadata to
`catalog/en.arb` (rules in the README), run `make check`, and merge that pull request first;
the merge publishes a release the client then syncs. Don't add translations in the same pull
request; the next translation pass writes them.

Changing an English message, its description or its placeholders marks every translation of
it for retranslation. When the change adds, removes or renames a placeholder, `make check`
warns about each translation that no longer matches and leaves it out of the generated files
(English shows instead) until the next translation pass or a person fixes it; it does not block
your pull request. Keep English byte-identical when moving strings out of a client.

Don't edit `settingsManifest.*` keys; change the label in silo-server and run
`make import-settings-manifest`.

## Adding keys from a client branch

When you extract strings from a client while other branches do the same:

1. Branch from `feat/seed-catalog` (from `main` once the seed has merged).
2. Add keys only in the namespaces your area owns, such as `player.*` for the player. Leave
   other areas' keys and `common.*` alone; propose shared vocabulary in its own small change.
3. Run `make fmt`. Every `catalog/*.arb` and `state/*.json` file has one canonical layout:
   `@@locale` first, then keys in code-point order, each `@key` block right after its key,
   2-space JSON with a trailing newline. Parallel branches then add lines in different places
   and merge without conflicts.
4. Run `make check`. It fails on a file that isn't in the canonical layout, or that repeats a key
   (a merge can leave one twice; only the last would count, so remove the extra by hand).
5. Generate into the client from your branch:
   `scripts/sync-translations --platform <web|apple|android|roku> --local <this checkout>`.
   The client records `version=local-<commit>`, with `-dirty` when your catalog changes are
   not committed yet; commit them first so the client points at a real commit.

## Maintainers: the translation pass

`make translate LOCALE=<tag>|all` runs on a maintainer machine with Claude Code signed in. CI
never runs it and holds no Anthropic credential.

It picks the keys that are missing or whose English changed, sends them to Claude Code
(`claude -p --model claude-opus-5-5`) in batches of about 100 with their descriptions, the
style guide, glossary terms and existing translations from the same area, validates every
result, retries failures once, and writes `catalog/<lang>.arb`, `state/<lang>.json` and
`out/translate-pr-body.md`. Values a person edited are kept. Then:

```sh
make check
git switch -c chore/opus-pass
git add catalog state && git commit -m "chore(translations): opus pass"
gh pr create --title "chore(translations): opus pass" --body-file out/translate-pr-body.md
```

`DRY_RUN=1` sends only the first batch and prints the result without writing anything.

## Changing the tools

`make ci` must pass. Generator changes update `tests/golden` with `make golden`; review the
diff, since every client gets it. Keep the output layout in the README stable: clients and
their CI depend on those paths.
