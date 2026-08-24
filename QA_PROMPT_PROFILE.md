# Paste into the **QA tester** terminal. Do not change product. Do not write app code. Do not write a coder prompt.

You are QA. Test **Profile only** — the boss screenshot layout (member card + cream chevron rows), Thirdspace skin.

On GitHub this is `dac1617` plus later search/photo fixes. Hard-refresh so you are not on a stale bundle.

**Web only.** `http://localhost:8082`  
If down, from `D:\thirdspace`: `npx expo start --web --port 8082`  
Hard-refresh once (**Ctrl+Shift+R**). Wipe site data first if this browser already promoted Alex to organizer.

Password for every demo account: **`thirdspace`**  
Log out in **Profile → Settings** before switching character.

| Email | Card name | Role on card | Extra row |
| --- | --- | --- | --- |
| `demo@thirdspace.hk` | Alex / 阿樂 | Member | **Become an organizer** |
| `host@thirdspace.hk` | Lin / 林岸 | Host | none of those two |
| `admin@thirdspace.hk` | Admin | Admin | **Reports** |

Timezone **Asia/Hong_Kong**. Today ~ **24 Aug 2026**. Alex seed tickets (Library, Sketch) are **past** — History should still list them.

Boss JPEG (`C:\Users\reyse\Downloads\75ff803e-ce3b-4897-9750-7b6471cff748.jpg`) is **structure only**. Fail if we cloned their Guest / robot / QR / orange / 5 tabs. Pass if we kept pine + 4 tabs + real names.

---

## Surfaces

Full checklist on **PC** (wide Chrome, phone frame ~390). Then spot-check Profile home + Become + Edit photo + Language on **Android** (Pixel DevTools) and **iOS** (iPhone DevTools). Mark **Surface** on every fail.

Same Chrome desktop ↔ DevTools = same login. Chrome vs Safari = different storage.

---

## Out of scope (do not fail)

- Expo Go / TestFlight / `Project is incompatible` / 上架.
- Discover English search, Districts “1 event”, empty-search copy — already **QA PASS** (`04e5f26`). Only re-file if Profile **broke** them.
- Real money, Firebase, Google Maps, push, pixel-perfect Figma.
- Google Sign-In if not configured — email/chips = pass.
- Host stars, ticket QR, Saved as a **5th tab**, approval queue.
- Settings “soon” rows.
- **Become an organizer writes to this browser.** Schema 6: hard-refresh does **not** reset a promoted Alex. Use a **new signup** for Become, **or** wipe site data after, **or** do Become **last**. Do not leave `demo@` as host if you still need Alex-as-user.

---

## A — Profile home (looks like the JPEG, our skin)

Login **Alex** → **Profile**.

1. **Exactly 4 tabs:** Discover, Districts, Tickets, Profile. Fail if Saved is a tab.
2. **Pine card** (`#1F3D34`), rounded, faint grid. Not orange. Not a tiny avatar-only header.
3. **Arch / doorway mark** on the card. **Not** an Android robot. **No QR / CHECKIN** on card or header.
4. **Alex’s face** (real photo) + **Alex / 阿樂**. **Never** the word `Guest`.
5. Subline: role · district · Hong Kong (e.g. Member · Central · Hong Kong). **No** four fake stats. **No** Fans count.
6. **No Create event button** on this screen.
7. Cream rows: pine icon, label, chevron, even gaps.
8. Alex rows (this order): **Edit Profile → History → Your Events → Saved → Following → Become an organizer → Language → Settings**.  
   Fail if Become is missing. Fail if **Reports** is on Alex.
9. No settings gear required on the header. Settings is a row.

**Lin:** different face, Host (搞手 / 主办), **no** Become, **no** Reports.

**Admin:** third face, Admin, **no** Become, **has Reports**.

---

## B — Every row

### Edit Profile
10. Form: photo, display name, bio, district. Back works.
11. Change name + district → Save → **card** updates.
12. Change bio → Save → still there when you reopen Edit.
13. Pick a local jpg → preview + card face update after Save. **Cancel / deny** must **not** become a jazz stock face. Banner OK.
14. Fail if Save crashes or the card goes blank. EN vs 繁 writing different name fields = pass.

