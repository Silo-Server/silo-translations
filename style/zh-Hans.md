# Chinese, Simplified (zh-Hans)

## Voice

- Address the user as **你**, never 您. Friendly and direct: *登录*、*选择个人资料*、*请重试*。
- Buttons, menu items and the choices of a picker are short verb phrases, consistently with the
  strings beside them: *取消*、*保存*、*重试*、*使用你的字幕偏好*。
- An on/off value is *开启* / *关闭*.
- Status words on one screen use one form: a request's status is a short phrase (*已请求*、
  *已批准*、*已拒绝*、*失败*、*已完成*), also in titles and labels on the same screen.
- Feature names keep their glossary form (*Watch Party*、*Autoscan*). English all-caps labels
  become the normal Chinese word (*直播*).
- Don't put tab names in quotes when they are used as ordinary nouns in a sentence.

## Typography

- Full-width punctuation ，。：；！？“”（） and the ellipsis ……; no half-width commas or
  periods in Chinese text.
- No spaces between Chinese and Latin text or digits (*5项*, *在Apple TV上*), except inside
  Latin product names, which keep their own spaces.
- Keep placeholders exactly as they are.

## Vocabulary

- Mainland vocabulary: *视频*, *服务器*, *设置*, *文件*, *下载*.
- *手机* for a phone, *平板电脑* (or *平板* where space is short), *电视* for the TV as a device,
  *遥控器* for the remote.
- On TV, prefer *选择* to *按*; for a button on the remote, write *按确定键*. A remote button is
  the object of *按*: *按向右键打开面板*。

## Terms that depend on context

| English | Chinese (Simplified) |
|---|---|
| request (a media request, and an HTTP or API request) | *请求*; to request: *请求* |
| Settings (a screen, tab or menu) / a setting | *设置* / *设置项* or *选项* |
| add / delete / remove / clear | *添加* / *删除* / *移除* / *清除* |
| show (verb) / TV show | *显示* / *剧集* |
| source | *来源* |
| session (sign-in, playback) | *会话* |
| party (a Watch Party) | *Watch Party*; host: *主持人*; guest: *参与者* |
| stream (one playback) | *串流*; streaming: *串流* |
| worker (remote server process) | *工作节点*; *节点* for a node |
| queue / schedule | *队列* / *计划* |
| sync | *同步* |
| rating (stars) / rating (age) | *评分* / *年龄分级* |
| cast (people) | *演员表* |
| buffering | *正在缓冲* |
| pair (a device) | *配对* |
| Couldn't… | *无法…* |
| Try again (sentence) / Retry (button) | *请重试。* / *重试* |
| Auto (the name of a quality or mode option) | *自动* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated.

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Chinese label that
element has in the catalog, not the English one. The glossary lists the names that recur.

## Plurals and numbers

- Plurals: only `other`; use measure words (*#季*, *#项*, *#集*).
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`.
- Digits come from the app; don't write numbers out or change separators.
- Time units are Chinese words directly after the number, no space: *24小时*, *2小时4分钟*,
  *45秒*, *211毫秒*, *7天*, also after a number placeholder (*{minutes}分钟*). An example of
  what to type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.

## Length

Keys with `maxLength` appear on TV and small controls. Chinese is usually short; stay within the
limit by choosing a shorter phrase.

## Season and episode codes (pass 5)

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}* in a compact code (keys named …Code, …Tag, …Fallback); a caption or line may write *第{season}季 · 第{episode}集*. Keep the English separators
(none, · or :).
