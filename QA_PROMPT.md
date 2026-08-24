# Paste into the **QA tester** terminal. Do not change product. Do not write app code. Do not write a coder prompt.

You are a **QA engineer**. Test the **web app** as a real user on **three surfaces**. Find bugs. File a report the engineer can turn into a coder prompt.

**Do not** open Expo Go. **Do not** test a native IPA / TestFlight. This pass is **browser only**.

**Do not** fix code. If the page is down, start it; then test.

---

## URL

`http://localhost:8082`

Hard-refresh once (**Ctrl+Shift+R** / Safari: empty cache) so demo data re-seeds.

If it is down, from `D:\thirdspace`:

```bash
npx expo start --web --port 8082
```

Timezone: **Asia/Hong_Kong**. Today in this project is **24 Aug 2026**. Seed event dates are hardcoded around mid-August 2026 — see “Seed reality” below before you file a false bug.

---

## Three surfaces (you must use all three)

Same app. Same checklists. Mark **Surface** on every fail.

| Surface | How to open | What “good” looks like |
| --- | --- | --- |
| **PC** | Chrome (or Edge) **full window**, ≥1280px wide | App sits in a **phone frame** (~390×844) on a stone stage. **Not** a desktop website. All clicks, forms, tabs, map, checkout still work inside that frame. |
| **Android** | Chrome DevTools → device toolbar → **Pixel 7 / Pixel 8** (~412×915), **or** a real Android phone Chrome to the same URL | Phone chrome, touch-sized targets, no desktop layout. Same workflows as PC. |
| **iOS** | Chrome DevTools → **iPhone 14 / 15** (390×844), **and if you have a phone:** iPhone **Safari** to the same URL on the LAN | Same as Android. Extra watch: Safari keyboard covering inputs, map pan vs page scroll, file picker, safe-area / header not under the notch. |

**Minimum if you only have a laptop:** one Chrome window at desktop width (PC) + DevTools Pixel (Android) + DevTools iPhone (iOS). Write at the top of the report: `Devices: emulated` or `Devices: real Android / real iPhone Safari`.

**Real phones (do this if you can):** same Wi‑Fi as the PC. Open `http://<PC-LAN-IP>:8082` (not `localhost` on the phone). Camera / WeChat / Expo Go are **out of scope**.

### Storage (do not mix this up)

Data is **this browser only** (AsyncStorage). Wipe site data = demo resets.

- Same Chrome tab, switching DevTools from desktop → Pixel → iPhone = **same login / same tickets**. That is OK for UI checks.
- Chrome vs Safari vs a real phone = **different** data. Log in again. Do not fail “Alex has no tickets” on a fresh Safari.
- Log out in **Profile → Settings** before switching demo character **on that browser**.

---

## Demo logins

**Password for every demo account:** `thirdspace`

| Email | Name | Role |
| --- | --- | --- |
| `demo@thirdspace.hk` | Alex | user |
| `host@thirdspace.hk` | Lin | organizer |
| `admin@thirdspace.hk` | Admin | admin |
| `chen@thirdspace.hk` | Chen Shu | extra organizer (optional) |

Login screen also has chips for Alex / Lin / Admin.

---

## Seed reality (24 Aug 2026) — do not fail these as bugs

After a hard refresh, seeded events look like this:

| Event | When | Price | Notes |
| --- | --- | --- | --- |
| After-work Jazz (Wan Chai) | 21 Aug, started | HK$250 | Past. Photo must still show. Join should be **started**, not Join. |
| Library Reading Night | 20 Aug | Free | Past. Alex **already has** this ticket. |
| Film Photo Walk | 22 Aug | HK$150 | Past. |
| Sunrise Hike | 23 Aug | Free | Past. |
| Weekend Market (Causeway Bay) | 22 Aug | Free | Past **and** full (8/8). |
| Old Street Sketching | 10 Aug | HK$120 | Past. Alex **already has** this ticket. Photo must still show. |
| **Pottery Evening (Central)** | **25 Aug 19:00** | **HK$380** | **Upcoming. Paid.** Use this for checkout. |
| **Rooftop Meet-up (Mong Kok)** | **28 Aug 20:00** | **HK$80** | **Upcoming. Paid.** |

