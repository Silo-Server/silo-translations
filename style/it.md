# Italian (it)

## Voice

- Address the user as **tu**: *Accedi*, *Scegli un profilo*, *Riprova*. Never *Lei* or *voi*:
  text that speaks to a group still addresses the reader, or uses the infinitive (*Guardare
  insieme, ovunque*).
- Buttons, menu items and the choices of a picker use the tu imperative, as Apple and Google do
  in Italian: *Annulla*, *Salva*, *Elimina*, *Riprova*, *Usa le impostazioni dei sottotitoli*.
  Instructions in sentences use the same imperative: *Scegli una libreria*. Use the infinitive
  only for a noun-like title that isn't an action (*Riproduzione*, *Impostazioni*).
- An on/off value is *Attivo* / *Disattivato*, masculine singular, whatever it switches.
- Agreement follows the noun the reader sees: a request's status agrees with *la richiesta*
  (*Richiesta*, *Approvata*, *Rifiutata*, *Non riuscita*, *Completata*), also in titles and
  labels on the same screen.
- Sentence case, like the English: only the first word and proper names take a capital.
  Languages, days and months are lowercase inside a sentence (*inglese*, *lunedì*). Feature
  names keep their own capitals (*Watch Party*, *Autoscan*). English all-caps labels stay all
  caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*nessuna
  libreria di film*), not quoted as the tab name.
- Quotation marks “…”. Write the ellipsis as one character ….
- Use the typographic apostrophe ’ for every elision, with no space after it: *l’app*,
  *dell’episodio*, *un’ora*, *all’avvio*. Write *qual è* without an apostrophe.
- Write accents on the letter: *è*, *perché*, *più*, *può*, and *È* at the start of a
  sentence, never *E’*.
- Be gender-neutral where it reads naturally: *persona*, *ospite*, *chi organizza il party*,
  *Ti diamo il benvenuto* instead of *Benvenuto*. Don't use asterisks or schwa.
- A placeholder holds a name whose gender and number you don't know. Write around it so no
  article or adjective has to agree with it: *{name} ha iniziato un Watch Party*, *dalla
  libreria {library}*, not *dal {library}*.

## Vocabulary

- Standard Italian for Italy and Switzerland.
- Established Italian UI terms where they are common: *Impostazioni*, *sottotitoli*,
  *libreria*, *scaricare*. Keep product and feature names from the glossary.
- English IT words that Italian uses as is stay English and invariable in the plural (*i
  server*, *gli account*, *i plugin*): *server*, *account*, *password*, *streaming*, *stream*,
  *download*, *backup*, *plugin*, *log*, *cache*, *app*. They take the masculine article,
  except *l’app* and *la password*, which are feminine.
- *telefono* for a phone, *tablet*, *TV* for the television as a device (*la TV*; *televisore*
  where there is room), *telecomando* for the remote.
- On TV, prefer *Seleziona* to *Premi*; for a button on the remote, write *Premi OK*. A remote
  button is the object of *Premi*, not the subject: *Premi Destra per aprire il pannello*.

## Terms that depend on context

| English | Italian |
|---|---|
| request (a media request, and an HTTP or API request) | *richiesta*; to request: *richiedere* |
| Settings (a screen, tab or menu) / a setting | *Impostazioni* / *impostazione* or *opzione* |
| add / delete / remove / clear | *aggiungere* / *eliminare* / *rimuovere* / *cancellare*, *svuotare* |
| show (verb) / TV show | *mostrare* / *serie* |
| source | *sorgente* |
| session (sign-in, playback) | *sessione* |
| party (a Watch Party) | *il Watch Party*; host: *host* or *chi organizza*; guest: *ospite* |
| stream (one playback) | *stream*; streaming: *streaming* |
| worker (remote server process) | *worker*, a technical term; *nodo* for a node |
| queue / schedule | *coda* / *pianificare*, *pianificazione* |
| sync | *sincronizzare*, *sincronizzazione* |
| rating (stars) / rating (age) | *valutazione* / *classificazione per età* |
| cast (people) | *cast* |
| buffering | *Buffering…* (status), or *Caricamento…* when space is short |
| seek (move to another point in playback) / search (find by name) | *spostarsi*, *spostamento*, *scorrimento* for a seek bar or its previews (*Impossibile spostarsi nel punto scelto*, *cache di spostamento*, *anteprime di scorrimento*); never *ricerca* or *cercare* for a seek / *cercare*, *ricerca* |
| pair (a device) | *abbinare*, *abbinamento* |
| Couldn't… | *Impossibile …* (*Impossibile caricare la libreria*) |
| Try again (sentence) / Retry (button) | *Riprova.* / *Riprova* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*La qualità Auto riproduce …*); as a choice in a list, *Automatica* or *Automatico* agreeing with the setting, where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Italian label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one many other`. `one` is only 1 (*1 stagione*); 0 takes `other` (*0 stagioni*);
  `many` is for whole millions. Put *di* between the number and a noun that follows it directly
  (*1.000.000 di stagioni*), and nowhere else: not before an adjective or participle
  (*1.000.000 personalizzati*, *1.000.000 in corso*), a unit or abbreviation (*1.000.000 min*,
  *1.000.000 GB*), or a noun that doesn't follow the number (*{done} su 1.000.000 di episodi*,
  but *Episodi: 1.000.000*). When no noun follows the number, `many` reads like `other`.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*,
  *7 g*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. In a short
  title where a line break would strand the unit, use a no-break space (U+00A0). An example of
  what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Italian runs about a quarter longer than English. Keys with `maxLength` appear on TV and small
controls. Stay within it: choose a shorter word over an abbreviation, drop articles and
prepositions before abbreviating (*Impostazioni audio*, not *Impostazioni dell’audio*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}* (S for stagione, E for episodio,
as in English). Keep the English separators (none, · or :).
