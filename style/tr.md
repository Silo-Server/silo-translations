# Turkish (tr)

## Voice

- Address the user with the polite **siz** forms that Apple, Google and Netflix use in their
  Turkish interfaces: *Bir profil seçin*, *Tekrar deneyin*, *Hesabınıza giriş yapın*. Never the
  familiar *sen* forms in sentences (*seç*, *hesabın*). Possessives follow: *profiliniz*,
  *cihazınız*, *kitaplığınız*. Text that speaks to a group still addresses the reader, or uses
  a verbal noun (*Nerede olursanız olun birlikte izleyin*).
- Buttons, menu items and the choices of a picker use the bare verb stem, as Apple's and
  Google's Turkish buttons do, consistently with the strings beside them: *İptal*, *Kaydet*,
  *Sil*, *Yeniden dene*, *Altyazı ayarlarını kullan*. Instructions in sentences use the siz
  imperative (*-in*, *-ın*, *-un*, *-ün*): *Bir kitaplık seçin*.
- An on/off value is *Açık* / *Kapalı*, whatever it switches.
- Status words on one screen use the same form: a request's status is a past participle or a
  short noun (*İstendi*, *Onaylandı*, *Reddedildi*, *Başarısız*), also in titles and labels on
  the same screen.
- Sentence case, like the English. Feature names keep their own capitals (*Watch Party*,
  *Autoscan*). English all-caps labels stay all caps (*CANLI* for LIVE).
- Turkish has a dotted and a dotless i, and they are different letters: *i*/*İ* and *ı*/*I*.
  Capitalize *i* as *İ* (*İptal*, *İndir*, *İzleme listesi*), and *ı* as *I* (*Işık*). Never write
  *Iptal* or *Indir*.
- A library type or tab name used as a common noun inside a sentence is lowercase (*film
  kitaplığı yok*), not quoted as the tab name.
- Quotation marks “…”. Write the ellipsis as one character …. Use the typographic apostrophe ’,
  which also separates a suffix from a proper name (*Silo’ya*, *Plex’ten*, *Apple TV’de*).
