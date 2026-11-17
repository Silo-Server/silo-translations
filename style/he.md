# Hebrew (he)

## Voice

- Modern standard Hebrew in full spelling without vowel points (כתיב מלא, by the Academy of the
  Hebrew Language's rules), as the platforms write it: *צפייה*, *ספרייה*, *תיקייה*, *שגיאה*,
  *אפליקציה*. No niqqud, no slang, no formal or archaic forms (*הנך*, *אנא*).
- Hebrew marks the gender of "you" in imperatives, the future and the present tense (*בחר* /
  *בחרי*, *אתה מחובר* / *את מחוברת*). Address the user without marking gender, as Google's
  Hebrew products do:
  - Buttons, menu items, tabs and the choices of a picker are verbal nouns (שם פעולה),
    consistently with the strings beside them: *שמירה*, *ביטול*, *מחיקה*, *ניסיון חוזר*,
    *התחברות*, *שימוש בהעדפות הכתוביות*. Setting labels are noun phrases too (*הפעלה
    אוטומטית*, *גודל הכתוביות*).
  - Instructions in sentences use *יש ל* + infinitive for what the user must do and *אפשר ל* +
    infinitive for what they may do: *יש לבחור ספרייה*, *אפשר לשנות את זה בהגדרות*.
  - A question to the user is an infinitive: *למחוק את הפרופיל?*, *לצאת מה-Watch Party?*.
  - The past tense and the possessive are spelled the same for both genders, so use them freely:
    *התחברת בתור {name}*, *הפרופיל שלך*, *נשלח אליך קוד*.
  - Where the English says "you are" with an adjective or a present tense, rephrase around the
    user: *אין חיבור לאינטרנט* for "You're offline", *נדרשת התחברות* for "You need to sign in".
  - Never slashes, dots or both forms (*בחר/י*, *בחר.י*), and never the plural imperative
    (*בחרו*) for one user. Only where no neutral wording reads naturally, use the masculine
    singular.
- An on/off value is *מופעל* / *כבוי*, whatever it switches.
- Progress states: *בטעינה…* for "Loading…"; other states are *מתבצעת* or *מתבצע*, agreeing with
  the verbal noun that follows, with an ellipsis: *מתבצעת התחברות…*, *מתבצעת שמירה…*, *מתבצע
  עיבוד…*.
- Status words on one screen use one form. A request's status agrees with *בקשה* (feminine):
  *נשלחה בקשה*, *ממתינה*, *אושרה*, *נדחתה*, *נכשלה*, *הושלמה*, also in titles and labels on the
  same screen.
- Hebrew has no capital letters. Latin names keep their own capitals (*Watch Party*, *Autoscan*).
  An English all-caps label becomes the plain Hebrew word (*בשידור חי* for LIVE, *חדש* for NEW).
- A library type or tab name used as a common noun inside a sentence is written as the common
  noun (*אין ספריות סרטים*), not quoted as the tab name.
- Role nouns keep their standard form (*משתמש*, *מנהל*, *מארח*, *אורח*). In sentences about a
  person, prefer wording that names the action (*הצטרפות ל-Watch Party*) to a gendered verb.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and grammar

Hebrew attaches the one-letter words ו, ה, ב, כ, ל, מ, ש to the next word, and verbs, adjectives
and numbers agree with their noun in gender and number. A placeholder holds a value you can't
see (a person, a title, a server, a Hebrew or a Latin name), so nothing can attach to it and
nothing can agree with it.

- Never write a prefix onto a placeholder: not *ב{server}*, *ל{user}*, *ה{title}*,
  *מ{library}*. Put a Hebrew noun before it and attach the prefix to that noun: *בשרת {server}*,
  *לספרייה {library}*, *מהפרופיל {name}*, *למשתמש {user}*, *במכשיר {device}*. Common carrier
  nouns: *שרת*, *ספרייה*, *פרופיל*, *משתמש*, *מכשיר*, *קובץ*, *פריט* (an item or title), *אוסף*.
- Where no carrier noun fits, write the prefix with a hyphen, as Hebrew does before Latin names
  and digits: *נשלח ל-{email}*.
- The definite article goes on the carrier noun, never on the placeholder: *השרת {server} לא
  זמין*. A placeholder that names something is definite, so a direct object takes *את*: *למחוק
  את הפרופיל {name}?*, *לא ניתן היה להפעיל את {title}*. Don't make a placeholder the second noun
  of a construct: *בספרייה {library}*, not *בספריית {library}*.
- Don't let a verb or an adjective agree with a person or a title you can't see (*{user} הצטרף*
  or *הצטרפה*). Use a noun phrase with a colon (*הצטרפות ל-Watch Party: {user}*), or put a
  carrier noun first and agree with it (*הפריט {title} נוסף לרשימת הצפייה*).
- A number outside a plural can't choose its noun's form. Rephrase so it doesn't have to:
  *פרקים: {count}*.
- Names the glossary keeps in Latin letters take a prefix with a hyphen and agree in the
  masculine: *ב-Silo*, *ל-Plex*, *מ-TMDB*, *ב-Apple TV*, *אם Silo לא מוצא את הקובץ*,
  *ה-Watch Party הסתיים*. After ב, כ, ל the article ה drops (*בשרת*, *לספרייה*,
  *ל-Watch Party*); after מ, ש, ו it stays (*מהשרת*, *מה-Watch Party*). Never write a product
  name in Hebrew letters.
- A label named in a sentence takes a prefix like any Hebrew word (*בהגדרות*, *בדף הבית*). Where
  the label would blend into the sentence, put a noun before it and the label in quotes:
  *מהשורה ”בצפייה”*, *יש לבחור באפשרות ”חיבור טלפון”*.

## Typography

- Text runs right to left and the app sets the direction. Keep Latin names, placeholders and
  numbers as they are, in reading order, and never add bidi control characters (U+200E, U+200F,
  U+202A–U+202E, U+2066–U+2069).
- Start a string with a Hebrew word where it reads naturally: some platforms take a line's
  direction from its first letter, and a line that starts with a Latin name or a placeholder can
  then be laid out left to right. *השרת {server} לא זמין*, not *{server} לא זמין*.
- A path through screens or menus is joined with ←, which points toward the next step in
  right-to-left text: *הגדרות ← כללי ← אזורי דף הבית*. Never → or >, which point back. An arrow
  that names a key on a remote or keyboard stays as the English writes it.
- Punctuation is the Latin set . , : ; ? !, as Hebrew writes it. Quotation marks ”…” (U+201D at
  both ends).
- Geresh ׳ (U+05F3) marks an abbreviation or a borrowed sound: *דק׳*, *שע׳*, *ג׳*, *צ׳*.
  Gershayim ״ (U+05F4) marks an acronym: *בע״מ*, *ארה״ב*. Never the ASCII ' or " for them; an
  ASCII apostrophe also breaks the message format.
- The typographic apostrophe ’ appears only inside Latin text. Write the ellipsis as one
  character …, right after the word (*בטעינה…*).
- After a prefix, before a Latin word, a digit or a placeholder, use the ASCII hyphen - with no
  spaces (*ב-Silo*, *ב-1080p*, *ל-{email}*), not the maqaf ־. A dash between words is an en
  dash with spaces ( – ).

## Vocabulary

- The standard Hebrew interface terms: *הגדרות*, *שרת*, *ספרייה*, *כתוביות*, *הורדה* (to
  download: *להוריד*; the list: *הורדות*), *מכשיר*, *חשבון*, *סיסמה*, *פרופיל*, *משתמש*,
  *אפליקציה*, *קובץ*, *תיקייה*, *התראות*, *חיפוש*, *הפעלה* (play, playback), *השהיה*, *איכות*,
  *רזולוציה*, *מטא-נתונים*, *גיבוי*, *תוסף*, *מטמון* (cache). Keep product and feature names
  from the glossary.
- *התחברות* / *התנתקות* for signing in and out (to sign in: *להתחבר*), *הזרמה* for streaming,
  *המרת קידוד* for transcoding. Technical names stay in Latin letters: *remux*, *worker*,
  *webhook*, *token*, *URL*, *API*.
- *טלפון* for a phone, *טאבלט*, *טלוויזיה* for the TV as a device (*TV* where space is short),
  *שלט* for the remote.
- On TV, prefer *יש לבחור* to *יש ללחוץ*; for a button on the remote, write *יש ללחוץ על OK*. A
  remote button is the object of *ללחוץ על*, not the subject: *יש ללחוץ על החץ ימינה כדי לפתוח
  את החלונית*.

## Terms that depend on context

| English | Hebrew |
|---|---|
| request (a media request, and an HTTP or API request) | *בקשה*; to request: *לבקש* |
| Settings (a screen, tab or menu) / a setting | *הגדרות* / *הגדרה* or *אפשרות* |
| add / delete / remove / clear | *הוספה* / *מחיקה* / *הסרה* / *ניקוי* |
| show (verb) / TV show | *הצגה*, *להציג* / *סדרה* |
| source | *מקור* |
| session (sign-in, playback) | *סשן*; an expired sign-in: *פג תוקף ההתחברות* |
| party (a Watch Party) | *Watch Party*, masculine (*ה-Watch Party הסתיים*); host: *מארח*; guest: *אורח*; participants: *משתתפים* |
| stream (one playback) | *הזרמה* (*2 הזרמות פעילות*); streaming: *הזרמה*; to stream: *להזרים* |
| worker (remote server process) | *worker*, a technical term (*ב-worker*); *צומת* for a node |
| queue / schedule | *תור* / *לוח זמנים*; to schedule: *לתזמן*, *תזמון* |
| sync | *סנכרון*, *לסנכרן* |
| rating (stars) / rating (age) | *דירוג* / *סיווג גיל* |
| cast (people) / cast (to a TV) | *שחקנים* / *העברה* (*העברה לטלוויזיה*) |
| buffering | *בטעינה…* (status); the buffer: *מאגר זמני*; cache: *מטמון* |
| pair (a device) | *צימוד*; to pair: *לצמד* |
| Couldn't… | *לא ניתן היה ל…* (*לא ניתן היה לטעון את הספרייה*); a short title: the verbal noun with *נכשל* or *נכשלה*, agreeing with it (*השמירה נכשלה*, *העדכון נכשל*) |
| Try again (sentence) / Retry (button) | *אפשר לנסות שוב.* / *ניסיון חוזר* |
| Repeat (playback mode) | *חזרה* (never for Retry) |
| Auto (the name of a quality or mode option) | *אוטומטי* |
| play / resume / reload | *הפעלה* / *המשך* / *רענון* |
| seek (moving within playback) | *מעבר* (to seek: *לעבור למיקום אחר*, *לדלג*); while seeking: *מעבר למיקום…*; the seek bar: *סרגל ההתקדמות*. Never *חיפוש*, which is search |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Hebrew column lists forms without prefixes (*שרת*, *ספרייה*), so *בשרת* or *לספרייה* matches.

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
  - `two`: 2
  - `other`: 0, 3, 4, 5, 6, 7, 8, 9, …
  Write `#` where the number goes.
- `one` is the singular noun followed by *אחד* or *אחת*, agreeing with it, without `#`: *פרק
  אחד*, *עונה אחת*, *סרט חדש אחד*. A compact form (a unit abbreviation, *x / y*, a badge) keeps
  `#`: *# דק׳*.
- `two` uses the dual where Hebrew has one, alone, without the number: *שעתיים*, *יומיים*,
  *שבועיים*, *חודשיים*, *שנתיים*, *פעמיים*. Every other noun takes the plural with the number:
  *# פרקים*, *# עונות*.
- `other` is the plural with the number, also for 0 and for 11 and up: *# פרקים*, *# ימים*.
  Adjectives agree: *# פרקים חדשים*, *# עונות חדשות*. Write
  `{count, plural, one {יום אחד} two {יומיים} other {# ימים}}` and
  `{count, plural, one {פרק אחד} two {# פרקים} other {# פרקים}}`.
- A prefix before a number takes a hyphen: *ב-# מכשירים*, *ל-{count_text} פרופילים*.
- A number and its unit are separated by a space: *24 שע׳*, *2 שע׳ 4 דק׳*, *45 שנ׳*, *211 ms*,
  *7 ימים*, also after a number placeholder (*{minutes} דק׳*). A percentage has no space
  (*50%*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Hebrew is usually shorter than English, since vowels aren't written, but the verbal nouns and
*יש ל* phrases add words. Keys with `maxLength` appear on TV and small controls. Stay within it:
drop *את*, the article or the object first (*שמירה* rather than *שמירת השינויים*), and never
shorten a word with a geresh, except the standard units (*דק׳*, *שע׳*, *שנ׳*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *ע{season}פ{episode}*,
*ע{season} · פ{episode}*, *ע{season}:פ{episode}*, *פ{episode}* (ע for עונה, פ for פרק, as
Disney+ writes them in Hebrew; no geresh after the letter), never Latin S or E. Keep the English
separators (none, · or :). Spelled out, a season is *עונה* and an episode *פרק*: *עונה 2, פרק 3*,
with digits, never Hebrew letters as numbers (*עונה ב׳*).
