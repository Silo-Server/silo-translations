# Russian (ru)

## Voice

- Address the user as **вы**, lowercase, as Apple, Google and Netflix do in Russian: *Войдите*,
  *Выберите профиль*, *Повторите попытку*. Never *ты*, and never a capitalized *Вы*. The
  formal plural verb forms are also gender-neutral (*вы вошли*, *вы добавили*), so prefer them
  to impersonal past tenses where the English says "you".
- Buttons, menu items and the choices of a picker use the perfective infinitive, consistently
  with the strings beside them: *Отменить*, *Сохранить*, *Повторить*, *Использовать настройки
  субтитров*. Instructions in sentences use the вы imperative: *Выберите медиатеку*. A
  standalone tab or screen name is a noun (*Настройки*, *Загрузки*, *Главная*).
- An on/off value is *Вкл.* / *Выкл.*, whatever it switches. Where it reads as a state in a
  sentence or a status line, *включено* / *выключено*, agreeing with its noun.
- Status words on one screen use the same form: a request's status is a short neuter past
  participle (*Запрошено*, *Одобрено*, *Отклонено*, *Ошибка*), also in titles and labels on the
  same screen. In-progress states use the noun or present form the platforms use: *Загрузка…*,
  *Буферизация…*, *Обработка…*.
- Sentence case, like the English. Russian capitalizes only the first word and proper names;
  never Title Case. Feature names keep their own capitals (*Watch Party*, *Autoscan*). English
  all-caps labels stay all caps (*LIVE*); a Russian replacement for one is all caps too
  (*В ЭФИРЕ*) only when the English is all caps.
- A library type or tab name used as a common noun inside a sentence is written as the common
  noun in its case (*нет медиатек с фильмами*), not quoted as the tab name. When a sentence
  names a screen, button or setting, quote its label in «…» in the nominative, and let a
  governing word take the case: *в разделе «Настройки»*, *нажмите «Сохранить»*.
- Quotation marks «…»; inside them, „…“. Write the ellipsis as one character …. Use the em dash
  with spaces ( — ) for a dash and the en dash without spaces for ranges (*5–10*). The letter ё
  is written where the word has it (*ещё*, *всё*, *учётная*), as the platforms do.
- Be gender-neutral. Russian past tenses and short adjectives agree with gender, and a
  placeholder can be anyone. Don't write *присоединился(-ась)* or slashes. Instead:
  - put the person in apposition to a noun that fixes the agreement: *Пользователь {name}
    присоединился к Watch Party*, *Участник {name} вышел*;
  - or use a construction without a gendered verb: *{name}: подключение к Watch Party*,
    *{name} в Watch Party*, *Новый участник: {name}*.
  Host of a party is *организатор*, a guest is *гость*, a viewer is *зритель*.

## Placeholders and case

Russian nouns decline, and a placeholder always arrives in the nominative. Build the sentence so
the inserted text can stay nominative:
- put a name after a governing noun or a colon: *в медиатеке «{library}»*, *Сервер: {server}*,
  *Не удалось удалить файл {file}*;
- quote titles of media and other user content in «…» after a noun when the grammar needs a
  case: *Удалить фильм «{title}»?*;
- don't put an adjective or a verb whose ending depends on the placeholder's gender or number
  right next to it.

## Vocabulary

- Established Russian UI terms where the platforms use them: *Настройки*, *субтитры*,
  *медиатека*, *скачать*, *воспроизведение*. Keep product and feature names from the glossary.
- *телефон* for a phone (*смартфон* only where the English says smartphone), *планшет*,
  *телевизор* for the TV as a device (*ТВ* where space is short), *пульт* for the remote.
- On TV, prefer *Выберите* to *Нажмите*; for a button on the remote, write *Нажмите OK*. A
  remote button is the object of *Нажмите*, not the subject: *Нажмите «Вправо», чтобы открыть
  панель*.
- IT words Russian uses as loanwords stay as Russian loanwords, in Cyrillic: *сервер*,
  *аккаунт*, *плагин*, *стриминг*, *транскодирование*, *кеш*, *логи* (*журнал* for a log
  screen). Prefer a native word where the platforms use one: *резервная копия* over *бэкап*,
  *загрузка* over *аплоад*, *ссылка* over *линк*.
