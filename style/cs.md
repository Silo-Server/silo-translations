# Czech (cs)

## Voice

- Address the user formally, with **vy** in the plural imperative, as Apple, Google and Netflix do
  in Czech: *Přihlaste se*, *Vyberte profil*, *Zkuste to znovu*. Never *ty*. Write *vy*, *váš*,
  *vám* lowercase; capital *Vy* belongs in letters, not in an interface.
- Buttons, menu items and the choices of a picker use the infinitive, consistently with the
  strings beside them: *Zrušit*, *Uložit*, *Zkusit znovu*, *Použít nastavení titulků*.
  Instructions in sentences use the imperative: *Vyberte knihovnu*.
- An on/off value is *Zapnuto* / *Vypnuto*, whatever it switches.
- Status words on one screen use the same form: a request's status is a neuter past participle
  (*Vyžádáno*, *Schváleno*, *Zamítnuto*, *Selhalo*), also in titles and labels on the same
  screen.
- Sentence case, like the English. Czech capitalizes only the first word of a title or label.
  Feature names keep their own capitals (*Watch Party*, *Autoscan*). English all-caps labels
  stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase and declined
  (*žádné filmové knihovny*), not quoted as the tab name.
- Quotation marks „…“ (low, then high). Write the ellipsis as one character …, also where
  the English types three dots. Czech rarely needs an apostrophe; where one appears (an
  English name), use the typographic ’.

## Gender-neutral wording

Czech marks gender on past-tense verbs and on many nouns. Avoid wording that must guess the
reader's or another person's gender:

- Don't address the user with a past participle (*Přihlásil jste se*). Use an impersonal or
  noun form: *Přihlášení proběhlo úspěšně*, *Jste přihlášeni*, *Nepodařilo se uložit*.
- A name in a placeholder can't agree with a verb. Put a role noun before it and let the verb
  agree with the noun: *Uživatel {name} se připojil*, or use a noun phrase: *Připojení: {name}*.
- Role nouns use the generic masculine, as Czech platforms do (*uživatel*, *správce*,
  *hostitel*, *host*). Never use slashes or bracketed endings (*uživatel/ka*, *připojil(a)*).

## Placeholders and case

Czech declines nouns; a placeholder can't. Keep a placeholder in a position where its
nominative form reads correctly, usually after a noun that carries the case: *na serveru
{server}*, *v knihovně {library}*, *profil {profile}*, never *na {server}u*. A date, time or
number placeholder may stand anywhere.

## Vocabulary

- Established Czech UI terms where Apple, Google and Netflix use them: *Nastavení*, *titulky*,
  *knihovna*, *stáhnout*, *účet*, *heslo*, *zařízení*. Keep product and feature names from the
  glossary.
- *telefon* for a phone, *tablet*, *televize* for the TV as a device (*TV* where space is short),
  *dálkový ovladač* or *ovladač* for the remote.
- On TV, prefer *Vyberte* to *Stiskněte*; for a button on the remote, write *Stiskněte OK*. A
  remote button is the object of *Stiskněte*, not the subject: *Stisknutím tlačítka Vpravo
  otevřete panel* or *Stiskněte Vpravo a otevřete panel*.
- English IT words that Czech uses as is stay, declined as Czech nouns: *server* (*serveru*),
  *stream* (*streamu*), *plugin* (*pluginu*), *worker*, *webhook*, *token*, *log* where it names
  a file (*protokol* as a general word). Verbs take Czech endings: *streamovat*,
  *synchronizovat*.

## Terms that depend on context

| English | Czech |
|---|---|
| request (a media request) / an HTTP or API request | *žádost*; to request: *vyžádat si*, *požádat o* / *požadavek* |
| Settings (a screen, tab or menu) / a setting | *Nastavení* / *nastavení* or *možnost* |
| add / delete / remove / clear | *přidat* / *smazat* / *odebrat* / *vymazat* |
| show (verb) / TV show | *zobrazit* / *seriál* |
| source | *zdroj* |
| session (sign-in, playback) | *relace* |
| party (a Watch Party) | *Watch Party* (indeclinable, feminine: *tato Watch Party*); host: *hostitel*; guest: *host* (in Czech *host* is the guest, never the host) |
| stream (one playback) | *stream*; streaming: *streamování*; to stream: *streamovat* |
| worker (remote server process) | *worker*, a technical term; *uzel* for a node |
| queue / schedule | *fronta* / *naplánovat*, *plán* |
| sync | *synchronizovat*, *synchronizace* |
| rating (stars) / rating (age) | *hodnocení* / *věkové omezení* |
| cast (people) | *obsazení* |
| buffering | *Načítání* (status) |
| pair (a device) | *spárovat*, *párování* |
| admin (a person) | *správce* |
| Couldn't… | *Nepodařilo se …* (impersonal, no gender) |
| Try again (sentence) / Retry (button) | *Zkuste to znovu.* / *Zkusit znovu* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Kvalita Auto přehrává …*); as a choice in a list, *Automaticky* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Czech label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one few many other`, and every plural lists all four.
  - `one`: 1 (*1 díl*, *1 položka*).
  - `few`: 2–4 (*3 díly*, *2 položky*).
  - `many`: fractions only (*1,5 dílu*, *2,5 hodiny*), the genitive singular. The apps pass whole
    numbers, so it rarely shows, but write it correctly.
  - `other`: 0 and 5 and up (*0 dílů*, *5 položek*), the genitive plural.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*,
  *7 d*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. A percent
  sign also takes a space (*{percent} %*). In a short title where a line break would strand
  the unit, use a no-break space (U+00A0). An example of what to type into a field (*24h*,
  *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Czech runs longer than English, and declension adds syllables. Keys with `maxLength` appear on
TV and small controls. Stay within it: choose a shorter word or rephrase as a noun over an
abbreviation (*Nastavení* over *Upravit nastavení*), and drop a possessive (*váš*) before
abbreviating.

## Season and episode codes

A season is *řada*, an episode is *díl*, as Czech television and streaming services call them.
Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *Ř{season}D{episode}*,
*Ř{season} · D{episode}*, *Ř{season}:D{episode}*, *D{episode}* (Ř for řada, D for díl, never S
or E). Keep the English separators (none, · or :).
