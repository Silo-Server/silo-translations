# Arabic (ar)

## Voice

- **Modern Standard Arabic**, no dialect. Address the user in the masculine-neutral imperative
  common in software (*سجّل الدخول*، *اختر ملفًا شخصيًا*، *حاول مرة أخرى*) unless a
  gender-neutral noun phrase reads naturally. Never the plural imperative: text that speaks to a
  group still addresses the reader, or uses a verbal noun (*المشاهدة معًا من أي مكان*).
- Buttons, menu items and the choices of a picker use verbal nouns (مصدر), consistently with the
  strings beside them: *إلغاء*، *حفظ*، *إعادة المحاولة*، *استخدام تفضيلات الترجمة*. Instructions
  in sentences use the imperative: *اختر مكتبة*.
- An on/off value is *مفعّل* / *معطّل*.
- Agreement follows the noun the reader sees: a request's status agrees with *الطلب*
  (masculine: *مطلوب*، *تمت الموافقة*، *مرفوض*، *فشل*، *مكتمل*), also in titles and labels on the
  same screen.
- Feature names keep their glossary form (*Watch Party*، *Autoscan*). English all-caps labels
  become the normal Arabic word (*مباشر*).

## Typography and direction

- The text is laid out right to left. Keep Latin product names and placeholders as they are;
  don't add bidi control characters.
- Arabic punctuation inside Arabic text: the comma ،, the semicolon ؛ and the question mark ؟.
  No Latin `,` `;` `?` inside Arabic sentences. A full stop is `.`. Quotation marks « ».
- Don't add tatweel (ـ) or decorative diacritics; use shadda and tanween only where they prevent a
  misreading (*ملفًا*).

## Vocabulary

- *الهاتف* for a phone, *الجهاز اللوحي*, *التلفزيون* for the TV as a device, *جهاز التحكم عن
  بُعد* for the remote.
- On TV, prefer *اختر* to *اضغط*; for a button on the remote, write *اضغط على OK*. A remote
  button is the object of *اضغط على*: *اضغط على السهم الأيمن لفتح اللوحة*.

## Terms that depend on context

| English | Arabic |
|---|---|
| request (a media request, and an HTTP or API request) | *طلب*؛ to request: *طلب* (verb *اطلب*) |
| Settings (a screen, tab or menu) / a setting | *الإعدادات* / *إعداد* or *خيار* |
| add / delete / remove / clear | *إضافة* / *حذف* / *إزالة* / *مسح* |
| show (verb) / TV show | *عرض* / *مسلسل* |
| source | *المصدر* |
| session (sign-in, playback) | *الجلسة* |
| party (a Watch Party) | *Watch Party*; host: *المضيف*; guest: *الضيف* |
| stream (one playback) | *البث*؛ streaming: *البث* |
| worker (remote server process) | *العامل* (worker), a technical term; *العقدة* for a node |
| queue / schedule | *قائمة الانتظار* / *جدولة* |
| sync | *مزامنة* |
| rating (stars) / rating (age) | *التقييم* / *التصنيف العمري* |
| cast (people) | *طاقم التمثيل* |
| buffering | *جارٍ التخزين المؤقت* |
| pair (a device) | *إقران* |
| Couldn't… | *تعذّر …* |
| Try again (sentence) / Retry (button) | *حاول مرة أخرى.* / *إعادة المحاولة* |
| Auto (the name of a quality or mode option) | *تلقائي* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Arabic label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: all six categories `zero one two few many other`, in every plural key. CLDR picks
  them by the number modulo 100: `zero` for 0, `one` for 1, `two` for 2, `few` when it ends in
  03–10 (3–10, 103–110, …), `many` when it ends in 11–99 (11–99, 111–199, …), and `other` for
  the rest (100–102, 200–202, … and fractions). Use the dual for `two` (*موسمان*), the plural
  with the counted noun in `few` (*# مواسم*), the singular accusative in `many` (*# موسمًا*),
  and the singular genitive in `other` (*# موسم*). `zero`, `one` and `two` may leave the number
  out (*لا مواسم*، *موسم واحد*، *موسمان*; see the dual rule below); `few`, `many` and `other` keep
  the number, as `#` or as `{count_text}` where the English prints that.
- Western digits come from the app's number formatting; don't convert digits by hand.
- A number and its unit are separated by a space and the unit agrees with the number in each
  plural form: *24 ساعة*، *5 دقائق*، *45 ثانية*. In compact strings (a countdown, a table cell)
  use the abbreviations *س* (hour), *د* (minute), *ث* (second), *ي* (day) and keep *ms* as
  written. An example of what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and
  stays exactly as written.

## Length

Keys with `maxLength` appear on TV and small controls. Stay within it: choose a shorter word over
an abbreviation, and drop the article where the phrase still reads correctly.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *م{season}ح{episode}*, *م{season} · ح{episode}*, *م{season}:ح{episode}*, *ح{episode}*, never Latin S or E. Keep the English separators
(none, · or :).

## Paths and the dual (pass 5)

- A path through screens or menus is joined with *←*, which points toward the next step in
  right-to-left text on every platform: *الإعدادات ← عام ← أقسام الرئيسية*. Never *→* or *>*:
  Android draws *>* unmirrored, so it points back toward the previous step.
- In `two`, use the dual noun alone, without the number: *طلبان قيد التنفيذ*, *مساران*,
  *في مجموعتين*, *حلقتان*. The dual already says "two", so *2 طلبان* repeats it, and a number
  next to a singular noun (*2 حلقة*) is wrong. Keep the number in `two` only where there is no
  noun to put in the dual: a bare count, *x / y*, or an abbreviation (*قبل # ي*).
