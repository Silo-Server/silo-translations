# Hindi (hi)

## Voice

- Address the user with the formal **आप** and its polite imperative in *-एँ*/*-ें*, as Apple,
  Google and Netflix do in Hindi: *साइन इन करें*, *कोई प्रोफ़ाइल चुनें*, *फिर से कोशिश करें*,
  *आपका खाता*. Never *तुम* or *तू* and their forms (*चुनो*, *तुम्हारा*).
- Hindi verbs show the gender of their subject, and you can't know the reader's. Prefer wording
  that doesn't show it: an imperative (*बदलें*), an impersonal passive (*इसे सेटिंग में बदला जा
  सकता है*), *आपको … होगा* (*आपको फिर से साइन इन करना होगा*), or a *ने* construction (*आपने
  साइन आउट कर दिया है*). Only where none fits, use the masculine plural Apple and Google use
  with *आप* (*आप … कर सकते हैं*).
- Buttons and menu items use the same imperative, kept short: *रद्द करें*, *सेव करें*,
  *मिटाएँ*, *फिर से कोशिश करें*; *ठीक है* for OK, *हो गया* for Done. Labels of a setting, a
  toggle or a picker are noun phrases (*ऑटोप्ले*, *सबटाइटल का साइज़*, *ऐप की भाषा*). Don't add
  *कृपया*: keep it only in a full sentence where the English says *please*, never on a button.
- An on/off value is *चालू* / *बंद*, whatever it switches.
- Progress states use *… हो रहा है* with an ellipsis: *लोड हो रहा है…*, *कनेक्ट हो रहा है…*.
  Status words on one screen use one form: a request's status agrees with *अनुरोध* (masculine):
  *अनुरोध किया गया*, *स्वीकार किया गया*, *अस्वीकार किया गया*, *विफल रहा*, *पूरा हुआ*; where
  `maxLength` is tight, the short set *स्वीकृत*, *अस्वीकृत*, *विफल*, *लंबित*, *कतार में*.
- Devanagari has no capitals. Latin names keep their own (*Watch Party*, *Autoscan*); an English
  all-caps label becomes the Hindi word (*लाइव* for LIVE, *नया* for NEW).
- A tab name used as a common noun in a sentence is not quoted (*कोई फ़िल्म लाइब्रेरी नहीं है*).
  A button or row the user is told to choose is quoted, word for word as its label, because
  Hindi labels are themselves imperatives: *“फ़ोन कनेक्ट करें” चुनें*. A menu path is not quoted.
- Neutral wording for people: *उपयोगकर्ता*, *होस्ट*, *मेहमान*, *व्यक्ति*. Refer to a named
  person with the respectful plural (*{user} पार्टी में हैं*); repeat the name rather than *वह*.
- Keep every word that narrows what a sentence covers: *with {provider}*, *on this device*,
  *only*, *for this profile*. Dropping one changes what the sentence says. A warning that the
  user can't sign in *with* a method says so (*इस खाते में {provider} से साइन इन नहीं किया जा
  सकता।*); dropping *{provider} से* turns it into a warning that the account is locked.

## Placeholders and grammar

Hindi marks case with postpositions, and verbs, adjectives and *का/की/के* agree with a noun's
gender and number. A placeholder's value (a name, a title) is unseen, so its gender is unknown.

- Write postpositions as separate words after a noun, a name or a placeholder: *{server} से*,
  *{library} में*, *{title} को*, *{device} पर*, *Plex से*. They don't change with the word before
  them, so they are always right after a placeholder. With a pronoun they are one word: *इसमें*,
  *उसे*, *आपको*, *आपका*.
- *का/की/के* agrees with the noun after it, the thing owned, which you can see: *{user} का खाता*,
  *{user} की प्रोफ़ाइल*, *{user} के डिवाइस*, and *के* before a postposition (*{user} के खाते में*).
- A verb or adjective can't agree with a placeholder (*{title} जोड़ा गया* or *जोड़ी गई*?).
  Write around it:
  - A carrier noun before the placeholder, and agreement with that noun: *सर्वर {server} से
    कनेक्ट नहीं हो सका*, *टाइटल {title} वॉचलिस्ट में जोड़ा गया*, *प्रोफ़ाइल {name} मिटा दी गई*.
    Carriers: *सर्वर*, *डिवाइस*, *टाइटल* (a film, series or other item), *उपयोगकर्ता*,
    *कलेक्शन* (masculine); *प्रोफ़ाइल*, *लाइब्रेरी*, *फ़ाइल* (feminine).
  - The placeholder marked with *को* and a passive, which stays masculine singular whatever the
    value: *{title} को वॉचलिस्ट में जोड़ा गया*, *{name} को हटा दिया गया*.
  - For a person, a *ने* construction, where the verb agrees with the visible object (*{user} ने
    प्लेबैक रोक दिया*, *{user} ने पार्टी छोड़ दी*, *{user} ने आपको बुलाया है*); the present
    tense, whose *है/हैं* has no gender (*{user} अब पार्टी में हैं*); or a label (*होस्ट: {user}*).
- Hindi puts the verb last, so a placeholder moves to where Hindi word order puts it: *Play
  {title}* is *{title} चलाएँ*.

## Typography

- End a sentence with the danda । (U+0964), never a Latin period or a vertical bar |: *सर्वर से
  कनेक्ट नहीं हो सका। फिर से कोशिश करें।* No space before it, one after. Buttons, labels, titles
  and list items have no end punctuation, as in English. The period stays in numbers, versions
  and URLs (*2.5*, *v1.2*).
- Question and exclamation marks, commas, colons and parentheses are the Latin forms, with a
  space after and none before: *यह प्रोफ़ाइल मिटाएँ?*, *गड़बड़ी: {message}*.
- Quotation marks “…”, nested ‘…’. Write the ellipsis as one character …, right after the word.
- Hindi has no apostrophe: *Silo’s profile menu* is *Silo का प्रोफ़ाइल मेन्यू*. Use the
  typographic apostrophe ’ only inside Latin text that needs one.
- A space separates digits, placeholders and Latin words from the Hindi around them: *3 एपिसोड*,
  *Apple TV पर चलाएँ*, *{count} फ़िल्में*.
- Spell loans as Apple and Google do in Hindi: the nukta for *z* and *f* (*सीज़न*, *सीरीज़*,
  *फ़िल्म*, *फ़ाइल*, *साइज़*) and *ऑ* for the open *o* (*ऑडियो*, *ऑनलाइन*, *ऑटो*). Chandrabindu ँ
  where nothing stands above the headline (*हाँ*, *जाएँ*, *मिटाएँ*), anusvara ं where a vowel
  sign does (*में*, *करें*, *हैं*, *नहीं*).

## Vocabulary

- Everyday standard Hindi, as Google and Netflix write it, not Sanskritized coinages people
  don't use (*संगणक*, *उपशीर्षक*, *पुनर्स्थापित करें*, *प्रवाहित करें*). Hindi words where the
  platforms use them: *खाता*, *उपयोगकर्ता*, *भाषा*, *खोजें* (search), *चलाएँ* (play), *रोकें*
  (pause), *अनुरोध*, *इतिहास*, *पसंदीदा*, *सूचनाएँ*, *अनुमति*, *गड़बड़ी* (error), *इस्तेमाल करें*.
- English IT and media words, transliterated into Devanagari: *सर्वर*, *ऐप*, *डिवाइस*, *पासवर्ड*,
  *प्रोफ़ाइल*, *लाइब्रेरी*, *सबटाइटल*, *वीडियो*, *एपिसोड*, *सीज़न*, *डाउनलोड*, *स्ट्रीमिंग*,
  *प्लेबैक*, *मेटाडेटा*, *बैकअप*, *प्लगइन*, *कैश*, *लॉग*, *टोकन*, *लिंक*, *मेन्यू*, *सेटिंग*.
  A verb from a loan takes *करें* or *होना*: *सेव करें*, *कनेक्ट करें*, *कनेक्ट हो गया*.
- Latin letters for names from the glossary, acronyms (*PIN*, *URL*, *API*, *IP*, *HDR*, *4K*;
  *QR कोड*, *API कुंजी*) and everything under Keep as written. The exception is *टीवी* for the
  television as a device; *Apple TV* and *Android TV* stay.
- Gender of the nouns used most. Masculine: *सर्वर*, *डिवाइस*, *खाता*, *पासवर्ड*, *एपिसोड*,
  *सीज़न*, *अनुरोध*, *डाउनलोड*, *सबटाइटल*, *कलेक्शन*, *बैकअप*, *प्लगइन*, *टास्क*, *ऐप*, *टाइटल*,
  *सेक्शन*, *टीवी*. Feminine: *प्रोफ़ाइल*, *लाइब्रेरी*, *फ़िल्म*, *सीरीज़*, *ऑडियोबुक*, *सेटिंग*,
  *फ़ाइल*, *वॉचलिस्ट*, *पंक्ति*, *कतार*, *स्क्रीन*, *पार्टी*, *स्ट्रीम*, *जॉब*. A name takes the
  gender of what it names, usually an app or server (*Plex कनेक्ट हो गया*); *Watch Party* is
  feminine (*Watch Party शुरू हुई*).
- *फ़ोन* for a phone, *टैबलेट*, *टीवी* for the TV as a device, *रिमोट* for the remote. On TV,
  prefer *चुनें* to *दबाएँ*; for a button on the remote, write *OK बटन दबाएँ*. A direction on the
  remote is a button the user presses: *पैनल खोलने के लिए दायाँ बटन दबाएँ*.

## Terms that depend on context

| English | Hindi |
|---|---|
| request (a media request, and an HTTP or API request) | *अनुरोध*; to request: *अनुरोध करें* |
| Settings (a screen, tab or menu) / a setting | *सेटिंग* / *सेटिंग* (also in the plural) or *विकल्प* |
| add / delete / remove / clear | *जोड़ें* / *मिटाएँ* / *हटाएँ* / *साफ़ करें* |
| show (verb) / TV show | *दिखाएँ* / *सीरीज़* or *टीवी शो* |
| source | *सोर्स* |
| session (sign-in, playback) | *सेशन* |
| party (a Watch Party) | *Watch Party*; on its own *पार्टी*; host: *होस्ट*; guest: *मेहमान* |
| stream (one playback) | *स्ट्रीम*; streaming: *स्ट्रीमिंग*; to stream: *स्ट्रीम करें* |
| worker (remote server process) | *वर्कर*; *नोड* for a node |
| queue / schedule | *कतार* / *शेड्यूल*, *शेड्यूल करें* |
| sync | *सिंक करें*, *सिंक* |
| rating (stars) / rating (age) | *रेटिंग* / *आयु रेटिंग* |
| cast (people) / cast (to a TV) | *कलाकार* / *कास्ट करें* |
| buffering | *बफ़र हो रहा है…* (status) |
| pair (a device) | *पेयर करें*, *पेयरिंग*; never *जोड़ें*, which is add |
| seek (moving within playback) / search | *आगे-पीछे करना*, *… पर जाना* (*10 सेकंड आगे जाएँ*, *आगे-पीछे नहीं किया जा सका*, *आगे-पीछे हो रहा है…*); never *खोजना* or *खोज*, which mean search / *खोजें*, *खोज* |
| Resume / Start over | *जारी रखें* / *शुरू से चलाएँ* |
| Couldn't… | *… नहीं किया जा सका* (*सेव नहीं किया जा सका*; with a feminine object *सेटिंग सेव नहीं की जा सकी*) or *… नहीं हो सका* (*कनेक्ट नहीं हो सका*) |
| Try again (sentence) / Retry (button) | *फिर से कोशिश करें।* / *फिर से कोशिश करें* |
| Auto (the name of a quality or mode option) | *ऑटो*; inside a sentence that names the option, quote it: *“ऑटो” क्वालिटी …* |
| Reload / Refresh | *फिर से लोड करें* / *रीफ़्रेश करें* |
| Are you sure / Delete X? (confirmation) | *… मिटाएँ?* (*यह प्रोफ़ाइल मिटाएँ?*); *क्या आपको यकीन है?*; never *क्या आप … चाहते हैं?* |

The glossary (`glossary.csv`) holds the fixed renderings and the names never translated. Its
Hindi column gives the base form first; inflect it as the sentence needs (*फ़िल्में*, *खाते में*).

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
- `one` takes the singular noun and verb, `other` the plural: `{count, plural, one {# फ़िल्म}
  other {# फ़िल्में}}`, `{count, plural, one {# एपिसोड बाकी है} other {# एपिसोड बाकी हैं}}`.
  Masculine nouns ending in a consonant, and Sanskrit nouns in *-आ* such as *उपयोगकर्ता*, look
  the same in both (*# सर्वर*, *# डिवाइस*); still list both categories.
- Plural forms: *फ़िल्म → फ़िल्में*, *फ़ाइल → फ़ाइलें*, *प्रोफ़ाइल → प्रोफ़ाइलें*, *पंक्ति →
  पंक्तियाँ*, *घंटा → घंटे*, *खाता → खाते*; *सेटिंग* stays *सेटिंग*. Before a postposition a
  plural noun takes *-ओं*: *सभी डिवाइसों पर*, *इन फ़िल्मों में*.
- Where the English prints `{count_text}` instead of `#`, keep `{count_text}`: the app formats
  that number.
- Digits come from the app; don't write numbers out or change separators. An example of what to
  type into a field (*24h*, *30d, 2w, 6m*) is input syntax and stays exactly as written.
- Latin digits only, never Devanagari digits (*०–९*). A number and its unit are separated by a
  space: *24 घंटे*, *2 घंटे 4 मिनट*, *45 सेकंड*, *7 दिन*, *211 ms*, also after a placeholder
  (*{minutes} मिनट*). In compact strings (a countdown, a table cell, `{hours}h {minutes}m`) use
  *घं॰*, *मि॰*, *से॰* with the abbreviation sign ॰ (U+0970): *{hours} घं॰ {minutes} मि॰*.

## Length

Hindi usually runs as long as the English or longer, and `maxLength` counts every code point:
each vowel sign, virama, nukta, anusvara and chandrabindu is a character (*सेटिंग* counts 6).
Keys with `maxLength` appear on TV and small controls. Stay within it with a shorter
construction, never an abbreviated word: a noun phrase instead of a clause in a status (*डाउनलोड
जारी*, not *डाउनलोड हो रहा है*), no *आपका/आपकी* or *कृपया*, the shorter common word (*रोकें*).

## Season and episode codes

Every season and episode code uses the same letters across the catalog (codes, tags, captions,
play buttons, Watch Party lines, notifications, admin pages): *S{season}E{episode}*,
*S{season} · E{episode}*, *S{season}:E{episode}*, *E{episode}*, in Latin letters. Keep the
English separators (none, · or :), and put the code where Hindi word order puts it:
*S{season}:E{episode} चलाएँ*, *S{season}:E{episode} जारी रखें*. Spelled-out text uses
*सीज़न {season}* and *एपिसोड {episode}* (*सीज़न 2, एपिसोड 3*).
