# Slovenian (sl)

## Voice

- Write standard Slovenian, never Croatian or Serbian words or forms (see the table below).
- Address the user formally, with **vi** and plural verb forms, as Apple's and Google's Slovenian
  interfaces do: *Prijavite se*, *Izberite profil*, *Poskusite znova.* Never *ti* in sentences.
  Write *vi*, *vaš*, *vam* lowercase. Text that speaks to a group uses the same form.
- Buttons and menu items use the short imperative that Slovenian interfaces use for commands:
  *Shrani*, *Prekliči*, *Izbriši*, *Uredi*, *Predvajaj*, *Poskusi znova*; sign-in buttons are
  nouns (*Prijava*, *Odjava*). Keep the form consistent with the strings beside it. Names of
  settings, screens and tabs are nouns (*Predvajanje*, *Podnapisi*, *Kakovost pretoka*).
  Instructions in sentences use the formal imperative: *Izberite knjižnico*.
- An on/off value is *Vklopljeno* / *Izklopljeno*, whatever it switches.
- Progress states are verbal nouns with an ellipsis: *Nalaganje …*, *Povezovanje …*,
  *Prenašanje …*, *Medpomnjenje …*.
- Status words on one screen use the same form: a request's status is a neuter participle
  (*Zahtevano*, *Odobreno*, *Zavrnjeno*, *Neuspešno*), also in titles and labels on the same
  screen.
- Sentence case, like the English. Slovenian lowercases languages, months and days inside a
  sentence (*slovenščina*, *v ponedeljek*, *15. novembra*). Feature names keep their own capitals
  (*Watch Party*, *Autoscan*). English all-caps labels stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase and declined
  (*ni knjižnic s filmi*), not quoted as the tab name.
- Be gender-neutral. The formal plural already hides the user's gender (*Prijavili ste se*,
  *Odjavljeni ste*, *Dobrodošli*); never *Dobrodošel* or *Prijavljen si*. Role nouns use the
  generic masculine, as Slovenian platforms do (*uporabnik*, *skrbnik*, *gostitelj*, *gost*).
  Never slashes or bracketed endings (*uporabnik/-ca*, *pridružil(a)*).
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and grammar

Slovenian declines nouns in six cases and three numbers (singular, dual, plural), and adjectives
and past-tense verbs agree with a noun's gender and number. A placeholder arrives in the
nominative, and its gender is unknown.

- Put a noun before the placeholder that takes the case, and leave the placeholder bare after
  it: *na strežniku {server}*, *v knjižnici {library}*, *za profil {profile}*, *iz naprave
  {device}*. Never an ending on a placeholder (*na {server}u*, *{title}a*).
- Let participles and verbs agree with that carrier noun: *Knjižnica {library} je bila dodana*,
  *Element {title} je bil izbrisan*. Or put the value after a colon: *Izbrisano: {title}*,
  *Strežnik: {server}*.
- A name in a placeholder can't agree with a past-tense verb. Put a role noun before it
  (*Uporabnik {name} se je pridružil*), use the present tense, which has no gender (*{name} se
  pridružuje Watch Party*), or use a noun phrase (*Nov gledalec: {name}*).
- The prepositions *s/z* and *k/h* change with the next sound (*s strežnikom*, *z napravo*,
  *k strežniku*, *h knjižnici*), which a placeholder hides; the carrier noun decides: *s profilom
  {name}*, *z napravo {device}*.
- Foreign names decline as Slovenian does (*v Plexu*, *iz Jellyfina*), but *Silo* and names that
  end oddly stay undeclined after a noun: *v aplikaciji Silo*, *na strežniku Silo*, *v storitvi
  TMDB*.
- A number placeholder outside a plural can't decline its noun: write *Epizode: {count}*, not
  *{count} epizod*. A date or time placeholder may stand anywhere.

## Typography

- Quotation marks „…“ (low, then high), with ‚…‘ inside them.
- Write the ellipsis as one character …. After a whole word it takes a space before it, as
  Slovenian spelling requires (*Nalaganje …*, *Shrani kot …*); it touches the letters only where
  it cuts a word short. Never three dots.
- Use the typographic apostrophe ’, never '. Slovenian needs one only in foreign names.
- A dash between parts of a sentence is an en dash with spaces ( – ); a range takes an en dash
  without spaces (*5–10*). A hyphen joins an abbreviation to a word (*PIN-koda*, *TV-serija*).
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*, *7 d*,
  also after a number placeholder (*{minutes} min*). Never *m* for minutes. A percent sign also
  takes a space (*{percent} %*). In a short title where a line break would strand the unit, use
  a no-break space (U+00A0).

## Vocabulary

- Established Slovenian UI terms, as Apple and Google use them: *Nastavitve*, *strežnik*,
  *knjižnica*, *podnapisi*, *prenos* and *prenesi* (download; *Prenosi* for the list of
  downloads), *naprava*, *račun*, *geslo*, *profil*, *uporabnik*, *predvajanje*, *iskanje*. Keep
  product and feature names from the glossary.
- Streaming is *pretakanje* (*pretakati*), one stream is a *pretok*. *Prenos* is a download, never
  streaming.
- *telefon* for a phone, *tablični računalnik* (*tablica* where space is short), *televizor* for
  the TV as a device (*TV* where space is short), *daljinski upravljalnik* for the remote.
- On TV, prefer *Izberite* to *Pritisnite*; for a button on the remote, write *Pritisnite OK*. A
  remote button is the object of *Pritisnite*, not the subject: *Pritisnite desno, da odprete
  ploščo*.
