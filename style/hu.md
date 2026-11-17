# Hungarian (hu)

## Voice

- Address the user formally (*magázás*), as Apple's and Google's Hungarian interfaces do,
  through the verb and without the pronoun: *Válasszon profilt*, *Próbálja újra.*, *Jelentkezzen
  be*, *Adja meg a jelszót*. Where a pronoun is needed, write *Ön* with a capital (*Önnek*, *az
  Ön fiókja*), sparingly: *a fiók*, *a profil* where the article says enough. Never the informal
  *te* forms (*Válassz*, *Próbáld újra*, *a profilod*). Text that speaks to a group still
  addresses the reader, or uses a noun phrase. No *kérjük* for a plain "please".
- Buttons, menu items and the choices of a picker are verbal nouns in *-ás*/*-és*, as on Apple
  and Android in Hungarian: *Mentés*, *Törlés*, *Bejelentkezés*, *Lejátszás*, *Folytatás*,
  *Feliratbeállítások használata*; short words stay as they are (*OK*, *Mégse*, *Kész*,
  *Tovább*, *Újra*). Labels of a setting, a toggle or a picker are noun phrases (*Automatikus
  lejátszás*, *Feliratméret*). Sentences use the formal imperative: *Válasszon egy könyvtárat.*
- An on/off value is *Be* / *Ki*, whatever it switches.
- Progress states are the verbal noun with an ellipsis: *Betöltés…*, *Csatlakozás…*,
  *Pufferelés…*. Finished states take *-va*/*-ve* (*Mentve*, *Letöltve*); a failure is
  *Sikertelen*. Status words on one screen use the same form: a request's status is *Igényelve*,
  *Jóváhagyva*, *Elutasítva*, *Sikertelen*, *Kész*, also in titles and labels on that screen.
- Sentence case, like the English. Hungarian lowercases languages, nationalities, days and months
  (*angol*, *magyar*, *hétfő*, *január*). Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). An English all-caps label becomes the Hungarian word in capitals (*ÉLŐ* for LIVE).
  A library type or tab name used as a common noun inside a sentence is lowercase (*nincs
  filmkönyvtár*), not quoted.
- Hungarian has no grammatical gender and *ő* covers he and she. Keep it that way: *felhasználó*,
  *személy*, *vendég*, *házigazda* for whoever hosts a party; no *-nő* forms, *úr* or *hölgy*.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and suffixes

