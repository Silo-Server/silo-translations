# Romanian (ro)

## Voice

- Address the user formally, in the second person plural, as Apple's and Google's Romanian
  interfaces do: *Selectați un profil*, *Încercați din nou.*, *Conectați-vă*. Leave out the
  pronoun *dumneavoastră*; where a possessive is needed, write *dvs.* (*contul dvs.*), and drop
  it where the article already says whose it is (*Profilul a fost salvat*). Never the informal
  *tu* forms (*Selectează*, *Conectează-te*, *contul tău*). Text that speaks to a group uses the
  same forms. Leave out *vă rugăm* for a plain "please".
- Buttons, menu items and the choices of a picker use the same imperative, as Android does in
  Romanian: *Anulați*, *Salvați*, *Ștergeți*, *Reîncercați*, *Redați*, *Folosiți setările
  pentru subtitrări*. Labels of a setting, a toggle or a picker, and titles of screens and
  sections, are noun phrases: *Redare automată*, *Dimensiunea subtitrărilor*, *Setări audio*.
- An on/off value is *Activat* / *Dezactivat*, whatever it switches.
- Progress states use the reflexive present with an ellipsis: *Se încarcă…*, *Se conectează…*,
  *Se descarcă…*. Status words agree with the noun the reader sees: a request's status agrees
  with *cererea* (*Solicitată*, *Aprobată*, *Respinsă*, *Eșuată*, *Finalizată*), also in titles
  and labels on the same screen.
- Sentence case, like the English. Romanian lowercases languages, nationalities, days and months
  (*engleză*, *luni*, *ianuarie*). Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). English all-caps labels stay all caps (*LIVE*). A library type or tab name used as
  a common noun inside a sentence is lowercase (*nu există biblioteci de filme*), not quoted.
- Romanian marks gender on adjectives and participles, and the app doesn't know the user's. Use
  forms without gender: the compound past (*V-ați conectat*), *Bine ați venit*, *Sigur doriți să
  ștergeți profilul?*; never *Sunteți sigur?*, *Sunteți conectat* or slashes (*conectat/ă*). For
  other people, *gazda* (one word for anyone hosting), *persoana*, *participanții*.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and grammar

Romanian puts the definite article at the end of a noun (*serverul*, *biblioteca*), marks the
genitive and dative with endings (*serverului*, *bibliotecii*), and makes adjectives and
participles agree with the noun's gender. A placeholder holds a value you can't see, so none of
this can be written onto it, and nothing can agree with it.

- Never attach an article or an ending to a placeholder: not `{server}-ul`, `{title}-ului`,
  `{library}-a` or `{name}-ei`.
- Put a common noun before the placeholder and give that noun the article and the case:
  *Conectare la serverul {server}*, *S-a adăugat în biblioteca {library}*, *Setările profilului
  {name}*, *Redarea titlului {title} nu a reușit*, *de pe dispozitivul {device}*. Carrier nouns:
  *serverul*, *biblioteca*, *profilul*, *titlul*, *dispozitivul*, *utilizatorul*, *contul*.
- The carrier noun also settles agreement: *Titlul {title} a fost eliminat*, not *{title} a fost
  eliminat* or *eliminată*. Or use a form that doesn't agree: the reflexive (*S-a eliminat
  {title}*), or a colon (*Nu s-a putut reda: {title}*).
- A person's name can be the subject of a verb in the present or the compound past, which have no
  gender: *{user} s-a alăturat*, *{name} a pornit un Watch Party*; not *{user} este conectat*.
  For an owner, use a carrier noun (*profilul utilizatorului {user}*), not *lui {name}*.
- A noun followed by a placeholder or a name keeps its article after a preposition (*pe serverul
  {server}*, *în biblioteca {library}*); without one it stays bare (*pe server*, *în bibliotecă*).
- Names that the glossary keeps as written take no article or ending: *în Silo*, *din Plex*. Where
  the sentence needs a case, put a noun before the name: *setările serverului Silo*, *contul
  Jellyfin*, *aplicația Infuse*. Prefer *codul PIN*, *adresa URL* to *PIN-ul*, *URL-ul*.

## Typography

- Write *ș* and *ț* with a comma below (U+0219, U+021B; *Ș*, *Ț*, U+0218, U+021A), never the
  cedilla forms *ş*, *ţ* (U+015F, U+0163): *Setări*, *Ștergeți*, *conținut*.
- *î* at the start and end of a word and after a prefix (*înapoi*, *a coborî*, *reîncercați*);
  *â* inside a word (*când*, *rând*, *România*). Write *sunt*, *sunteți*, never *sînt*.
- Quotation marks „…” (low, then high: U+201E and U+201D); inside them, «…».
- No space before *: ; ! ?* or before the ellipsis. Write the ellipsis as one character ….
- Clitics and contractions take a hyphen: *s-a*, *v-ați*, *Conectați-vă*, *într-un*, *dintr-o*.
  Write *nu a*, *nu s-a* in full, never *n-a*. Romanian has no apostrophe; use the typographic ’
  only inside a name or English text that has one, never '.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*,
  *7 zile*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. The percent
  sign attaches as in English: *50%*. In a short title where a line break would strand the unit,
  use a no-break space (U+00A0).

## Vocabulary

