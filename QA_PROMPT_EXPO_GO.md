# Paste into the **QA tester** terminal. Do not change product. Do not write app code. Do not write a coder prompt.

You are QA. The boss opens Thirdspace in **Expo Go** and **gets in**. Then **lots of features do not work**, and the **map cannot be moved**. Your job: **find what is broken in Expo Go**. One report. We will write a coder prompt from that report — not before.

**Chrome is not a pass.** Use Chrome only to compare (“works on web, dead in Go”).

Do **not** fail this pass for “App Store Expo Go is SDK 54.” If you **opened the app**, you are in. Write **how** you opened it at the top.

---

## How to open (Expo Go)

PC: `D:\thirdspace` → Metro must stay running:

```bash
npx expo start
```

If the phone is not on the same Wi‑Fi, use tunnel (`npx expo start --tunnel`). Scan the QR with the **Camera** (or Expo Go scanner), **not WeChat**.

Write at the top of the report:

```
Client: Expo Go
Phone: Android | iPhone
Expo Go version (Settings in Go, if you see it):
How opened: LAN QR | tunnel | other
App actually launched? yes/no
If no, the exact red error (then stop — that is a different ticket)
```

Password **`thirdspace`**. Log out **Profile → Settings** before switching.

| Email | Who |
| --- | --- |
| `demo@thirdspace.hk` | Alex (user) |
| `host@thirdspace.hk` | Lin (host) |
| `admin@thirdspace.hk` | Admin |

Timezone **Asia/Hong_Kong**. ~24 Aug 2026. Alex’s Library + Sketch tickets are **past**. Upcoming empty until they join = OK.

Data is **this phone**. Chrome tickets are not on the phone.

---

## Out of scope (do not fail)

- 上架 / TestFlight / App Store listing.
- Real money. Card **`4242 4242 4242 4242`** only.
- Firebase / own server.
- Pixel-perfect Figma.
- Push. Settings “soon”.
- Host stars, ticket QR, 5th Saved tab, approval queue.
- Google Maps API — this app is **OpenStreetMap**.
- Random street names OSM does not know (search **district or event name**).
- Google Sign-In if it errors in Go — **email login must work**. Record Google as a note.

---

## Hunt 1 — Map (boss: cannot move it)

**Districts** tab. This is the first Blocker if it fails.

Finger **on the map** (not on the list):

1. OSM tiles visible (streets / harbour), not a grey/green empty box, not Google.
2. **Drag** — the **map** pans. Fail if the **whole page** scrolls and the map stays glued.
3. **Pinch** zoom in and out on the map.
4. After you pan, the map stays where you left it (does not jump back instantly).
5. Search **Wan Chai** / **灣仔** — list filters, map recentres. **Then pan again** — still the map, not the page.
6. Tap an event row — event opens. Back. Map still there.
7. Scroll the **event list** under the map — list moves, map should not steal that scroll.
8. OSM credit visible (do not crop it off).

If 2 or 3 fail, that is the boss bug. Screenshot **finger on map, page scrolling** vs map moving.

---

## Hunt 2 — Features that often die in Expo Go

For each: **works / broken / skipped**. If broken: steps, expected, actual, screenshot. Compare Chrome only if you are unsure.

### Photos
9. Discover Popular: Jazz + Sketch **photos**, not grey cards. Open Jazz → hero photo.
10. Profile card: Alex / Lin / Admin **three different faces**. Never Guest.

### Tabs + chrome
11. Exactly **4 tabs:** Discover, Districts, Tickets, Profile. All four **open** (not a dead tap / wrong screen).
12. Headers not under the notch / status bar. Tab bar tappable (not under home indicator).

### Discover
13. Search **Jazz** and **爵士** both hit After-work Jazz.
14. Moods filter. Popular See all expands.
15. Heart save → Profile **Saved** (not a 5th tab).

### Join / pay / tickets
16. Lin creates a **free future** event if needed (or join one that has not started). Alex **Join** → Tickets Upcoming. **No QR** on the pass.
17. Pottery (or a paid upcoming): checkout **4242** succeeds; a non-4242 card fails. Keyboard must not eat Pay.
18. Tickets **See all** month calendar: change month, tap a day, Close. Sheet not stuck off-screen.
19. Past event (Jazz): CTA is started, not Join.

### Chat
20. With a ticket (Library): Chat opens, you can **send**. Without a ticket: cannot post.

### Profile (boss card + rows)
21. Pine membership card, cream rows. No Create on Profile home.
22. Edit Profile: change a field, Save. Photo pick: Allow vs Deny (Deny must **not** slap jazz stock).
23. History, Your Events, Saved, Following, Language, Settings all **open**.
24. **Become an organizer** (new signup, not demo@ first): in-app **Not now / Confirm** (modal). Not a dead tap. Confirm → Host, Create on **Your Events**.
25. Language 繁 / EN / 简 — whole screen. 简 must not hit the Tickets tab.

### Create (Lin)
26. Stock photo chips paint. Create publishes. Event shows on Discover **with a photo**.

### Admin
27. Reports opens. Seed pending on Rooftop. Resolve / Hide exist. Alex has no Reports row.

---

## Hunt 3 — “Does nothing / half the app missing”

Tap everything that looks tappable. File if:

- Button does nothing
- Screen is blank / white / infinite spinner
- Keyboard covers the only button with no way to scroll
- Back does nothing
- WebView / map / calendar / photo picker crashes Go
- Feature works on Chrome and is **dead in Go** (mark `Go-only`)

---

## Severity

- **Blocker:** cannot demo on Expo Go (map unusable, blank Discover, cannot login, tabs dead, crash).
- **Major:** a stated workflow fails only (or also) in Go — join, pay, create, Become, calendar, photos, chat.
- **Minor:** spacing, copy, one awkward tap.

---

## Report (this is what we need for the coder)

```
QA EXPO GO
Phone:
Expo Go version:
How opened:
Launched: yes/no
```

Each fail:

```
ID: GO-1
Severity: Blocker | Major | Minor
Go-only?: yes | no | unknown
Workflow: map pan | join | photos | …
Steps:
Expected:
Actual:
Screenshot:
Repro: always | intermittent
```

**Map first** in the list if it fails.

Matrix (pass / fail / skipped):

| Workflow | Expo Go |
| --- | --- |
| Login / logout | |
| Discover photos + search | |
| **Map pan / pinch** | |
| Map search Wan Chai | |
| Join free | |
| Pay 4242 | |
| Tickets calendar | |
| Chat holders | |
| Profile rows | |
| Become confirm | |
| Create event + photo | |
| Admin Reports | |
| Language 繁/EN/简 | |

**QA FAIL for Expo Go** if the map cannot be moved, or any Blocker, or a Major that matches “features don’t work.”  
**QA PASS for Expo Go** only if Hunt 1 pan/pinch **and** the demo path (login → photos → join or 4242 → tickets → Profile) all work **on the phone**.

No essay. No patch. No coder prompt. We write the coder prompt **after** this report.

## Start

Launch in Expo Go → Alex Discover photos → **Districts: drag and pinch the map** → Wan Chai → Join/pay → Profile rows → Lin create → send the report.

Go.