Alex’s seeded tickets are **both past**. **Upcoming** on Tickets may be **empty** until Alex joins Pottery or Rooftop. That is **pass**, not a bug.

There is **no free upcoming** seed event. To test **free Join**: Lin (or Alex) **creates** a free event dated after now (create form defaults around **5 Sep 2026**).

To test **waitlist**: Market is full but already ended. Create a **capacity 1** future event as Lin → join as Alex → sign up a **new** user → that user should see waitlist.

---

## Out of scope (do **not** fail)

- App Store / Play / TestFlight / Expo Go / 上架.
- Native iPhone Metro QR (`Project is incompatible`) — different project; not this web pass.
- Real money, live Stripe, real Google Maps API.
- Firebase / own backend.
- Pixel-perfect Figma. Vibe: stone `#F6F4F1`, pine `#1F3D34`, photos, not purple.
- Google Sign-In popup if `.env` has no web client id — banner “not configured” + **email login still works** = **pass**. Record it as a note, not a fail.
- Push notifications. Settings rows **Notifications / Security / Privacy / Terms** may say “soon” or a hint — **pass**.
- Host stars/score, ticket **QR**, 5th **Saved** tab, approval queue to publish.
- Nominatim / typing a random street OSM does not know. Search **district name** or **event name** only.
- Google iOS client id empty.

**Product that is frozen (fail if the app violates this):**

- Exactly **4 tabs:** Discover, Districts, Tickets, Profile. Saved lives **inside Profile**, not a tab.
- **Pass = ticket card.** No QR.
- Stamps = join badges, not money coupons.
- Chat = **ticket holders** only.
- Copy: **one language per screen** (Settings: 繁中 / English / 简体). Fail if one card mixes English + Chinese labels.
- Map is **OpenStreetMap**, not Google Maps.
- Test pay card **`4242 4242 4242 4242`** only. No real charge.
- Create event is on **every** Profile (Alex can become organizer).

---

## How to work

1. **PC first** — walk **every** section below end-to-end. This is the source of truth for “does the product work.”
2. **Android viewport** — repeat the same journeys. You may reuse the Chrome session. Hunt layout, tap, keyboard, map, photos, checkout.
3. **iOS viewport** (Safari if you have it) — same again. Hunt Safari-only breaks.

If a flow already failed on PC, still **try it** on Android/iOS once. Say whether it is **all surfaces** or **one surface**.

Take screenshots for every fail (save under `qa-artifacts/` if you can).

---

## A — Boot and chrome (all surfaces)

1. URL loads. No white screen, no boot error, no infinite spinner.
2. **PC:** stone stage + **phone frame**. Fail if the app goes **full-bleed wide** (multi-column desktop, 5-column grids).
3. **PC:** tabs, buttons, inputs, map, sheets all usable **inside** the frame (not clipped, not unclickable).
4. **Android / iOS:** layout is a phone, not a stretched desktop site.
5. Header has air under the top (not kissing the bezel / notch).
6. Bottom tabs always reachable. Content not trapped under the tab bar.
7. No horizontal page-bleed (sideways sneak-scroll of the whole app).
8. Stone/cream/pine. No old purple JPEG chrome.
9. No Discover **bell**. No search **sliders** that do nothing.

---

## B — Auth

10. Login chips: Alex / Lin / Admin. Each lands as that person.
11. Email + password form: correct `thirdspace` works. Wrong password is rejected with an error (no crash).
12. **Create account:** switch to sign up, new email + password + name → **Interests** screen → pick moods **Continue** → Discover. Repeat once with **Skip**. New user is **not** admin.
13. Refresh (F5) while logged in: still logged in.
14. Profile → Settings → **Log out** → login screen. Switch character.
15. Google button: if not configured, email path still works = pass.

---

## C — Discover (Alex)

16. Exactly 4 tabs.
17. **Popular now:** cards have **real photos**, not grey/black empty. **After-work Jazz** and **Old Street Sketching** must show photos.
18. Popular **See all** expands extra photo cards (not a dead control).
19. Recommended rows have **thumbnails**.
20. Search filters the list. Try Chinese title **and** English title (e.g. Jazz / 爵士, Pottery / 陶藝). Empty search restores the list. Fail if the control does nothing or errors.
21. **5 moods** (Quiet / Create / Meet / Weekend / Nearby) **filter**. No dead “See all” on By mood.
22. Heart on a card → saved. Profile **Saved** lists it. Heart again unsaves. Saved is **not** a 5th tab.
23. Open Jazz → **hero is a photo** (concert/stage), not a blank slab. Back works.

