# Polish (pl)

## Voice

- Address the user informally, in the second person singular (*ty*), as Netflix, Google and
  Apple do in Polish: *Wybierz profil*, *Spróbuj ponownie*, *Twoja biblioteka*. Never *Pan* /
  *Pani* or *Państwo*. Don't capitalize *ty*, *twój*, *ciebie* inside UI text. The one
  exception is the For You tab name, *Dla Ciebie*, as Google and Spotify write it. A longer label
  built on it lowercases *dla*: *Polecane dla Ciebie*, not *Polecane Dla Ciebie*. Leave the
  pronoun out where the verb already says who (*Zaloguj się*, not *Ty zaloguj się*). Text that speaks to
  a group still addresses the reader in the singular, or uses a noun (*Wspólne oglądanie,
  gdziekolwiek jesteś*), never the plural *wy*.
- Buttons and menu actions use the perfective imperative, as on Apple and Android: *Zapisz*,
  *Anuluj*, *Usuń*, *Zaloguj się*, *Spróbuj ponownie*, *Użyj ustawień napisów*. Names of settings,
  screens and sections are nouns, often verbal nouns: *Odtwarzanie*, *Pobieranie*, *Napisy*,
  *Jakość strumienia*. Instructions in sentences use the imperative: *Wybierz bibliotekę*.
- An on/off value is *Wł.* / *Wył.* where it stands alone next to a setting, and *Włączone* /
  *Wyłączone* where there is room and the value reads as a status. Use one pair per screen.
- Status words use impersonal *-no* / *-to* forms or nouns, which have no gender: *Wysłano*,
  *Zatwierdzono*, *Odrzucono*, *Pobrano*, *Niepowodzenie*, *Oczekuje*. Use the same form across
  titles and labels on the same screen.
- Sentence case, like the English. Polish doesn't capitalize the words of a title. Feature and
  product names keep their own capitals (*Watch Party*, *Autoscan*). English all-caps labels
  stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase and declined
  (*brak bibliotek filmów*), not quoted as the tab name.
- Quotation marks „…” (low-high). Write the ellipsis as one character …. Polish rarely needs an
  apostrophe; where one appears, use ’.

## Gender-neutral wording

Polish past tense and many adjectives mark the gender of the person. The app doesn't know it, so
never write a gendered second-person form (*zalogowałeś się*, *jesteś gotowy*) and never a slash
form (*zalogowałeś/-aś*). Use instead:

- an impersonal form: *Zalogowano*, *Nie udało się zapisać*, *Wylogowano cię*;
- the present tense or a noun: *Logowanie zakończone* or *Gotowe*, not *Jesteś zalogowany*;
- *osoba* for a person whose gender is unknown: *osoba prowadząca* (the host), *osoby oglądające*.

The same holds for third persons named by a placeholder: *{name} dołączył* is wrong; write
*{name} dołącza do Watch Party* (present tense has no gender) or *Nowa osoba: {name}*.

## Placeholders and cases

Polish declines nouns, and the app inserts names as they are. Put a placeholder where its
nominative form reads correctly: after a colon (*Serwer: {server}*), in apposition after a
declined common noun (*na serwerze {server}*, *w bibliotece {library}*, *z urządzenia
{device}*), or as the subject. Never attach a case ending to a placeholder. Don't decline
product names either; add a noun (*w aplikacji Silo*, *z serwera Plex*).

## Vocabulary

- Established Polish UI terms: *Ustawienia*, *napisy*, *biblioteka*, *pobierz*, *konto*,
  *hasło*. Keep product and feature names from the glossary.
- *telefon* for a phone, *tablet*, *telewizor* for the TV as a device (*TV* where space is
  short), *pilot* for the remote.
- On TV, prefer *Wybierz* to *Naciśnij*; for a button on the remote, write *Naciśnij OK*. A
  remote button is the object of *Naciśnij*: *Naciśnij przycisk w prawo, aby otworzyć panel*.
- English IT words that Polish UI uses as is stay English or take their usual Polish spelling:
  *serwer*, *streaming*, *log* / *logi*, *cache*, *token*, *webhook*. Prefer the Polish word
  where one is established: *kopia zapasowa* (backup), *wtyczka* (plugin), *węzeł* (node),
  *strumień* (one stream), *zwiastun* (trailer).

## Terms that depend on context

| English | Polish |
|---|---|
| request (a media request) / an HTTP or API request | *prośba*; to request: *poproś o* / *żądanie* |
| Settings (a screen, tab or menu) / a setting | *Ustawienia* / *ustawienie* or *opcja* |
| add / delete / remove / clear | *dodaj* / *usuń* / *usuń* or *odłącz* / *wyczyść* |
| show (verb) / TV show | *pokaż*, *wyświetl* / *serial* |
| source | *źródło* |
| session (sign-in, playback) | *sesja* |
| party (a Watch Party) | *Watch Party* (undeclined); host: *osoba prowadząca* or *host*; guest: *gość* |
| stream (one playback) | *strumień*; streaming: *streaming*, *przesyłanie strumieniowe* |
| worker (remote server process) | *worker*, a technical term; *węzeł* for a node |
| queue / schedule | *kolejka* / *zaplanuj*, *harmonogram* |
| sync | *synchronizuj*, *synchronizacja* |
| rating (stars) / rating (age) | *ocena* / *kategoria wiekowa* |
| cast (people) | *obsada* |
| buffering | *Buforowanie…* (status) |
| pair (a device) | *sparuj*, *parowanie* |
| Couldn't… | *Nie udało się …* (impersonal, so no gender) |
| Try again (sentence) / Retry (button) | *Spróbuj ponownie.* / *Spróbuj ponownie* or *Ponów* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Jakość Auto odtwarza …*); as a choice in a list, *Automatycznie* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Polish column lists word stems so that every case form matches.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Polish label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one few many other`, from CLDR:
  - `one`: exactly 1 (*1 odcinek*). 21, 31, 101 are `many`, not `one`.
  - `few`: numbers ending in 2, 3, 4, except 12–14 (*2 odcinki*, *23 odcinki*).
  - `many`: 0, 5–21, 12–14, and other whole numbers ending in 0, 1, 5–9 (*0 odcinków*,
    *5 odcinków*, *12 odcinków*, *21 odcinków*).
  - `other`: fractions, genitive singular (*1,5 odcinka*, *2,5 godziny*). Whole counts never
    reach it, but write it correctly.
  - `{count, plural, one {# odcinek} few {# odcinki} many {# odcinków} other {# odcinka}}`.
  - Adjectives and verbs agree with the form: *1 nowy odcinek*, *2 nowe odcinki*, *5 nowych
    odcinków*; *Usunięto 1 element*, *Usunięto 3 elementy*, *Usunięto 5 elementów*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*,
  *7 dni*, also after a number placeholder (*{minutes} min*). SI abbreviations (*h*, *min*,
  *s*, *ms*) take no period. Never *m* for minutes. In a short title where a line break would
  strand the unit, use a no-break space (U+00A0). An example of what to type into a field
  (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Polish runs long, often a third longer than English. Keys with `maxLength` appear on TV and
small controls. Stay within it: choose a shorter word (*Pobierz* over *Rozpocznij pobieranie*,
*TV* over *telewizor*), drop pronouns and prepositions, and use the standard abbreviations
(*Wł.*, *Wył.*, *odc.*, *sez.*) only when nothing shorter reads naturally.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}O{episode}*,
*S{season} · O{episode}*, *S{season}:O{episode}*, *O{episode}* (S for sezon, O for odcinek,
never E). Keep the English separators (none, · or :).
