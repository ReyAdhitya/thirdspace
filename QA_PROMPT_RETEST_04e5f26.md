# Paste into the **QA tester** terminal. Do not change product. Do not write app code.

You are QA. **Retest only.** Commit **`04e5f26`** claimed to fix WEB-1…WEB-5. Confirm they are actually fixed in the browser. Do **not** re-walk the whole app. Do **not** open Expo Go.

**URL:** `http://localhost:8082`  
Hard-refresh once (**Ctrl+Shift+R**). If down: `npx expo start --web --port 8082` from `D:\thirdspace`.

**One surface is enough:** wide Chrome, phone frame. Password `thirdspace`.  
Alex = `demo@thirdspace.hk`. Lin = `host@thirdspace.hk`. Log out in Profile → Settings before switching.

If a check still fails, file it with the **old ID** (WEB-1 … WEB-5). New bugs only if they block these five.

---

## WEB-1 — Discover English search

Alex → Discover.

1. Type **Jazz** → **After-work Jazz** is in the list (not empty).
2. Clear. Type **Pottery** → **Pottery Evening**.
3. Clear. Type **爵士** → Jazz still hits. Type **陶藝** → Pottery still hits.
4. Clear / empty query → full list comes back.

Fail if Jazz/Pottery show “Nothing here yet” / `searchEmpty`.

---

## WEB-2 — one language on Settings

Alex → Profile → Settings → switch to **繁體中文**.

5. Language row is **語言** only. **No** “Language” on that row.
6. Rest of Settings is 繁 (設定, 登出, 地區…). No English glued onto a Chinese label.
7. Switch **简体** → row is **语言** only.
8. Switch **English** → row is **Language**. Login chip/email still work after you log out and back in (spot-check; Google / Thirdspace as names = pass).

---

## WEB-3 — web file pick paints

Lin → Profile → Your Events → **Create event** (or Create if it is still on her Profile).

9. **Stock chips** still show pictures. Pick a chip → cover on the form is that photo.
10. **Add a photo** → choose any local jpg (not a stock chip). Form cover must **show that photo**, not a grey slab.
11. Publish a cheap future free event. Open it → **hero is the picked photo**, not grey.
12. Create again → Add a photo → **cancel / deny**. Cover must **not** silently become Jazz. Error banner is OK.

Fail if the picked file is grey on the form **or** the event page.

---

## WEB-4 — empty search copy

Alex → Discover → search `zzzzzzz` (or any garbage that matches nothing).

13. Empty body is **about search** (`searchEmpty` — e.g. “Nothing matches that search…”).
14. It is **not** “No tickets yet. Join something on Discover.”

---

## WEB-5 — “1 event”

Alex → Districts → search **Wan Chai** (one Jazz row).

15. Caption is **1 event**, not **1 events**.
16. Clear search (many rows) → **N events** (plural). 繁/简 can stay `N 個活動`.

---

## Report

```
QA RETEST — 04e5f26
Hard-refresh: yes/no

WEB-1 search EN/中: pass | fail
WEB-2 語言 / 语言: pass | fail
WEB-3 file-pick photo: pass | fail
WEB-4 searchEmpty: pass | fail
WEB-5 1 event: pass | fail
```

If all five **pass** → **QA PASS for 04e5f26**.  
If any fail → **QA FAIL**, reuse WEB-1…WEB-5, steps / expected / actual / screenshot.

No full matrix. No coder prompt. Go.
