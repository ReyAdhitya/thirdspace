# Paste this to the **iOS QA tester** (or Lok). They test on a **real iPhone**. They do not write code.

You are QA. Goal: prove Thirdspace **works on iOS**, not Chrome. Boss said Expo Go hides / breaks features — you will **try every path**, then send **one report** back to the engineer.

**Do not** test in laptop Chrome as the main pass. Chrome is backup only. **Primary device = iPhone.**

---

## Which app to open (read this first)

Pick **one**. Write it at the top of your report.

**A. Real iOS build (preferred — this is what 上架 feels like)**  
TestFlight / internal EAS / development build installed on the phone.  
If the boss has this, **use it**. Expo Go is not this.

**B. Expo Go SDK 57 only (not the App Store Expo Go)**  
App Store Expo Go is **SDK 54**. This project is **SDK 57**. Store Expo Go **cannot** run it.  
If you must use Expo Go: install from [https://sign.expo.dev](https://sign.expo.dev) → **SDK 57** (Apple ID, ~7 days).  
PC must keep Metro running (`npx expo start` or `--tunnel`). Scan QR from Camera, not WeChat.  
Log into Expo Go as the same Expo account as the project owner if asked.

If a feature fails on **B** only, mark: `Client: Expo Go` vs `Client: TestFlight`. Do not mix them.

---

## Demo logins (password `thirdspace` for all)

Log out in **Profile → Settings** before switching.

| Email | Name | Role |
| --- | --- | --- |
| `demo@thirdspace.hk` | Alex | user |
| `host@thirdspace.hk` | Lin | organizer |
| `admin@thirdspace.hk` | Admin | admin |
| `chen@thirdspace.hk` | Chen Shu | extra organizer (optional) |

Timezone **Asia/Hong_Kong**. Settings: 繁中 / English / 简体 — **one language per screen**. Fail if one card mixes EN + 中文.

---

## Out of scope (do not fail the build for these)

- App Store listing / 上架 itself (boss deploys).
- Real money / live Stripe. Test card only.
- Firebase / own server (data stays **on this phone**).
- Pixel-perfect Figma.
- Push notifications.
- Host stars, ticket QR, 5th Saved tab, approval queue (crossed out).
- Google Maps API (app uses **OpenStreetMap**).
- Typed search for a random street OSM does not know (district name / event name only).
- **Google Sign-In on Expo Go** if it errors: record it. Email login must still work = not a product fail unless TestFlight also fails. iOS Google needs `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` + Google Cloud iOS client (bundle `hk.thirdspace.app`).

---

## Blockers (must pass on iPhone)

### Photos
1. Alex → Discover **Popular now**: Jazz + Sketch show **photos**, not grey empty cards. All Popular cards have photos.
2. Recommended rows have thumbnails.
3. Open Jazz → hero photo visible.
4. Profile faces: Alex, then Lin, then Admin — three different faces, no empty circles.

### Map
5. **Districts**: real **OSM** map (WebView), not Google, not green blob territories.
6. Event list under map only. Fail on `Central 1` / `Eastern 0` index.
7. Search Wan Chai / 灣仔 filters list. Tap row → event page + map recentres. Pan/zoom works on the phone.

### Tickets calendar
8. Alex has tickets. Upcoming / Past. **5-day strip** still there.
9. **See all / 查看全部** → **month calendar** sheet. Dots, prev/next month, tap day filters, Clear, empty day OK. **No QR** on the pass.

### Roles
10. Alex: join / save / tickets / chat if holder. **No** Admin Reports.
11. Lin: hosting list + **Create event**. Edit own event. **No** Admin.
12. Admin: Profile → **Reports**. Hide / feature / ban / resolve. Still 4 tabs.

### Join
13. Join a **free** event → ticket on Tickets tab.
14. Paid: `4242 4242 4242 4242` succeeds. Other card rejected. No real charge.
15. After start: Join gone. Full → waitlist. Cancel if you can.
16. Chat: ticket holders only.
17. **4 tabs only:** Discover, Districts, Tickets, Profile.

### iOS-only (this is why Expo Go complaints happen — still try)

18. **Create event → add photo** from the library. Allow Photos permission. Photo appears on the form and after save.
19. OSM map: scroll the Districts screen without the map eating all gestures; map still pans inside the card.
20. Safe area: titles not under Dynamic Island / notch / home indicator.
21. Background the app 30s, come back: still logged in, tickets still there.
22. Kill and reopen: session/data behaviour noted (Expo Go vs TestFlight).
23. Rotate? App is **portrait** — confirm it does not break.

---

## Major — walk all three characters on iOS

**Alex:** 5 moods filter; Popular See all; heart → Profile Saved; follow host; language switch whole screen; stamps not coupons.

**Lin:** Host page (name, photo, bio, events, **no stars**); create event (stock chips have pictures); new event on Discover.

**Admin:** Reports pending/processed/all; hide event → Alex no longer sees it on Discover; ban user; no publish-approval queue.

---

## How to report (send this whole block back to the engineer)

```
DEVICE: iPhone model + iOS version
CLIENT: TestFlight / EAS dev build / Expo Go SDK 57 (sign.expo.dev)
BUILD: (version / date / git if you know)

SUMMARY: PASS / FAIL
Blockers failed: (IDs)
Majors failed: (IDs)

For each fail:
ID:
Severity: Blocker | Major | Minor
Character: Alex | Lin | Admin | n/a
Client: Expo Go | TestFlight | both
Steps:
Expected:
Actual:
Screenshot: yes/no

Expo Go vs real app:
- Features that failed ONLY in Expo Go:
- Features that failed on TestFlight/dev build too:
```

If **all Blockers pass on TestFlight/dev iOS**, write: **QA PASS iOS (real build)**.  
If they pass **only** on Expo Go 57, write: **QA PASS iOS Expo Go** and list anything you could not run (Google, camera, etc.).

Start: iPhone client → Alex photos → Districts map → Tickets calendar → join 4242 → Lin create+photo → Admin hide. Then dump the report.
