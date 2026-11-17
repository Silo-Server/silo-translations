# Indonesian (id)

Write standard Indonesian as Apple, Google and Netflix write it in their Indonesian apps. It is
not Malay: a Malay word (*muat turun*, *tetapan*, *kata laluan*) in an Indonesian string is a
mistake. The table under Vocabulary lists the pairs.

## Voice

- Address the user as *Anda*, capitalized also mid-sentence and as a possessive (*profil Anda*),
  as Apple, Google and Netflix do. Never *kamu*, *kau*, *Saudara* or *Bapak/Ibu*. Leave the
  pronoun out wherever the sentence works without it: *Pilih profil*, *Masuk untuk melanjutkan*,
  *Profil dihapus*.
- Buttons, menu items and the choices of a picker are short base-form imperatives, consistently
  with the strings beside them: *Simpan*, *Batal*, *Hapus*, *Coba lagi*, *Tambahkan ke daftar
  tonton*. Never add *-lah*, *silakan* or *Anda* to a button. Instructions in sentences use the
  same imperative (*Pilih perpustakaan.*); *Silakan* or *Mohon* only where the English says
  please.
- Labels of a setting, a toggle or a picker are noun phrases (*Pemutaran otomatis*, *Ukuran
  subtitel*), not imperatives.
- An on/off value is *Aktif* / *Nonaktif*, whatever it switches.
- Progress states use the active *me-* verb and the ellipsis: *Memuat…*, *Menghubungkan…*. Status
  words on one screen use the same form: a finished action is the passive *di-* verb
  (*Disimpan*, *Dihapus*), and a request's status is *Diminta*, *Disetujui*, *Ditolak*, *Gagal*
  or *Selesai*, also in titles and labels on the same screen.
- Sentence case, like the English. Days, months and language names are capitalized, *bahasa* is
  not: *Senin*, *Januari*, *bahasa Inggris*. Feature names keep their own capitals (*Watch
  Party*, *Autoscan*). English all-caps labels stay all caps (*BARU*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*Belum ada
  perpustakaan film*), not quoted as the tab name.
- Indonesian has no grammatical gender; *dia* and *mereka* cover everyone. Name people by role:
  *pengguna*, *tamu*, *peserta*, *host*.
- Standard written Indonesian, never Jakarta colloquial (*nggak*, *udah*, *aja*, *nonton*):
  *tidak*, *sudah*, *saja*, *menonton*.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says: *Anda masuk dengan
  {provider}, dan hanya melalui alamat {provider}* keeps both *dengan {provider}* and *hanya*.

## Placeholders and grammar

Indonesian has no case endings, articles, gender or agreement, so a placeholder's unseen value
doesn't change the words around it. Watch word order and affixes.

- The head noun comes first; what describes or owns it follows: *Profil {name}*, *Perpustakaan
  {library}*, *{count} episode baru*. Never the English order (*{name} profil*) or a copied *’s*.
