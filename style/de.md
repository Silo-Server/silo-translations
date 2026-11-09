# German (de)

## Voice

- Address the user as **du**, lowercase: *Melde dich an*, *Wähle ein Profil*, *Versuche es
  erneut*. Never *Sie*, and never *ihr*: text that speaks to a group still addresses the reader,
  or uses the infinitive (*Gemeinsam schauen, egal wo*).
- Buttons, menu items and the choices of a picker use the infinitive, consistently with the
  strings beside them: *Abbrechen*, *Speichern*, *Erneut versuchen*, *Untertitel-Einstellungen
  verwenden*. Instructions in sentences use the du imperative: *Wähle eine Mediathek*.
- An on/off value is *Ein* / *Aus*, whatever it switches.
- Status words on one screen use the same form: a request's status is a participle without an
  article (*Angefragt*, *Genehmigt*, *Abgelehnt*, *Fehlgeschlagen*), also in titles and labels on
  the same screen.
- Sentence case, like the English, with nouns capitalized as German requires. Feature names keep
  their own capitals (*Watch Party*, *Autoscan*). English all-caps labels stay all caps
  (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is written as the common
  noun (*keine Film-Mediatheken*), not quoted as the tab name.
- Quotation marks „…“. Write the ellipsis as one character ….
- Be gender-neutral where it reads naturally: *Person*, *Gast*, *wer die Party leitet*; avoid
  gender stars and colons.

## Vocabulary

- Established German UI terms over anglicisms where they are common: *Einstellungen*,
  *Untertitel*, *Mediathek*, *herunterladen*. Keep product and feature names from the glossary.
- *Smartphone* for a phone, *Tablet*, *Fernseher* for the TV as a device (*TV* where space is
  short), *Fernbedienung* for the remote.
- On TV, prefer *Wähle* to *Drücke*; for a button on the remote, write *Drücke OK*. A remote
  button is the object of *Drücke*, not the subject: *Drücke Rechts, um den Bereich zu öffnen*.

## Terms that depend on context

| English | German |
|---|---|
| request (a media request, and an HTTP or API request) | *Anfrage*; to request: *anfragen* |
| Settings (a screen, tab or menu) / a setting | *Einstellungen* / *Einstellung* or *Option* |
| add / delete / remove / clear | *hinzufügen* / *löschen* / *entfernen* / *leeren* |
| show (verb) / TV show | *anzeigen* / *Serie* |
| source | *Quelle* |
| session (sign-in, playback) | *Sitzung* |
| party (a Watch Party) | *die Watch Party*; host: *Gastgeber* or *wer die Party leitet*; guest: *Gast* |
| stream (one playback) | *Stream*; streaming: *Streaming* |
| worker (remote server process) | *Worker*, a technical term; *Knoten* for a node |
| queue / schedule | *Warteschlange* / *planen*, *Zeitplan* |
| sync | *synchronisieren*, *Synchronisierung* |
| rating (stars) / rating (age) | *Bewertung* / *Altersfreigabe* |
| cast (people) | *Besetzung* |
| buffering | *Wird gepuffert* (status) |
| pair (a device) | *koppeln*, *Kopplung* |
| Couldn't… | *… konnte nicht … werden* or *Fehler beim …* |
| Try again (sentence) / Retry (button) | *Versuche es erneut.* / *Erneut versuchen* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Die Qualität Auto spielt …*); as a choice in a list, *Automatisch* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the German label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one other`.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 Std.*, *2 Std. 4 Min.*, *45 Sek.*,
  *211 ms*, *7 Tg.*, also after a number placeholder (*{minutes} Min.*). Never *m* for minutes.
  In a short title where a line break would strand the unit, use a no-break space (U+00A0). An
  example of what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly
  as written.

## Length

German runs long. Keys with `maxLength` appear on TV and small controls. Stay within it: choose a
shorter word or a shorter compound over an abbreviation, and drop articles before abbreviating.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}F{episode}*, *S{season} · F{episode}*, *S{season}:F{episode}*, *F{episode}* (F for Folge, never E). Keep the English separators
(none, · or :).
