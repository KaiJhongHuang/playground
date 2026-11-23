// Lindy Hop 資源入口 — 資料檔
// 新增資源：在對應 section 的 group.items 加一筆 {name, url, zh, en, tags, where}
// tags: free | paid | freemium | zh | en | pick | search（search = 尚無確認的官方網址，連到搜尋結果）
var UPDATED = '2026-11-23';
function g(q){ return 'https://www.google.com/search?q=' + encodeURIComponent(q); }
function W(zh,en){ return {zh:zh,en:en}; }

var SECTIONS = [
{ id:'taiwan', icon:'🇹🇼', title:W('台灣','Taiwan'),
  intro:W('台灣的教室、舞會與年度活動。多數團體以 Facebook／Instagram 為主要據點；標「搜尋連結」的項目會帶你到搜尋結果找最新官方頁面。',
          'Schools, socials and annual events in Taiwan. Most groups live on Facebook/Instagram; items tagged “Search link” open a search for their current official page.'),
  groups:[
  { title:W('台北 · 教室與舞會','Taipei · Schools & socials'), items:[
    {name:'Swing Taiwan 社交舞與搖擺舞學校', url:'http://swingtaiwan.com', zh:'台北老牌搖擺舞學校，Lindy Hop 分級課程、新手體驗與戶外 TGIF 舞會。', en:'Long-running Taipei school: levelled Lindy Hop classes, taster sessions and outdoor TGIF socials.', tags:['zh','pick'], where:W('台北','Taipei')},
    {name:'Big Apple Swing Studio', url:g('Big Apple Swing Studio 搖擺舞教室 台北'), zh:'復興北路的搖擺舞教室，每月 Live Band 舞會，也是 Bubble Pop 與 City Cup 的主辦。', en:'Swing studio on Fuxing N. Rd with monthly live-band parties; home of Bubble Pop and City Cup.', tags:['zh','search'], where:W('台北','Taipei')},
    {name:'Friday Swing', url:g('Friday Swing 爵士社交舞與搖擺舞教室'), zh:'2020 年成立，忠孝敦化 Sunny Side 教室，主辦 Spring Hop 與 #TGIF 搖擺下班日。', en:'Founded 2020; Sunny Side studio near Zhongxiao Dunhua. Runs Spring Hop and the #TGIF after-work socials.', tags:['zh','search'], where:W('台北','Taipei')},
    {name:'TapLife · 小中大舞廳', url:g('TapLife 小中大舞廳 搖擺舞'), zh:'結合踢踏與搖擺舞的教室與舞廳，有新手體驗、聖誕與跨年舞會。', en:'Tap + swing studio and dance hall with beginner tasters, Christmas and New Year parties.', tags:['zh','search'], where:W('台北','Taipei')},
    {name:'Naughty Swing', url:'https://naughtyswingtw.oen.tw/', zh:'搖擺舞團，開設 Solo 課與講座，主辦 RSF、What The PA 等活動。', en:'Swing troupe offering solo classes and talks; organisers of RSF and What The PA.', tags:['zh'], where:W('台北','Taipei')},
    {name:'JF Swing', url:g('JF Swing 搖擺舞 台北'), zh:'以工作坊見長：Jazz Feet、Jazz Fever、Jam Fest。', en:'Workshop-focused group: Jazz Feet, Jazz Fever, Jam Fest.', tags:['zh','search'], where:W('台北','Taipei')},
    {name:'Switch Taipei', url:g('Switch Taipei 搖擺舞'), zh:'推廣角色互換（switch）的社群，有主題課程、台灣搖擺舞讀書會與歷史講座。', en:'Community promoting switch dancing; themed classes, a swing-dance reading group and history talks.', tags:['zh','search'], where:W('台北','Taipei')},
    {name:'Bal Up Studio', url:g('Bal Up Studio Balboa 台北'), zh:'Balboa 專門，主辦 Tasty Balboa 工作坊。', en:'Balboa specialists; hosts the Tasty Balboa workshop.', tags:['zh','search'], where:W('台北','Taipei')}
  ]},
  { title:W('其他城市','Other cities'), items:[
    {name:'Swing Gale 大風搖擺', url:g('Swing Gale 大風搖擺 新竹'), zh:'新竹的搖擺舞社群。', en:'Hsinchu’s swing dance community.', tags:['zh','search'], where:W('新竹','Hsinchu')},
    {name:"Let's Swing Taichung", url:g("Let's Swing Taichung 台中 搖擺舞"), zh:'台中的搖擺舞社群。', en:'Taichung’s swing dance community.', tags:['zh','search'], where:W('台中','Taichung')},
    {name:'日舞．台南', url:g('日舞台南 搖擺舞'), zh:'台南的搖擺舞團體。', en:'Swing dance group in Tainan.', tags:['zh','search'], where:W('台南','Tainan')},
    {name:'思慕搖擺', url:g('思慕搖擺 台南 Swing'), zh:'台南的搖擺舞社群，開設 Shim Sham 等課程。', en:'Tainan community running classes such as the Shim Sham.', tags:['zh','search'], where:W('台南','Tainan')},
    {name:'Swing Formosa', url:g('Swing Formosa 高雄 搖擺舞'), zh:'高雄的搖擺舞社群。', en:'Kaohsiung’s swing dance community.', tags:['zh','search'], where:W('高雄','Kaohsiung')}
  ]},
  { title:W('年度活動','Annual events'), items:[
    {name:'Cheek to Cheek Swing Festival (C2C)', url:'https://c2cswing.com/', zh:'C2C Swing 主辦的國際搖擺節：工作坊、多組比賽、現場樂團舞會。', en:'International festival by C2C Swing: workshops, multiple competition divisions and live-band parties.', tags:['zh','en','pick'], where:W('台北','Taipei')},
    {name:'Bubble Pop Lindy Exchange 台北國際搖擺生活節', url:'https://www.bubblepop.tw', zh:'2019 年起的 Lindy Exchange，曾在西門紅樓舉辦三天舞會與免費街頭體驗；最新一屆請看官方公告。', en:'Lindy exchange since 2019, held at Ximen Red House with parties and free street tasters; check for the latest edition.', tags:['zh','en'], where:W('台北','Taipei')},
    {name:'CRB Taipei – Cross Road Blues', url:'https://www.swingyoulater.com/festivals/crb-taipei-cross-road-blues', zh:'台北的 Blues 舞蹈週末（Lindy 的姊妹舞種）。', en:'Blues dance weekender in Taipei (a sister dance to Lindy Hop).', tags:['en'], where:W('台北','Taipei')}
  ]},
  { title:W('中文閱讀','Reading in Chinese'), items:[
    {name:'搖擺舞 social 注意事項、新手指南', url:'https://vocus.cc/article/64b21722fd8978000134a463', zh:'第一次去舞會前先看：給 Leader 與 Follower 的實用建議與禮儀。', en:'Read before your first social: practical tips and etiquette for leaders and followers (Chinese).', tags:['zh','free','pick']},
    {name:'搖擺舞新手攻略＆各國活動查詢', url:'https://vocus.cc/article/657667d3fd897800012958a6', zh:'一位新手半年內跑遍台北各教室與活動的紀錄，可當成台北場景地圖。', en:'A newcomer’s six-month log across Taipei’s studios and events — a handy map of the scene (Chinese).', tags:['zh','free']},
    {name:'台北搖擺舞團體歷年活動整理', url:'https://vocus.cc/article/68610711fd89780001ac93e2', zh:'整理台北各團體每年固定舉辦的活動。', en:'Round-up of the recurring yearly events run by each Taipei group (Chinese).', tags:['zh','free']},
    {name:'給初學舞者的十首經典搖擺樂（林迪舞篇）', url:'https://medium.com/@michaelswingfun/%E7%B5%A6%E5%88%9D%E5%AD%B8%E8%88%9E%E8%80%85%E7%9A%84%E5%8D%81%E9%A6%96%E7%B6%93%E5%85%B8%E6%90%96%E6%93%BA%E6%A8%82-%E4%B9%8B-%E6%9E%97%E8%BF%AA%E8%88%9E%E7%AF%87-6a93b7e97539', zh:'用十首歌帶新手認識經典搖擺樂。', en:'Ten classic swing tunes for new dancers, explained in Chinese.', tags:['zh','free']},
    {name:'康健雜誌：Swing Taiwan 創辦人 Wade 的故事', url:'https://www.commonhealth.com.tw/article/88814', zh:'從創辦人的經歷看搖擺舞如何在台北生根。', en:'Profile of Swing Taiwan’s founder and how swing took root in Taipei (Chinese).', tags:['zh','free']},
    {name:'關鍵評論網：上海的搖擺舞復興', url:'https://www.thenewslens.com/article/154142', zh:'中央社報導：搖擺舞在上海快速發展，幾乎天天有舞會。', en:'CNA feature on Shanghai’s fast-growing swing scene (Chinese).', tags:['zh','free']},
    {name:"Taipei's Got Rhythm: The City's Swing Culture", url:'https://travel.taipei/en/pictorial/article/28098', zh:'台北旅遊網的英文專題，適合介紹給外國朋友。', en:'Taipei Travel’s English feature on the city’s swing culture — good for visitors.', tags:['en','free']}
  ]}
]},

{ id:'asia', icon:'🌏', title:W('亞洲','Asia'),
  intro:W('從台灣飛一趟就到的場景與活動。首爾是亞洲最大的 Lindy Hop 城市。','Scenes and events a short flight from Taiwan. Seoul is Asia’s biggest Lindy Hop city.'),
  groups:[
  { title:W('韓國','Korea'), items:[
    {name:'BAL&HOP', url:'https://balnhop.kr/', zh:'首爾的 Balboa＋Lindy Hop 大型活動，通常在 9 月。', en:'Major Balboa + Lindy Hop event in Seoul, usually September.', tags:['en','pick'], where:W('首爾','Seoul')},
    {name:'Seoul Lindy Fest', url:'https://seoullindyfest.com/', zh:'首爾的年度 Lindy Hop 節，通常在 10 月。', en:'Seoul’s annual Lindy Hop festival, usually October.', tags:['en'], where:W('首爾','Seoul')},
    {name:'Seoul Swing Dance Community (Meetup)', url:'https://www.meetup.com/seoul-swing-dance-community', zh:'外國舞者到首爾找課程與舞會的英文入口。', en:'English-friendly gateway to classes and socials in Seoul.', tags:['en','free'], where:W('首爾','Seoul')},
    {name:'Seoul: The Swing Capital of the World', url:'https://koreaexpose.com/seoul-the-swing-capital-of-the-world', zh:'英文專題：首爾為什麼被稱為搖擺之都。', en:'Feature on why Seoul is called the swing capital.', tags:['en','free']}
  ]},
  { title:W('香港 · 新加坡 · 東南亞','Hong Kong · Singapore · SE Asia'), items:[
    {name:'Harbourside Swing Fest', url:'https://www.frenchmay.com/en/programmes/dance/harbourside-swing-fest-2026/', zh:'香港的海濱搖擺舞節，匯聚亞洲舞者，約在 4 月下旬。', en:'Hong Kong’s harbourside swing festival gathering Asia’s dancers, around late April.', tags:['en'], where:W('香港','Hong Kong')},
    {name:'Hong Kong Swings', url:'https://www.eventbrite.hk/o/hong-kong-swings-33977600877', zh:'香港搖擺舞團體的活動與課程售票頁。', en:'Tickets for classes and events by a Hong Kong swing group.', tags:['en'], where:W('香港','Hong Kong')},
    {name:'Jitterbugs Swingapore', url:'https://www.timeout.com/singapore/sport-and-fitness/jitterbugs-swingapore', zh:'新加坡老牌搖擺舞學校（Time Out 介紹頁）。', en:'Singapore’s long-established swing school (Time Out listing).', tags:['en'], where:W('新加坡','Singapore')},
    {name:'Swingstation SG', url:'https://www.timeout.com/singapore/sport-and-fitness/swingstation', zh:'新加坡的搖擺舞教室（Time Out 介紹頁）。', en:'Swing studio in Singapore (Time Out listing).', tags:['en'], where:W('新加坡','Singapore')},
    {name:'Swing Dance at The Hop', url:'https://www.meetup.com/swing-dance-at-the-hop', zh:'曼谷 The Hop 的定期課程與舞會。', en:'Regular classes and socials at The Hop, Bangkok.', tags:['en'], where:W('曼谷','Bangkok')},
    {name:'Hanoi Lindy Weekend', url:'https://www.swingyoulater.com/festivals/hanoi-lindy-weekend2', zh:'河內的 Lindy Hop 週末活動。', en:'Lindy Hop weekender in Hanoi.', tags:['en'], where:W('河內','Hanoi')}
  ]},
  { title:W('日本 · 中國','Japan · China'), items:[
    {name:'r/SwingDancing：日本各城市場景討論', url:'https://www.reddit.com/r/SwingDancing/comments/1e6ch5j/lindy_hop_swing_dance_scenes_in_japan', zh:'網友整理的日本各城市 Lindy Hop 場景，去日本前可參考。', en:'Community thread on Lindy Hop scenes across Japanese cities.', tags:['en','free'], where:W('日本','Japan')},
    {name:'Lindy Hop in Beijing (Google Arts & Culture)', url:'https://artsandculture.google.com/story/_wVBuzxG93vjJg', zh:'北京 Lindy Hop 發展的圖文故事。', en:'Illustrated story of Lindy Hop’s growth in Beijing.', tags:['en','free'], where:W('北京','Beijing')}
  ]}
]},

{ id:'learn', icon:'🎓', title:W('線上學習','Learn online'),
  intro:W('找不到課、想在家複習、或想跟世界名師學。多為英文授課；價格以各站公告為準。','For home practice or learning from international teachers. Mostly in English; check each site for current pricing.'),
  groups:[
  { title:W('免費入門','Free starters'), items:[
    {name:'Lindy Ladder', url:'https://www.youtube.com/channel/UCYG-_qxYozModUKwJizS34g', zh:'Shauna Marble 的免費分級課程，從基本步一路到招式與空中技。', en:'Shauna Marble’s free graded curriculum, from basics to moves and aerials.', tags:['en','free','pick']},
    {name:'SwingStep 免費初學系列', url:'https://swingstep.com/classes/free-beginner-lindy-hop-series/', zh:'德國 SwingStep 推出的免費 Lindy Hop 入門系列。', en:'Free beginner Lindy Hop series from SwingStep (Germany).', tags:['en','free']},
    {name:'SwingStepTV (YouTube)', url:'https://www.youtube.com/channel/UClPCb4ar70U2_qGLcaWHHTg', zh:'招式、技巧與教學心法的免費頻道。', en:'Free channel covering moves, technique and teaching ideas.', tags:['en','free']},
    {name:'Secrets of Solo (YouTube)', url:'https://www.youtube.com/@secretsofsolo', zh:'Ksenia 的 Solo Jazz 與 Charleston 免費短教學。', en:'Ksenia’s short free tutorials on solo jazz and Charleston.', tags:['en','free']},
    {name:'Wikibooks: Swing Dancing / Lindy Hop', url:'https://en.wikibooks.org/wiki/Swing_Dancing/Lindy_Hop', zh:'開放教材式的文字入門。', en:'Open-textbook style written introduction.', tags:['en','free']}
  ]},
  { title:W('訂閱制課程','Subscription courses'), items:[
    {name:'iLindy', url:'https://ilindy.com/', zh:'多位名師的教學庫，上千支影片、Level 1–5 分級，另有直播課與免費試看。', en:'Multi-teacher library: 1,000+ videos across Levels 1–5, plus live classes and free samples.', tags:['en','freemium','pick']},
    {name:'Syncopated City', url:'https://syncopatedcity.com/lindy-hop-lessons-online/', zh:'Michael Jagger 與 Evita Arce 的「Lindy Hop Roadmap」，從 Solo 基礎帶到六個級別。', en:'Michael Jagger & Evita Arce’s “Lindy Hop Roadmap” from solo foundations through six levels.', tags:['en','paid']},
    {name:'Rhythm Juice', url:'https://www.rhythmjuice.com/', zh:'Dax 與 Sarah 的老牌線上學校：Lindy 1–3、Solo Jazz 編舞、歷史課與 Zoom 教練課。', en:'Dax & Sarah’s veteran online school: Lindy 1–3, solo jazz routines, history and Zoom coaching.', tags:['en','paid']},
    {name:'SwingStep Online Pass', url:'https://swingstep.com/classes/online-pass/', zh:'90 小時以上的 Lindy Hop 與 Solo Jazz 教學，附 Zoom 練習課。', en:'90+ hours of Lindy Hop and solo jazz lessons with Zoom practice sessions.', tags:['en','paid']},
    {name:'iDance.net', url:'https://www.idance.net/', zh:'兩千多堂課的影片庫，可單買也可訂閱，涵蓋 Lindy、Charleston、Balboa、Shag。', en:'2,000+ lessons to buy singly or by subscription: Lindy, Charleston, Balboa, Shag.', tags:['en','paid']},
    {name:'Laura Glaess (Patreon)', url:'https://www.patreon.com/lauraglaess', zh:'知名 Solo Jazz／Lindy 老師的教學內容。', en:'Lessons from a well-loved solo jazz and Lindy teacher.', tags:['en','paid']}
  ]},
  { title:W('Solo Jazz · Charleston · Balboa · Shag','Solo Jazz · Charleston · Balboa · Shag'), items:[
    {name:"Ksenia's Secrets of Solo", url:'https://secretsofsolo.com/', zh:'Solo Jazz 與 20 年代 Charleston 專門學校：即興、轉圈、踢腿與每週挑戰。', en:'Dedicated solo jazz and 20s Charleston school: improvisation, spins, kicks and weekly challenges.', tags:['en','paid']},
    {name:'MyCharleston', url:'https://mycharlestondance.com/livestream', zh:'倫敦團隊的 Charleston Zoom 六週課程。', en:'Six-week Charleston courses over Zoom from a London team.', tags:['en','paid']},
    {name:'I Solo Balboa', url:'https://isolobalboa.com/', zh:'Olga Marina 專練 Balboa 個人步法的線上課。', en:'Olga Marina’s online course for solo Balboa footwork.', tags:['en','paid']},
    {name:'Kelly & Mickey Balboa', url:'https://www.kellyandmickey.com/online-courses', zh:'加州 Balboa 名師的單門課程，從入門到 Bal-Swing。', en:'Stand-alone Balboa courses from California, from basics to Bal-Swing.', tags:['en','paid']},
    {name:'Let it Swing School Online', url:'https://letitswing.tv/balboa/', zh:'柏林團隊：20s Charleston、Balboa、Collegiate Shag、St. Louis Shag。訂閱前請確認是否仍在更新。', en:'Berlin team: 20s Charleston, Balboa, Collegiate and St. Louis Shag. Check it is still updated before subscribing.', tags:['en','paid']},
    {name:'Shag.lt Online Collegiate Shag', url:'https://shag.lt/online-collegiate-shag/', zh:'立陶宛團隊的 Collegiate Shag Zoom 直播課。', en:'Live Zoom Collegiate Shag classes from Lithuania.', tags:['en','paid']}
  ]}
]},

{ id:'watch', icon:'🎬', title:W('影片觀摩','Watch'),
  intro:W('看比賽與表演是最快的靈感來源。以下都是官方頻道。','Competition and performance footage is the fastest source of inspiration. All official channels.'),
  groups:[
  { items:[
    {name:'ILHC — International Lindy Hop Championships', url:'https://www.youtube.com/@ILHC/featured', zh:'最具指標性的 Lindy Hop 大賽官方頻道，含 ILHC Europe。', en:'Official channel of the benchmark Lindy Hop championships, including ILHC Europe.', tags:['free','pick']},
    {name:'Lindy Focus', url:'https://www.youtube.com/user/jazzartonline/videos', zh:'美國跨年大型營隊的 Lindy、Solo、Balboa、Slow 各組比賽。', en:'Lindy, solo, Balboa and slow contests from the big US New Year camp.', tags:['free']},
    {name:'Savoy Cup', url:'https://www.youtube.com/@SavoyCup', zh:'法國大賽，以表演與 showcase 精彩著稱。', en:'French competition famed for its shows and showcases.', tags:['free']},
    {name:'Camp Jitterbug', url:'https://www.youtube.com/channel/UC4eeHDOTwDtNI_G_FgobP2A', zh:'西雅圖老牌營隊的比賽與 jam 影片。', en:'Contests and jams from Seattle’s long-running camp.', tags:['free']},
    {name:'Herräng Dance Camp', url:'https://www.youtube.com/@herrangdancecamp', zh:'瑞典傳奇夏令營的營隊故事與每週表演。', en:'Stories and weekly shows from Sweden’s legendary summer camp.', tags:['free']},
    {name:'The Snowball', url:'https://www.youtube.com/playlist?list=PLEvJbXh-RdCCEMFeZTtJBShCOW4qhmY5x', zh:'斯德哥爾摩跨年活動的比賽播放清單。', en:'Contest playlist from Stockholm’s New Year event.', tags:['free']},
    {name:'Yehoodi Swings', url:'https://www.youtube.com/channel/UCzjqX9NieCmo2_YpwnKPpMQ', zh:'Yehoodi 的直播與賽事轉播影片庫。', en:'Yehoodi’s archive of livestreams and event broadcasts.', tags:['free']},
    {name:'Lindy Hop Cats：學習頻道清單', url:'https://lindyhopcats.notion.site/Channels-for-Lindy-Learning-Inspiration-409458fbc60843cbae916e0df8a64f7b', zh:'整理好的 Lindy Hop YouTube 頻道總表，想挖更多從這裡開始。', en:'Curated list of Lindy Hop YouTube channels to dig deeper.', tags:['en','free']}
  ]}
]},

{ id:'history', icon:'📜', title:W('歷史與文化','History & culture'),
  intro:W('Lindy Hop 誕生於 1920–30 年代紐約哈林區的非裔美國人社群。認識它的根，舞會跳得更有感。','Lindy Hop was born in the African American community of Harlem in the 1920s–30s. Knowing its roots deepens the dance.'),
  groups:[
  { title:W('入門導讀','Start here'), items:[
    {name:'Yehoodi：Lindy Hop 歷史入門', url:'https://yehoodi.com/history', zh:'從哈林起源、Savoy 舞廳到 1980 年代復興的完整導讀。', en:'A complete primer from Harlem origins and the Savoy to the 1980s revival.', tags:['en','free','pick']},
    {name:'Frankie Manning Foundation', url:'https://www.frankiemanningfoundation.org', zh:'Lindy Hop 大使 Frankie Manning 的基金會：傳承、獎學金與史料。', en:'Foundation of Lindy Hop ambassador Frankie Manning: legacy, scholarships and archives.', tags:['en','free','pick']},
    {name:'FMF 史料資源入口', url:'https://www.frankiemanningfoundation.org/archival-resources', zh:'早期舞者小傳、老影片與線上展覽。', en:'Biographies of early dancers, vintage clips and online exhibits.', tags:['en','free']},
    {name:'World Lindy Hop Day · Frankie Month', url:'https://www.frankiemanningfoundation.org/frankie-month', zh:'5 月 26 日是 Frankie 生日，也是世界 Lindy Hop 日。', en:'May 26 — Frankie’s birthday — is World Lindy Hop Day.', tags:['en','free']},
    {name:'Lindy Hop（維基百科）', url:'https://en.wikipedia.org/wiki/Lindy_Hop', zh:'英文維基條目，快速建立全貌。', en:'Wikipedia overview for the big picture.', tags:['en','free']},
    {name:'History of Lindy Hop（維基百科）', url:'https://en.wikipedia.org/wiki/History_of_Lindy_Hop', zh:'英文維基的歷史專條。', en:'Wikipedia’s dedicated history article.', tags:['en','free']}
  ]},
  { title:W('人物與 Savoy 舞廳','People & the Savoy'), items:[
    {name:"Savoy Style：Whitey's Lindy Hoppers", url:'https://www.savoystyle.com/wlh.html', zh:'傳奇表演舞團的成員、電影與演出史。', en:'Members, films and performance history of the legendary troupe.', tags:['en','free']},
    {name:'Savoy Ballroom（維基百科）', url:'https://en.wikipedia.org/wiki/Savoy_Ballroom', zh:'哈林 Savoy 舞廳（1926–1958）的歷史。', en:'History of Harlem’s Savoy Ballroom (1926–1958).', tags:['en','free']},
    {name:'Norma Miller（維基百科）', url:'https://en.wikipedia.org/wiki/Norma_Miller', zh:'「搖擺女王」Norma Miller 生平。', en:'Life of Norma Miller, the “Queen of Swing”.', tags:['en','free']},
    {name:'Al & Leon（維基百科）', url:'https://en.wikipedia.org/wiki/Al_%26_Leon', zh:'Al Minns 與 Leon James，把 Savoy 的舞傳到下一代的關鍵人物。', en:'Al Minns and Leon James, key carriers of Savoy dancing to later generations.', tags:['en','free']},
    {name:'美國國會圖書館：Frankie Manning 示範演出', url:'https://www.loc.gov/loc/lcib/9513/afc.html', zh:'1995 年民俗中心的報導，含名稱由來與舞團歷史。', en:'1995 American Folklife Center report with the name’s origin and troupe history.', tags:['en','free']},
    {name:'NMAAHC 館藏：Savoy 舞池照片', url:'https://www.si.edu/object/savoy-ballroom%3Anmaahc_2014.276.2.13', zh:'史密森尼非裔美國人歷史文化博物館收藏的 1940 年前後照片。', en:'A circa-1940 photograph held by the Smithsonian NMAAHC.', tags:['en','free']},
    {name:'ATOMIC Ballroom：Icons of Rhythm', url:'https://atomicballroom.com/icons-of-rhythm-black-history', zh:'介紹搖擺舞背後的黑人舞者與音樂家。', en:'Profiles of the Black dancers and musicians behind swing.', tags:['en','free']},
    {name:'Google Arts & Culture：FMF 線上展', url:'https://artsandculture.google.com/partner/frankie-manning-foundation', zh:'基金會的數位展覽與影像館藏。', en:'The foundation’s digital exhibits and image collections.', tags:['en','free']}
  ]},
  { title:W('經典影片與書','Classic films & books'), items:[
    {name:"Hellzapoppin' (1941) 解說", url:'https://savoystyle.com/hellzapoppin.html', zh:'影史最經典的 Lindy Hop 片段，背景與舞者介紹。', en:'Background on the most famous Lindy Hop sequence on film.', tags:['en','free','pick']},
    {name:"關於 Hellzapoppin' 的七件事", url:'https://www.yehoodi.com/blog/2018/7/23/seven-things-you-should-know-about-hellzapoppin', zh:'Yehoodi 的幕後考據。', en:'Yehoodi’s behind-the-scenes research.', tags:['en','free']},
    {name:'A Day at the Races (1937) 解說', url:'https://www.savoystyle.com/day_at_races.html', zh:'馬克斯兄弟電影裡的 Lindy Hop 段落。', en:'The Lindy Hop scene in the Marx Brothers film.', tags:['en','free']},
    {name:'The Spirit Moves', url:'https://en.wikipedia.org/wiki/The_Spirit_Moves', zh:'Mura Dehn 記錄黑人社交舞的紀錄片。', en:'Mura Dehn’s documentary of Black social dance.', tags:['en','free']},
    {name:'Alive and Kicking (2016)', url:'https://en.wikipedia.org/wiki/Alive_and_Kicking_(2016_film)', zh:'記錄當代搖擺舞復興與全球舞圈的紀錄片。', en:'Documentary on the modern swing revival and global scene.', tags:['en']},
    {name:'書：Frankie Manning: Ambassador of Lindy Hop', url:'https://frankiemanningfoundation.org/ambassador-of-lindy-hop-book', zh:'Frankie 的自傳，Savoy 年代的第一手資料。', en:'Frankie’s autobiography — a first-hand account of the Savoy era.', tags:['en','paid']},
    {name:"書：Swingin' at the Savoy (Norma Miller)", url:'https://alt.library.temple.edu/tupress/titles/1214_reg.html', zh:'Norma Miller 的回憶錄。', en:'Norma Miller’s memoir.', tags:['en','paid']},
    {name:'書：Jazz Dance (Marshall & Jean Stearns)', url:'https://www.hachettebookgroup.com/titles/marshall-stearns/jazz-dance/9780306805530/', zh:'美國爵士民間舞蹈史的經典著作。', en:'The classic history of American vernacular jazz dance.', tags:['en','paid']}
  ]},
  { title:W('當代議題與組織','Today’s conversations'), items:[
    {name:'Black Lindy Hoppers Fund', url:'https://blacklindyhoppersfund.org/', zh:'資助黑人舞者、樂手與研究者的獎助與傳承計畫。', en:'Grants and legacy programmes for Black dancers, musicians and researchers.', tags:['en']},
    {name:'Collective Voices for Change', url:'https://www.collectivevoicesforchange.org/manifesto-fr', zh:'討論爵士舞蹈圈的種族不平等與文化挪用。', en:'Addressing racial inequity and appropriation in the jazz dance world.', tags:['en','free']},
    {name:'FMF：Lindy Hop in Academia', url:'https://www.frankiemanningfoundation.org/post/lindy-hop-in-academia', zh:'Lindy Hop 學術研究整理。', en:'A round-up of academic work on Lindy Hop.', tags:['en','free']}
  ]}
]},

{ id:'music', icon:'🎷', title:W('音樂','Music'),
  intro:W('Lindy Hop 是跳給 swing jazz 的舞。聽得越多，跳得越好。','Lindy Hop is danced to swing jazz. The more you listen, the better you dance.'),
  groups:[
  { title:W('聽與練','Listen & practise'), items:[
    {name:'Swing Street Radio', url:'https://www.swingstreetradio.org/landing-page/', zh:'24 小時無廣告的大樂團／早期爵士網路電台。', en:'24/7 ad-free big band and early jazz internet radio.', tags:['free','pick']},
    {name:'依 BPM 分類的 Lindy Hop 歌單 (Bajescu)', url:'https://bajescu.com/dance/music', zh:'80–330 BPM、每 10 BPM 一組的 Spotify 歌單，練速度最好用。', en:'Spotify playlists from 80 to 330 BPM in steps of 10 — ideal for tempo practice.', tags:['free','pick']},
    {name:'Lindy Hop 120–140 BPM 歌單', url:'https://open.spotify.com/playlist/26bn57QFL3iTOJWfsVljVQ', zh:'慢到中速的練習歌單，適合初學。', en:'Slow-to-medium practice playlist, good for beginners.', tags:['free']},
    {name:'Lindy Hop 180–200 BPM 歌單', url:'https://open.spotify.com/playlist/28WpKoUZ3MG7e0ZgIwAIFg', zh:'快歌練習歌單。', en:'Fast-tempo practice playlist.', tags:['free']},
    {name:'Carnegie Hall：Swing Bands 時間軸', url:'https://timeline.carnegiehall.org/genres/swing-bands', zh:'經典大樂團導讀：Basie、Ellington、Chick Webb、Ella。', en:'Guide to the classic big bands: Basie, Ellington, Chick Webb, Ella.', tags:['en','free']},
    {name:'Hey Mister Jesse (Podcast 存檔)', url:'https://podcasts.apple.com/us/podcast/hey-mister-jesse/id113427515', zh:'給舞者的搖擺音樂節目，已停更但存檔仍值得聽。', en:'Swing music show for dancers; ended, but the archive is still worth it.', tags:['en','free']},
    {name:'The Syncopated Times', url:'https://syncopatedtimes.com/johnathan-stouts-jazz-is-crafted-for-dancing/', zh:'傳統爵士與搖擺樂媒體，常報導為舞者演奏的樂團。', en:'Trad jazz and swing publication that often covers bands who play for dancers.', tags:['en','free']}
  ]},
  { title:W('當代舞會樂團','Today’s dance bands'), items:[
    {name:'Gordon Webster', url:'https://gordonwebstermusic.bandcamp.com', zh:'紐約鋼琴手與團長，全球舞會常客。', en:'New York pianist and bandleader, a fixture at dance events worldwide.', tags:['paid']},
    {name:'Jonathan Stout and his Campus Five', url:'https://campusfive.bandcamp.com/music', zh:'洛杉磯樂團，1930 年代小編制搖擺，專為舞者演奏。', en:'LA band playing 1930s small-group swing made for dancers.', tags:['paid']},
    {name:'Naomi & Her Handsome Devils', url:'https://naomisdevils.bandcamp.com/music', zh:'冠軍舞者 Naomi Uyama 帶的樂團。', en:'Led by champion dancer Naomi Uyama.', tags:['paid']},
    {name:'Michael Gamble & the Rhythm Serenaders', url:'https://michaelgamble.bandcamp.com', zh:'低音提琴手帶的舞者向搖擺樂團。', en:'Bassist-led swing band built for dancers.', tags:['paid']},
    {name:'Hot Sugar Band', url:'http://hotsugarband.fr/', zh:'巴黎搖擺樂團，歐洲大型活動常客。', en:'Paris swing band, regulars at major European events.', tags:['paid']}
  ]},
  { title:W('DJ 資源','For DJs'), items:[
    {name:'Shuffle Projects (DJ CHRiSBE)', url:'https://shuffleprojects.com/resources/', zh:'搖擺 DJ 的技巧、音樂來源與書單。', en:'Swing DJ technique, music sources and reading lists.', tags:['en','free']},
    {name:'SwingDJs.com 論壇', url:'https://www.swingdjs.com/', zh:'DJ 交流選曲與音樂知識的老牌論壇。', en:'Veteran forum where DJs trade tunes and music knowledge.', tags:['en','free']},
    {name:'FMF：Lindy Hop DJ Corner', url:'https://www.frankiemanningfoundation.org/post/lindy-hop-dj-corner-you-should-dj-big-band-music', zh:'鼓勵 DJ 多放大樂團音樂的專欄。', en:'A column urging DJs to play more big band music.', tags:['en','free']}
  ]}
]},

{ id:'events', icon:'✈️', title:W('全球活動','World events'),
  intro:W('想出國跳舞，先查行事曆。月份為往年慣例，實際日期請以官網為準。','Planning to travel for dancing? Start with the calendars. Months are typical; confirm dates on official sites.'),
  groups:[
  { title:W('行事曆與目錄','Calendars & directories'), items:[
    {name:'Swing You Later', url:'https://swingyoulater.com/calendar', zh:'全球搖擺活動行事曆，可依國家、舞種、形式篩選。', en:'Worldwide swing festival calendar, filterable by country, style and format.', tags:['en','free','pick']},
    {name:'SwingPlanIt', url:'https://www.swingplanit.com/', zh:'老牌全球活動資料庫，可依舞種與國家篩選。', en:'Long-standing global event database, filterable by style and country.', tags:['en','free','pick']},
    {name:'Swing Calendar', url:'https://swingcalendar.com/en/', zh:'另一個全球搖擺活動行事曆。', en:'Another worldwide swing event calendar.', tags:['en','free']},
    {name:'Jazz Dance Direct', url:'https://jazzdancedirect.com/resource-pages', zh:'爵士舞活動、組織、學校的可搜尋目錄。', en:'Searchable directory of jazz dance events, organisations and schools.', tags:['en','free']}
  ]},
  { title:W('指標性活動','Landmark events'), items:[
    {name:'Herräng Dance Camp', url:'https://www.herrang.com/', zh:'全球最大的 Lindy Hop 舞營，7 月連續數週。', en:'The world’s largest Lindy Hop camp, running for weeks every July.', tags:['pick'], where:W('瑞典 · 7 月','Sweden · Jul')},
    {name:'ILHC', url:'https://ilhc.com', zh:'International Lindy Hop Championships，最具指標性的大賽。', en:'International Lindy Hop Championships — the benchmark competition.', where:W('北美 · 夏季','N. America · Summer')},
    {name:'ILHC Europe', url:'https://europe.ilhc.com/', zh:'ILHC 的歐洲站。', en:'The European edition of ILHC.', where:W('保加利亞 · 10 月','Bulgaria · Oct')},
    {name:'Lindy Focus', url:'https://www.lindyfocus.com/', zh:'美國最大的跨年舞營，以現場大樂團聞名。', en:'America’s biggest New Year camp, known for its live big bands.', where:W('美國 · 12 月底','USA · late Dec')},
    {name:'The Snowball', url:'https://www.thesnowball.se/', zh:'斯德哥爾摩的跨年活動。', en:'Stockholm’s New Year event.', where:W('瑞典 · 12 月底','Sweden · late Dec')},
    {name:'Savoy Cup', url:'https://www.savoycup.com', zh:'法國南部的大賽，表演節目精彩。', en:'Competition in the south of France with spectacular shows.', where:W('法國 · 4 月','France · Apr')},
    {name:'Rock That Swing Festival', url:'https://www.rockthatswing.com', zh:'慕尼黑的大型搖擺節。', en:'Large swing festival in Munich.', where:W('德國 · 2 月','Germany · Feb')},
    {name:'Camp Jitterbug', url:'https://www.campjitterbug.com/', zh:'西雅圖老牌營隊，陣亡將士紀念日週末。', en:'Seattle’s long-running camp over Memorial Day weekend.', where:W('美國 · 5 月','USA · May')},
    {name:'Camp Hollywood', url:'https://camphollywood.net/', zh:'洛杉磯營隊，National Jitterbug Championships 在此舉辦。', en:'LA camp that hosts the National Jitterbug Championships.', where:W('美國 · 9 月','USA · Sep')}
  ]},
  { title:W('看懂比賽','Understanding competitions'), items:[
    {name:'ILHC 比賽規則', url:'https://ilhc.com/?p=1432', zh:'Strictly、Classic、Showcase、Team 等組別的定義。', en:'Definitions of Strictly, Classic, Showcase, Team and other divisions.', tags:['en','free']},
    {name:'Jack and Jill（維基百科）', url:'https://en.wikipedia.org/wiki/Jack_and_Jill_(dance)', zh:'隨機配對即興比賽（也稱 Mix & Match）的形式說明。', en:'The random-partner improvised format (also called Mix & Match).', tags:['en','free']}
  ]}
]},

{ id:'read', icon:'🎧', title:W('閱讀與 Podcast','Read & listen'),
  groups:[
  { items:[
    {name:'Swungover*', url:'https://swungover.wordpress.com/table-of-contents/', zh:'Bobby White 的部落格：歷史、技巧、教學與文化，圈內最具代表性之一。', en:'Bobby White’s blog on history, technique, teaching and culture — one of the scene’s essential reads.', tags:['en','free','pick']},
    {name:'Yehoodi', url:'http://www.yehoodi.com/blog', zh:'老牌 Lindy Hop 社群媒體：新聞、專文與賽事轉播。', en:'Veteran Lindy Hop community media: news, features and event broadcasts.', tags:['en','free']},
    {name:'Integrated Rhythm (Podcast)', url:'https://podcasts.apple.com/us/podcast/integrated-rhythm/id1541989543', zh:'Chisomo Selemani 與 Bobby White 談種族、黑人經驗與爵士舞文化。', en:'Chisomo Selemani & Bobby White on race, Black experience and jazz dance culture.', tags:['en','free']},
    {name:'The Track with Ryan Swift (Podcast)', url:'https://podcasts.apple.com/podcast/id986251421', zh:'Lindy Hop 名人深度訪談，已停更但是很好的口述歷史。', en:'Long-form interviews with Lindy Hop figures; ended, but a fine oral history.', tags:['en','free']},
    {name:'What a Jazz (Podcast)', url:'https://open.spotify.com/show/6J98EG1uGLZyscNWDaBAIk', zh:'Elze Visnevskyte 主持的爵士與搖擺舞節目。', en:'Elze Visnevskyte’s show on jazz and swing dancing.', tags:['en','free']},
    {name:'Swing Dance Home：Podcast 總覽', url:'https://swingdancehome.com/en/podcasts-for-swing-lindy-hop-dancers/', zh:'整理好的搖擺舞 Podcast 清單。', en:'A curated list of podcasts for swing dancers.', tags:['en','free']},
    {name:'Swing Dance Inspiration (Substack)', url:'https://swingdance.substack.com/', zh:'Lainey Silver 的電子報，談靈感與社群。', en:'Lainey Silver’s newsletter on inspiration and community.', tags:['en','free']},
    {name:'lurklurk Lindy Hop 術語表', url:'https://lurklurk.org/lindyhop/glossary.html', zh:'舞步、握姿、音樂術語的英文詞彙表，看英文教學時好用。', en:'Glossary of moves, holds and music terms — handy alongside English lessons.', tags:['en','free']}
  ]}
]},

{ id:'community', icon:'💬', title:W('線上社群','Communities'),
  groups:[
  { items:[
    {name:'r/SwingDancing', url:'https://www.reddit.com/r/SwingDancing/', zh:'最大的英文搖擺舞討論區，問問題、找各城市場景都方便。', en:'The largest English swing forum — good for questions and finding scenes in any city.', tags:['en','free','pick']},
    {name:'Yehoodi (Facebook)', url:'https://www.facebook.com/Yehoodi/', zh:'Yehoodi 的社群專頁，追蹤國際圈內消息。', en:'Yehoodi’s page for international scene news.', tags:['en','free']}
  ]}
]},

{ id:'gear', icon:'👞', title:W('舞鞋與工具','Shoes & tools'),
  groups:[
  { items:[
    {name:'BPM 節拍偵測器', url:'../beat-detector/', zh:'本站小工具：用麥克風或手動點擊量出歌曲 BPM。', en:'This site’s own tool: measure a song’s BPM by microphone or tapping.', tags:['free']},
    {name:'Swing Tempo (Android)', url:'https://play.google.com/store/apps/details?id=fr.laurentlixfe.swingtempo', zh:'點擊算 BPM，並提示適合跳 Lindy 還是 Charleston。', en:'Tap for BPM, with a hint on whether it suits Lindy or Charleston.', tags:['free']},
    {name:'Swing 舞鞋品牌總覽', url:'https://slowfeetstudio.nl/2021/05/21/where-can-you-buy-swing-dance-shoes/', zh:'一次看 16 個舞鞋品牌，選鞋前先讀。', en:'Sixteen swing shoe brands compared — read before buying.', tags:['en','free','pick']},
    {name:'Saint Savoy', url:'https://www.saintsavoy.com/en/', zh:'維也納的手工復古舞鞋，可寄送全球。', en:'Handmade vintage-style dance shoes from Vienna, shipped worldwide.', tags:['paid']},
    {name:'Aris Allen', url:'https://arisallen.com/', zh:'美國品牌，專為搖擺舞者設計的麂皮底鞋款。', en:'US brand of suede-soled shoes designed for swing dancers.', tags:['paid']},
    {name:'Slide & Swing', url:'https://www.slideandswing.es/', zh:'西班牙舞鞋品牌，歐洲 Lindy 圈常見。', en:'Spanish dance shoe brand popular across Europe’s Lindy scene.', tags:['paid']},
    {name:'Re-Mix Vintage Shoes', url:'https://remixvintageshoes.com/pages/about-us', zh:'1910–60 年代鞋款復刻品牌（非專門舞鞋）。', en:'Reproductions of 1910s–60s footwear (not dance-specific).', tags:['paid']},
    {name:'Swing Fashion: Keds (Swungover)', url:'https://swungover.wordpress.com/2011/05/27/swing-fashion-keds/', zh:'平價入門選擇：帆布鞋與貼麂皮底的做法。', en:'The budget starter option: canvas sneakers, and adding suede soles.', tags:['en','free']},
    {name:'VintageDancer', url:'https://vintagedancer.com/site-map/', zh:'1920–50 年代服裝史與復古穿搭指南。', en:'Fashion history and vintage style guides for the 1920s–50s.', tags:['en','free']}
  ]}
]}
];
