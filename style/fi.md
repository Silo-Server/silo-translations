# Finnish (fi)

## Voice

- Address the user in the singular (*sinä*), through the verb form, without writing the pronoun:
  *Kirjaudu sisään*, *Valitse profiili*, *Yritä uudelleen*, *Profiilisi*. Never the formal or
  plural *te* (*Kirjautukaa*, *Valitkaa*). Text that speaks to a group still addresses the
  reader, or uses a noun phrase (*Yhteiskatselu missä tahansa*).
- Buttons and menu items are singular imperatives, as on Apple, Google and Windows in Finnish:
  *Tallenna*, *Peruuta*, *Poista*, *Yritä uudelleen*, *Käytä tekstitysasetuksia*. Labels of a
  setting, a toggle or a picker are noun phrases (*Automaattinen toisto*, *Tekstityksen koko*),
  not imperatives.
- An on/off value is *Päällä* / *Pois*, whatever it switches.
- Progress states use the passive present with an ellipsis: *Ladataan…*, *Yhdistetään…*,
  *Puskuroidaan…*. Status words on one screen use the same form: a request's status is a passive
  past participle (*Pyydetty*, *Hyväksytty*, *Hylätty*, *Epäonnistunut*), also in titles and
  labels on the same screen.
- Sentence case, like the English. Finnish lowercases languages, nationalities, days and months
  (*englanti*, *suomi*, *maanantai*). Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). English all-caps labels stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase
  (*ei elokuvakirjastoja*), not quoted as the tab name.
- Quotation marks ”…” (the same closing mark U+201D at both ends). Write the ellipsis as one
  character …. Use the typographic apostrophe ’ where Finnish needs one, which is rare: before
  a case ending on a name that ends in a silent letter.
- Finnish has no grammatical gender and *hän* is neutral. Use neutral nouns: *henkilö*, *vieras*,
  *järjestäjä* for whoever hosts a party (not *isäntä* or *emäntä*); avoid *-mies* compounds.
- No colloquial forms (*me mennään*, *sä*), no clitics such as *-han* or *-pa*. Plain, friendly
  standard Finnish (*yleiskieli*), as Netflix and Apple write it.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. A warning that the user can't sign in *with* a method says so
  (*Et voi kirjautua tälle tilille palvelun {provider} kautta …*); dropping the method turns it
  into a warning that the account is locked.

## Placeholders and case endings

Finnish inflects nouns with case endings whose form depends on the word's stem and vowel harmony
(*Silo* → *Silossa*, *Plex* → *Plexissä*, *Kodi* → *Kodissa*, *TMDB* → *TMDB:ssä*). A
placeholder holds a value you can't see, so you can't choose its ending.

- Keep every placeholder in the nominative, as a bare value. Never glue an ending, a colon
  ending or a compound part onto it: not `{server}:ssa`, `{server}ssa`, `{title}n`, `{name}:lle`,
  `{library}-kirjasto` or `{count}:n`.
- Put a generic noun before the placeholder and give that noun the case ending: *Yhdistetään
  palvelimeen {server}*, *Lisätty kirjastoon {library}*, *Kohteen {title} toisto epäonnistui*,
  *Käyttäjä {user} liittyi*, *Profiilin {name} asetukset*. Common carrier nouns: *palvelin*,
  *kirjasto*, *kohde* (an item or title), *käyttäjä*, *profiili*, *laite*, *tiedosto*.
- Or restructure so the placeholder stands alone as the subject, after a colon, or in an
  apposition: *{user} liittyi*, *Palvelin: {server}*.
- A number placeholder keeps its noun after it, in the case the number requires (see Plurals);
  never a case ending on the number itself.
- Fixed names that the glossary keeps in English are inflected normally, with a colon after an
  abbreviation or a final digit and an apostrophe after a silent letter: *Silon*, *Plexissä*,
  *Apple TV:ssä*, *TMDB:stä*, *HDR10:n*. When the name is long or the ending awkward, use a
  carrier noun instead (*Rotten Tomatoes -palvelusta*).

## Vocabulary

- Standard Finnish UI terms over English loans where Finnish platforms use them: *asetukset*,
  *palvelin*, *kirjasto*, *tekstitys*, *lataa*, *suoratoisto*, *laite*, *tili*, *salasana*,
  *varmuuskopio*, *laajennus*, *metatiedot*. Keep product and feature names from the glossary.
- English IT words that Finnish uses as is are written as Finnish spells them: *transkoodaus*,
  *remux*, *traileri*, *striimi* only where *suoratoisto* doesn't fit.
