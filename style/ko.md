# Korean (ko)

## Voice

- Sentences and messages use the polite **해요체**, as Google's and Netflix's Korean apps do:
  *로그인하세요*, *프로필을 선택하세요*, *다시 시도해 주세요*, *저장했어요*. Don't use
  합쇼체 (*-습니다*, *-십시오*) and never 반말 (*해*, *해라*). A status sentence that reports
  what happened also takes 해요체: *작업이 완료됐어요*, *서버에 연결할 수 없어요*.
- Address the reader without a pronoun: never *당신*, *너* or *귀하*. Leave the subject out, as
  Korean does. For another person use their name or a noun with *님* (*{user}님*, *호스트님*
  only where the English is personal; *호스트* in labels).
- Buttons, menu items, tabs and the choices of a picker are short nouns or noun phrases without
  a verb ending, consistently with the strings beside them: *취소*, *저장*, *다시 시도*,
  *삭제*, *자막 설정 사용*. A verb phrase is written in the noun form *-하기* only where a noun
  doesn't fit (*이어서 보기*, *공유하기*).
- An on/off value is *켬* / *끔*, as Apple's Korean UI writes it, whatever it switches.
- Status words on one screen use one form: a request's status is a noun or *-됨* form
  (*요청됨*, *승인됨*, *거절됨*, *실패*, *완료*), also in titles and labels on the same screen.
- Instructions in a sentence end in *-하세요* (*라이브러리를 선택하세요*). A polite request to
  do something the app can't do for the user takes *-해 주세요* (*잠시 후 다시 시도해 주세요*).
- Feature names keep their glossary form (*Watch Party*, *Autoscan*). English all-caps labels
  become the normal Korean word (*라이브*), or stay in Latin capitals where Korean apps keep them
  (*LIVE* badge on a thumbnail, *NEW*).
- Don't put tab names in quotes when they are used as ordinary nouns in a sentence (*영화
  라이브러리가 없어요*).
- Gender-neutral wording comes naturally: Korean nouns have no gender. Use *사용자*, *게스트*,
  *호스트*, never *그* or *그녀* for a person; repeat the noun or leave it out.

## Particles after placeholders and Latin text

The form of 을/를, 이/가, 은/는, 과/와, (으)로 depends on whether the word before it ends in a
consonant (받침), and the translator can't see the value of a placeholder. In order of
preference:

1. Put a Korean noun between the placeholder and the particle, so the particle follows a known
   word: *{title} 항목을 삭제할까요?*, *{server} 서버에 연결할 수 없어요*, *{name} 프로필로 전환*,
   *{count}개 항목이*. For a person, *{user}님이* (님 ends in a consonant).
2. Rephrase so no particle is needed: a colon or a label (*삭제됨: {title}*), the placeholder as
   a modifier (*{title}의 …*; 의 never changes), or *에*, *에서*, *도*, *만*, *까지*, *부터*,
   which don't depend on the final sound.
3. Only where neither works, write both forms with the consonant form first: *{title}을(를)*,
   *{name}이(가)*, *{name}은(는)*, *{name}과(와)*, *{name}(으)로*. Apple's and Microsoft's Korean
   templates do this. Don't guess one form.

The same applies after a fixed English word or a number whose Korean reading you can't be sure
of: write *Silo에서*, and for *Plex* or *Jellyfin* pick the particle by how Korean reads the name
(*Jellyfin을*, *Plex를*, *Silo를*, *Roku를*, *Apple TV를*).

## Typography

- Spaces between words follow standard Korean spacing (띄어쓰기). Particles and endings attach
  to the word before them, with no space, also after a placeholder (*{name}님의*, *{count}개*).
- Counters and Korean units attach to the number without a space: *5개*, *3편*, *2명*, *10초*.
- Sentences end with a period, as in Apple's and Google's Korean UI; buttons, labels, titles and
  list items have none. Question marks and exclamation marks are the ASCII forms ? !.
- Quotation marks “…”, nested ‘…’. Use the ellipsis character …. Half-width punctuation and
  parentheses, followed by a space as in English. Never full-width 、。「」.
- Latin words and digits sit in the text with normal Korean spacing (*Apple TV에서 재생*,
  *1080p 화질*). Keep placeholders exactly as they are.
- Use the typographic apostrophe ’ inside any Latin text that needs one.
- No capitalization in Hangul; Latin product names keep their own capitals.

## Vocabulary

