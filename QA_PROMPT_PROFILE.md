# Paste into the **QA tester** terminal. Do not change product. Do not write app code. Do not write a coder prompt.

You are QA. Commit under test: **`dac1617`** — Profile rebuilt as a pine membership card + cream chevron stack.

Prove **the new Profile works**, **every row goes somewhere real**, and **the rest of the app still works**. File bugs. Engineer will turn fails into a coder prompt.

**Web only.** `http://localhost:8082`  
If down: `npx expo start --web --port 8082` from `D:\thirdspace`.  
Hard-refresh once (**Ctrl+Shift+R**).

Password for every demo account: **`thirdspace`**  
Log out in **Profile → Settings** before switching character.

| Email | Name on card | Role |
| --- | --- | --- |
| `demo@thirdspace.hk` | Alex | **user** (sees Become an organizer) |
| `host@thirdspace.hk` | Lin | organizer (no Become row) |
| `admin@thirdspace.hk` | Admin | admin (Reports row, no Become) |

Timezone **Asia/Hong_Kong**. Today ~ **24 Aug 2026**. Alex’s seeded tickets (Library 20 Aug, Sketch 10 Aug) are **past**. Upcoming Tickets empty until they join something — **pass**.

---

## Surfaces

Walk the **full Profile checklist on PC** (wide Chrome, phone frame ~390). Then repeat Profile home + Become confirm + Edit Profile + Language on **Android** (Pixel DevTools) and **iOS** (iPhone DevTools / Safari if you have it).

Mark **Surface** on every fail. Chrome vs Safari = different storage. Same Chrome desktop ↔ DevTools = same login.

---

## Out of scope (do not fail)

- Expo Go / TestFlight / 上架 / `Project is incompatible`.
- Real money, Firebase, Google Maps, push, pixel-perfect Figma.
- Google Sign-In popup if not configured — email login works = pass.
- Host stars, ticket QR, 5th Saved tab, approval queue.
- Settings rows that say “soon”.
- **Do not** leave `demo@` as organizer if you still need Alex-as-user later. Become-host **writes to this browser**. Schema is still 6 — hard-refresh will **not** reset a promoted Alex. Use a **new signup** for Become, **or** wipe site data after, **or** do Become **last**.

---

## A — Profile home (the JPEG structure, our skin)

Login as **Alex**. Open **Profile**.

1. **Exactly 4 tabs:** Discover, Districts, Tickets, Profile. Fail if Saved is a tab.
2. **Pine membership card** (deep green `#1F3D34`), not orange, not a tiny avatar-only header.
3. Card has the **arch mark** (doorway), **not** a robot, **not** QR / CHECKIN.
4. Card shows **Alex’s face** (real photo) and **Alex / 阿樂** — **never** the word `Guest`.
5. Subline is role + district + Hong Kong (e.g. Member · Central · Hong Kong). **No** four-number stat strip. **No** fake Fans count.
6. **No Create event button** on this screen.
7. Below the card: **cream rows**, icon + label + chevron, stacked with even gaps.
8. Alex’s rows, **in this kind of order:** Edit Profile → History → Your Events → Saved → Following → **Become an organizer** → Language → Settings.  
   Fail if Become is missing for Alex. Fail if Reports is on Alex.
9. No settings **gear** required on the header (Settings is a row). Fail if a QR sits on the header.

Then log **Lin**: same card idea, **Lin’s different face**, name 林岸 / Lin. Role reads **Host** (or 搞手). **No** Become row. **No** Reports.

Then log **Admin**: **third different face**. Role **Admin**. **No** Become. **Has Reports**.

---

## B — Every row (Alex first; wipe/signup rules above)

### Edit Profile
10. Opens a form: photo, display name, bio, district. Back works.
11. Change **name** + **district** → Save → back on the **card** (name + district updated).
12. Change **bio** → Save → open a host/event path if needed; at least it persists when you reopen Edit Profile.
13. **Photo:** pick a file → preview updates → Save → card face updates. **Cancel / deny** must **not** slap a jazz stock photo. Error banner is OK.
14. English vs 繁: editing while in English may write the English name field. Do not fail that. Fail if Save crashes or the card goes blank.

### History
15. Alex sees **joined** events (Library + Sketch) as rows. Tap → event page. Back returns to History.
16. **Stamps / impressions** still here (join badges). Copy says they are **not coupons** (`stampsHint` or equivalent). Alex has 2 joins — some badges locked, at least the first unlocked if threshold is 1.
17. Empty History: use a **brand-new signup** (skip interests) → History is an empty state, not a crash.

### Your Events
18. **Alex (still user):** **no** Create event button. Empty copy tells them to become an organizer. Not Lin’s jazz/pottery list.
19. **Lin:** **Create event** button at the top. List of **her** hosted events with `joined / capacity`. Tap → event page. She can still **edit her own** event from the event page.
20. Lin Create: stock chips show pictures, save a **free future** event (form defaults ~ Sep 2026) → appears on Discover **and** back in Your Events.

