# Vietnamese (vi)

Write standard Vietnamese, with every diacritic, as Apple, Google and Netflix write it in their
Vietnamese apps: short, polite and plain.

## Voice

- Address the user as *bạn*, lowercase mid-sentence, the neutral polite form Apple, Google and
  Netflix use: *Hồ sơ của bạn*. Never *quý khách*, *anh/chị*, *mình*, *cậu* or *mày*. Leave the
  pronoun out wherever the sentence works without it: *Chọn một hồ sơ*, *Đăng nhập để tiếp tục*,
  *Đã xóa hồ sơ*.
- Buttons, menu items and the choices of a picker are short verb phrases without a pronoun,
  *hãy* or *vui lòng*, consistently with the strings beside them: *Lưu*, *Hủy*, *Xóa*, *Thử lại*,
  *Thêm vào danh sách xem*. Instructions in sentences use the bare verb (*Chọn một thư viện.*);
  *Vui lòng* only where the English says please.
- Labels of a setting, a toggle or a picker are noun phrases (*Tự động phát*, *Cỡ chữ phụ đề*),
  not instructions.
- An on/off value is *Bật* / *Tắt*, whatever it switches.
- Progress states start with *Đang* and end with the ellipsis: *Đang tải…*, *Đang kết nối…*.
  Status words on one screen use the same form: a finished action starts with *Đã* (*Đã lưu*,
  *Đã xóa*), and a request's status is *Đã yêu cầu*, *Đã phê duyệt*, *Đã từ chối*, *Không thành
  công* or *Hoàn tất*, also in titles and labels on the same screen.
- Sentence case, like the English: only the first word and proper names take a capital (*Tiếp
  tục xem*). A proper name capitalizes every syllable (*Hàn Quốc*); a language is *tiếng* plus
  the name (*tiếng Anh*). Feature names keep their own capitals (*Watch Party*, *Autoscan*).
  English all-caps labels stay all caps (*MỚI*).
- A library type or tab name used as a common noun inside a sentence is lowercase (*Chưa có thư
  viện phim nào*), not quoted as the tab name.
- Third-person pronouns mark gender and age (*anh ấy*, *cô ấy*). Don't use them for a user:
  repeat the name or the role (*người dùng*, *khách*, *chủ phòng*), or write *họ*.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says: *Bạn đăng nhập bằng
  {provider}, và chỉ qua địa chỉ {provider}* keeps both *bằng {provider}* and *chỉ*.

## Placeholders and grammar

Vietnamese words never change form: no case, gender, number or articles, so a placeholder's
unseen value doesn't change the words around it. What matters is word order and the small words
around a noun or verb.

- A modifier follows its noun: *Thư viện {library}*, *Phim bộ yêu thích*, *{count} tập mới*. An
  owner follows too, with *của* in a sentence (*Hồ sơ của {name}*); a short label may drop *của*
  (*Hồ sơ {name}*). Never the English order (*{name} hồ sơ*) or a copied *’s*.
- A count comes before its noun, a position number after it: *{count} tập*, *{minutes} phút*,
  but *Tập {episode}*, *Mùa {season}*. Time: *{minutes} phút trước* (ago), *sau {minutes} phút*
  (in), *còn {minutes} phút* (left).
- Prepositions sit before the placeholder: *trên {device}* (on a device), *trong {library}*,
  *vào {library}* (into), *từ {provider}* (from), *bằng {provider}* (sign in with), *với {user}*
  (with a person), *cho {name}* (for).
- Tense words go before the verb: *{user} đã tham gia*, *Đang phát trên {device}*, *{title} sẽ
  được tải xuống lúc {time}*. Use *đã*, *đang* and *sẽ* where the English marks the time; short
  labels and status lines often drop them.
- Prefer the active or bare form to the passive (*Đã thêm {title} vào danh sách xem*). *bị* is
  only for something bad that happens to the user's item (*Phiên đã bị ngắt*), never for a
  neutral event.