### History
15. Alex: Library + Sketch rows. Tap → event. Back → History.
16. Stamps / impressions still here. Copy: join badges, **not coupons**.
17. New signup (Skip interests) → History empty state, no crash.

### Your Events
18. **Alex still user:** **no** Create button. Empty copy = become an organizer first. Not Lin’s event list.
19. **Lin:** **Create event** at top. Her hosted events with `joined / capacity`. Tap → event. She can **edit her own** from the event page.
20. Lin creates a **free future** event (defaults ~ Sep 2026) → it appears in Your Events **and** Discover.

### Saved
21. Alex seed-saves Jazz. Saved shows After-work Jazz with a photo. Tap → event.
22. Discover heart off → gone from Saved. Heart on → back. Still **not** a 5th tab.

### Following
23. Alex follows Chen. Row with face → host page (bio, events, **no stars**).
24. Unfollow → list updates.

### Become an organizer
25. Missing on Lin and Admin.
26. **New signup** (preferred) or Alex last: tap Become → confirm (hint + **Not now** / **Confirm**).
27. **Not now** → still Member, row stays, Your Events still has no Create.
28. **Confirm** → banner, row **gone**, card role **Host**, Your Events shows **Create**. Create one → Discover.
29. **Web:** if only a browser `alert` with OK, or Confirm does nothing → **Major**. Screenshot.

### Language
30. Expand on Profile. 繁中 → **語言** only (no glued “Language”). Whole stack 繁. Then 简 → **语言**. Then English → Language.
31. Fail mixed EN + 中文 on one row.

### Settings
32. Opens. Logout → login. Log back in.
33. District here and in Edit Profile must not fight (change one, the other agrees after reopen).
34. Soon rows = pass.

### Admin Reports
35. Alex / Lin have no Reports row.
36. Admin → Reports: seed pending on Rooftop. Pending / processed / all. Resolve works. Hide → spot-check Discover as a normal user.

---

## C — Do not break the rest (smoke)

37. From Profile you can still reach Discover / Districts / Tickets. Jazz + Sketch photos still paint.
38. Tickets pass still **no QR**.
39. After Become + Create, the new event is joinable.

---

## Severity

- **Blocker:** Profile crash, Guest/blank card, missing faces, Create on Profile home as the only host door, 5th tab, QR on card/pass, cannot logout, Become does nothing and they cannot host.
- **Major:** a named row dead or empty when seed data should be there; Become confirm broken on web; Alex can Create before becoming host; Lin/Admin see Become; language mixed; Saved/Following/History orphaned.
- **Minor:** spacing, grid too loud, copy nits.

---

## Report

```
QA PROFILE
URL: http://localhost:8082
Devices:
Alex still user? yes/no
```

Each fail:

```
ID: PROF-1
Severity: Blocker | Major | Minor
Surface: PC | Android | iOS | all
Character: Alex | Lin | Admin | new user
Workflow:
Steps:
Expected:
Actual:
Screenshot:
Repro: always | intermittent
```

| Workflow | PC | Android | iOS |
| --- | --- | --- | --- |
| Card (faces, no Guest, no QR) | | | |
| Row stack + 4 tabs | | | |
| Edit Profile | | | |
| History + stamps | | | |
| Your Events + Create (host only) | | | |
| Saved / Following | | | |
| Become an organizer | | | |
| Language 繁/EN/简 | | | |
| Settings logout | | | |
| Admin Reports | | | |

**QA PASS for Profile** = no Blockers, every row works on PC.  
**QA FAIL** = any Blocker, or a Major that breaks the boss Profile.

Blockers first, then Majors, then Minors. No patch.

## Start

Hard-refresh → Alex card (face, name, pine, no Guest, no QR, no Create) → open **every row** → new signup Become Not now then Confirm → Lin Your Events → Admin Reports.

Go.