---

## D — Districts

24. Real **OSM** map (OpenStreetMap tiles / OSM chrome), not Google, not the old green blob “New Territories / Kowloon / HK Island.”
25. Under the map: **event rows only**. Fail on `Central 1` / `Eastern 0` district index.
26. Search **Wan Chai** / **灣仔** filters the list and recentres the map.
27. Tap a row → event page **and** map had recentred. Default (cleared search) = whole HK.
28. Pan / zoom the map. Fail if the **page** scrolls instead of the map (especially iOS).
29. OSM attribution visible (do not crop the credit off the card).

---

## E — Event page, join, pay, waitlist, cancel, chat (do the real path)

Use **Pottery Evening** (paid, upcoming) and a **Lin-created free future event** as needed.

30. Event page: title, date/time (HK), place, price/free, capacity `joined / cap`, host row, photo.
31. Host row → host page: name, photo, bio, their events. **No stars.** Follow / unfollow. Followed hosts can show on Discover recommended.
32. **Report:** open report, send a reason → banner sent. (Seed already has one report on Rooftop.)
33. **Past event** (Jazz / Library): primary CTA is **started** (or equivalent), **not** Join.
34. **Free upcoming** (create if needed): Join → ticket appears under **Tickets → Upcoming**. Pass card shows title, date, place, Free. **No QR.**
35. **Paid upcoming** (Pottery or Rooftop): Join → **Checkout**. Photo + price. Card **`4242 4242 4242 4242`** succeeds → Tickets. A **non-4242** card is **rejected**. No real charge. (Hard-refresh after a failed pay if the demo card field needs a clean try.)
36. **Waitlist:** Lin creates capacity **1**, date in the future. Alex joins (fills it). **New signup user** opens it → **Join waitlist**. They are waitlisted, not a second seated ticket.
37. **Cancel:** on a **not-yet-started** joined event, Cancel booking → ticket gone / cancelled. If someone was waitlisted, they can get promoted (spot-check if you set this up in 36).
38. **Chat:** with a ticket (Alex already holds Library — even if past, if chat still opens, send a message). **Without** a ticket, cannot post (error / no send / blocked). Fail if a stranger can spam the holder thread.
39. Activity page comments vs holder chat: holder thread is the Chat screen; do not crash either.

---

## F — Tickets

40. Upcoming / Past segments work.
41. Fresh Alex: Past has Library + Sketch. Upcoming empty until they join — **pass**.
42. After joining Pottery: Upcoming shows it. **5-day strip** still there.
43. **See all / 查看全部** → **month sheet** (Sun–Sat, prev/next month). Days with tickets have a **dot**. Tap a day → list filters. Empty day → empty state. **Clear** shows all tickets again.
44. Tap a pass → event page. **No QR** anywhere on the pass.

---

## G — Profile + Settings (all three characters)

45. **Alex** has a **face** (not empty circle). Journey / stamps exist (join badges, **not** coupons). Saved list. Following (seed: follows Chen). **Create event** button exists. **No** Admin Reports / shield.
46. **Lin** has a **different face**. Hosting list + Create event. **No** Admin Reports.
47. **Admin** has a **third face**. Profile → **Reports** (shield). Same 4 tabs.
48. Settings: language **繁中 / English / 简体** — **whole screen** changes (tabs, buttons, empty states). Fail mixed EN+中文 on one card.
49. Settings: change **home district** → it sticks after leaving Settings.
50. Settings: Notifications / Security / Privacy / Terms may be “soon” = pass. About can show the tagline. Logout works.

---

## H — Create / edit event (Lin, then once as Alex)

51. Create: stock photo **chips show pictures**. Title, district, address, date/time, free vs price, capacity, mood. Save → event page → appears on **Discover**.
52. **Add photo** (camera/upload): picking a file sets the cover. **Cancel / deny** must **not** silently slap a jazz stock photo on the event. Error banner is OK.
53. Edit **her own** event from the event page. Change title → it updates. Alex must **not** get a working edit on Lin’s event (no edit, or it refuses).
54. New event visible in Lin Profile hosting list.

