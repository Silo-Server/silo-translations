# Every target runs the TypeScript tools directly with Node (>= 22.18, native type stripping).
NODE ?= node

.PHONY: check check-complete fmt test typecheck generate golden translate translate-pr add-locale import-settings-manifest ci

## check: validate the catalog (errors fail; warnings print)
check:
	$(NODE) tools/validate.ts .
	$(NODE) tools/import-settings-manifest.ts --check

## check-complete: every language has a valid translation, written for today's English, of every
## key it ships (CI runs it; a merge publishes a release, which must not leave a shipped language
## with missing keys)
check-complete:
	$(NODE) tools/check-complete.ts .

## fmt: rewrite catalog/*.arb and state/*.json in the canonical layout (make check requires it)
fmt:
	$(NODE) tools/fmt.ts

## test: validator table tests, generator goldens, plural rules, platform acceptance
test:
	$(NODE) --test tests/*.test.ts

typecheck:
	npx tsc -p .

## generate OUT=<dir> [VERSION=<v>]: write <dir>/{web,apple,android,roku}/...
generate:
	@test -n "$(OUT)" || { echo "usage: make generate OUT=<dir> [VERSION=<version>]"; exit 2; }
	$(NODE) tools/generate.ts --out "$(OUT)" $(if $(VERSION),--version "$(VERSION)")

## golden: rewrite tests/golden from the fixture catalog (review the diff)
golden:
	rm -rf tests/golden
	$(NODE) tools/generate.ts --root tests/fixtures/basic --out tests/golden --version test
	rm -f tests/golden/.silo-translations-out

## translate LOCALE=<tag>[,<tag>…]|all [DRY_RUN=1] [JOBS=n] [ROUNDS=n] [ONLY=p1,p2] [RETRANSLATE=p1,p2]:
## Opus pass through Claude Code (maintainer machine only)
translate:
	@test -n "$(LOCALE)" || { echo "usage: make translate LOCALE=<tag>[,<tag>…]|all [DRY_RUN=1] [JOBS=n] [ROUNDS=n] [ONLY=prefixes] [RETRANSLATE=prefixes]"; exit 2; }
	$(NODE) tools/translate.ts --locale "$(LOCALE)" $(if $(DRY_RUN),--dry-run) $(if $(JOBS),--jobs $(JOBS)) $(if $(ROUNDS),--rounds $(ROUNDS)) $(if $(ONLY),--only "$(ONLY)") $(if $(RETRANSLATE),--retranslate "$(RETRANSLATE)")

## translate-pr PR=<number> [SUBJECT=…] [REVIEWED=1] [NO_PUSH=1] [JOBS=n] [ROUNDS=n]: translate a
## pull request's English into every language, commit and push it (maintainer machine only)
translate-pr:
	@test -n "$(PR)" || { echo "usage: make translate-pr PR=<number> [SUBJECT=what the keys are] [REVIEWED=1] [NO_PUSH=1] [JOBS=n] [ROUNDS=n]"; exit 2; }
	$(NODE) tools/translate-pr.ts "$(PR)" $(if $(SUBJECT),--subject "$(SUBJECT)") $(if $(REVIEWED),--reviewed) $(if $(NO_PUSH),--no-push) $(if $(JOBS),--jobs $(JOBS)) $(if $(ROUNDS),--rounds $(ROUNDS))

## add-locale TAG=<bcp47> [NAME=…] [PLATFORMS=web,apple,android] [GLOSSARY=<term,rendering csv>]:
## locales.json line, glossary column and style guide template for a new language
add-locale:
	@test -n "$(TAG)" || { echo "usage: make add-locale TAG=<bcp47> [NAME=endonym] [PLATFORMS=web,apple,android] [GLOSSARY=file]"; exit 2; }
	$(NODE) tools/add-locale.ts "$(TAG)" $(if $(NAME),--name "$(NAME)") $(if $(PLATFORMS),--platforms "$(PLATFORMS)") $(if $(GLOSSARY),--glossary "$(GLOSSARY)")

## import-settings-manifest REPO=<silo-server checkout> REF=<rev>
import-settings-manifest:
	@test -n "$(REPO)" -a -n "$(REF)" || { echo "usage: make import-settings-manifest REPO=<silo-server checkout> REF=<rev>"; exit 2; }
	$(NODE) tools/import-settings-manifest.ts --repo "$(REPO)" --ref "$(REF)"

ci: typecheck check test
