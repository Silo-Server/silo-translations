# Bulgarian (bg)

## Voice

- Write standard Bulgarian, never Russian words, spellings or letters (see the table below).
- Address the user as **вие**, with plural verb forms, as Google and Netflix do in Bulgarian:
  *Влезте*, *Изберете профил*, *Опитайте отново*. Never *ти*. Write *вие*, *ваш*, *ви*
  lowercase; a capital *Вие* belongs in letters, not in an interface.
- Bulgarian has no infinitive. Buttons, menu items and the choices of a picker are verbal nouns
  or nouns, as in Google's Bulgarian interfaces: *Запазване*, *Изтриване*, *Редактиране*,
  *Отказ*, *Нов опит*, *Вход*, *Изход*, *Възпроизвеждане*. Never mix in a singular imperative
  (*Запази*) beside them. Names of settings, screens and tabs are nouns (*Възпроизвеждане*,
  *Субтитри*, *Качество на потока*). Instructions in sentences use the *вие* imperative:
  *Изберете библиотека*.
- An on/off value is *Включено* / *Изключено*, whatever it switches (*Вкл.* / *Изкл.* only where
  `maxLength` forces it).
- Progress states use the present tense with *се* and an ellipsis, so they don't read as
  buttons: *Зарежда се…*, *Свързва се…*, *Изтегля се…*. The verb agrees with a named subject:
  *Зареждат се епизодите…*.
- Status words on one screen use the same form: a request's status is a neuter participle
  (*Заявено*, *Одобрено*, *Отхвърлено*, *Неуспешно*), also in titles and labels on the same
  screen.
- Sentence case, like the English. Bulgarian lowercases languages, months and days inside a
  sentence (*български*, *в понеделник*, *15 ноември*). Feature names keep their own capitals
  (*Watch Party*, *Autoscan*). English all-caps labels stay all caps (*LIVE*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*няма
  библиотеки с филми*), not quoted as the tab name. When a sentence names a screen, button or
  setting, quote its label in „…“ after a noun that carries the article: *бутона „Запазване“*,
  *в екрана „Начало“*.
- Be gender-neutral. The aorist has no gender, and *вие* takes plural verb forms: *Влязохте*,
  *Излязохте от акаунта си*, *{name} се присъедини към Watch Party*, *{name} напусна*. Avoid
  adjectives and passive participles about a person, which mark gender (*Сигурен ли сте?*,
  *{name} е поканен*): write *Наистина ли искате да изтриете профила?*, *Поканата е изпратена*.
  Role nouns use the generic masculine (*потребител*, *администратор*, *домакин*, *гост*); never
  slashes (*потребител/ка*).
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says.

## Placeholders and grammar

Bulgarian nouns have no cases, but definiteness is a suffix (*-ът/-ят*, *-а/-я*, *-та*, *-то*,
*-те*), and adjectives, participles and the perfect tense agree with a noun's gender and number.
A placeholder can take neither, and its gender is unknown.

- Never attach an article or an ending to a placeholder or a Latin name (*{server}-ът*,
  *{library}та*, *Plex-а*, *Silo-то*). Put a carrier noun before it and give that noun the
  article: *Сървърът {server} не отговаря*, *в библиотеката {library}*, *Профилът {profile} е
  изтрит*.
- Let adjectives and participles agree with the carrier noun (*Елементът {title} е изтрит*), put
  the value after a colon (*Изтрито: {title}*, *Сървър: {server}*), or use a form without
  gender. Confirmations take *Да се … ли …?*: *Да се изтрие ли {title}?*.
- A masculine noun takes the full article *-ът/-ят* as the subject and the short *-а/-я*
  everywhere else, also on an adjective in front: *Сървърът не отговаря* / *Свържете се със
  сървъра*; *Избраният профил е изтрит* / *в избрания профил*.
- *с* becomes *със* before *с* or *з*, and *в* becomes *във* before *в* or *ф* (*със сървъра*,
  *във вашия профил*). Before a placeholder, a carrier noun decides: *с профила {name}*, *в
  устройството {device}*.
- Product and service names stay in Latin letters without an article: *в Plex*, *сървърът
  Plex*, *в приложението Silo*, *от TMDB*. *Watch Party* is neuter (*Watch Party приключи*,
  *това Watch Party*).
- A number placeholder outside a plural can't choose the noun form: write *Епизоди: {count}*.
  A date or time placeholder may stand anywhere.

## Typography

- Quotation marks „…“ (low, then high).
- Write the ellipsis as one character …, directly after the word (*Зарежда се…*), also where the
  English types three dots.
- Use the typographic apostrophe ’, never '; it appears only in Latin names.
- A dash between parts of a sentence is an en dash with spaces ( – ); a range takes an en dash
  without spaces (*5–10*).
- The short pronoun "her" is written *ѝ*, never *и* (which means "and"): *в профила ѝ*.
- Time units are Bulgarian, after a space: *24 ч*, *2 ч 4 мин*, *45 сек*, *211 мс*, *7 дни*,
  also after a number placeholder (*{minutes} мин*). Data and bit-rate units stay as written
  (*GB*, *Mbps*). The percent sign is written without a space (*{percent}%*). In a short title
  where a line break would strand the unit, use a no-break space (U+00A0).

## Vocabulary

- Established Bulgarian UI terms, as Google and Netflix use them: *Настройки*, *сървър*,
  *библиотека*, *субтитри*, *изтегляне* (*Изтеглени* for the list of downloads), *устройство*,
  *акаунт*, *парола*, *профил*, *потребител*, *възпроизвеждане*, *търсене*, *известие*. A
  *профил* is a Silo profile only; the account is always *акаунт*.