---

## I — Admin

55. Alex / Lin cannot open Admin Reports (no button, or screen refuses).
56. Admin Reports: pending / processed / all. Seed pending report on Rooftop (spam). Event thumb can show.
57. **Resolve** a report → it leaves pending.
58. **Hide** an event → log in as Alex → it is **gone from Discover**. Unhide restores (if the control exists).
59. **Feature** / unfeature if the control exists — Discover featured treatment changes or at least no crash.
60. **Ban:** sign up a throwaway user first (do **not** leave `demo@` banned). Ban them as Admin → that email cannot log in (banned message). Unban → login works again.

---

## J — Language + time (spot-check, not a translation audit)

61. Switch to 繁中, walk Discover + one event + Tickets + Profile. Then 简体. Then back to English.
62. Dates/times feel like **Hong Kong**, not UTC-shifted a day off (calendar day of Pottery = **25 Aug**, not 24 or 26).

---

## K — Surface-specific (must try on Android **and** iOS, not only PC)

63. Type in search, login, checkout card, create-event fields, chat box. Keyboard must not permanently hide the focused field or the Send/Pay/Join button with no way to scroll to it.
64. Tab bar tappable; no dead zone at the bottom (especially iPhone home indicator).
65. Map pan/zoom vs list scroll (Districts).
66. Month calendar sheet: change month, tap a day, Close/Clear — not stuck, not off-screen.
67. Long titles do not smash the layout (event titles, ticket cards).
68. Photos still paint (Jazz, Sketch, avatars) on **each** surface — web used to blank `require()` images; that is a **blocker** if it regresses.
69. iOS Safari only (if real phone): page zoom on input focus is ugly but **pass** unless it breaks the layout permanently. Crash / white screen / cannot type = fail.

---

## Severity

- **Blocker:** cannot demo (blank photos, cannot login, cannot join/pay, map missing, crash, wrong SDK-style white screen, cannot use a tab).
- **Major:** a stated workflow fails (waitlist, cancel, admin hide, calendar, language mixed, role leaked, chat without ticket, layout unusable on one surface).
- **Minor:** polish, spacing, copy, a control that is merely ugly.

---

## How to report

Start the report with:

```
QA WEB — Thirdspace
URL:
Date:
Devices: emulated | real (list them)
Browsers:
SDK / what the terminal said (if you saw it):
Seed: hard-refresh yes/no
```

Then **every fail**:

```
ID: WEB-1
Severity: Blocker | Major | Minor
Surface: PC | Android | iOS | all
Browser: Chrome 390 | Chrome desktop | Safari iPhone | ...
Character: Alex | Lin | Admin | new user | n/a
Workflow: (e.g. checkout, Districts map, create event)
Steps:
Expected:
Actual:
Screenshot:
Repro: always | intermittent
```

Then a **matrix** (pass / fail / skipped) for:

| Workflow | PC | Android | iOS |
| --- | --- | --- | --- |
| Login / logout / signup | | | |
| Discover photos + moods + search | | | |
| Districts OSM | | | |
| Join free | | | |
| Checkout 4242 | | | |
| Waitlist + cancel | | | |
| Chat holders only | | | |
| Tickets calendar | | | |
| Create / edit event | | | |
| Admin hide / ban / reports | | | |
| Language 繁/EN/简 | | | |
| Profile faces + 4 tabs | | | |

**Skipped** needs a reason (e.g. “no real Safari”).

End with:

- **QA PASS for demo** — all Blockers pass on **all three** surfaces (minors allowed).
- **QA FAIL** — any Blocker, **or** a Major that breaks a demo workflow on **any** required surface.

List Blockers first, then Majors, then Minors. No essay. No patch. No coder prompt.

---

## Start here

1. Hard-refresh `http://localhost:8082` in a **wide** Chrome window (PC).
2. Alex → Popular photos (Jazz + Sketch) → Districts OSM → Tickets (Past ok empty Upcoming) → join Pottery with **4242**.
3. Lin → create a **free** future event → Alex joins it.
4. Admin → Reports / hide spot-check.
5. Repeat photos, map, checkout, calendar, create, tabs on **Android** viewport, then **iOS** viewport.

Go.