### Saved
21. Alex seed-saves Jazz. Saved lists **After-work Jazz** (photo not blank). Tap → event.
22. Discover heart **unsaves** → Saved list drops it. Heart again → it returns. Still **not** a 5th tab.

### Following
23. Alex follows **Chen**. Row with face + name → host page (bio, events, **no stars**). Back works.
24. Unfollow on the host page → Following list updates (empty or without Chen).

### Become an organizer (user only)
25. **Lin / Admin:** row **absent**.
26. **New signup** (preferred) or Alex last: tap Become → a **confirm** (title + hint + Not now / Confirm).
27. **Not now** → still Member, row still there, Your Events still has no Create.
28. **Confirm** → banner that they can host. Row **gone**. Card role becomes Host. Your Events now shows **Create event**. Create one → it hits Discover.
29. **Web:** if Confirm/Cancel never appear (browser `alert` with only OK, or tap does nothing) → **Major** (workflow broken on the surface we ship in Chrome). Screenshot it.

### Language
30. Expand on Profile (not only Settings). Switch **繁中** → tabs, card role, **every visible row** change. Then **简体**. Then **English**.
31. Fail if one screen mixes English labels + Chinese labels (e.g. English “History” next to 「你的活動」 on the same stack).

### Settings
32. Still opens. Language + district still work (district may also live in Edit Profile — both must stay in sync or at least not fight).
33. **Log out** → login screen. Log back in as the same person.
34. “Soon” rows (security / privacy / terms) = pass.

### Admin Reports
35. Alex / Lin cannot open Reports (no row). If they somehow route there, it refuses.
36. Admin → Reports: seed pending on Rooftop still there. Pending / processed / all. Resolve works. Hide an event → check Discover as Alex (spot-check).

---

## C — Features still good (regression, do not skip)

Profile moved a lot of UI. Confirm the product demo path still works **as Alex** (or a user who is still a user).

37. Discover **Popular:** Jazz + Sketch **photos** visible, not grey cards. Recommended thumbs exist.
38. **Districts:** real OSM map, event rows only (no `Central 1` index). Search Wan Chai / 灣仔 filters + recentres.
39. **Tickets:** Past has Library + Sketch. **See all** month calendar still opens (dots, tap day, Clear). **No QR** on the pass. Copy may still say no QR.
40. Join a **free future** event (Lin’s new one, or create as Lin first) → ticket in Upcoming.
41. **Pottery Evening** (25 Aug, HK$380) or Rooftop: checkout **`4242 4242 4242 4242`** succeeds; a non-4242 card fails. No real charge.
42. Chat: ticket holder can send (Library chat is seeded). Without a ticket, cannot post.
43. After start (Jazz): CTA is started, not Join.
44. Phone frame on PC still a phone, not a full-bleed desktop site. Tabs always reachable.

---

## Severity

- **Blocker:** cannot open Profile, blank/Guest card, missing faces, crash on a row, cannot logout, Create still on Profile home as the only way to host, 5th tab, QR on the pass/card, photos blank on Discover.
- **Major:** a named row goes nowhere / empty when it should have seed data; Become confirm broken on web; Alex sees Create on Your Events before becoming host; Lin/Admin see Become; language mixed; Saved/Following/History orphaned; regression on join/pay/map/calendar.
- **Minor:** spacing, chevron alignment, card grid too loud, copy nits.

---

## How to report

```
QA PROFILE — dac1617
URL:
Devices:
Browsers:
Hard-refresh: yes/no
Alex still user? yes/no (if you promoted them, say so)
```

Each fail:

```
ID: PROF-1
Severity: Blocker | Major | Minor
Surface: PC | Android | iOS | all
Character: Alex | Lin | Admin | new user
Workflow: (e.g. Become an organizer, Edit Profile photo, History)
Steps:
Expected:
Actual:
Screenshot:
Repro: always | intermittent
```

Matrix (pass / fail / skipped):

| Workflow | PC | Android | iOS |
| --- | --- | --- | --- |
| Card (faces, no Guest, no QR) | | | |
| Row stack + 4 tabs | | | |
| Edit Profile (name / photo / district) | | | |
| History + stamps | | | |
| Your Events + Create (host only) | | | |
| Saved / Following | | | |
| Become an organizer confirm | | | |
| Language on Profile | | | |
| Settings logout | | | |
| Admin Reports | | | |
| Discover photos | | | |
| Districts OSM | | | |
| Tickets calendar / no QR | | | |
| Join free + pay 4242 | | | |

**QA PASS for demo** = no Blockers, and every Profile row works on PC (minors OK).  
**QA FAIL** = any Blocker, or a Major that breaks the boss Profile or the join/pay demo.

Blockers first, then Majors, then Minors. No patch. No coder prompt.

---

## Start here

1. Hard-refresh → Alex → **look at the card** (face, name, pine, no Guest, no QR, no Create).
2. Open **every row** once.
3. New signup → Become **Not now** then **Confirm** → Create from Your Events.
4. Lin Your Events + Admin Reports.
5. Smoke Discover photos, Districts map, Tickets calendar, one 4242 pay.
6. Repeat card + Become + Edit + Language on Android and iOS viewports.

Go.
