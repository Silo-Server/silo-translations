# French (fr)

## Voice

- Address the user as **vous**: *Connectez-vous*, *Choisissez un profil*, *Réessayez*. Text that
  speaks to a group uses the same *vous* or the infinitive.
- Buttons, menu items and the choices of a picker use the infinitive, consistently with the
  strings beside them: *Annuler*, *Enregistrer*, *Réessayer*, *Utiliser vos préférences de
  sous-titres*. Instructions in sentences use the imperative: *Choisissez une bibliothèque*.
- An on/off value is *Activé* / *Désactivé*, masculine singular, whatever it switches.
- Agreement follows the noun the reader sees: a request's status agrees with *la demande*
  (*Demandée*, *Approuvée*, *Refusée*, *Échouée*, *Terminée*), also in titles and labels on the
  same screen.
- Sentence case, like the English. Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). English all-caps labels stay all caps (*EN DIRECT*). A library type or tab name
  used as a common noun inside a sentence is lowercase (*aucune bibliothèque de films*).
- Typography: a narrow no-break space (U+202F) before `: ; ! ?` and inside « » guillemets; write
  the ellipsis as one character ….
- Be gender-neutral where it reads naturally (*Bienvenue*, *la personne qui organise*); avoid
  inclusive-writing dots.

## Vocabulary

- Standard French for France, Belgium, Switzerland and Canada; avoid regional words.
- *téléphone* for a phone, *tablette*, *TV* for the television as a device (*la TV*),
  *télécommande* for the remote.
- On TV, prefer *Sélectionnez* to *Appuyez*; for a button on the remote, write *Appuyez sur OK*.
  A remote button is the object of *Appuyez sur*: *Appuyez sur Droite pour ouvrir le panneau*.

## Terms that depend on context

| English | French |
|---|---|
| request (a media request, and an HTTP or API request) | *demande*; to request: *demander* |
| Settings (a screen, tab or menu) / a setting | *Paramètres* / *paramètre* or *option* |
| add / delete / remove / clear | *ajouter* / *supprimer* / *retirer* / *effacer* |
| show (verb) / TV show | *afficher* / *série* |
| source | *source* |
| session (sign-in, playback) | *session* |
| party (a Watch Party) | *la Watch Party*; host: *l'hôte* or *la personne qui organise*; guest: *invité* |
| stream (one playback) | *flux*; streaming: *streaming* |
| worker (remote server process) | *worker*, a technical term; *nœud* for a node |
| queue / schedule | *file d'attente* / *planifier*, *planification* |
| sync | *synchroniser*, *synchronisation* |
| rating (stars) / rating (age) | *note* / *classification par âge* |
| cast (people) | *distribution* |
| buffering | *mise en mémoire tampon* (status), or *chargement* when space is short |
| pair (a device) | *associer*, *association* |
| Couldn't… | *Impossible de …* |
| Try again (sentence) / Retry (button) | *Réessayez.* / *Réessayer* |
| Auto (the name of a quality or mode option) | *Auto* inside a sentence names the option (*La qualité Auto lit …*); as a choice in a list, *Automatique* where it fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units in the French convention (*Go*, *Mo*, *Mbit/s* for GB, MB, Mbps), resolutions (*1080p*), codec, protocol and format names (in their usual capitals,
*HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the French label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one many other`. `one` covers 0 and 1 (*0 saison*, *1 saison*); `many` is for whole
  millions (*1 000 000 de saisons*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a no-break space (U+00A0): *24 h*, *2 h 4 min*, *45 s*,
  *211 ms*, *7 j*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. An
  example of what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly
  as written.

## Length

Keys with `maxLength` appear on TV and small controls. Stay within it: choose a shorter word over
an abbreviation, and drop articles before abbreviating.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*, *S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}* (E without accent, never É). Keep the English separators
(none, · or :).
