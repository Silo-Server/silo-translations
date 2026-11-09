# Spanish (es)

One neutral Spanish for Spain and Latin America (D1).

## Voice

- Address the user as **tú**: *Inicia sesión*, *Elige un perfil*, *Vuelve a intentarlo*. Never
  *usted*, *vosotros* or *ustedes*, and keep tú consistent within a screen. Text that speaks to a
  group still addresses the reader alone, or uses the infinitive: *Ver juntos, estén donde estén*.
- Buttons, menu items and the choices of a picker use the infinitive, consistently with the
  strings beside them: *Cancelar*, *Guardar*, *Reintentar*, *Iniciar sesión*, *Usar tus
  preferencias de subtítulos*. Instructions in sentences use the tú imperative: *Elige una
  biblioteca*.
- An on/off value is *Activado* / *Desactivado*, singular and masculine, whatever it switches.
- Agreement follows the noun the reader sees: a request's status agrees with *la solicitud*
  (*Solicitada*, *Aprobada*, *Rechazada*, *Fallida*, *Completada*), also in titles and eyebrows
  on the same screen.
- Sentence case, like the English. Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). Write the English all-caps labels in capitals too (*EN DIRECTO*). A library type
  or tab name used as a common noun inside a sentence is lowercase (*No hay bibliotecas de
  películas*), even where the English capitalizes it.
- Quotation marks: “ ”. Use « » only if the English quotes with them.
- Be gender-neutral where it reads naturally (*te damos la bienvenida*, not *bienvenido*).

## Neutral vocabulary

- No regional words: *teléfono* (not *móvil* or *celular*), *equipo* or *dispositivo* (not
  *ordenador* or *computadora*), *archivo*, *carpeta*, *pantalla*, *control remoto* (not *mando*).
- *video* without an accent (the form used across Latin America and accepted in Spain).
- On TV, prefer *Selecciona* to *Pulsa*, *Presiona* or *Oprime*; for a button on the remote, write
  *Presiona OK*. A remote button is the object of *Presiona*, not the subject of the sentence:
  *Presiona Derecha para abrir el panel*, not *Derecha abre el panel*.
- *tableta*, never *tablet*.

## Terms that depend on context

| English | Spanish |
|---|---|
| request (a media request, and an HTTP or API request) | *solicitud* (never *petición*); to request: *solicitar* |
| Settings (a screen, tab or menu) / a setting | *Configuración* / *ajuste* or *opción* |
| add / delete / remove / clear | *añadir* (never *agregar*) / *eliminar* / *quitar* / *borrar* |
| show (verb) / TV show | *mostrar* / *serie* |
| TV (the device) | *la TV*, plural *las TV*; never *televisor* (the short form fits TV screens) |
| source | *origen* for where something comes from (an Autoscan source, a source user); *fuente* for a source of data or markers |
| session (sign-in, playback) | *sesión* |
| party (a Watch Party) | *la Watch Party*; host: *anfitrión* or *quien organiza*; guest: *invitado* |
| stream (one playback) | *transmisión*; streaming: *transmisión* |
| worker (remote server process) | *worker*, a technical term; *nodo* for a node |
| queue / schedule | *cola* / *programar*, *programación* |
| sync | *sincronizar*, *sincronización* |
| rating (stars) / rating (age) | *calificación* / *clasificación por edad* |
| cast (people) | *reparto* |
| buffering | *almacenando en búfer* (status), or *carga* when space is short |
| pair (a device) | *vincular*, *vinculación* |
| Couldn't… | *No se pudo…* |
| Try again (sentence) / Retry (button) | *Vuelve a intentarlo.* / *Reintentar* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option: *La calidad Auto reproduce…*; as a choice in a list, *Automático* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*, not *Espacio* or *Intro*).

When a sentence names another screen, button, row, task or setting, use the Spanish label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one many other`. *many* is for whole millions (*1 000 000 de temporadas*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *211 ms*, *7 d*, *45 s*,
  also after a number placeholder (*{minutes} min*). Use the Spanish symbols *h*, *min*, *s*,
  *ms*, *d*; never *m* for minutes (it reads as metres). In a short title where a line break
  would strand the unit (a chart card title), use a no-break space (U+00A0). Exception: an
  example of what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly
  as written.

## Length

Keys with `maxLength` appear on TV and small controls. Stay within it: choose a shorter word over
an abbreviation, and drop articles before abbreviating.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *T{season}E{episode}*, *T{season} · E{episode}*, *T{season}:E{episode}*, *E{episode}*. Keep the English separators
(none, · or :).
