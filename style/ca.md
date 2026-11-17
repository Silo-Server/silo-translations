# Catalan (ca)

## Voice

- Standard Catalan of the Institut d’Estudis Catalans, in the general forms Apple and Google use
  for every Catalan-speaking area: *aquest* (not *este*), *sortir* (not *eixir*), *veure* (not
  *vore*), inchoative verbs in *-eix* (*afegeix*, *reprodueix*, *comparteix*, not *afegix*). No
  Spanish calques (see "Catalan, not Spanish" below).
- Address the user as **tu**, with the pronoun left out, as Apple and Google do in Catalan:
  *Inicia la sessió*, *Tria un perfil*, *Torna-ho a provar*, *Has oblidat la contrasenya?*
  Never *vostè* (*Iniciï*, *Triï*) or *vós*/*vosaltres* (*Inicieu*, *Trieu*, *Voleu…?*). Text
  that speaks to a group still addresses the reader, or uses the infinitive (*Veure junts,
  siguin on siguin*).
- Buttons, menu items and the choices of a picker use the tu imperative, as Apple and Google do
  in Catalan: *Cancel·la*, *Desa*, *Elimina*, *Torna-ho a provar*, *Inicia la sessió*,
  *Utilitza les preferències de subtítols*. Instructions in sentences use the same imperative:
  *Tria una biblioteca*. Labels of a setting, a toggle or a picker are noun phrases
  (*Reproducció automàtica*, *Mida dels subtítols*).
- Leave out a possessive the sentence doesn't need (*Canvia la contrasenya*); one that stays
  takes the article: *el teu perfil*, *la teva llista per veure*.
- An on/off value is *Activat* / *Desactivat*, masculine singular, whatever it switches.
- Progress states use the impersonal *s’està* + infinitive with an ellipsis: *S’està
  carregant…*, *S’està connectant…*, *S’està baixant…*. Only where `maxLength` leaves no room,
  the gerund alone (*Carregant…*).
- Agreement follows the noun the reader sees: a request's status agrees with *la sol·licitud*
  (*Sol·licitada*, *Aprovada*, *Rebutjada*, *Completada*), also in titles and labels on the same
  screen. A failed one is *Ha fallat*, not *Fallida*, which reads as bankruptcy.
- Sentence case, like the English. Months, days and languages are lowercase (*gener*,
  *dilluns*, *anglès*). Feature names keep their own capitals (*Watch Party*, *Autoscan*).
  English all-caps labels stay all caps (*EN DIRECTE* for LIVE). A library type or tab name
  used as a common noun inside a sentence is lowercase (*cap biblioteca de pel·lícules*).
- Be gender-neutral where it reads naturally: *Et donem la benvinguda* rather than *Benvingut*,
  *Segur que vols eliminar…?* rather than *Estàs segur…?*, *qui organitza* for the host of a
  party. Never slashes, *@* or *-x* (*benvingut/da*, *convidat@s*).
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.
- A warning that the user can't sign in *with* a method keeps it (*Ja no podràs iniciar la
  sessió amb {provider}*); without *amb {provider}* it reads as a locked account.

## Placeholders and grammar

A placeholder holds a value you can't see: its gender, number and first sound are unknown.

- Catalan elides the article and *de* before a vowel or a silent h (*l’aplicació*, *d’àudio*,
  *l’Apple TV*), and contracts *a*, *de* and *per* with *el* and *els* (*al*, *del*, *pel*,
  *als*, *dels*, *pels*). You can't choose between *el*, *la* and *l’*, or between *de* and
  *d’*, before a value you can't see, so never put an article, *de*, *d’* or a contraction
  straight before a placeholder (not *del {server}*, *de {title}*, *l’{name}*). Put a noun
  before it and let the article agree with that noun: *al servidor {server}*, *de la biblioteca
  {library}*, *del perfil {name}*, *de l’element {title}*, *a l’usuari {user}*. *amb*, *a*,
  *en*, *per* and *sobre* never elide and may stand before one: *amb {provider}*, *a {server}*.
- A person placeholder stands without the personal article *en*/*na*, best as the subject:
  *{user} s’ha unit a la Watch Party*, *{user} t’ha convidat*. Where it can't be the subject,
  use a carrier noun or a colon: *Invitació: {user}*.