- Download is *скачать*, *скачивание*; the list of downloaded items is *Загрузки*, as on
  Netflix and Android.

## Terms that depend on context

| English | Russian |
|---|---|
| request (a media request, and an HTTP or API request) | *запрос*; to request: *запросить* |
| Settings (a screen, tab or menu) / a setting | *Настройки* / *настройка* or *параметр* |
| add / delete / remove / clear | *добавить* / *удалить* / *удалить* or *убрать* (from a list) / *очистить* |
| show (verb) / TV show | *показать*, *показывать* / *сериал* |
| episode | *серия* (as on Netflix and Kinopoisk), not *эпизод* |
| series of books (audiobooks, manga) | *цикл*, *циклы*, never *серия*, which is an episode; a TV series is *сериал* |
| source | *источник* |
| session (sign-in, playback) | *сеанс* |
| party (a Watch Party) | *Watch Party* (feminine where it needs a gender: *ваша Watch Party*); host: *организатор*; guest: *гость* |
| stream (one playback) | *поток* (a media or network stream), *трансляция* for live; streaming: *стриминг*; to stream: *транслировать* |
| worker (remote server process) | *воркер*, a technical term; *узел* for a node |
| queue / schedule | *очередь* / *запланировать*, *расписание* |
| sync | *синхронизировать*, *синхронизация* |
| rating (stars) / rating (age) | *оценка*, *рейтинг* / *возрастной рейтинг* |
| cast (people) | *актёры*, *в ролях* |
| buffering | *Буферизация…* (status) |
| pair (a device) | *привязать*, *привязка* |
| Couldn't… | *Не удалось …* (*Не удалось загрузить медиатеку*) |
| Try again (sentence) / Retry (button) | *Повторите попытку.* / *Повторить* |
| Auto (the name of a quality or mode option) | *Авто*, also inside a sentence (*качество «Авто»*); *Автоматически* where a full word fits |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
resolutions (*1080p*, *4K*), codec, protocol and format names (in their usual capitals, *HTTP*,
*HLS*, *HEVC*, even where the English lowercases them), and keyboard keys (*Space*, *Enter*).
Product and brand names stay in Latin letters; never transliterate them.

Units are written the Russian way, as the platforms do: *ГБ*, *МБ*, *ТБ*, *Мбит/с*, *кбит/с*,
*мс*, *Гц*. Units that are part of input syntax, code or a setting value stay as written.

When a sentence names another screen, button, row, task or setting, use the Russian label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one few many other`. For whole numbers:
  - `one`: 1, 21, 31 … 101 (but not 11): nominative singular, *# серия*, *# фильм*;
  - `few`: 2–4, 22–24 … (but not 12–14): genitive singular, *# серии*, *# фильма*;
  - `many`: 0, 5–20, 25–30, 11–14, 111 …: genitive plural, *# серий*, *# фильмов*;
  - `other`: fractions only (1,5): genitive singular, *# серии*, *# фильма*. It never shows for
    a whole count, but every plural must still carry it.
  Adjectives and verbs agree in each form: *Выбрана # серия*, *Выбрано # серии*, *Выбрано #
  серий*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- A number outside a plural (a placeholder in plain text) can't decline its noun. Rephrase so
  the noun doesn't depend on it: *Серий: {count}*, *Осталось: {count}*.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 ч*, *2 ч 4 мин*, *45 с*, *211 мс*,
  *7 дн.*, also after a number placeholder (*{minutes} мин*). Abbreviations without a period:
  *ч*, *мин*, *с*, *мс*; with a period: *дн.*, *нед.*, *мес.* In a short title where a line
  break would strand the unit, use a no-break space (U+00A0). An example of what to type into a
  field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Russian runs 15–30% longer than English. Keys with `maxLength` appear on TV and small controls.
Stay within it: choose a shorter synonym (*Смотреть* over *Воспроизвести* on a short Play button),
drop the object before abbreviating, and use the platforms' common abbreviations (*Вкл.*,
*Выкл.*, *мин*) only when nothing shorter fits.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}*, in Latin letters as the
English writes them. Cyrillic *С* would stand for both *сезон* and *серия*. Keep the English
separators (none, · or :). Written out, a season or episode is *Сезон {season}*,
*Серия {episode}*.
