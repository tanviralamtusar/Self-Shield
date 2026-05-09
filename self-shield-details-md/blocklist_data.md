# Self-Shield — Default Block Lists

## Structure
Stored in repo: `self-shield-blocklists/`
Format: JSON files per category
Versioned: each file has a `version` integer — bumped on any change
Pushed to devices: via admin dashboard "Update System Lists" or automatic on app update

---

## Category: Pornography (`lists/pornography.json`)

```json
{
  "id": "sys-porn-001",
  "name": "Pornography",
  "version": 1,
  "type": "hostname",
  "entries": [
    "pornhub.com", "xvideos.com", "xnxx.com", "xhamster.com",
    "redtube.com", "youporn.com", "tube8.com", "spankbang.com",
    "beeg.com", "tnaflix.com", "porn.com", "sex.com",
    "brazzers.com", "bangbros.com", "naughtyamerica.com",
    "onlyfans.com", "fansly.com", "manyvids.com",
    "rule34.xxx", "e621.net", "nhentai.net", "hentaihaven.xxx",
    "literotica.com", "reddit.com/r/nsfw", "reddit.com/r/gonewild"
  ]
}
```

---

## Category: Gambling (`lists/gambling.json`)

```json
{
  "id": "sys-gamble-001",
  "name": "Gambling & Betting",
  "version": 1,
  "type": "hostname",
  "entries": [
    "bet365.com", "betway.com", "draftkings.com", "fanduel.com",
    "pokerstars.com", "888casino.com", "williamhill.com",
    "ladbrokes.com", "unibet.com", "betfair.com",
    "bovada.lv", "mybookie.ag", "betonline.ag",
    "casino.com", "partypoker.com", "fulltiltpoker.com",
    "sportsbettingcommunity.com", "pinnacle.com"
  ]
}
```

---

## Category: LGBTQ+ Content (`lists/lgbtq.json`)

```json
{
  "id": "sys-lgbtq-001",
  "name": "LGBTQ+ Content",
  "version": 1,
  "type": "hostname",
  "entries": [
    "grindr.com", "scruff.com", "jackd.com", "hornet.app",
    "her.app", "lgbtqnation.com", "queerty.com",
    "out.com", "advocate.com", "pride.com",
    "gaytimes.co.uk", "pinknews.co.uk"
  ]
}
```

---

## Category: Islamophobic Content (`lists/islamophobic.json`)

```json
{
  "id": "sys-islamophobic-001",
  "name": "Islamophobic Sites",
  "version": 1,
  "type": "hostname",
  "entries": [
    "jihadwatch.org", "faithfreedom.org", "thereligionofpeace.com",
    "answeringislam.org", "prophetofdoom.net"
  ]
}
```

---

## Category: Default Blocked Keywords (`lists/keywords.json`)

```json
{
  "id": "sys-keywords-001",
  "name": "Harmful Keywords",
  "version": 1,
  "type": "keyword",
  "entries": [
    { "value": "porn", "is_regex": false },
    { "value": "xxx", "is_regex": false },
    { "value": "sex video", "is_regex": false },
    { "value": "nude", "is_regex": false },
    { "value": "naked", "is_regex": false },
    { "value": "casino", "is_regex": false },
    { "value": "bet now", "is_regex": false },
    { "value": "free spins", "is_regex": false },
    { "value": "\\bxnxx\\b", "is_regex": true },
    { "value": "\\bxvideos\\b", "is_regex": true }
  ]
}
```

---

## In-App Blocking Patterns (`lists/inapp_patterns.json`)

Server-side JSON defining UI element patterns for Accessibility Service.
Updated without requiring an app update.

```json
{
  "version": 3,
  "patterns": [
    {
      "app": "com.instagram.android",
      "targets": [
        { "type": "view_id", "value": "com.instagram.android:id/clips_tab", "block_type": "reels" },
        { "type": "view_id", "value": "com.instagram.android:id/reel_viewer_root", "block_type": "reels" }
      ]
    },
    {
      "app": "com.google.android.youtube",
      "targets": [
        { "type": "content_desc", "value": "Shorts", "block_type": "shorts" },
        { "type": "view_id", "value": "com.google.android.youtube:id/reel_player_page_container", "block_type": "shorts" }
      ]
    },
    {
      "app": "com.whatsapp",
      "targets": [
        { "type": "content_desc", "value": "Status", "block_type": "status" },
        { "type": "view_id", "value": "com.whatsapp:id/status_list_main_view", "block_type": "status" },
        { "type": "content_desc", "value": "Channels", "block_type": "channels" }
      ]
    },
    {
      "app": "com.zhiliaoapp.musically",
      "targets": [
        { "type": "full_block", "value": true, "block_type": "feed" }
      ]
    },
    {
      "app": "com.facebook.katana",
      "targets": [
        { "type": "content_desc", "value": "Reels", "block_type": "reels" },
        { "type": "view_id", "value": "com.facebook.katana:id/video_reels_tab", "block_type": "reels" }
      ]
    },
    {
      "app": "com.twitter.android",
      "targets": [
        { "type": "content_desc", "value": "For you", "block_type": "feed" }
      ]
    }
  ]
}
```

---

## Quran/Dua Prompts for Focus Mode (`lists/focus_prompts.json`)

```json
{
  "version": 1,
  "prompts": [
    {
      "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "transliteration": "Bismillahir rahmanir raheem",
      "translation": "In the name of Allah, the Most Gracious, the Most Merciful"
    },
    {
      "arabic": "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
      "transliteration": "Wa maa khalaqtul jinna wal insa illaa liya'budoon",
      "translation": "I did not create jinn and humans except to worship Me. (51:56)"
    },
    {
      "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      "transliteration": "Alaa bidhikrillahi tatma-innul quloob",
      "translation": "Verily, in the remembrance of Allah do hearts find rest. (13:28)"
    }
  ]
}
```