- Affixes and the clitics *-nya*, *-ku*, *-mu* attach only to Indonesian words, never to a
  placeholder or a name: not *{title}nya*, *{provider}-nya*, *Silonya*. Name the thing instead
  (*Deskripsi {title}*, *server Silo*) or use *ini*/*itu*.
- *di*, *ke* and *dari* are separate words before a placeholder or name (*di {device}*,
  *ke {server}*, *dari {provider}*); the passive prefix *di-* is joined to its verb (*diputar*).
- Where the value alone wouldn't say what it is, put a generic noun before it (*server*,
  *perpustakaan*, *profil*, *perangkat*, *pengguna*): *Tidak dapat terhubung ke server
  {server}*. Or let the placeholder stand alone, as the subject or after a colon: *{user}
  bergabung*, *Server: {server}*.
- A person's name stands as it is, without *Bapak*, *Ibu* or *Sdr.*; refer back with the name or
  *dia*.
- Leave *a*, *an* and *the* untranslated (*Pilih profil*, not *Pilih sebuah profil*). *This* and
  *that* are *ini* and *itu* after the noun (*profil ini*).
- A confirmation is a short question: *Hapus profil ini?* Write *Apakah Anda yakin …?* only where
  the English asks "Are you sure".

## Typography

- Quotation marks “…”, nested ‘…’. Write the ellipsis as one character …, never three periods.
- Use the typographic apostrophe ’, never '. Indonesian words almost never need one (names such
  as *O’Brien*).
- Punctuation as in English: no space before ? ! : ;. Sentences end with a period; buttons,
  labels, titles and list items have none.
- A number and its unit are separated by a space: *24 jam*, *2 j 4 mnt*, *45 dtk*, *7 hari*,
  *211 ms*, also after a number placeholder (*{minutes} mnt*). Never *m* for minutes. Percent
  takes no space: *50%*. In a short title where a line break would strand the unit, use a
  no-break space (U+00A0).

## Vocabulary

- Standard UI words as Apple, Google and Netflix use them: *Pengaturan*, *server*,
  *perpustakaan*, *subtitel*, *unduh*, *perangkat*, *akun*, *kata sandi*, *pengguna*, *profil*,
  *putar* (play), *jeda*, *lanjutkan*, *lewati* (skip), *riwayat*, *pratinjau*, *cadangan*
  (backup), *pulihkan*, *notifikasi*.
- English IT words Indonesian platforms keep stay English, lowercase inside a sentence:
  *server*, *streaming*, *stream*, *file*, *folder*, *cache*, *plugin*, *log*, *host*, *node*,
  *worker*, *remux*, *metadata*, *token*, and *Wi-Fi*, *PIN*, *URL*, *API*. Not coinages the
  apps don't show (*peladen*, *tembolok*, *pengaya*, *berkas*, *simpul*).
- *ponsel* for a phone, *tablet*, *TV* for the television as a device (*televisi* only in running
  prose), *remote* for the remote control.
- On TV, prefer *Pilih* to *Tekan*; for a button on the remote, write *Tekan OK*. A direction on
  the remote is something the user presses: *Tekan Kanan untuk membuka panel*.

Indonesian, not Malay:

| English | Indonesian (use) | Malay (never) |
|---|---|---|
| download / upload | *unduh* / *unggah* | *muat turun* / *muat naik* |
| Settings / password | *Pengaturan* / *kata sandi* | *Tetapan* / *kata laluan* |
| device / account / server | *perangkat* / *akun* / *server* | *peranti* / *akaun* / *pelayan* |
| file / library / subtitles | *file* / *perpustakaan* / *subtitel* | *fail* / *pustaka* / *sari kata* |
| movie / episode / trailer | *film* / *episode* / *trailer* | *filem* / *episod* / *treler* |
| delete / remove / try again | *hapus* / *hapus* / *coba lagi* | *padam* / *alih keluar* / *cuba lagi* |
| phone / online / link | *ponsel* / *online* / *tautan* | *telefon* / *dalam talian* / *pautan* |
| share / update / reload | *bagikan* / *perbarui* / *muat ulang* | *kongsi* / *kemas kini* / *muat semula* |
| enable / disable / skip | *aktifkan* / *nonaktifkan* / *lewati* | *dayakan* / *lumpuhkan* / *langkau* |
| new / quality / code | *baru* / *kualitas* / *kode* | *baharu* / *kualiti* / *kod* |
| minute / second / time | *menit* / *detik* / *waktu* | *minit* / *saat* / *masa* |
| error / default / please | *kesalahan* / *default* / *silakan* | *ralat* / *lalai* / *sila* |

## Terms that depend on context

| English | Indonesian |
|---|---|
| request (a media request, and an HTTP or API request) | *permintaan*; to request: *meminta* |
| Settings (a screen, tab or menu) / a setting | *Pengaturan* / *pengaturan* or *opsi* |
| add / delete / remove / clear | *tambahkan* / *hapus* / *hapus dari …*, *keluarkan* / *kosongkan* |
| show (verb) / TV show | *tampilkan* / *serial* |
| source | *sumber* |
| session (sign-in, playback) | *sesi* |
| party (a Watch Party) | *Watch Party*; host: *host*; guest: *tamu* |
| stream (one playback) | *stream*; streaming: *streaming* (*3 stream aktif*, *Streaming ke {device}*) |
| worker (remote server process) | *worker*, a technical term; *node* for a node |
| queue / schedule | *antrean* / *jadwalkan*, *jadwal* |
| sync | *sinkronkan*, *sinkronisasi* |
| rating (stars) / rating (age) | *rating* / *rating usia* |
| cast (people) | *pemeran* |
| buffering | *Buffering…* (status) |
| pair (a device) | *pasangkan*; pairing: *penyandingan* (*kode penyandingan*), never *pemasangan* (installing) |
| sign in / sign out | *masuk* / *keluar* (*Masuk dengan {provider}*) |
| direct play / direct stream | *putar langsung* / *stream langsung*; *langsung* means direct here. Real-time things (*live sessions*, *live logs*) are *aktif* or *real-time* (*sesi aktif*, *log real-time*) |
| Couldn't… | *Tidak dapat …* (*Tidak dapat menyimpan perubahan*); a short title may use *Gagal …* |
| Try again (sentence) / Retry (button) | *Coba lagi.* / *Coba lagi* |
| Auto (the name of a quality or mode option) | *Otomatis* |
| seek (move to another point in playback) / search (find by name) | *lompat* to a point, *geser* by dragging, *posisi pemutaran*: *Melompat…*, *Tidak dapat melompat ke posisi itu*, *Pratinjau posisi* (seek previews); never *cari* or *pencarian* / *cari*, *pencarian* |

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
- The noun after a number stays as it is, with no reduplication and no classifier: *1 episode*,
  *3 episode*, *0 film*, *5 pengguna*, never *3 episode-episode* or *3 buah film*. Write
  `{count, plural, other {# episode}}`. Use *orang* only where the English says people
  (*3 orang menonton*).
- Without a number, the plural comes from context or a quantity word (*semua episode*, *beberapa
  file*), never from reduplication. "{count} more" is *{count} lainnya*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Indonesian runs 20 to 30 percent longer than English: affixes lengthen verbs, and many one-word
English labels need two words. Keys with `maxLength` appear on TV and small controls. Stay within
it: drop *Anda*, *yang*, *untuk* and *sedang* where the meaning stays clear (*Profil*, not
*Profil Anda*), and choose the shorter word. Never abbreviate a word or fall back to English.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *M{season}E{episode}*,
*M{season} · E{episode}*, *M{season}:E{episode}*, *E{episode}*, *M{season}* (M for musim, E for
episode, as Netflix writes them in Indonesian; never S). Keep the English separators (none, a
space, · or :). Spelled out: *Musim {season}*, *Episode {episode}* (*Musim 2, episode 3*), also
in running text (*Musim {season} mulai tayang {date}*). Where `{season}` holds a season's name
rather than its number (*Download {season}*), don't add *Musim*: *Unduh {season}*.
