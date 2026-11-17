# Malay (ms)

Write standard Malaysian Malay, spelled as Dewan Bahasa dan Pustaka spells it, as Apple, Google
and Netflix write it in their Malay apps. It is not Indonesian: an Indonesian word (*unduh*,
*pengaturan*, *kata sandi*) in a Malay string is a mistake. The table under Vocabulary lists the
pairs.

## Voice

- Address the user as *anda*, lowercase mid-sentence and as a possessive (*profil anda*), as
  Malay spells it and Apple, Google and Netflix write it. Never *kamu*, *awak*, *engkau* or
  *tuan/puan*, and never the Indonesian capital *Anda* mid-sentence. Leave the pronoun out
  wherever the sentence works without it: *Pilih profil*, *Log masuk untuk meneruskan*, *Profil
  dipadam*.
- Buttons, menu items and the choices of a picker are short base-form imperatives, consistently
  with the strings beside them: *Simpan*, *Batal*, *Padam*, *Cuba lagi*, *Tambah ke senarai
  tontonan*. Never add *-lah*, *sila* or *anda* to a button. Instructions in sentences use the
  same imperative (*Pilih pustaka.*); *Sila* only where the English says please.
- Labels of a setting, a toggle or a picker are noun phrases (*Main automatik*, *Saiz sari
  kata*), not imperatives.
- An on/off value is *Hidup* / *Mati*, whatever it switches.
- Progress states use the active *me-* verb and the ellipsis: *Memuatkan…*, *Menyambung…*.
  Status words on one screen use the same form: a finished action is the passive *di-* verb
  (*Disimpan*, *Dipadam*), and a request's status is *Diminta*, *Diluluskan*, *Ditolak*, *Gagal*
  or *Selesai*, also in titles and labels on the same screen.
- Sentence case, like the English. Days, months and language names are capitalized, *bahasa* is
  not: *Isnin*, *Januari*, *bahasa Inggeris*. Feature names keep their own capitals (*Watch
  Party*, *Autoscan*). English all-caps labels stay all caps (*BAHARU*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*Belum ada
  pustaka filem*), not quoted as the tab name.
- Malay has no grammatical gender; *dia* and *mereka* cover everyone. Name people by role:
  *pengguna*, *tetamu*, *peserta*, *hos*.
- Standard written Malay, never colloquial (*tak*, *dah*, *nak*, *je*, *kat*): *tidak*, *sudah*,
  *mahu*, *sahaja*, *di*. *Boleh* is "can"; *tidak dapat* is "couldn't".
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says: *Anda log masuk dengan
  {provider}, dan hanya melalui alamat {provider}* keeps both *dengan {provider}* and *hanya*.

## Placeholders and grammar

Malay has no case endings, articles, gender or agreement, so a placeholder's unseen value doesn't
change the words around it. Watch word order, affixes and the choice of preposition.

- The head noun comes first; what describes or owns it follows: *Profil {name}*, *Pustaka
  {library}*, *{count} episod baharu*. Never the English order (*{name} profil*) or a copied
  *’s*.