- Turkish has no grammatical gender and *o* covers he, she and it. Keep it that way: *kişi*,
  *misafir*, *partiyi başlatan kişi*; avoid *bay*/*bayan*.

## Suffixes after placeholders

Case and possessive suffixes follow vowel harmony and the last sound of the word they attach to
(*Plex’e* but *Jellyfin’e*, *Emby’ye*, *Roku’dan* but *Plex’ten*). A placeholder's value is not
known when you translate, so a suffix written after it is wrong for many values.

- Don't attach a suffix to a placeholder: not *{server}’a*, *{name}’in*, *{count}’te*.
- Put a noun after the placeholder and attach the suffix to that noun: *{server} sunucusuna
  bağlanılamadı*, *{name} adlı profil silindi*, *{title} içeriği listeye eklendi*, *{device}
  cihazında oynatılıyor*.
- Or move the placeholder where it needs no suffix: a list or a label after a colon (*Bağlanılamadı:
  {server}*), or the subject of the sentence in its bare form (*{name} katıldı*).
- A number placeholder takes no suffix either: *{count} öğe*, *{minutes} dk sonra*. An ordinal
  dot after a number is fine: *{season}. sezon*.
- A fixed proper name written in the translation (*Silo*, *Plex*, *Roku*) takes its suffix after an
  apostrophe in the correct harmony: *Silo’ya*, *Plex’e*, *Roku’da*.

## Vocabulary

- Standard Turkish UI terms as Apple, Google and Netflix use them: *Ayarlar*, *altyazı*,
  *kitaplık*, *indir*, *sunucu*, *hesap*, *bölüm*, *sezon*, *dizi*. Keep product and feature names
  from the glossary.
- *telefon* for a phone, *tablet*, *TV* or *televizyon* for the television as a device (*TV* where
  space is short), *kumanda* for the remote.
- On TV, prefer *Seçin* to *Basın*; for a button on the remote, write *OK düğmesine basın*. A
  remote button is the object of *basın*, with *düğmesine* carrying the suffix: *Paneli açmak
  için Sağ düğmesine basın*.
- Use Turkish words for IT terms where Turkish platforms do: *sunucu* (server), *akış* (stream),
  *yedek*, *yedekleme* (backup), *eklenti* (plug-in), *günlük* (log), *önbellek* (cache),
  *parola* (password). Keep the English term where Turkish UIs keep it: *Wi-Fi*, *Remux*, *PIN*,
  *URL*, *API*, *token* only in admin text.
- *Section* of a screen is *kısım*; keep *bölüm* for an episode.

## Terms that depend on context

| English | Turkish |
|---|---|
| request (a media request) / an HTTP or API request | *istek*; to request: *istemek*, *istek göndermek* / *istek* |
| Settings (a screen, tab or menu) / a setting | *Ayarlar* / *ayar* or *seçenek* |
| add / delete / remove / clear | *ekle* / *sil* / *kaldır* / *temizle* |
| show (verb) / TV show | *göster* / *dizi* |
| source | *kaynak* |
| session (sign-in, playback) | *oturum* |
| party (a Watch Party) | *Watch Party*; host: *ev sahibi* or *partiyi başlatan kişi* (never *sunucu*, which is the server); guest: *misafir* |
| stream (one playback) | *akış*; streaming: *akış*; to stream: *akış yapmak* |
| worker (remote server process) | *worker*, a technical term; *düğüm* for a node |
| queue / schedule | *kuyruk*, *sıra* / *zamanla*, *zamanlama* |
| sync | *eşitle*, *eşitleme* |
| rating (stars) / rating (age) | *puan* / *yaş sınırı* |
| cast (people) | *oyuncular* |
| buffering | *Arabelleğe alınıyor* (status) |
| seek (move to another point in playback) / search (find by name) | *sarma*, *ileri veya geri sarmak*, *konuma atlamak* (*Sarma önbelleği*, *Sarılıyor*); never *arama* or *aranıyor* for a seek / *ara*, *arama* |
| pair (a device) | *eşle*, *eşleme* |
| sign in / sign out | *oturum aç* / *oturumu kapat* |
| Couldn't… | *… yapılamadı* (passive impossibility: *Yüklenemedi*, *Kaydedilemedi*) |
| Try again (sentence) / Retry (button) | *Tekrar deneyin.* / *Yeniden dene* |
| Auto (the name of a quality or mode option) | *Otomatik*; inside a sentence that names the option, quote it: *“Otomatik” kalite …* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*, even where the English lowercases them), and keyboard keys
(*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Turkish label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: `one other`. A Turkish noun stays singular after a number or a quantity word: *1
  bölüm*, *3 bölüm*, *birkaç film*, never *3 bölümler*. So both forms usually carry the same
  noun: `{count, plural, one {# bölüm} other {# bölüm}}`. Keep both categories even when they are
  identical; the check requires them.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators.
- A number and its unit are separated by a space: *24 sa*, *2 sa 4 dk*, *45 sn*, *211 ms*,
  *7 gün*, also after a number placeholder (*{minutes} dk*). Never *m* for minutes. In a short
  title where a line break would strand the unit, use a no-break space (U+00A0). An example of
  what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.
- Turkish writes the percent sign before the number: where the English writes `{percent}%` as
  text, write `%{percent}`.

## Length

Turkish runs long: suffixes stack, and many English one-word labels need two Turkish words. Keys
with `maxLength` appear on TV and small controls. Stay within it: choose a shorter word over an
abbreviation, drop *lütfen* and possessive suffixes the context makes obvious (*Ayarlar*, not
*Ayarlarınız*), and use the bare stem form for labels.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}B{episode}*,
*S{season} · B{episode}*, *S{season}:B{episode}*, *B{episode}* (S for sezon, B for bölüm, never E).
Keep the English separators (none, · or :). A spelled-out label is *Sezon {season}* and
*Bölüm {episode}*; in running text, *{season}. sezon*, *{episode}. bölüm*.