Hungarian marks case and possession with suffixes whose vowels follow the word's vowel harmony
(*szerverhez* but *fiókhoz*, *könyvtárban* but *eszközben*), *-val*/*-vel* takes on the last
consonant (*Plexszel*, *fájllal*), and the article is *a* before a consonant sound and *az*
before a vowel sound. A placeholder holds a value you can't see, so you can't choose any of these.

- Never attach a suffix to a placeholder, with or without a hyphen: not `{server}-hez`,
  `{name}-t`, `{library}ban`, `{title}-val` or `{count}-ból`.
- Put a noun after the placeholder and give that noun the suffix: *a(z) {server} szerverhez*,
  *a(z) {library} könyvtárba*, *a(z) {device} eszközről*; for a name or a title, *nevű* or
  *című* before the noun: *a(z) {name} nevű profilt*, *a(z) {title} című elemet*. Carrier nouns:
  *szerver*, *könyvtár*, *profil*, *felhasználó*, *eszköz*, *fájl*, *elem* (an item or title).
- The article before a placeholder, in order of preference:
  1. Write the sentence so that no article stands before it: after a colon (*Nem sikerült
     csatlakozni: {server}*), as a label (*Szerver: {server}*), or as a person's name, which
     takes no article (*{user} csatlakozott*).
  2. Where the article can't be avoided, write *a(z)*, as Apple's and Microsoft's Hungarian do:
     *Csatlakozás a(z) {server} szerverhez*. Never guess *a* or *az*, and don't drop an article
     Hungarian needs. A number placeholder is the same (*az 5*, *a 6*).
- A possessor stays bare and the owned noun takes the suffix: *{user} profilja*. A named item
  is definite, so the verb is definite too (*Törli a(z) {name} nevű profilt?*).
- Names that the glossary keeps in English take suffixes as they are pronounced: *Silóban*,
  *Silót* (a final *o* lengthens to *ó*, as in *Oslóban*), *Plexben*, *Plexszel*,
  *Jellyfinhez*, *Rokun*. After an acronym, a digit, or a final letter not pronounced as written,
  the suffix follows a hyphen: *Apple TV-n*, *TMDB-ből*, *HDR10-zel*, *PIN-t*. When a name is
  long or the suffix awkward, put a noun after it (*a Rotten Tomatoes szolgáltatásból*).

## Typography

- Quotation marks „…” (low, then high: U+201E and U+201D); inside them, »…«.
- Write *ő* and *ű* with the double acute (U+0151, U+0171; *Ő*, *Ű*), never *õ*, *û*, *ô* or
  *ö*, *ü* in their place. Long and short vowels are different letters (*kor*, *kór*).
- No space before *: ; ! ?* or before the ellipsis. Write the ellipsis as one character ….
- A comma before every subordinate clause and before *de*: *…, hogy*, *…, ha*, *…, amely*.
- Hungarian writes no apostrophe for elision or possession (*a Silo beállításai*); use the
  typographic ’ only inside a name or English text that has one, never '.
- Compounds are one word (*feliratméret*, *filmkönyvtár*); one of three or more parts and over
  six syllables takes a hyphen at its main seam (*metaadat-szolgáltató*). A name or acronym
  joined to a noun takes a hyphen, as in *Google-fiók*: *Jellyfin-fiók*, *PIN-kód*, *Watch
  Party-meghívó*; a noun that says what kind of thing the name is stays separate (*a Silo
  szerver*). Never join a placeholder to a noun (`{server}-szerver`).
- A suffix after a digit, an acronym or a sign follows a hyphen: *URL-t*, *4K-s*, *50%-os*.
  Ordinal numbers take a period: *{season}. évad*, *3. hely*.
- A number and its unit are separated by a space: *24 ó*, *2 ó 4 p*, *45 mp*, *211 ms*,
  *7 nap*, also after a number placeholder (*{minutes} p*, or *{minutes} perc* where there is
  room). Never *m* for minutes. The percent sign attaches: *50%*. In a short title where a line
  break would strand the unit, use a no-break space (U+00A0).

## Vocabulary

- Standard Hungarian UI terms as Apple and Google write them: *Beállítások*, *szerver*,
  *könyvtár* (a media library), *felirat*, *letöltés*, *eszköz*, *fiók*, *jelszó*, *profil*,
  *felhasználó*, *értesítés*, *alkalmazás*, *keresés*, *lejátszás*, *megtekintés*, *sorozat*,
  *évad*, *epizód*, *szereplők*, *előzetes*. A folder or directory on disk is *mappa*; *könyvtár*
  means only a media library.
- Hungarian words over English loans where Hungarian platforms use them: *biztonsági mentés*
  (backup), *bővítmény* (plugin), *napló* (log), *gyorsítótár* (cache), *átkódolás*
  (transcoding), *metaadatok*, *csomópont* (node). English IT words Hungarian keeps: *stream*,
  *streamelés*, *token*, *webhook*, *API*, *remux*, *worker*.
- *telefon* for a phone, *táblagép*, *TV* for the television as a device (*a TV-n*; *televízió*
  in full where there is room), *távirányító* for the remote.
- On TV, prefer *Válassza ki* to *Nyomja meg*; for a button on the remote, write *Nyomja meg az
  OK gombot*. A remote button is the object, with *gomb* carrying the suffix: *A panel
  megnyitásához nyomja meg a Jobbra gombot*.

## Terms that depend on context

| English | Hungarian |
|---|---|
| request (a media request, and an HTTP or API request) | *kérés* (*HTTP-kérés*); to request: *kér*, *igényel* |
| Settings (a screen, tab or menu) / a setting | *Beállítások* / *beállítás* or *lehetőség* |
| add / delete / remove / clear | *hozzáadás* / *törlés* / *eltávolítás* / *kiürítés* (a list, a queue, the cache), *törlés* (a field, the history) |
| show (verb) / TV show | *megjelenítés*, *megjelenít* / *sorozat* |
| source | *forrás* |
| session (sign-in, playback) | *munkamenet* |
| party (a Watch Party) | *Watch Party* (*a Watch Partyhoz*, *a Watch Partyban*); host: *házigazda*; guest: *vendég* |
| stream (one playback) | *stream*; streaming: *streamelés*; to stream: *streamel* |
| worker (remote server process) | *worker*, a technical term; *csomópont* for a node |
| task / job | *feladat* / *művelet* |
| queue / schedule | *várólista* / *ütemezés*, *ütemez* |
| sync | *szinkronizálás*, *szinkronizál* |
| rating (stars) / rating (age) | *értékelés* / *korhatár-besorolás* |
| cast (people) | *szereplők* |
| buffering | *Pufferelés…* (status) |
| seek (move to another point in playback) / search (find by name) | *tekerés*, *ugrás* (*Nem sikerült a tekerés*, *tekerési gyorsítótár*, *előnézeti képek tekeréskor*); never *keresés* or *keres* for a seek / *keresés*, *keres* |
| pair (a device) | *párosítás*, *párosít* |
| Couldn't… | *Nem sikerült …* (*Nem sikerült betölteni a könyvtárat*) |
| Try again (sentence) / Retry (button) | *Próbálja újra.* / *Újra* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*az Auto minőség …*); as a choice in a list, *Automatikus* |
| Home (the start screen) | *Kezdőlap*; inside a sentence, *a Kezdőlapon*, *a Kezdőlapra* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Hungarian column lists stems (*könyvtár*, *jelszó|jelszav*, *bejelentkez*) so any suffixed form
matches.

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
- Hungarian keeps the noun in the singular after every number and quantity word (*sok*,
  *néhány*, *több*), and the verb agrees in the singular: *1 epizód*, *3 epizód*, *0 epizód*,
  *5 új film*, *3 epizód van hátra*; never *3 epizódok*. Both forms usually carry the same noun:
  `{count, plural, one {# epizód} other {# epizód}}`. Keep both categories even when they are
  identical; the check requires them.
- The suffix the sentence needs goes on the noun, never on the number: *# epizódot*,
  *# eszközön*, *# napja*, *# nap múlva*. A noun without a number takes the plural as in
  English: *Epizódok*, *Letöltések*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Hungarian runs longer than English, often by a quarter or more, and suffixes and compounds make
long words that can't break. Keys with `maxLength` appear on TV and small controls. Stay within
it: choose a shorter word (*Folytatás* for Resume, *Függőben* for Pending), use the verbal noun
rather than a sentence, and drop the article, *Ön* and possessive suffixes a label doesn't need
(*Beállítások*, not *Az Ön beállításai*). Never abbreviate a word (*beáll.*, *ep.*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *É{season}E{episode}*,
*É{season} · E{episode}*, *É{season}:E{episode}*, *E{episode}* (É for évad, E for epizód; never
S). Keep the English separators (none, · or :). Spelled-out text uses ordinals, the number
first: *{season}. évad*, *{episode}. epizód*, *{season}. évad, {episode}. epizód*; never *Évad
{season}*. A count uses the singular noun: *# évad*, *# epizód*.