- Adjectives and past participles can't agree with a placeholder. Make them agree with a
  carrier noun (*S’ha eliminat el fitxer {file}*), use an impersonal *s’ha* form (*S’ha afegit
  {title}*), or put them before a colon (*Afegit: {title}*).
- Fixed names elide like any word that starts with a vowel sound: *d’Emby*, *d’IMDb*,
  *d’OpenSubtitles*, *d’Infuse*, *l’Apple TV*, *l’Android TV*. Devices take the article (*el
  Roku*, *el Chromecast*, *la TV*); apps and services usually don't (*a Plex*, *amb Jellyfin*,
  *de Silo*).
- *en* before *aquest*, *un*, *algun* (*en aquest dispositiu*), *a* before the definite article
  (*al servidor*); *per a* before a noun (*per a aquest perfil*), *per* before an infinitive.

## Typography

- Quotation marks «…», with no space inside; “…” for a quotation inside a quotation. Use them
  where the English quotes; don't add them around a label that the English leaves bare.
- No inverted ¿ or ¡: those are Spanish. No space before : ; ! ?. Write the ellipsis as one
  character …. Use the typographic apostrophe ’ in every elision and after a verb, never ':
  *l’aplicació*, *d’àudio*, *s’està*, *n’hi ha*, *connecta’t*.
- The geminated l takes the middle dot U+00B7: *col·lecció*, *pel·lícula*, *sol·licitud*,
  *Cancel·la*, *intel·ligent*. Never a full stop (*l.l*), a hyphen, a bullet (*l•l*) or the
  single character *ŀ*.
- Accents and the diaeresis are part of the spelling and stay on capitals: *vídeo*, *àudio*,
  *també*, *més*, *reproduït*, *proveïdor*, *És necessari*, *À*.

## Vocabulary

- The UI terms Apple and Google use in Catalan: *Configuració*, *servidor*, *biblioteca*,
  *subtítols*, *baixar*, *baixada* (download), *penjar* (upload), *dispositiu*, *compte* (*el
  compte*), *contrasenya*, *usuari*, *fitxer*, *pantalla*, *cercar*, *gestionar*, *registre*
  (a log), *memòria cau* (a cache), *connector* (a plugin), *enllaç*, *en línia*, *en directe*.
- *aplicació*, and *app* (*l’app*) only where space is short. *streaming* stays as a loan where
  it names the technology. Keep product and feature names from the glossary.
- *telèfon* for a phone, *tauleta*, *TV* (feminine, *la TV*) or *televisor* for the television
  as a device, *comandament* for the remote.
- On TV, prefer *Selecciona* to *Prem*; for a button on the remote, write *Prem OK*. A remote
  button is the object of *Prem*, not the subject: *Prem Dreta per obrir el tauler*. On a touch
  screen write *Toca*, with a mouse *Fes clic a*.

## Catalan, not Spanish

A model drifts into Spanish forms. Always use the left column.

| Catalan (use) | Not (calque from Spanish) |
|---|---|
| *cercar*, *cerca* | *buscar*, *busca* |
| *esborrar* | *borrar* |
| *mida* | *tamany* |
| *desar* | *guardar* (for saving a file or a change) |
| *prémer* (*Prem OK*) | *apretar*, *pulsar* |
| *des de*, *fins a* | *desde*, *hasta* |
| *haver de* (*Has d’iniciar la sessió*) | *tenir que* (*Tens que…*) |
| *cal* (*Cal reiniciar el servidor*) | *hi ha que* |
| *el més recent*, *el que has vist* | *lo més recent*, *lo que has vist* |
| *a causa de* | *degut a* |
| *pel que fa a* | *en quant a* |
| *encara* | *todavia* |
| *Torna-ho a provar* | *Intenta-ho de nou* |
| *treure* | *quitar* |
| *fitxer* (a file) | *arxiu* |
| *en directe* | *en viu* |
| *el senyal* (masculine) | *la senyal* |

