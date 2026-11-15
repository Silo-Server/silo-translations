# Norwegian Bokmål (nb)

## Voice

- Write Bokmål. Not Nynorsk (*ikkje*, *eg*, *kva*, *berre*, *frå*, *innstillingar*), and not
  Danish (*Gem*, *Annuller*, *Indstillinger*, *afspil*, *efter*, *nu*, *hvad*, *bliver*, *af*,
  *mig*/*dig*, *sprog*, *tilføj*). The Bokmål forms are *lagre*, *avbryt*, *innstillinger*,
  *spill av*, *etter*, *nå*, *hva*, *blir*, *av*, *meg*/*deg*, *språk*, *legg til*. Use the
  moderate, mainstream Bokmål that Apple, Google and Netflix use: *-en* rather than *-a* in
  feminine nouns where both are allowed (*boken*, *listen*, *siden*), and *-et* in past tense
  (*lastet*, *spillet av*).
- Address the user as **du**, lowercase (*deg*, *din*/*ditt*/*dine*): *Logg på*, *Velg en
  profil*, *Prøv igjen*. Never *De*. Text that speaks to a group still addresses the reader
  (*Se sammen, uansett hvor du er*).
- Buttons, menu items and the choices of a picker use the imperative, as Apple, Google and
  Netflix do: *Avbryt*, *Lagre*, *Slett*, *Prøv igjen*, *Bruk undertekstinnstillingene*. Never
  the infinitive with *å* on a button. Instructions in sentences use the imperative too: *Velg et
  bibliotek*.
- An on/off value is *På* / *Av*, whatever it switches.
- Status words on one screen use the same form: a request's status is a past participle
  (*Forespurt*, *Godkjent*, *Avvist*, *Tilgjengelig*); a failed state is *Mislyktes*. Use the same
  forms in titles and labels on that screen.
- Sentence case, like the English. Norwegian doesn't capitalize nouns, weekdays, months or
  language names. Feature names keep their own capitals (*Watch Party*, *Autoscan*). English
  all-caps labels stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*ingen
  filmbiblioteker*), not quoted as the tab name.
- Quotation marks «…» (and ‘…’ inside them). Write the ellipsis as one character …, with a
  space before it when it follows a whole word, as Norwegian writes it: *Laster inn …*, *Velg
  studio …*, *Søk …*. No space only when it cuts a word short.
- The genitive takes no apostrophe: *Silos innstillinger*, *serverens navn*. An apostrophe
  appears only after a name ending in *s*, *x* or *z* (*Thomas’ profil*), and then it is the
  typographic ’.
- Be gender-neutral where it reads naturally: *person*, *gjest*, *verten* or *den som er vert*.

## Vocabulary

- Established Norwegian UI terms over anglicisms where they are common: *Innstillinger*,
  *undertekster*, *bibliotek*, *laste ned*, *sikkerhetskopi*, *strømme*. Keep product and feature
  names from the glossary.
- *telefon* for a phone, *nettbrett* for a tablet, *TV* (uppercase, as Apple, Google and Netflix
  write it) for the television as a device, *fjernkontroll* for the remote.
- On TV, prefer *Velg* to *Trykk på*; for a button on the remote, write *Trykk på OK*. A remote
  button is the object of *Trykk på*, not the subject: *Trykk på Høyre for å åpne panelet*.
- Write compounds as one word, as Norwegian requires (*undertekstinnstillinger*,
  *avspillingshastighet*, *mediebibliotek*), never with an English-style space (*undertekst
  innstillinger* and *avspilling hastighet* are wrong). Use a hyphen after an abbreviation, a
  digit or a multi-word name (*TV-serie*, *e-postadresse*, *4K-video*, *Watch Party-invitasjon*,
  *Apple TV-appen*).
- English IT words that Norwegian uses as is stay English, inflected the Norwegian way: *server*
  (*serveren*, *servere*), *node*, *cache*, *plugin* where *programtillegg* would be too long,
  *log* is *logg* (*loggen*, *logger*).

## Terms that depend on context

| English | Norwegian Bokmål |
|---|---|
| request (a media request) / an HTTP or API request | *forespørsel*; to request: *be om*, *forespørre* / *forespørsel* |
| Settings (a screen, tab or menu) / a setting | *Innstillinger* / *innstilling* or *alternativ* |
| add / delete / remove / clear | *legg til* / *slett* / *fjern* / *tøm* |
| show (verb) / TV show | *vis* / *serie* |
| source | *kilde* |
| session (sign-in, playback) | *økt* |
| party (a Watch Party) | *Watch Party* (*Watch Party-en* only where the definite form is unavoidable); host: *vert* or *den som er vert*; guest: *gjest* |
| stream (one playback) | *strøm*; streaming: *strømming*; to stream: *strømme* |
| worker (remote server process) | *worker*, a technical term; *node* for a node |
| queue / schedule | *kø* / *planlegge*, *tidsplan* |
| sync | *synkroniser*, *synkronisering* |
| rating (stars) / rating (age) | *vurdering* / *aldersgrense* |
| cast (people) | *rolleliste* |
| buffering | *Bufrer* (status) |
| seek (move to another point in playback) / search (find by name) | *spole*, *spoling*, *hoppe til* (*Kunne ikke spole*, *spolebuffer*, *spoleforhåndsvisninger*); never *søk* or *søke-* for a seek / *søk*, *søke* |
| pair (a device) | *sammenkoble*, *sammenkobling*; connect: *koble til* |
| sign in / sign out | *logg på* / *logg ut* |
| Couldn't… | *Kunne ikke …* or *… mislyktes* |
| Try again (sentence) / Retry (button) | *Prøv igjen.* / *Prøv igjen* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Kvaliteten Auto spiller …*); as a choice in a list, *Automatisk* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Norwegian label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one other`. `one` is the number 1 only (*1 episode*, *1 sesong*); `other` is
  everything else, including 0 (*0 episoder*, *2 sesonger*). A word whose plural is the same as
  the singular still writes both forms (*1 år*, *5 år*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 t*, *2 t 4 min*, *45 s*, *211 ms*, *7 d*,
  *85 %*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. In a short
  title where a line break would strand the unit, use a no-break space (U+00A0). An example of
  what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Norwegian compounds run long. Keys with `maxLength` appear on TV and small controls. Stay within
it: choose a shorter word or a shorter compound over an abbreviation, and drop articles before
abbreviating.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages). Norwegian says *sesong* and
*episode*, so the letters stay S and E: *S{season}E{episode}*, *S{season} · E{episode}*,
*S{season}:E{episode}*, *E{episode}*. Keep the English separators (none, · or :).