- Standard Romanian UI terms as Android, Windows and Google write them: *Setări* (not Apple's
  *Configurări*), *server*, *bibliotecă*, *subtitrări*, *descărcare*, *dispozitiv*, *cont*,
  *parolă*, *profil*, *utilizator*, *aplicație*, *căutare*, *redare* (playback), *vizionare*
  (watching), *serial* (a TV series), *distribuție*; *Redați* (Play), *Reluați* (Resume).
- English IT words Romanian keeps are neuter: *server* (*serverul*, *servere*), *stream*,
  *streaming*, *backup*, *plugin* (*pluginuri*), *job* (*joburi*), *worker*, *token*, *webhook*.
  One not pronounced as spelled takes its article after a hyphen (*cache-ul*, *Watch Party-ul*).
  Romanian words where Android uses them: *jurnal* (log), *transcodare*, *metadate*, *dosar*
  (folder), *sarcină* (task).
- *telefon* for a phone, *tabletă*, *televizor* for the television as a device (*TV* where space
  is short), *telecomandă* for the remote.
- On TV, prefer *Selectați* to *Apăsați*; for a button on the remote, write *Apăsați OK*. A remote
  button is the object of *Apăsați*: *Apăsați Dreapta pentru a deschide panoul*.

## Terms that depend on context

| English | Romanian |
|---|---|
| request (a media request, and an HTTP or API request) | *cerere*; to request: *a solicita* |
| Settings (a screen, tab or menu) / a setting | *Setări* / *setare* or *opțiune* |
| add / delete / remove / clear | *adăugați* / *ștergeți* / *eliminați* / *goliți* (a list, a queue, the cache), *ștergeți* (a field, the history) |
| show (verb) / TV show | *afișați*, *a afișa* / *serial* |
| source | *sursă* |
| session (sign-in, playback) | *sesiune* |
| party (a Watch Party) | *Watch Party* (neuter: *un Watch Party*, *Watch Party-ul*); host: *gazda*; guest: *invitat*, *participant* |
| stream (one playback) | *stream* (*streamul*); streaming: *streaming*; to stream: *a reda în streaming* |
| worker (remote server process) | *worker*, a technical term (*workerul*); *nod* for a node |
| task / job | *sarcină* / *job* (*jobul*, *joburi*) |
| queue / schedule | *coadă* (*în coadă*) / *a programa*, *programare*, *program* |
| sync | *a sincroniza*, *sincronizare* |
| rating (stars) / rating (age) | *evaluare* / *clasificare de vârstă* |
| cast (people) | *distribuție* |
| buffering | *Se încarcă în buffer…* (status), or *Se încarcă…* when space is short |
| seek (move to another point in playback) / search (find by name) | *derulare*, *a derula*, *salt la* (*Nu s-a putut derula*, *cache de derulare*, *previzualizări la derulare*); never *căutare* or *a căuta* for a seek / *căutare*, *a căuta* |
| pair (a device) | *a asocia*, *asociere* |
| Couldn't… | *Nu s-a putut …* (*Nu s-a putut încărca biblioteca*), impersonal, so no gender |
| Try again (sentence) / Retry (button) | *Încercați din nou.* / *Reîncercați* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Calitatea Auto redă …*); as a choice in a list, *Automat* or *Automată*, agreeing with the setting |
| Home (the start screen) | *Acasă*; inside a sentence, *ecranul Acasă* (*pe ecranul Acasă*) |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Romanian column lists stems and inflected forms (*bibliotecă|bibliotec*, *episod|episoad*).

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
  - `few`: 0, 2, 3, 4, 5, 6, 7, 8, …
  - `other`: 20, 21, 22, 23, 24, 25, 26, 27, …
  Write `#` where the number goes.
- The noun after the number:
  - `one` (only 1): the singular, *# episod*, *# oră*.
  - `few` (0, 2–19, also 101–119, 201–219 and so on, and decimals): the plural directly after
    the number, *# episoade*, *# ore*.
  - `other` (20–100, 120–200 and so on): *de* and the plural, *# de episoade*, *# de ore*.
  - `{count, plural, one {# episod} few {# episoade} other {# de episoade}}`. Adjectives,
    participles and the verb agree: *# episod nou a fost adăugat*, *# episoade noi au fost
    adăugate*, *# de episoade noi au fost adăugate*.
- Put *de* only between the number and a noun that follows it directly; not before a unit or
  abbreviation (*# min*, *# GB*) or where the noun comes first (*Episoade: #*), and there `other`
  reads like `few`. Where the English has no noun after the number (*{count} selected*), add one
  (*# de elemente selectate*) or use a colon (*Selectate: #*). The same holds with
  `{count_text}`: `other {{count_text} de descărcări}`.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Romanian runs about a quarter longer than English. Keys with `maxLength` appear on TV and small
controls. Stay within it: choose a shorter word, a noun or a reflexive form over a sentence (*Se
descarcă*, *În bibliotecă*, *Parțial*, *În așteptare*), and drop *dvs.*, articles and prepositions
a label doesn't need (*Setări audio*). Never abbreviate a word (*sez.*, *ep.*, *nr.*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}* (S for sezon, E for episod, as in
English). Keep the English separators (none, · or :). Spelled-out text puts the number after the
articled noun, as Netflix does in Romanian: *Sezonul {season}*, *Episodul {episode}*, *Sezonul
{season}, episodul {episode}*. A count follows the plural rules: *# sezoane*, *# de episoade*.