- Standard Korean (표준어) and the National Institute of Korean Language's loanword spelling
  (외래어 표기법), as Korean platform UIs follow them: *서버*, *프로필*, *라이브러리*,
  *다운로드*, *스트리밍*, *콘텐츠* (not *컨텐츠*), *메시지* (not *메세지*), *플러그인*,
  *백업*.
- Use the established Sino-Korean UI word where one is common, as Apple and Google do: *설정*,
  *자막*, *계정*, *사용자*, *비밀번호*, *기기*, *즐겨찾기*, *검색*, *재생*, *일시정지*. Use the
  loanword where Korean apps do: *로그인*, *로그아웃*, *스트리밍*, *트랜스코딩*, *메타데이터*,
  *워커*, *노드*.
- *휴대폰* for a phone, *태블릿*, *TV* for the television as a device (Korean writes it in Latin
  letters; *텔레비전* only in running prose that needs it), *리모컨* for the remote.
- On TV, prefer *선택하세요* to *누르세요*; for a button on the remote, write *OK 버튼을
  누르세요*. A remote button is the object of *누르다*: *오른쪽 버튼을 누르면 패널이 열려요*.

## Terms that depend on context

| English | Korean |
|---|---|
| request (a media request, and an HTTP or API request) | *요청*; to request: *요청하다* |
| Settings (a screen, tab or menu) / a setting | *설정* / *설정* or *옵션* |
| add / delete / remove / clear | *추가* / *삭제* / *제거* / *지우기* |
| show (verb) / TV show | *표시*, *보기* / *시리즈* or *TV 프로그램* |
| source | *소스* |
| session (sign-in, playback) | *세션* |
| party (a Watch Party) | *Watch Party*; host: *호스트*; guest: *게스트* |
| stream (one playback) | *스트림*; streaming: *스트리밍* |
| worker (remote server process) | *워커*; *노드* for a node |
| queue / schedule | *대기열* / *예약*, *일정* |
| sync | *동기화* |
| rating (stars) / rating (age) | *평점* / *관람 등급* |
| cast (people) | *출연진* |
| buffering | *버퍼링 중* (status) |
| pair (a device) | *페어링* |
| Couldn't… | *…할 수 없어요* or *…하지 못했어요* |
| Try again (sentence) / Retry (button) | *다시 시도해 주세요.* / *다시 시도* |
| Auto (the name of a quality or mode option) | *자동* |
| Reload / Refresh | *새로고침*, one word as Chrome and Android write it, never *새로 고침*; to reload: *새로고침하다* |
| Are you sure / Delete X? (confirmation) | *…할까요?* (*이 프로필을 삭제할까요?*) |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Korean renderings are noun stems: add particles and endings after them (*라이브러리를*,
*로그인하세요*).

## Keep as written

Code, file paths, URLs, environment variable and setting names, text in backticks, hostnames,
units (*Mbps*, *kbps*, *GB*), resolutions (*1080p*), codec, protocol and format names (in their
usual capitals, *HTTP*, *HLS*), and keyboard keys (*Space*, *Enter*).

When a sentence names another screen, button, row, task or setting, use the Korean label that
element has in the catalog, not the English one. Write that label word for word, also inside a menu
path (*Settings → General → …*): don’t swap in a synonym or another wording of the same idea.
When the prompt lists the labels a string names, use the one on the string’s platform. The
glossary lists the names that recur.

## Plurals and numbers

- Plurals: only `other`. Korean doesn't inflect nouns for number; write the counter word with
  `#` and no plural marker (*#개 시즌* or *시즌 #개*, *#개 항목*, *#편*, *#명*), never *들*
  where English adds -s.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`.
- Digits come from the app; don't write numbers out in Hangul or change separators.
- Time units are Korean words directly after the number, no space: *24시간*, *2시간 4분*,
  *45초*, *7일*, also after a number placeholder (*{minutes}분*). Latin units keep a space
  (*211 ms*, *20 Mbps*). An example of what to type into a field (*24h*, *30d, 2w, 6m*) is
  input syntax and stays exactly as written.

## Length

Keys with `maxLength` appear on TV and small controls; a Hangul syllable counts as two. Korean
is usually short in syllables but each one is wide, so a label close to the limit may need a
shorter noun (*설정* rather than *환경 설정*), dropping particles and *-하기*, never an
abbreviation of a word.

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}*. Keep the English separators
(none, · or :). Spelled-out text uses *시즌 {season}* and *{episode}화* (*시즌 2 3화*), as
Korean streaming apps write it.