- Affixes and the clitics *-nya*, *-ku*, *-mu* attach only to Malay words, never to a
  placeholder or a name: not *{title}nya*, *{provider}-nya*, *Silonya*. Name the thing instead
  (*Penerangan {title}*, *pelayan Silo*) or use *ini*/*itu*.
- Prepositions are separate words. *di* and *ke* are for places (*di {device}*, *ke {server}*),
  *kepada* for a person (*Dihantar kepada {user}*). *dari* is for a place or a time (*dari
  {date}*), *daripada* for a person, a service or a source (*Diimport daripada {provider}*). The
  passive prefix *di-* is joined to its verb (*dimainkan*).
- Where the value alone wouldn't say what it is, put a generic noun before it (*pelayan*,
  *pustaka*, *profil*, *peranti*, *pengguna*): *Tidak dapat menyambung ke pelayan {server}*. Or
  let the placeholder stand alone, as the subject or after a colon: *{user} telah menyertai*,
  *Pelayan: {server}*.
- A person's name stands as it is, without *Encik*, *Puan* or *Tuan*; refer back with the name or
  *dia*.
- Leave *a*, *an* and *the* untranslated (*Pilih profil*, not *Pilih sebuah profil*). *This* and
  *that* are *ini* and *itu* after the noun (*profil ini*).
- A confirmation is a short question: *Padam profil ini?* Write *Adakah anda pasti …?* only where
  the English asks "Are you sure".

## Typography

- Quotation marks “…”, nested ‘…’. Write the ellipsis as one character …, never three periods.
- Use the typographic apostrophe ’, never '. Malay words almost never need one (names such as
  *O’Brien*).
- Punctuation as in English: no space before ? ! : ;. Sentences end with a period; buttons,
  labels, titles and list items have none.
- A number and its unit are separated by a space: *24 jam*, *2 j 4 min*, *45 saat*, *7 hari*,
  *211 ms*, also after a number placeholder (*{minutes} min*). Never *m* for minutes. Percent
  takes no space: *50%*. In a short title where a line break would strand the unit, use a
  no-break space (U+00A0).

## Vocabulary

- Standard UI words as Apple, Google and Netflix use them: *Tetapan*, *pelayan*, *pustaka*,
  *sari kata*, *muat turun*, *peranti*, *akaun*, *kata laluan*, *pengguna*, *profil*, *main*
  (play), *jeda*, *sambung semula* (resume), *langkau* (skip), *sejarah*, *pratonton*,
  *sandaran* (backup), *pulihkan*, *pemberitahuan*, *fail*, *rangkaian*.
- English IT words take the Malay spelling where Malay platforms use one: *strim*,
  *penstriman*, *transkod*, *nod*, *treler*, *muzik*, *pemalam* (plug-in). Others stay English,
  lowercase inside a sentence: *cache*, *log*, *folder*, *metadata*, *remux*, *worker*, *token*,
  and *Wi-Fi*, *PIN*, *URL*, *API*.
- *telefon* for a phone, *tablet*, *TV* for the television as a device (*televisyen* only in
  running prose), *alat kawalan jauh* for the remote (*kawalan jauh* where space is short).
- On TV, prefer *Pilih* to *Tekan*; for a button on the remote, write *Tekan OK*. A direction on
  the remote is something the user presses: *Tekan Kanan untuk membuka panel*.

Malay, not Indonesian:

| English | Malay (use) | Indonesian (never) |
|---|---|---|
| download / upload | *muat turun* / *muat naik* | *unduh* / *unggah* |
| Settings / password | *Tetapan* / *kata laluan* | *Pengaturan* / *kata sandi* |
| device / account / server | *peranti* / *akaun* / *pelayan* | *perangkat* / *akun* / *server* |
| file / library / subtitles | *fail* / *pustaka* / *sari kata* | *file* / *perpustakaan* / *subtitel* |
| movie / episode / trailer | *filem* / *episod* / *treler* | *film* / *episode* / *trailer* |
| delete / remove / try again | *padam* / *alih keluar* / *cuba lagi* | *hapus* / *hapus* / *coba lagi* |
| phone / online / link | *telefon* / *dalam talian* / *pautan* | *ponsel* / *online* / *tautan* |
| share / update / reload | *kongsi* / *kemas kini* / *muat semula* | *bagikan* / *perbarui* / *muat ulang* |
| enable / disable / skip | *dayakan* / *lumpuhkan* / *langkau* | *aktifkan* / *nonaktifkan* / *lewati* |
| new / quality / code | *baharu* / *kualiti* / *kod* | *baru* / *kualitas* / *kode* |
| minute / second / time | *minit* / *saat* / *masa* | *menit* / *detik* / *waktu* |
| error / default / please | *ralat* / *lalai* / *sila* | *kesalahan* / *default* / *silakan* |

## Terms that depend on context

| English | Malay |
|---|---|
| request (a media request, and an HTTP or API request) | *permintaan*; to request: *minta*, *membuat permintaan* |
| Settings (a screen, tab or menu) / a setting | *Tetapan* / *tetapan* or *pilihan* |
| add / delete / remove / clear | *tambah* / *padam* / *alih keluar* / *kosongkan* |
| show (verb) / TV show | *tunjukkan*, *paparkan* / *siri* or *rancangan TV* |
| source | *sumber* |
| session (sign-in, playback) | *sesi* |
| party (a Watch Party) | *Watch Party*; host: *hos*; guest: *tetamu* |
| stream (one playback) | *strim*; streaming: *penstriman*; to stream: *menstrim* (*3 strim aktif*) |
| worker (remote server process) | *worker*, a technical term; *nod* for a node |
| queue / schedule | *baris gilir* / *jadualkan*, *jadual* |
| sync | *segerakkan*, *penyegerakan* |
| rating (stars) / rating (age) | *penarafan* / *penarafan umur* |
| cast (people) | *pelakon* |
| buffering | *Menimbal…* (status) |
| pair (a device) | *gandingkan*, *penggandingan* (*kod penggandingan*) |
| sign in / sign out | *log masuk* / *log keluar* (*Log masuk dengan {provider}*) |
| direct play / direct stream | *main terus* / *strim terus*; never *langsung* for direct, which reads as live. Real-time things (*live sessions*, *live logs*) are *aktif* or *masa nyata* (*sesi aktif*, *log masa nyata*) |
| Couldn't… | *Tidak dapat …* (*Tidak dapat menyimpan perubahan*); a short title may use *Gagal …* |
| Try again (sentence) / Retry (button) | *Sila cuba lagi.* / *Cuba lagi* |
| Auto (the name of a quality or mode option) | *Auto* as the option's name, as YouTube writes it; *automatik* inside a label or sentence (*Main automatik*) |
| seek (move to another point in playback) / search (find by name) | *lompat* to a point, *kedudukan main*: *Melompat…*, *Tidak dapat melompat ke kedudukan itu*, *Pratonton kedudukan* (seek previews); never *cari* or *carian* / *cari*, *carian* |

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
  - `other`: 0, 1, 2, 3, 4, 5, 6, 7, …
  Write `#` where the number goes.
- The noun after a number stays as it is, with no reduplication and no classifier: *1 episod*,
  *3 episod*, *0 filem*, *5 pengguna*, never *3 episod-episod* or *3 buah filem*. Write
  `{count, plural, other {# episod}}`. Use *orang* only where the English says people
  (*3 orang sedang menonton*).
- Without a number, the plural comes from context or a quantity word (*semua episod*, *beberapa
  fail*), never from reduplication. "{count} more" is *{count} lagi*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Malay runs 25 to 35 percent longer than English: affixes lengthen verbs, and many one-word
English labels are two Malay words (*muat turun*, *log masuk*, *alih keluar*). Keys with
`maxLength` appear on TV and small controls. Stay within it: drop *anda*, *yang*, *untuk*, *sila*
and *telah* where the meaning stays clear (*Profil*, not *Profil anda*), and choose the shorter
word. Never abbreviate a word or fall back to English.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *M{season}E{episode}*,
*M{season} · E{episode}*, *M{season}:E{episode}*, *E{episode}*, *M{season}* (M for musim, E for
episod, as Netflix writes them in Malay; never S). Keep the English separators (none, a space,
· or :). Spelled out: *Musim {season}*, *Episod {episode}* (*Musim 2, episod 3*), also in running
text (*Musim {season} bermula {date}*). Where `{season}` holds a season's name rather than its
number (*Download {season}*), don't add *Musim*: *Muat turun {season}*.
