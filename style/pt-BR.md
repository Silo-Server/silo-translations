# Portuguese, Brazil (pt-BR)

## Voice

- Brazilian Portuguese, not European. Address the user as **você**, usually implied by the verb:
  *Entre na sua conta*, *Escolha um perfil*, *Tente novamente*. Never *tu* or *vocês*: text that
  speaks to a group still addresses the reader, or uses the infinitive (*Assistir juntos, onde
  todos estiverem*).
- Buttons, menu items and the choices of a picker use the infinitive, consistently with the
  strings beside them: *Cancelar*, *Salvar*, *Tentar novamente*, *Usar suas preferências de
  legendas*. Instructions in sentences use the imperative: *Escolha uma biblioteca*.
- An on/off value is *Ativado* / *Desativado*, masculine singular, whatever it switches.
- Agreement follows the noun the reader sees: a request's status agrees with *a solicitação*
  (*Solicitada*, *Aprovada*, *Recusada*, *Com falha*, *Concluída*), also in titles and labels on
  the same screen.
- Sentence case, like the English. Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). English all-caps labels stay all caps (*AO VIVO*). A library type or tab name used
  as a common noun inside a sentence is lowercase (*nenhuma biblioteca de filmes*).
- Quotation marks “ ”. Write the ellipsis as one character ….
- Be gender-neutral where it reads naturally (*Boas-vindas*, *quem organiza*).

## Vocabulary

- Brazilian vocabulary: *tela*, *celular*, *arquivo*, *baixar*, *controle remoto*, *tablet*,
  *TV* for the television as a device (*a TV*).
- On TV, prefer *Selecione* to *Pressione*; for a button on the remote, write *Pressione OK*. A
  remote button is the object of *Pressione*: *Pressione Direita para abrir o painel*.

## Terms that depend on context

| English | Portuguese (Brazil) |
|---|---|
| request (a media request, and an HTTP or API request) | *solicitação*; to request: *solicitar* |
| Settings (a screen, tab or menu) / a setting | *Configurações* / *configuração* or *opção* |
| add / delete / remove / clear | *adicionar* / *excluir* / *remover* / *limpar* |
| show (verb) / TV show | *mostrar* / *série* |
| source | *origem* for where something comes from; *fonte* for a source of data |
| session (sign-in, playback) | *sessão* |
| party (a Watch Party) | *a Watch Party*; host: *anfitrião* or *quem organiza*; guest: *convidado* |
| stream (one playback) | *transmissão*; streaming: *streaming* |
| worker (remote server process) | *worker*, a technical term; *nó* for a node |
| queue / schedule | *fila* / *agendar*, *agendamento* |
| sync | *sincronizar*, *sincronização* |
| rating (stars) / rating (age) | *avaliação* / *classificação indicativa* |
| cast (people) | *elenco* |
| buffering | *carregando* |
| pair (a device) | *parear*, *pareamento* |
| Couldn't… | *Não foi possível …* |
| Try again (sentence) / Retry (button) | *Tente novamente.* / *Tentar novamente* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*A qualidade Auto reproduz …*); as a choice in a list, *Automático* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Portuguese label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one many other`. `one` covers 0 and 1; `many` is for whole millions
  (*1.000.000 de temporadas*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*, *7 d*,
  also after a number placeholder (*{minutes} min*). Never *m* for minutes. In a short title
  where a line break would strand the unit, use a no-break space (U+00A0). An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Keys with `maxLength` appear on TV and small controls. Stay within it: choose a shorter word over
an abbreviation, and drop articles before abbreviating.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *T{season}E{episode}*, *T{season} · E{episode}*, *T{season}:E{episode}*, *E{episode}*. Keep the English separators
(none, · or :).

## Pass 5

- In a compact value line or summary (*VERSÃO Auto · 2160p*), the Auto choice is *Auto*, like
  every other language: *Auto · {value}*.
- The skip-back interval is *Retroceder*, paired with *Avançar*; *Voltar* is the Back button.
