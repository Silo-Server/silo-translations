# Slovak (sk)

## Voice

- Write standard Slovak, never Czech words or spellings (see "Slovak, not Czech" below).
- Address the user formally, with **vy** and the plural imperative, as Apple, Google and Netflix
  do in Slovak: *Prihláste sa*, *Vyberte profil*, *Skúste to znova*. Never *ty* (*Prihlás sa*).
  Write *vy*, *váš*, *vám* lowercase; a capital *Vy* belongs in letters, not in an interface.
- Buttons, menu items and the choices of a picker use the infinitive, consistently with the
  strings beside them: *Zrušiť*, *Uložiť*, *Skúsiť znova*, *Použiť nastavenia titulkov*. Names of
  settings, screens and tabs are nouns (*Prehrávanie*, *Titulky*, *Kvalita streamu*).
  Instructions in sentences use the imperative: *Vyberte knižnicu*.
- An on/off value is *Zapnuté* / *Vypnuté*, whatever it switches.
- Progress states use the reflexive present with an ellipsis: *Načítava sa…*, *Pripája sa…*,
  *Sťahuje sa…*. The verb agrees with a named subject: *Načítavajú sa epizódy…*.
- Status words on one screen use the same form: a request's status is a neuter participle
  (*Vyžiadané*, *Schválené*, *Zamietnuté*, *Neúspešné*), also in titles and labels on the same
  screen.
- Sentence case, like the English. Slovak lowercases languages, months and days inside a
  sentence (*slovenčina*, *v pondelok*, *15. novembra*). Feature names keep their own capitals
  (*Watch Party*, *Autoscan*). English all-caps labels stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase and declined
  (*žiadne filmové knižnice*), not quoted as the tab name.
- Be gender-neutral. With *vy* the past tense is plural and shows no gender (*Prihlásili ste sa*),
  but an adjective or passive participle after *ste* is singular and does (*Ste prihlásený*,
  *Ste si istý?*). Use a verb or a noun instead: *Prihlásenie prebehlo úspešne*, *Naozaj chcete
  odstrániť tento profil?*
- Role nouns use the generic masculine, as Slovak platforms do (*používateľ*, *správca*,
  *hostiteľ*, *hosť*). Never slashes or bracketed endings (*používateľ/ka*, *pripojil(a) sa*).
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and grammar

Slovak declines nouns in six cases, and adjectives and past-tense verbs agree with a noun's gender
and number. A placeholder arrives in the nominative, and its gender is unknown.

- Put a noun before the placeholder that takes the case, and leave the placeholder bare after
  it: *na serveri {server}*, *v knižnici {library}*, *pre profil {profile}*, *zo zariadenia
  {device}*. Never an ending on a placeholder (*na {server}i*, *{title}u*).
- Let adjectives, participles and verbs agree with that carrier noun: *Knižnica {library} bola
  pridaná*, *Položka {title} sa odstránila*. Or put the value after a colon: *Odstránené:
  {title}*, *Server: {server}*.
- A name in a placeholder can't agree with a past-tense verb. Put a role noun before it
  (*Používateľ {name} sa pripojil*), use the present tense, which has no gender (*{name} sa
  pripája k Watch Party*), or use a noun phrase (*Nový divák: {name}*).
- The prepositions *v/vo*, *s/so*, *z/zo*, *k/ku* change with the next word, which a placeholder
  hides; the carrier noun decides: *so serverom {server}*, *vo verzii {version}*, *ku knižnici
  {library}*.
- Put product and service names after a noun rather than declining them: *v aplikácii Silo*,
  *na serveri Plex*, *zo služby TMDB*. As a subject, *Silo* is neuter (*Silo stratilo spojenie*).
- A number placeholder outside a plural can't decline its noun: write *Epizódy: {count}*, not
  *{count} epizód*. A date or time placeholder may stand anywhere.

## Typography

- Quotation marks „…“ (low, then high), with ‚…‘ inside them.
- Write the ellipsis as one character …, directly after the word (*Načítava sa…*), also where
  the English types three dots.
- Use the typographic apostrophe ’, never '. Slovak needs one only in foreign names.
- A dash between parts of a sentence is an en dash with spaces ( – ); a range takes an en dash
  without spaces (*5–10*). No space before a colon, question mark or exclamation mark.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*, *7 d*,
  also after a number placeholder (*{minutes} min*). Never *m* for minutes. A percent sign also
  takes a space (*{percent} %*). In a short title where a line break would strand the unit, use
  a no-break space (U+00A0).

## Vocabulary

- Established Slovak UI terms, as Apple, Google and Netflix use them: *Nastavenia*, *server*,
  *knižnica*, *titulky*, *stiahnuť* (*Stiahnuté* for the list of downloads), *zariadenie*,
  *účet*, *heslo*, *profil*, *používateľ*, *prehrávanie*, *vyhľadávanie*. Keep product and
  feature names from the glossary.
- *telefón* for a phone, *tablet*, *televízor* for the TV as a device (*TV* where space is
  short), *diaľkový ovládač* (*ovládač* where space is short) for the remote.
- On TV, prefer *Vyberte* to *Stlačte*; for a button on the remote, write *Stlačte OK*. A remote
  button is the object of *Stlačte*, not the subject: *Stlačením tlačidla doprava otvoríte
  panel*.
- English IT words that Slovak uses as is stay, declined as Slovak nouns: *stream* (*streamu*),
  *webhook*, *token*, *worker*; verbs take Slovak endings (*streamovať*, *synchronizovať*). Use
  the Slovak word where the platforms do: *doplnok* (plugin), *záloha* (backup), *vyrovnávacia
  pamäť* (cache), *prekódovanie* (transcoding), *metadáta*, *upútavka* (trailer), *denník* (a log).

