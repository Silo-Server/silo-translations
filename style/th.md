# Thai (th)

## Voice

- Write standard Thai in the polite, neutral register of Apple's, Google's and Netflix's Thai
  apps. No sentence-final particles (*ครับ*, *ค่ะ*, *คะ*, *นะ*, *จ้ะ*), no chatty words (*เลย*,
  *จ้า*, *เนอะ*), and no elevated or royal vocabulary (*ท่าน*, *กระผม*).
- Leave the reader out, as Thai does: *ลงชื่อเข้าใช้*, *เลือกโปรไฟล์*, *โปรดลองอีกครั้ง*.
  Where a sentence needs a pronoun, use *คุณ* (*บัญชีของคุณ*, *คุณเปลี่ยนได้ในการตั้งค่า*);
  never *ท่าน*, *เธอ* or *แก*. Don't add *ของคุณ* where the English *your* only marks a label
  (*โปรไฟล์*, not *โปรไฟล์ของคุณ*).
- Buttons and menu items are short verb phrases: *ยกเลิก*, *บันทึก*, *ลบ*, *ลองอีกครั้ง*,
  *ใช้การตั้งค่าคำบรรยาย*; *ตกลง* for OK, *เสร็จสิ้น* for Done. Labels of a setting, a toggle
  or a picker are noun phrases (*ขนาดคำบรรยาย*, *ภาษาของแอป*, *การเล่นอัตโนมัติ*). *โปรด*
  belongs in a full sentence that asks the user to do something (*โปรดลองอีกครั้ง*), never on a
  button, and never together with *กรุณา*.
- An on/off value is *เปิด* / *ปิด*, whatever it switches.
- Progress states use *กำลัง* with an ellipsis: *กำลังโหลด…*, *กำลังเชื่อมต่อ…*. A finished
  action takes *แล้ว*: *บันทึกแล้ว*, *ลบ {title} แล้ว*. Status words on one screen use one form:
  a request's status is *ขอแล้ว*, *อนุมัติแล้ว*, *ปฏิเสธแล้ว*, *ล้มเหลว*, *เสร็จสมบูรณ์*, also in
  titles and labels on the same screen.
- Avoid the passive with *ถูก*, which sounds adverse in Thai; write the active or *…แล้ว*
  (*เพิ่ม {title} ในรายการที่อยากดูแล้ว*, not *{title} ถูกเพิ่ม…*). Keep *ถูก* for something
  done against the user (*ถูกบล็อก*).
- Thai has no capitals. Latin names keep their own (*Watch Party*, *Autoscan*); an English
  all-caps label becomes the Thai word (*สด* for LIVE, *ใหม่* for NEW).
- A tab name used as a common noun in a sentence is not quoted (*ไม่มีคลังภาพยนตร์*). A button or
  row the user is told to choose is quoted, word for word as its label: *เลือก
  “เชื่อมต่อโทรศัพท์”*. A menu path is not quoted.
- Thai nouns have no gender. Use *ผู้ใช้*, *โฮสต์*, *ผู้เข้าร่วม*; never *เขา* or *เธอ* for a
  named person: repeat the name or leave it out.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says. A warning that the
  user can't sign in *with* a method says so (*ลงชื่อเข้าใช้บัญชีนี้ด้วย {provider} ไม่ได้*);
  dropping *ด้วย {provider}* turns it into a warning that the account is locked. *Only* is
  *เท่านั้น* after the phrase it limits (*ในอุปกรณ์นี้เท่านั้น*).

## Placeholders and grammar

Thai words don't inflect, so a placeholder never changes the words around it. What matters is
word order, the classifier after a number, and the spaces around the placeholder.

- Modifiers follow the noun: *เซิร์ฟเวอร์ {server}*, *คลัง {library}*, *โปรไฟล์ของ {user}*. The
  verb comes first in an instruction and on a button: *เล่น {title}*, *ลบ {name}*.
- Put a carrier noun before a placeholder whose kind the sentence doesn't make clear:
  *เชื่อมต่อกับเซิร์ฟเวอร์ {server} ไม่ได้*, *เพิ่ม {title} ลงในคลัง {library} แล้ว*,
  *ผู้ใช้ {user} เข้าร่วมแล้ว*. Carrier nouns: *เซิร์ฟเวอร์*, *คลัง*, *โปรไฟล์*, *ผู้ใช้*,
  *อุปกรณ์*, *ไฟล์*, *คอลเลกชัน*. A name that is plainly the subject needs none
  (*{user} เข้าร่วม Watch Party แล้ว*).
