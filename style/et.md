# Estonian (et)

## Voice

- Address the user politely with the plural **teie**, as Google and Microsoft do in Estonian:
  *Logige sisse*, *Valige profiil*, *Proovige uuesti.*, *Teie meediakogu*. Write *teie*,
  *teile*, *teid* in lowercase, and prefer *oma* or no pronoun where it reads naturally (*Valige
  oma profiil*). Never the informal *sina* in a sentence (*Vali oma profiil.*, *sinu*), also in
  text that speaks to a group.
- Buttons, menu items and the choices of a picker are short singular imperatives, as on Google
  and Microsoft in Estonian: *Salvesta*, *Tühista*, *Kustuta*, *Logi sisse*, *Proovi uuesti*.
  Instructions in sentences use the plural: *Valige meediakogu*. Names of settings, screens and
  sections are nouns: *Esitus*, *Allalaadimised*, *Voo kvaliteet*.
- An on/off value is *Sees* / *Väljas*, whatever it switches.
- Progress states are *-mine* nouns with an ellipsis: *Laadimine…*, *Ühendamine…*,
  *Otsimine…*. A request's status is a past participle, which never changes (*Taotletud*,
  *Kinnitatud*, *Tagasi lükatud*, *Ebaõnnestunud*), also in titles and labels on the same screen.
- Sentence case, like the English. Estonian lowercases languages, days and months (*inglise*,
  *esmaspäev*, *jaanuar*). Feature names keep their own capitals (*Watch Party*, *Autoscan*). An
  English all-caps label stays all caps (*OTSE* for LIVE).
- A library type or tab name used as a common noun inside a sentence is lowercase
  (*filmikogusid pole*). When a sentence names a screen, button or setting, put its label in
  „…“, unchanged, after a noun that takes the case: *jaotises „Seaded“*, *nuppu „Salvesta“*.
- Estonian has no grammatical gender and *tema* is neutral. Use neutral nouns: *kasutaja*,
  *vaataja*, *korraldaja* for whoever hosts a party, *külaline*.
- Plain, friendly standard Estonian (*kirjakeel*), without slang or colloquial short forms.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.
- So a sign-in warning keeps its method (*Sellele kontole ei saa teenuse {provider} kaudu sisse
  logida*), and *only on this device* stays *ainult selles seadmes*.

## Placeholders and grammar

Estonian inflects nouns in fourteen cases, with endings whose form depends on the word's stem
(*Silo* → *Silos*, *Plex* → *Plexist*, *Jellyfin* → *Jellyfini*, *TMDB* → *TMDB-st*). A
placeholder holds a value you can't see, so you can't choose its ending.

- Keep every placeholder in the nominative, as a bare value. Never glue an ending, a hyphen
  ending, an apostrophe ending or a compound part onto it: not `{server}is`, `{server}-is`,
  `{title}’i`, `{name}le`, `{library}kogu` or `{count}-st`.
- Put a generic noun before the placeholder and give that noun the case ending: *Ühendamine
  serveriga {server}…*, *Lisatud meediakogusse {library}*, *Pealkirja {title} esitamine
  ebaõnnestus*, *Kasutaja {user} liitus*, *Profiili {name} seaded*. Common carrier nouns:
  *server*, *meediakogu*, *pealkiri* (a title), *üksus* (an item), *kasutaja*, *profiil*,
  *seade*, *fail*.
- Or restructure so the placeholder stands alone as the subject, after a colon, or in an
  apposition: *{user} liitus*, *Server: {server}*.
- A number placeholder keeps its noun after it, in the case the number requires (see Plurals);
  never a case ending on the number.
- Fixed names that the glossary keeps in English are inflected normally. Endings join a name
  directly (*Silos*, *Plexist*, *Jellyfini*, *Rokus*, *Watch Partyga*), with a hyphen after an
  abbreviation or a final digit (*Apple TV-s*, *TMDB-st*, *HDR10-ga*), and with an apostrophe
  after a final letter that isn't pronounced as written (*Google’i*). When the name is long or
  the ending awkward, use a carrier noun (*teenuses Rotten Tomatoes*, *rakendusega Infuse*).

## Typography

- Quotation marks „…“; a sentence's period or comma goes after the closing mark.
- Write the ellipsis as one character …, right after the word (*Laadimine…*).
- Use the typographic apostrophe ’, never ', and only where a case ending follows a name whose
  last letter isn't pronounced as written (*Google’i*, *Disney’le*).
- A hyphen joins a case ending to an abbreviation or a final digit (*TMDB-st*, *HDR10-ga*), and
  an abbreviation to the noun of a compound (*PIN-kood*, *HDR-video*, *TV-saade*).
- A dash inside a sentence is an en dash with spaces ( – ); a range takes one without (*5–10*).
- An ordinal number in digits takes a period: *2. hooaeg*, *5. osa*, *1. koht*.
- Always write õ ä ö ü š ž, and a comma before every subordinate clause (*et*, *kui*, *mis*,
  *kas*): *Vajutage OK, et jätkata*.

## Vocabulary

- Standard Estonian UI terms as Google and Microsoft use them: *Seaded*, *server*, *meediakogu*
  (a media library; *-kogu* in compounds such as *filmikogu*), *subtiitrid*, *laadi alla* /
  *allalaadimine*, *seade*, *konto*, *parool*, *kasutaja*, *esitus* (playback), *esita* (play),
  *peata* (pause), *jätka* (resume), *vaikimisi* (by default), *vahemälu* (cache), *logi* (log),
  *varukoopia* (backup), *pistikprogramm* (plugin), *metaandmed*, *treiler*. Library types:
  *Filmid*, *Sarjad*, *Muusika*, *Audioraamatud*. English stays only where it is code-like
  (*API*, *URL*, *webhook*).
