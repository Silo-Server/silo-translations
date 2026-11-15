# Swedish (sv)

## Voice

- Address the user as **du** (*dig*, *din*/*ditt*/*dina*): *Logga in*, *Välj en profil*,
  *Försök igen*. Never *ni*, not even when the text speaks to a group: address the reader, or
  rephrase without a pronoun (*Titta tillsammans, var du än är*).
- Buttons, menu items, the choices of a picker and instructions in sentences use the imperative,
  as Apple, Google and Microsoft do in Swedish: *Avbryt*, *Spara*, *Försök igen*, *Ta bort*,
  *Lägg till*, *Använd undertextinställningar*, *Välj ett bibliotek*. Don't use the infinitive
  with *att* on a button, and don't mix imperative and noun forms among strings that sit
  side by side.
- An on/off value is *På* / *Av*, whatever it switches.
- Status words on one screen use the same form: a request's status is a past participle that
  agrees with *förfrågan* (common gender): *Begärd*, *Godkänd*, *Avvisad*, *Misslyckad*, also in
  titles and labels on the same screen. A participle that describes a visible noun agrees with
  it (*Avsnittet är nedladdat*, *Filmen är nedladdad*).
- Sentence case, like the English. Swedish doesn't capitalize nouns, days, months or language
  names (*svenska*, *engelska*). Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). English all-caps labels stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*inga
  filmbibliotek*), not quoted as the tab name.
- Quotation marks ”…” (the same closing mark on both sides, as Swedish typography requires).
  Write the ellipsis as one character ….
- The genitive takes no apostrophe: *Silos server*, *Sonarrs inställningar*, *profilens
  historik*. A name ending in *s*, *x* or *z* adds nothing (*Plex bibliotek*). Where an
  apostrophe is needed, use the typographic ’.
- Inflect an abbreviation said letter by letter with a colon: *URL:en*, *API:et*, *SMS:et*,
  *PIN:en*. Prefer a compound with a hyphen where one reads naturally (*PIN-koden*,
  *URL-adressen*).
- Be gender-neutral where it reads naturally: *person*, *gäst*, *den som är värd*, *användaren*.
  Prefer rephrasing to *hen*; never write *han/hon*.

## Vocabulary

- Standard Swedish as written in Sweden, which Swedish speakers in Finland also read without
  trouble; avoid words only one of them uses.
- Established Swedish UI terms where they are common: *Inställningar*, *undertexter*,
  *bibliotek*, *ladda ned*, *lösenord*, *enhet*, *konto*. Keep product and feature names from
  the glossary.
- *telefon* for a phone, *surfplatta* for a tablet, *tv* (lowercase, as Språkrådet and Apple's
  Swedish write it) for the television as a device, *fjärrkontroll* for the remote.
- On TV, prefer *Välj* to *Tryck på*; for a button on the remote, write *Tryck på OK*. A remote
  button is the object of *Tryck på*, not the subject: *Tryck på Höger för att öppna panelen*.
- Write compounds as one word, as Swedish requires (*undertextinställningar*,
  *uppspelningshastighet*, *filmbibliotek*, *serieavsnitt*). Never split them English-style with
  a space (*särskrivning*): *undertext inställningar* and *film bibliotek* are
  errors, and they change the meaning.
- A compound whose first part is an abbreviation, a digit or a product or feature name takes a
  hyphen: *tv-serie*, *PIN-kod*, *HDR-video*, *4K-video*, *5.1-ljud*, *e-postadress*,
  *Plex-server*, *Jellyfin-bibliotek*. When the name has several words, keep their spaces and
  put the hyphen before the last part only: *Watch Party-inbjudan*, *Apple TV-appen*,
  *Dolby Vision-innehåll*, *Android TV-enheter*. Don't put a space after the hyphen.
- English IT words that Swedish uses as is stay English, inflected the Swedish way: *server*
  (*servern*, *servrar*), *stream* (*streamen*), *streama*, *streaming*, *cache*, *plugin*
  (*pluginet*, *plugins*), *webhook*, *token*. Don't invent Swedish words where Swedish UIs
  use the English one.

## Terms that depend on context

| English | Swedish |
|---|---|
| request (a media request) / an HTTP or API request | *förfrågan* (pl. *förfrågningar*); to request: *begära*, button *Begär* / *begäran* |
| Settings (a screen, tab or menu) / a setting | *Inställningar* / *inställning* or *alternativ* |
| add / delete / remove / clear | *lägg till* / *radera* / *ta bort* / *rensa* |
| show (verb) / TV show | *visa* / *serie* |
| source | *källa* |
| session (sign-in, playback) | *session* |
| party (a Watch Party) | *Watch Party* (*Watch Partyn* in the definite); host: *värd* or *den som är värd*; guest: *gäst* |
| stream (one playback) | *stream*; streaming: *streaming*; to stream: *streama* |
| worker (remote server process) | *worker*, a technical term; *nod* for a node |
| queue / schedule | *kö* / *schemalägga*, *schema* |
| sync | *synkronisera*, *synkronisering* (*synka* where space is short) |
| rating (stars) / rating (age) | *betyg* / *åldersgräns* |
| cast (people) | *rollista*; a cast member: *skådespelare* |
| buffering | *Buffrar* (status) |
| pair (a device) | *parkoppla*, *parkoppling* |
| Couldn't… | *Det gick inte att …* or *Kunde inte …* |
| Try again (sentence) / Retry (button) | *Försök igen.* / *Försök igen* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Kvaliteten Auto spelar …*); as a choice in a list, *Automatisk* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

A placeholder can't take a Swedish ending, so don't put it where Swedish would inflect it
(*den här {device}*, *{server}s*). Build the sentence so the name stands uninflected: *på
{device}*, *den här enheten ({device})*, *servern {server}*.

When a sentence names another screen, button, row, task or setting, use the Swedish label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one other`. `one` is exactly 1 with no decimals (*1 säsong*); everything else,
  including 0 and 1.5, is `other` (*0 säsonger*, *21 säsonger*). Write the noun's own plural:
  *avsnitt* is the same in both, *film* / *filmer*, *serie* / *serier*, *säsong* / *säsonger*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 tim*, *2 tim 4 min*, *45 s*, *211 ms*,
  *7 d*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. In a short
  title where a line break would strand the unit, use a no-break space (U+00A0). An example of
  what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.
- Swedish writes *kl.* only in running text; a time placeholder stands alone.

## Length

Swedish runs longer than English, and long compounds can't break inside a word. Keys with
`maxLength` appear on TV and small controls. Stay within it: choose a shorter word or a
shorter compound over an abbreviation (*Hem* over *Startskärm*), and drop articles and
pronouns before abbreviating.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}A{episode}*,
*S{season} · A{episode}*, *S{season}:A{episode}*, *A{episode}* (S for säsong, A for avsnitt,
never E). Keep the English separators (none, · or :).