- Put one space before and one after a placeholder inside Thai text: *ตอนที่ {episode} จาก
  {total}*. No space next to punctuation or brackets (*({size})*, *{name}:*), and none where the
  English joins the placeholder to other characters (*S{season}E{episode}*, *{percent}%*).
- A number placeholder takes a classifier after it (see Plurals): *{count} ตอน*,
  *ภาพยนตร์ {count} เรื่อง*. *X of Y* is *X จาก Y* (*{current} จาก {total}*).
- Questions end with *ไหม* or *ใช่ไหม*, without a question mark: *ลบโปรไฟล์นี้ใช่ไหม*.

## Typography

- No spaces between words. A space separates phrases and sentences, where English has a comma
  between clauses or a period between sentences: *เชื่อมต่อไม่ได้ โปรดลองอีกครั้ง*. Thai has no
  full stop: a message ends without one, and without an exclamation mark.
- Put a space before and after Latin words, digits and placeholders inside Thai text: *เล่นบน
  Apple TV*, *3 ตอน*, *ดาวน์โหลด {count_text} รายการ*.
- In a list, separate the items with a space and put *และ* or *หรือ* before the last:
  *ภาพยนตร์ ซีรีส์ และหนังสือเสียง*. Don't use commas between Thai words or clauses.
- Quotation marks “…”, nested ‘…’. Write the ellipsis as one character …, right after the word.
  Colons and parentheses as in English, with a space after and none before (*ข้อผิดพลาด:
  {message}*).
- Thai has no apostrophe: *Silo’s profile menu* is *เมนูโปรไฟล์ของ Silo*. Use the typographic
  apostrophe ’ only inside Latin text that needs one.
- Write *ๆ* with a space on each side (*ต่าง ๆ*). Don't add spaces or invisible characters to
  help line breaking.

## Vocabulary

- Thai words where Apple and Google use them: *การตั้งค่า*, *บัญชี*, *รหัสผ่าน*, *ผู้ใช้*,
  *อุปกรณ์*, *คำบรรยาย*, *คลัง*, *ค้นหา* (search), *เล่น*, *หยุดชั่วคราว*, *ประวัติ*,
  *รายการโปรด*, *การแจ้งเตือน*, *สิทธิ์*, *ข้อผิดพลาด*, *ข้อมูลสำรอง*, *กู้คืน*, *เพิ่ม*, *ลบ*.
- English loans in Thai script, spelled as the Royal Society's transcription and Apple's and
  Google's Thai UIs write them: *แอป*, *เซิร์ฟเวอร์*, *โปรไฟล์*, *ดาวน์โหลด*, *อัปโหลด*,
  *อัปเดต*, *วิดีโอ*, *ไฟล์*, *โฟลเดอร์*, *ลิงก์*, *อีเมล*, *ออนไลน์*, *ปลั๊กอิน*, *แคช*,
  *บัฟเฟอร์*, *สตรีม*, *ซิงค์*, *โหนด*, *โทเค็น*, *เว็บฮุก*, *เมนู*, *ล็อก* (a log; *บันทึก* is
  save). Not the informal spellings *แอพ*, *ลิ้งค์*, *วีดีโอ*, *อีเมล์*, *อัพเดท*. The streaming
  words as Netflix writes them in Thai: *ซีซั่น*, *ซีรีส์*, *ตอน*, *ภาพยนตร์*.
- Latin letters for names from the glossary, for acronyms and initialisms (*PIN*, *URL*, *API*,
  *IP*, *HDR*, *4K*), and for everything under Keep as written. The exception is *ทีวี* for the
  television as a device; *Apple TV* and *Android TV* stay. A QR code is *คิวอาร์โค้ด*.
- *โทรศัพท์* for a phone, *แท็บเล็ต*, *ทีวี* for the TV as a device, *รีโมต* for the remote. On
  TV, prefer *เลือก* to *กด*; for a button on the remote, write *กดปุ่ม OK*. A direction on the
  remote is a button the user presses: *กดปุ่มขวาเพื่อเปิดแผง*.

## Terms that depend on context