- Where the value alone wouldn't say what it is, put a generic noun before it (*máy chủ*,
  *thư viện*, *hồ sơ*, *thiết bị*, *người dùng*): *Không thể kết nối với máy chủ {server}*. Or
  let the placeholder stand alone, as the subject or after a colon: *Máy chủ: {server}*.
- A person's name stands as it is, without *anh*, *chị*, *ông* or *bà* before it.
- Leave *a*, *an* and *the* untranslated in labels (*Chọn hồ sơ*); *một* only where a sentence
  needs it. *This* and *that* are *này* and *đó* after the noun (*hồ sơ này*).
- A confirmation is a short question: *Xóa hồ sơ này?* Write *Bạn có chắc muốn …?* only where the
  English asks "Are you sure".

## Diacritics and spelling

- Write every word with all its tone and vowel marks: *Tải xuống*, *Đăng nhập*. Never drop them;
  without them words collide (*mua* "buy", *mùa* "season").
- Use precomposed Unicode characters (NFC) and *đ*/*Đ* (U+0111/U+0110), never *d* or the
  look-alike *Ð* (U+00D0).
- Place the tone mark the traditional way, as Apple, Google and Microsoft do: *hòa*, *khỏe*,
  *xóa*, *hủy*, *tùy chọn*, never *hoà*, *khoẻ*, *xoá*, *huỷ*, *tuỳ*. Write *kỹ*, *lý*, *quy*
  (*kỹ thuật*, *lý do*, *quy tắc*).

## Typography

- Punctuation as in English: no space before ? ! : ;. Sentences end with a period; buttons,
  labels, titles and list items have none.
- Quotation marks “…”, nested ‘…’. Write the ellipsis as one character …, never three periods.
- Use the typographic apostrophe ’, never '. Vietnamese words never need one (Latin names such as
  *O’Brien*).
- A number and its unit are separated by a space: *24 giờ*, *2 giờ 4 phút*, *45 giây*, *7 ngày*,
  *211 ms*, also after a number placeholder (*{minutes} phút*). Write time words in full; never
  *m* or *p* for minutes. Percent takes no space: *50%*. In a short title where a line break
  would strand the unit, use a no-break space (U+00A0).

## Vocabulary

- Standard UI words as Apple, Google and Netflix use them: *Cài đặt*, *máy chủ*, *thư viện*,
  *phụ đề*, *tải xuống*, *tải lên*, *thiết bị*, *tài khoản*, *mật khẩu*, *người dùng*, *hồ sơ*,
  *tệp*, *thư mục*, *bộ nhớ đệm*, *liên kết*, *thông báo*, *sao lưu*, *khôi phục*,
  *siêu dữ liệu*, *chuyển mã*, *nhật ký* (log), *phát*, *tạm dừng*, *bỏ qua*, *xem trước*,
  *mặc định*.
- Media words: *phim* (*bộ phim* when counting in a sentence), *phim bộ* for a series, *tập*,
  *mùa*, *loạt phim* for a box set, *bộ sưu tập*, *đoạn giới thiệu* (trailer), *diễn viên*,
  *sách nói*. A season is *mùa*, never *phần*, which is a section of a screen.
- English words Vietnamese platforms keep stay English: *Wi-Fi*, *PIN*, *URL*, *API*, *email*,
  *plugin*, *remux*, *node*, *worker*, *token*, *codec*. Never *nút* for a node: it means a
  button.
- *điện thoại* for a phone, *máy tính bảng*, *TV* for the television as a device (*tivi* in
  running prose where it reads better), *điều khiển* for the remote.
- On TV, prefer *Chọn* to *Nhấn*; for a button on the remote, write *Nhấn OK*. A direction on the
  remote is something the user presses: *Nhấn sang phải để mở bảng*.

## Terms that depend on context

| English | Vietnamese |
|---|---|
| request (a media request, and an HTTP or API request) | *yêu cầu* (noun and verb) |
| Settings (a screen, tab or menu) / a setting | *Cài đặt* / *cài đặt* or *tùy chọn* |
| add / delete / remove / clear | *thêm* / *xóa* / *gỡ* or *xóa khỏi …* / *xóa hết* |
| show (verb) / TV show | *hiển thị* / *phim bộ* |
| source | *nguồn* |
| session (sign-in, playback) | *phiên* |
| party (a Watch Party) | *Watch Party*; host: *chủ phòng*; guest: *khách* |
| stream (one playback) | *luồng* (*3 luồng đang phát*); streaming: *phát trực tuyến* |
| worker (remote server process) | *worker*, a technical term; *node* for a node |
| queue / schedule | *hàng đợi* / *lên lịch*, *lịch* |
| sync | *đồng bộ hóa*, *đồng bộ* |
| rating (stars) / rating (age) | *đánh giá* / *giới hạn độ tuổi* |
| cast (people) | *diễn viên* |
| buffering | *Đang tải vào bộ đệm…* (status); *Đang tải…* where space is short |
| pair (a device) | *ghép nối* |
| sign in / sign out | *đăng nhập* / *đăng xuất* (*Đăng nhập bằng {provider}*) |
| online / offline | *trực tuyến* / *ngoại tuyến* |
| direct play / direct stream | *phát trực tiếp* / *truyền trực tiếp*; *trực tiếp* means direct here. Real-time things (*live sessions*, *live logs*) are *theo thời gian thực* or *đang diễn ra*, never *trực tiếp* |
| Couldn't… | *Không thể …* (*Không thể lưu thay đổi*) |
| Try again (sentence) / Retry (button) | *Vui lòng thử lại.* / *Thử lại* |
| Auto (the name of a quality or mode option) | *Tự động* |
| seek (move to another point in playback) / search (find by name) | *tua* (*tua đến*, *tua tới*, *tua lại*): *Đang tua…*, *Không thể tua*, *Bản xem trước khi tua* (seek previews); never *tìm* or *tìm kiếm* / *tìm kiếm*, *tìm* |

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
  - `one`: 0, 1
  - `other`: 2, 3, 4, 5, 6, 7, 8, 9, …
  Write `#` where the number goes.
- A Vietnamese noun doesn't change with the number, so both categories carry the same words:
  `{count, plural, one {# tập} other {# tập}}`. Keep both categories even when they are
  identical; the check requires them. `one` also takes 0 (*0 tập*).
- No plural word next to a number: *3 tập*, never *3 các tập*. Without a number, *các* covers
  all of a known set and *những* some of them (*các thiết bị khác*); leave both out where the
  sentence is clear without them.
- Most UI nouns are counted directly: *3 tập*, *2 mùa*, *5 thiết bị*, *4 mục*, *2 người dùng*.
  Use the classifier everyday Vietnamese needs: *3 bộ phim* (*3 phim* in a short label),
  *2 cuốn sách nói*, *3 người* for people in general, and count a noun the same way throughout.
  "{count} more" is *{count} mục khác*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Vietnamese runs 20 to 40 percent longer than English: every syllable is a separate word, and an
English compound becomes a phrase (*Subtitle size* is *Cỡ chữ phụ đề*). Keys with `maxLength`
appear on TV and small controls. Stay within it: drop *của bạn*, *đã*, *các*, *một* and *vui
lòng* where the meaning stays clear, and choose the shorter word (*Cỡ* rather than *Kích
thước*). Never abbreviate a word (*T.hình*), drop diacritics, or fall back to English.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *M{season}T{episode}*,
*M{season} · T{episode}*, *M{season}:T{episode}*, *T{episode}*, *M{season}* (M for mùa, T for
tập; never S or E). Keep the English separators (none, a space, · or :). Spelled out, the number
follows the word: *Mùa {season}*, *Tập {episode}* (*Mùa 2, tập 3*), also in running text (*Mùa
{season} bắt đầu vào {date}*). Where `{season}` holds a season's name rather than its number
(*Download {season}*), don't add *Mùa*: *Tải xuống {season}*.
