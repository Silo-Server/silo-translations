# Japanese (ja)

## Voice

- Polite **です/ます** style for sentences and messages: *サインインしてください*、
  *もう一度お試しください*。Address the reader without a pronoun; never *あなた* unless the
  English needs it.
- Buttons, menu items and the choices of a picker are short noun or dictionary forms without
  です/ます, consistently with the strings beside them: *キャンセル*、*保存*、*再試行*、
  *字幕の設定を使用*。
- An on/off value is *オン* / *オフ*.
- Status words on one screen use one form: a request's status is a noun (*リクエスト済み*、
  *承認済み*、*却下*、*失敗*、*完了*), also in titles and labels on the same screen.
- Feature names keep their glossary form (*Watch Party*、*Autoscan*). English all-caps labels
  become the normal Japanese word (*ライブ*).
- Don't put tab names in quotes when they are used as ordinary nouns in a sentence
  (*映画のライブラリがありません*).

## Typography

- Full-width punctuation 、。「」（）！？ and the ellipsis …. Quotes are 「」, nested 『』.
- No spaces between Japanese and Latin text or digits (*Siloを開く*, *5件*), except where a
  product name reads better spaced (*Apple TV で再生*).
- Keep placeholders exactly as they are; no spaces around them unless the English has Latin
  words next to them.

## Vocabulary

- Katakana for established loanwords (*サーバー*, *プロフィール*), with the long vowel mark
  (*サーバー*, not *サーバ*). Keep glossary renderings.
- *スマートフォン* for a phone, *タブレット*, *テレビ* for the TV as a device, *リモコン* for
  the remote.
- On TV, prefer *選択* to *押す*; for a button on the remote, write *OKボタンを押してください*.
  A remote button is the object of *押す*: *右ボタンを押すとパネルが開きます*。

## Terms that depend on context

| English | Japanese |
|---|---|
| request (a media request, and an HTTP or API request) | *リクエスト*; to request: *リクエストする* |
| Settings (a screen, tab or menu) / a setting | *設定* / *設定* or *オプション* |
| add / delete / remove / clear | *追加* / *削除* / *外す* / *クリア* |
| show (verb) / TV show | *表示* / *シリーズ* or *番組* |
| source | *ソース* |
| session (sign-in, playback) | *セッション* |
| party (a Watch Party) | *Watch Party*; host: *ホスト*; guest: *ゲスト* |
| stream (one playback) | *ストリーム*; streaming: *ストリーミング* |
| worker (remote server process) | *ワーカー*; *ノード* for a node |
| queue / schedule | *キュー* / *スケジュール* |
| sync | *同期* |
| rating (stars) / rating (age) | *評価* / *年齢制限* |
| cast (people) | *キャスト* |
| buffering | *バッファリング中* |
| pair (a device) | *ペアリング* |
| Couldn't… | *…できませんでした* |
| Try again (sentence) / Retry (button) | *もう一度お試しください。* / *再試行* |
| Auto (the name of a quality or mode option) | *自動* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Japanese label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: only `other`; write the counter word (*#シーズン*, *#件*, *#話*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`.
- Digits come from the app; don't write numbers out in kanji or change separators.
- Time units are Japanese words directly after the number, no space: *24時間*, *2時間4分*,
  *45秒*, *211ミリ秒*, *7日*, also after a number placeholder (*{minutes}分*). An example of
  what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Keys with `maxLength` appear on TV and small controls. Japanese is usually short; stay within the
limit by choosing a shorter noun phrase.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*, *S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}*. Keep the English separators
(none, · or :).