| English | Thai |
|---|---|
| request (a media request, and an HTTP or API request) | *คำขอ*; to request: *ขอ* (*ขอภาพยนตร์เรื่องนี้*) |
| Settings (a screen, tab or menu) / a setting | *การตั้งค่า* / *การตั้งค่า* or *ตัวเลือก* |
| add / delete / remove / clear | *เพิ่ม* / *ลบ* / *นำออก* / *ล้าง* |
| show (verb) / TV show | *แสดง* / *ซีรีส์* or *รายการทีวี* |
| source | *แหล่งที่มา* |
| session (sign-in, playback) | *เซสชัน* |
| party (a Watch Party) | *Watch Party*; on its own *ปาร์ตี้*; host: *โฮสต์*; guest: *ผู้เข้าร่วม* |
| stream (one playback) | *สตรีม*; streaming: *การสตรีม*; to stream: *สตรีม* |
| worker (remote server process) | *เวิร์กเกอร์*; *โหนด* for a node |
| queue / schedule | *คิว* / *ตั้งเวลา*, *กำหนดการ* |
| sync | *ซิงค์* |
| rating (stars) / rating (age) | *คะแนน* / *เรตอายุ* (*เรต 18+*) |
| cast (people) / cast (to a TV) | *นักแสดง* / *แคสต์* |
| buffering | *กำลังบัฟเฟอร์…* (status) |
| pair (a device) | *จับคู่*, *การจับคู่* |
| seek (moving within playback) / search | *กรอ*, *กรอไปยังตำแหน่ง…* (*กรอไปข้างหน้า 10 วินาที*, *กรอไม่ได้*, *กำลังกรอ…*); never *ค้นหา*, which is search / *ค้นหา* |
| Resume / Start over | *เล่นต่อ* / *เล่นตั้งแต่ต้น* |
| Couldn't… | *…ไม่ได้* (*บันทึกไม่ได้*, *เชื่อมต่อกับเซิร์ฟเวอร์ {server} ไม่ได้*) |
| Try again (sentence) / Retry (button) | *โปรดลองอีกครั้ง* / *ลองอีกครั้ง* |
| Auto (the name of a quality or mode option) | *อัตโนมัติ*; inside a sentence that names the option, quote it: *คุณภาพ “อัตโนมัติ” …* |
| Reload / Refresh | *โหลดซ้ำ* / *รีเฟรช* |
| Are you sure / Delete X? (confirmation) | *…ใช่ไหม* (*ลบโปรไฟล์นี้ใช่ไหม*); *แน่ใจไหม* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Thai column gives the form to use first, then other forms it accepts.

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
- Thai doesn't mark the plural: no *ๆ*, *หลาย* or *ทั้งหลาย* where English adds -s. A count is
  the number and then a classifier; a noun that isn't its own classifier comes before the number:
  `{count, plural, other {# ตอน}}`, `{count, plural, other {ภาพยนตร์ # เรื่อง}}`. Classifiers:
  *ตอน*, *ซีซั่น*, *เรื่อง* (movies, series, audiobooks), *คน* (people, users), *เครื่อง*
  (devices, servers), *ไฟล์*, and *รายการ* for items, downloads, requests and anything without a
  classifier of its own (*ดาวน์โหลด # รายการ*). *โปรไฟล์* and *คลัง* count themselves.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.
- Latin digits only, never Thai digits (*๑๒๓*). A number and its unit are separated by a space:
  *24 ชั่วโมง*, *2 ชม. 4 นาที*, *45 วินาที*, *7 วัน*, *211 ms*, also after a number placeholder
  (*{minutes} นาที*). In compact strings (a countdown, a table cell, a runtime such as
  `{hours}h {minutes}m`) use *ชม.* for hours and *วิ* for seconds: *{hours} ชม. {minutes} นาที*.
  Never *น.* for minutes; it reads as o’clock.

## Length

Thai is often narrower than English on screen, but `maxLength` counts every code point: each
vowel or tone mark above or below a consonant is a character of its own (*การตั้งค่า* counts 10).
Keys with `maxLength` appear on TV and small controls. Stay within it by choosing a shorter
wording, never by abbreviating a word (*ชม.* is the one abbreviation): drop *กำลัง* where the
label is plainly a state, drop *ของ*, *คุณ* and *โปรด*, and choose the shorter common word
(*ดูต่อ*, *เล่นต่อ*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}*, in Latin letters. Keep the
English separators (none, · or :), with a space between the code and Thai words: *เล่น
S{season}:E{episode}*. Spelled-out text uses *ซีซั่น {season}* and *ตอนที่ {episode}*
(*ซีซั่น 2 ตอนที่ 3*); a count of episodes is *# ตอน*, without *ที่*.