- *puhelin* for a phone, *tabletti*, *tv* (lowercase, the Finnish spelling; *televisio* in full
  sentences where space allows) for the television as a device, *kaukosäädin* for the remote.
- On TV, prefer *Valitse* to *Paina*; for a button on the remote, write *Paina OK*. A direction
  on the remote is something the user presses, not the subject: *Avaa paneeli painamalla
  oikealle*.

## Compounds

- Write compounds as one word, as Finnish requires: *tekstitysasetukset*, *toistonopeus*,
  *kirjastohaku*, *katseluhistoria*. Never an English-style spaced compound (*tekstitys
  asetukset*, *Watch Party kutsu*).
- After an abbreviation or a one-word name, join with a hyphen: *PIN-koodi*, *tv-sarja*,
  *HDR-sisältö*, *Silo-palvelin*, *Plex-kirjasto*, *Jellyfin-tili*.
- After a name of several words, write a space and a hyphen: *Watch Party -kutsu*,
  *Apple TV -sovellus*, *Dolby Vision -tuki*, *Android TV -laite*.
- Where two identical vowels meet at the seam, use a hyphen (*vapaa-aika*); otherwise no hyphen.
- Never build a compound with a placeholder (see above).

## Terms that depend on context

| English | Finnish |
|---|---|
| request (a media request, and an HTTP or API request) | *pyyntö*; to request: *pyytää* |
| Settings (a screen, tab or menu) / a setting | *Asetukset* / *asetus* or *vaihtoehto* |
| add / delete / remove / clear | *lisää* / *poista* / *poista* or *ota pois* / *tyhjennä* |
| show (verb) / TV show | *näytä* / *sarja* |
| source | *lähde* |
| session (sign-in, playback) | *istunto* |
| party (a Watch Party) | *Watch Party*; host: *järjestäjä*; guest: *vieras* |
| stream (one playback) | *suoratoisto*; to stream: *suoratoistaa* |
| worker (remote server process) | *worker*, a technical term, or *työsolmu*; *solmu* for a node |
| queue / schedule | *jono* / *ajoita*, *aikataulu* |
| sync | *synkronoi*, *synkronointi* |
| rating (stars) / rating (age) | *arvio* / *ikäraja* |
| cast (people) | *näyttelijät* |
| buffering | *Puskuroidaan…* (status) |
| pair (a device) | *muodosta laitepari*, *laitepari* |
| Couldn't… | *… epäonnistui* (*Tallentaminen epäonnistui*) or *Ei voitu …* |
| Try again (sentence) / Retry (button) | *Yritä uudelleen.* / *Yritä uudelleen* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*Laatu Auto toistaa …*); as a choice in a list, *Automaattinen* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Finnish column lists word stems (*palvelin|palvelim*, *kausi|kaude|kautta*) so any case form
matches.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Finnish label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one other`. `one` is exactly 1; `other` covers 0, 2 and up, and decimals.
- After a number other than 1, Finnish puts the noun, and any adjective with it, in the
  **partitive singular**, and the verb in the singular: *1 jakso*, *3 jaksoa*, *0 jaksoa*,
  *2 kautta*, *5 uutta elokuvaa*, *3 jaksoa jäljellä*. The `other` form is therefore not the
  nominative plural: never *3 jaksot*, *5 elokuvat*. Write
  `{count, plural, one {# jakso} other {# jaksoa}}`.
- When the counted phrase takes another case in the sentence, the number and noun take it
  together (*3 jaksossa*, *2 laitteelta*), and `one` and `other` then differ only if the
  number's own form differs; still list both categories.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 h*, *2 h 4 min*, *45 s*, *211 ms*,
  *7 pv*, *50 %*, also after a number placeholder (*{minutes} min*, *{percent} %*). Never *m*
  for minutes. In a short title where a line break would strand the unit, use a no-break space
  (U+00A0). An example of what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and
  stays exactly as written.

## Length

Finnish runs long, often longer than German. Keys with `maxLength` appear on TV and small
controls. Stay within it: choose a shorter word or a shorter compound over an abbreviation
(*Jatka* for "Resume", *Kesken* for "In progress"), and drop the carrier noun or possessive
suffix before abbreviating.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *K{season}J{episode}*,
*K{season} · J{episode}*, *K{season}:J{episode}*, *J{episode}* (K for kausi, J for jakso, as
Netflix writes them in Finnish; never S or E). Keep the English separators (none, · or :).