- *телефон* for a phone, *таблет*, *телевизор* for the TV as a device (*ТВ* where space is
  short), *дистанционно* for the remote.
- On TV, prefer *Изберете* to *Натиснете*; for a button on the remote, write *Натиснете OK*. A
  remote button is the object of *Натиснете*, not the subject: *Натиснете надясно, за да
  отворите панела*.
- IT loanwords are written in Cyrillic as Bulgarian spells them: *сървър*, *стрийминг*,
  *плъгин*, *кеш*, *токен*, *уебхук*, *трейлър*. Use the Bulgarian word where the platforms do:
  *резервно копие* (backup), *транскодиране*, *метаданни*, *дневник* (a log). Product, protocol
  and format names stay in Latin letters; never transliterate them.

Bulgarian, not Russian. A model tends to mix these in; always use the left column. Bulgarian has
no *ы*, *э* or *ё*; *ъ* is a vowel (*сървър*, *път*), and *ь* stands only before *о* (*шофьор*).

| Bulgarian (use) | Russian (never) |
|---|---|
| *изтриване*, *запазване*, *отказ* | *удаление*, *сохранение*, *отмена* |
| *потребител*, *грешка*, *търсене*, *известие* | *пользователь*, *ошибка*, *поиск*, *уведомление* |
| *изтегляне* (download), *зареждане* (loading) | *загрузка*, *скачивание* |
| *гледане*, *епизод* | *просмотр*, *серия* (for an episode) |
| *Опитайте отново.*, *Не можа да се …* | *Повторите попытку.*, *Не удалось …* |
| *сега*, *още*, *вече*, *само*, *отново*, *който* | *сейчас*, *ещё*, *уже*, *только*, *снова*, *который* |

## Terms that depend on context

| English | Bulgarian |
|---|---|
| request (a media request) / an HTTP or API request | *заявка* (*заявка за съдържание* where it must be told apart); to request: *заявете*, *заявяване* / *заявка* |
| Settings (a screen, tab or menu) / a setting | *Настройки* / *настройка* or *опция* |
| add / delete / remove / clear | *добавяне* / *изтриване* / *премахване* / *изчистване* |
| show (verb) / TV show | *показване*, *покажете* / *сериал* |
| series of books (audiobooks, manga) | *поредица* |
| source | *източник* |
| session (sign-in, playback) | *сесия* |
| party (a Watch Party) | *Watch Party* (no article, neuter); host: *домакин*; guest: *гост* |
| stream (one playback) | *поток*; streaming: *стрийминг* (*поточно предаване* in settings); to stream: *предава поточно* (*Silo предава поточно към ТВ*) |
| worker (remote server process) | *worker*, a technical term in Latin letters; *възел* for a node |
| queue / schedule | *опашка* / *насрочване*, *график* |
| sync | *синхронизиране*, *синхронизация* |
| rating (stars) / rating (age) | *оценка* / *възрастово ограничение* |
| cast (people) | *актьорски състав* |
| buffering | *Буферира се…* (status) |
| pair (a device) | *сдвояване*, *сдвоете* |
| admin (a person) | *администратор* |
| Couldn't… | *Не можа да се …* (*Не можа да се зареди библиотеката*) or *Неуспешно …* (*Неуспешно запазване*) |
| Try again (sentence) / Retry (button) | *Опитайте отново.* / *Нов опит* |
| Auto (the name of a quality or mode option) | *Автоматично*, also inside a sentence (*качество „Автоматично“*); *Авто* only where space is short |
| seek (moving within playback) / search | *превъртане*, *превъртете*, *прескачане* (*Само домакинът може да превърта.*) / *търсене*; seeking is never *търсене* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

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
- The noun form of each category:
  - `one`: the singular (*# епизод*, *# книга*, *# устройство*).
  - `other`: after a number, a masculine noun for a thing takes the counted form in *-а/-я*, not
    the plural: *# епизода*, *# сезона*, *# филма*, *# профила*, *# сървъра*, *# часа*; never
    *# епизоди*, *# филми*. Feminine and neuter nouns take the ordinary plural (*# книги*,
    *# минути*, *# устройства*), and so do masculine nouns for people (*# потребители*,
    *# зрители*). *ден* becomes *# дни*.
  - `{count, plural, one {# епизод} other {# епизода}}`.
- Adjectives before a counted form and participles are plural: *# нов епизод* / *# нови
  епизода*; *Изтеглен е # епизод* / *Изтеглени са # епизода*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Bulgarian runs 20–30% longer than English, and verbal nouns are long. Keys with `maxLength`
appear on TV and small controls. Stay within it: choose a shorter word (*Пускане* over
*Възпроизвеждане* on a short Play button, *Още* for "More"), drop *ви*, *си* or an object, and
write *ТВ* for *телевизор*. Use the standard abbreviations (*Вкл.*, *Изкл.*, *мин*, *ч*) only
where nothing shorter reads naturally.

## Season and episode codes

A season is *сезон* and an episode is *епизод*. Every season and episode code uses the same
letters across the catalog (codes, tags, captions, play buttons, Watch Party lines,
notifications, admin pages): *С{season}Е{episode}*, *С{season} · Е{episode}*,
*С{season}:Е{episode}*, *Е{episode}*, in Cyrillic (С for сезон, Е for епизод), never Latin S, C
or E. Keep the English separators (none, · or :). Spelled out, write *Сезон {season}*, *Епизод
{episode}*, *Сезон {season}, епизод {episode}*; an episode is never *серия*. A box set is
*филмова поредица*.