## Terms that depend on context

| English | Catalan |
|---|---|
| request (a media request, and an HTTP or API request) | *sol·licitud*; to request: *sol·licitar* |
| Settings (a screen, tab or menu) / a setting | *Configuració* / *opció* or *paràmetre* |
| add / delete / remove / clear | *afegir* / *eliminar* / *treure* / *esborrar*, *buidar* (a list or a queue) |
| show (verb) / TV show | *mostrar* / *sèrie* |
| source | *origen* for where something comes from (an Autoscan source, a source user); *font* for a source of data or markers |
| session (sign-in, playback) | *sessió* |
| party (a Watch Party) | *la Watch Party*; host: *amfitrió* or *qui organitza*; guest: *convidat* |
| stream (one playback) | *transmissió*; streaming: *streaming* |
| worker (remote server process) | *worker*, a technical term (*el worker*); *node* for a node |
| queue / schedule | *cua* / *programar*, *programació* |
| sync | *sincronitzar*, *sincronització* |
| rating (stars) / rating (age) | *valoració* / *qualificació per edats* |
| cast (people) | *repartiment* |
| buffering | *S’està carregant…* (status); the buffer itself: *memòria intermèdia* |
| pair (a device) | *vincular*, *vinculació* |
| Couldn't… | *No s’ha pogut …* (*No s’ha pogut carregar la biblioteca*) |
| Try again (sentence) / Retry (button) | *Torna-ho a provar.* / *Torna-ho a provar* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*La qualitat Auto reprodueix …*); as a choice in a list, *Automàtic* or *Automàtica* agreeing with the setting, where it fits |
| seek (move to another point in playback) / search (find by name) | *saltar a*, *canviar de posició* (*No s’ha pogut saltar a aquesta posició*, *S’està canviant de posició…*), *avançar o retrocedir* (*Només l’amfitrió pot avançar o retrocedir*); the seek bar: *barra de progrés*; seek previews: *previsualitzacions de la barra de progrés*; seek cache: *memòria cau de desplaçament*. Never *cercar*, *cerca* or *buscar* for a seek / *cercar*, *cerca* |
| skip back / skip forward (an interval) | *Retrocedeix* / *Avança*; *Enrere* is the Back button |
| Refresh / Reload | *Actualitza* / *Torna a carregar* |

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
  - `many`: 1000000
  - `other`: 0, 2, 3, 4, 5, 6, 7, 8, …
  Write `#` where the number goes.
- `one` is only 1 (*1 episodi*); 0 takes `other` (*0 episodis*). `many` is for whole millions
  and puts *de* between the number and a noun that follows it directly, elided before a vowel
  (*1.000.000 de temporades*, *1.000.000 d’episodis*); with no noun right after the number
  (*Episodis: #*), `many` reads like `other`. Adjectives and participles agree with the noun
  (*1 episodi baixat*, *# temporades noves*). Example:
  `{count, plural, one {# episodi} many {# d’episodis} other {# episodis}}`.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*,
  *7 d*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. In a short
  title where a line break would strand the unit, use a no-break space (U+00A0).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Catalan runs about a quarter longer than English. Keys with `maxLength` appear on TV and small
controls. Stay within it: choose a shorter word over an abbreviation (*Reprèn* for Resume,
*Surt* for Exit), drop articles, possessives and the obvious complement before abbreviating
(*Configuració d’àudio*, not *La teva configuració d’àudio*), and never cut a word with a full
stop (*Config.*, *Sol·lic.*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *T{season}E{episode}*,
*T{season} · E{episode}*, *T{season}:E{episode}*, *E{episode}* (T for temporada, E for
episodi, as in Spanish; never S). Keep the English separators (none, · or :). Spelled-out text writes *Temporada {season}*, *Episodi {episode}*, and both
together as *Temporada {season}, episodi {episode}*.