- English IT words that Slovenian uses as is: *webhook*, *token*, *worker*, *API*. Use the
  Slovenian word where the platforms do: *vtičnik* (plugin), *varnostna kopija* (backup),
  *dnevnik* (a log), *predpomnilnik* (cache), *prekodiranje* (transcoding), *metapodatki*,
  *napovednik* (trailer).

Slovenian, not Croatian or Serbian. A model tends to mix these in; always use the left column.

| Slovenian (use) | Not (Croatian or Serbian) |
|---|---|
| *nastavitve*, *strežnik*, *knjižnica*, *podnapisi* | *postavke*, *poslužitelj*, *medijateka*, *titlovi* |
| *prenos*, *prenesi*, *geslo* | *preuzimanje*, *preuzmi*, *lozinka* |
| *uporabnik*, *naprava*, *napaka*, *obvestilo* | *korisnik*, *uređaj*, *greška*, *obavijest* |
| *Shrani*, *Prekliči*, *Poskusi znova* | *Spremi*, *Odustani*, *Pokušaj ponovno* |
| *Vklopljeno* / *Izklopljeno* | *Uključeno* / *Isključeno* |
| *predvajanje*, *predvajaj*, *iskanje*, *išči* | *reprodukcija*, *reproduciraj*, *pretraga*, *pretraži* |
| *zahteva*, *naslednji*, *teden*, *glasba* | *zahtjev*, *sljedeći*, *tjedan*, *glazba* |
| *sinhronizirati* | *sinkronizirati*, *sinhronizovati* |

## Terms that depend on context

| English | Slovenian |
|---|---|
| request (a media request) / an HTTP or API request | *zahteva*; to request: *zahtevati*, *poslati zahtevo* / *zahteva* |
| Settings (a screen, tab or menu) / a setting | *Nastavitve* / *nastavitev* or *možnost* |
| add / delete / remove / clear | *dodaj* / *izbriši* / *odstrani* / *počisti* |
| show (verb) / TV show | *prikaži* / *serija* |
| series of books (audiobooks, manga) | *serija* (*Knjiga {number}*) |
| source | *vir* |
| session (sign-in, playback) | *seja* |
| party (a Watch Party) | *Watch Party* (indeclinable, feminine: *ta Watch Party*, *v Watch Party*); host: *gostitelj*; guest: *gost* |
| stream (one playback) | *pretok*; streaming: *pretakanje*; to stream: *pretakati* |
| worker (remote server process) | *worker*, a technical term; *vozlišče* for a node |
| queue / schedule | *čakalna vrsta* / *načrtuj*, *urnik* |
| sync | *sinhroniziraj*, *sinhronizacija* |
| rating (stars) / rating (age) | *ocena* / *starostna omejitev* |
| cast (people) | *igralska zasedba* |
| buffering | *Medpomnjenje …* (status) |
| pair (a device) | *seznani*, *seznanjanje* |
| admin (a person) | *skrbnik* |
| Couldn't… | *Ni bilo mogoče …* (*Ni bilo mogoče shraniti nastavitev*), impersonal, so no gender |
| Try again (sentence) / Retry (button) | *Poskusite znova.* / *Poskusi znova* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Kakovost Auto predvaja …*); as a choice in a list, *Samodejno* where it fits |
| seek (moving within playback) / search | *previjanje*, *previti*, *premakniti se* (*Previjati lahko samo gostitelj.*) / *iskanje*, *iskati*; seeking is never *iskanje* |

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
  - `one`: 1, 101, 201, 301, 401, 501, 601, 701, …
  - `two`: 2, 102, 202, 302, 402, 502, 602, 702, …
  - `few`: 3, 4, 103, 104, 203, 204, 303, 304, …
  - `other`: 0, 5, 6, 7, 8, 9, 10, 11, …
  Write `#` where the number goes.
- The noun form of each category; the categories follow the last two digits:
  - `one`: nominative singular (*# epizoda*, *# film*, *# opravilo*).
  - `two`: the dual (*# epizodi*, *# filma*, *# opravili*), never the plural *# epizode*.
  - `few`: nominative plural (*# epizode*, *# filmi*, *# opravila*).
  - `other`: genitive plural (*# epizod*, *# filmov*, *# opravil*).
  - `{count, plural, one {# epizoda} two {# epizodi} few {# epizode} other {# epizod}}`.
- Because `one` also covers 101, 201 and so on, a `one` form never spells out *en*, *ena* or
  *eno* and never says *ta* as if the count were exactly 1. Write `#` (or the placeholder the
  English uses). Where the English `one` form leaves the number out, put it in.
- Adjectives and verbs agree with each form: *# nova epizoda je bila prenesena*, *# novi epizodi
  sta bili preneseni*, *# nove epizode so bile prenesene*, *# novih epizod je bilo prenesenih*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Slovenian runs about a quarter longer than English. Keys with `maxLength` appear on TV and small
controls. Stay within it: choose a shorter word or rephrase (*Nadaljuj* for "Resume",
*Nastavitve* rather than *Nastavitve predvajanja* when the screen already says playback), drop a
possessive (*vaš*) or an object, and write *TV* for *televizor*. Don't abbreviate words beyond
*TV* and units.

## Season and episode codes

A season is *sezona* and an episode is *epizoda*, as Slovenian television and streaming services
call them. Every season and episode code uses the same letters across the catalog (codes, tags,
captions, play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}* (S for sezona, E for epizoda, the
same letters as the English). Keep the English separators (none, · or :). Spelled out, write
*Sezona {season}*, *Epizoda {episode}*, *Sezona {season}, epizoda {episode}*. A box set is
*filmska serija*, always with *filmska*; a bare *serija* is a TV series.