- *seade* is a device (*seadme*, *seadmed*). *Seaded* is the Settings screen; for one setting
  write *seadistus* or *valik*, so the two never meet in the same form.
- Standard forms, not anglicisms: *klõpsama*, not *klikkima*; *Seaded*, not *Sätted*;
  *värskendus*, not *apdeit*; *voogedastus*, not *striimimine*; *sisselogimine*, not *login*;
  *alla laadima*, not *tõmbama*; *see seade*, not *antud seade*; *serveril on*, not *server
  omab*.
- Write compounds as one word (*esituskiirus*, *vaatamisajalugu*) or as a genitive phrase
  (*subtiitrite seaded*); never two nominatives side by side. A name before a noun stands in the
  genitive, as a separate word: *Silo server*, *Plexi meediakogu*, *Apple TV rakendus*,
  *Watch Party kutse*.
- *telefon* for a phone, *tahvelarvuti* for a tablet, *teler* (*TV* where space is short) for
  the television as a device, *pult* for the remote.
- Click is *klõpsata*, tap *puudutada*, press *vajutada*. On TV, prefer *Valige* to *Vajutage*;
  for a button on the remote, write *Vajutage OK*. A direction is something the user presses:
  *Paneeli avamiseks vajutage paremale*.

## Terms that depend on context

| English | Estonian |
|---|---|
| request (a media request) / an HTTP or API request | *taotlus*; to request: *taotleda* / *päring* |
| Settings (a screen, tab or menu) / a setting | *Seaded* / *seadistus* or *valik* |
| add / delete / remove / clear | *lisa* / *kustuta* / *eemalda* / *tühjenda* |
| show (verb) / TV show | *näita* / *sari* |
| episode | *osa*, the word Estonian TV uses (*5. osa*) |
| source | *allikas* |
| session (sign-in, playback) | *seanss* |
| party (a Watch Party) | *Watch Party*; host: *korraldaja*; guest: *külaline*; viewer: *vaataja* |
| stream (one playback) | *voog*; streaming: *voogedastus*; to stream: *voogedastada* |
| worker (remote server process) | *tööprotsess*; *sõlm* for a node |
| queue / schedule | *järjekord* / *ajasta*, *ajakava* |
| sync | *sünkrooni*, *sünkroonimine* |
| rating (stars) / rating (age) | *hinnang* / *vanusepiirang* |
| cast (people) | *näitlejad*, *osades* |
| buffering | *Puhverdamine…* (status) |
| pair (a device) | *seo*, *sidumine* |
| Couldn't… | *… ebaõnnestus* (*Salvestamine ebaõnnestus*) or *… ei õnnestunud* (*Faili ei õnnestunud kustutada*) |
| Try again (sentence) / Retry (button) | *Proovige uuesti.* / *Proovi uuesti* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*kvaliteet „Auto“*); as a choice in a list, *Automaatne* |
| seek (moving within playback) | *kerida*, *kerimine* (*Kerimine ebaõnnestus*, *kerimisriba*); never *otsida* or *otsing*, which are search |
| Reload / Refresh | *Laadi uuesti* / *Värskenda* |
| Delete X? (confirmation) | *Kas kustutada …?* (*Kas kustutada see profiil?*) |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.
Its Estonian column lists word stems (*hooaeg|hooaj*, *ülesan|ülesand*) so every form matches.

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
  - `other`: 0, 2, 3, 4, 5, 6, 7, 8, …
  Write `#` where the number goes.
- After any number other than 1, also 21 and 31, Estonian puts the noun, and any adjective with
  it, in the **partitive singular**: *1 film*, *3 filmi*, *0 filmi*, *21 filmi*, *2 hooaega*,
  *4 seadet*, *5 uut osa*. The `other` form is therefore never the nominative plural: never
  *3 filmid*. Write `{count, plural, one {# film} other {# filmi}}`.
- Prefer the impersonal past for a result, so no verb has to agree with the count: *Lisati #
  film* / *Lisati # filmi*, *Kustutati # osa*.
- When the counted phrase takes another case in the sentence, the number and noun take it
  together (*# seadmes*, *# serverist*), and `one` and `other` then often look the same; still
  list both categories. A number outside a plural can't choose its noun's form: write *Filmide
  arv: {count}*, *Alles: {count}*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*, *7 p*,
  also after a number placeholder (*{minutes} min*). The percent sign follows the number without
  a space (*50%*, *{percent}%*). Never *m* for minutes. In a short title where a line break would
  strand the unit, use a no-break space (U+00A0).

## Length

Estonian is often no longer than English in letters, but its compounds are long single words
that can't wrap. Keys with `maxLength` appear on TV and small controls. Stay within it: choose a
shorter word or compound (*Jätka* for "Resume", *Pooleli* for "In progress", *TV* over *teler*),
and drop *oma*, *teie* or the carrier noun before anything else; never cut a word short.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}*, in the English letters (never H
or O). Keep the English separators (none, · or :). Written out, a season and an episode are
ordinals with a period: *{season}. hooaeg*, *{episode}. osa* (*2. hooaeg, 5. osa*).