Slovak, not Czech. A model tends to mix these in; always use the left column. Slovak never uses
the letters *ě*, *ř* or *ů*.

| Slovak (use) | Czech (never) |
|---|---|
| *Nastavenia* (plural), *knižnica*, *súbor*, *priečinok* | *Nastavení*, *knihovna*, *soubor*, *složka* |
| *stiahnuť*, *Stiahnuté*, *odstrániť* | *stáhnout*, *Stažené*, *smazat* |
| *používateľ*, *správca*, *zariadenie* | *uživatel*, *správce*, *zařízení* |
| *hľadať*, *vyhľadávanie*, *prehrať*, *prehrávanie* | *hledat*, *vyhledávání*, *přehrát*, *přehrávání* |
| *Skúste to znova.*, *Nepodarilo sa …*, *nedá sa* | *Zkuste to znovu.*, *Nepodařilo se …*, *nelze* |
| *séria*, *epizóda* | *řada*, *díl* |
| *vyrovnávacia pamäť*, *front* (a queue), *obľúbené*, *upútavka* | *mezipaměť*, *fronta*, *oblíbené*, *upoutávka* |
| *späť*, *teraz*, *iba* / *len*, *tu*, *tiež*, *ktorý*, *pretože* | *zpět*, *teď*, *pouze* / *jen*, *zde*, *také*, *který*, *protože* |

## Terms that depend on context

| English | Slovak |
|---|---|
| request (a media request) / an HTTP or API request | *žiadosť*; to request: *vyžiadať si*, *požiadať o* / *požiadavka* |
| Settings (a screen, tab or menu) / a setting | *Nastavenia* / *nastavenie* or *možnosť* |
| add / delete / remove / clear | *pridať* / *odstrániť* / *odobrať* / *vymazať* |
| show (verb) / TV show | *zobraziť* / *seriál* |
| series of books (audiobooks, manga) | *séria* (*knižná séria* where a TV season could be meant) |
| source | *zdroj* |
| session (sign-in, playback) | *relácia* |
| party (a Watch Party) | *Watch Party* (indeclinable, feminine: *táto Watch Party*, *k Watch Party*); host: *hostiteľ*; guest: *hosť* (in Slovak *hosť* is the guest, never the host) |
| stream (one playback) | *stream*; streaming: *streamovanie*; to stream: *streamovať* |
| worker (remote server process) | *worker*, a technical term; *uzol* for a node |
| queue / schedule | *front* / *naplánovať*, *plán* |
| sync | *synchronizovať*, *synchronizácia* |
| rating (stars) / rating (age) | *hodnotenie* / *vekové obmedzenie* |
| cast (people) | *obsadenie* |
| buffering | *Načítava sa…* (status) |
| pair (a device) | *spárovať*, *párovanie* |
| admin (a person) | *správca* |
| Couldn't… | *Nepodarilo sa …* (*Nepodarilo sa uložiť nastavenia*), impersonal, so no gender |
| Try again (sentence) / Retry (button) | *Skúste to znova.* / *Skúsiť znova* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Kvalita Auto prehráva …*); as a choice in a list, *Automaticky* where it fits |
| seek (moving within playback) / search | *pretáčať*, *pretáčanie*, *posunúť* (*Pretáčať môže iba hostiteľ.*) / *hľadať*, *vyhľadávanie*; seeking is never *hľadanie* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the label that element
has in the catalog in this language, not the English one. Write that label word for word, also
inside a menu path (*Settings → General → …*): don’t swap in a synonym or another wording of the
same idea. When the prompt lists the labels a string names, use the one on the string’s
platform. The glossary lists the names that recur.

## Plurals and numbers

- Plurals list exactly these CLDR categories, with the whole numbers each one takes:
  - `one`: 1
  - `few`: 2, 3, 4
  - `many`: only fractions (never a whole number)
  - `other`: 0, 5, 6, 7, 8, 9, 10, 11, …
  Write `#` where the number goes.
- The noun form of each category:
  - `one`: nominative singular (*# epizóda*, *# film*, *# zariadenie*).
  - `few`: nominative plural (*# epizódy*, *# filmy*, *# zariadenia*; people: *# používatelia*).
  - `many`: genitive singular, for fractions (*# epizódy*, *# filmu*, *# zariadenia*). The apps
    pass whole numbers, so it rarely shows, but write it correctly.
  - `other`: genitive plural (*# epizód*, *# filmov*, *# zariadení*, *# používateľov*).
  - `{count, plural, one {# epizóda} few {# epizódy} many {# epizódy} other {# epizód}}`.
- Adjectives and verbs agree with each form; with `other` the verb is neuter singular: *Pridala
  sa # nová epizóda*, *Pridali sa # nové epizódy*, *Pridalo sa # nových epizód*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Slovak runs about a quarter longer than English. Keys with `maxLength` appear on TV and small
controls. Stay within it: choose a shorter word or a noun (*Nastavenia* over *Upraviť
nastavenia*, *Pokračovať* for "Resume"), drop a possessive (*váš*) or an object, and write *TV*
for *televízor*. Don't abbreviate words beyond *TV* and units.

## Season and episode codes

A season is *séria* and an episode is *epizóda*, as Slovak television and streaming services
call them. Every season and episode code uses the same letters across the catalog (codes, tags,
captions, play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}* (S for séria, E for epizóda, the
same letters as the English). Keep the English separators (none, · or :). Spelled out, write
*Séria {season}*, *Epizóda {episode}*, *Séria {season}, epizóda {episode}*; never *sezóna* or
*diel*. A TV series is *seriál*, never *séria*; a box set is *filmová séria*.
