# HANDOFF — Thirdspace (give this to the next AI)

Read this whole file, then `PLAN.md` and `CODER_PROMPT.md`. Repo: `D:\thirdspace`. GitHub (private): https://github.com/ReyAdhitya/thirdspace

The human is **not** a native Chinese speaker; they are a SWE. Keep language simple. Boss speaks in product terms; papers are Traditional Chinese / Cantonese HK copy.

---

## Role history (important)

This conversation was **planner-only**. Human said: **no code**, plans go to a **coder** terminal, plus a **frontend reviewer**. Three terminals.

A coder later **did** build the Expo app (parts 1–4). The planner then **broke the “no code” rule** (theme restyle + phone-frame). Next AI: do not mix planner/coder unless the human says so.

Grill-me / Matt Pocock skills were used. Product questions are **frozen**. Do not reopen unless the human asks.

---

## What the boss actually asked for

From the human + three files (not our inventions):

- Build **Thirdspace**.
- **Three users: admin, organizers, normal users.**
- **React** → confirmed **React Native**.
- App **downloaded on iOS**.
- Design in **Figma**.
- Expo eject warning (old Expo); plan is **stay on Expo**, don’t eject.

**Boss files (Windows):**

- `C:\Users\reyse\Downloads\thirdspace reference.jpg` — polished **Home** (HK events, search, 5 moods, popular/recommended, hearts, **5 tabs**: Discover / Districts / Saved / Tickets / Profile). Purple look. **Jobs only, not pixel clone.**
- `C:\Users\reyse\Downloads\thirdspace wireframe1.jpg` — flow: login (email+Google), home (activities by topic), event (Chat+Join), organizer page (info, **score**, **Pass**), review (chat+comment), footprint+profile (mission+coupon), settings **?**, calendar. **Approval written then crossed out.**
- `C:\Users\reyse\Downloads\thirdspacewireframe2.jpg` — profile (info+follow, stat, interest), empty **Action** (= create event), personalization, chat.

**Product in one line:** HK activity/hangout finder. Join real events. Not a chat cafe. Third place = not home, not work.

---

## Locked product decisions (do not reopen)

| Topic | Decision |
|---|---|
| Object | Events/activities (活動), not a digital hangout room |
| Stack | Expo + React Native + TypeScript. iOS + Android + web **preview** |
| Web on laptop | **Phone-sized preview**, not a desktop website. Chrome = test window. Boss wants **iOS app**. |
| Look | Quiet / next-gen, **not** purple JPEG, **not** AI slop (pills, Feather, emoji, wellness beige). Figma is source of look when it exists. |
| Tabs | **4:** Discover, Districts, Tickets, Profile. Saved lives **in Profile** (boss drew 5 tabs). |
| Ticket | Card: title, time, address. Show phone. **No QR.** One ticket per user per event. |
| Full | MVP: 額滿. Full app: waitlist; cancel frees a seat. |
| After start | Cannot Join. Past events: comments only. |
| Chat / comments | Ticket holders only. |
| Host page | Name, photo, bio, events. **No star score. Pass = the ticket.** |
| Stamps | Badge on profile from join count. Not real coupons. |
| Follow | Host’s new events surface on Discover. |
| Heart | Save for later, in Profile. Not Join. |
| Report | Yes. Admin hide/ban. |
| Notifications | Later / don’t block. |
| Create form | Photo, title, summary, district+address, date+time, price/free, capacity, mood, event language. |
| Moods | Quiet / Create / Meet people / This weekend / Nearby |
| Districts | Fixed HK list; address is free text. |
| Languages | 繁中 first, then EN + 简体. |
| Pay | Show HK$. Test checkout (4242), not live Stripe. |
| Firebase | Throwaway/local OK for now. **AsyncStorage** is what shipped. Same services API for Firebase later. |
| Timezone | Asia/Hong_Kong |
| Approval queue | **Do not build** (boss crossed it out). |

---

## How to use / demo (human + boss)

**Boss cannot open localhost.** Screen-share, sit together, or send a recording. Public App Store / TestFlight = not done (no Apple account).

**Preview (dev machine only):** `http://localhost:8082`  
If dead: in `D:\thirdspace` run `npx expo start --web --port 8082`

**Password for all demo accounts:** `thirdspace`

| Role | Email |
|---|---|
| User | demo@thirdspace.hk |
| Organizer | host@thirdspace.hk |
| Admin | admin@thirdspace.hk |

Also `chen@thirdspace.hk` (organizer). Log out in Settings to switch.

**Phone:** Expo Go + `npx expo start` QR. Windows cannot run iOS Simulator.

---

## Architecture (what shipped)

One Expo app. Screens → `src/services` → local store (`src/services/store.ts`). Do not call storage from screens.

**Entities:** User (role), Activity/Event, Ticket, Message (chat|comment), Follow, Save, Report.

**Join:** check full / started / already joined → free ticket or test checkout if paid → ticket card.

**Nav:** Login → interests → tabs. Stack: Activity, Organizer, CreateActivity, Checkout, Settings, Admin.

Details + UML: `PLAN.md` sections B–D. Types: `src/types`.

---

## What is done vs not

**Done:** Spec (`PLAN.md`), coder prompt (`CODER_PROMPT.md`), Expo app parts 1–4 in one project, GitHub private repo, demo logins, local backend, test pay, waitlist/cancel, admin. Phone-frame on web was re-applied after a desktop-shell UI pass (human hated “looks like a laptop website”).

**Not done:** Real Figma file (boss expects this). Pixel-perfect UI (human said **AI slop**). Live Stripe. Google login (no client id). Firebase prod. EAS / TestFlight / App Store. Company Firebase.

**UI conflict:** Human wants neat next-gen look + Figma. An Opus restyle prompt was written in chat (anti-slop, keep features). Desktop web shell was a mistake vs iOS-first. Keep **bottom tabs + phone width on web**.

---

## Figma / Framer / models

- **Figma** = app screens (boss). Then paste frame URL into Cursor + Figma MCP + **Opus** to match code.
- **Framer** = optional marketing landing page only. **Not** the product. Do not replace RN with Framer.
- **Grok / planner** = spec, boss emails, grilling.
- **Opus** = implement UI from Figma / kill slop in code.
- Don’t run two models editing the same files at once.

Figma search keywords: `event discovery app`, `ticketing app mobile`, `Dice`, `Luma`, `dark mode mobile app minimal`. Avoid SaaS purple glass.

---

## Files to give the next AI

1. This `HANDOFF.md`
2. `PLAN.md` (full spec, section 0 = boss papers)
3. `CODER_PROMPT.md` (execute-to-the-end coder instructions)
4. Code under `src/`
5. Boss images in Downloads (paths above)

---

## Suggested first message for the next AI

> Read HANDOFF.md and PLAN.md. Thirdspace is an iOS-first Expo RN event app for HK (users / organizers / admin). Do not treat localhost as a public website. Boss wants Figma for UI. Do not eject Expo. Do not invent a new product. Ask whether I am planner, coder, or frontend before editing code.

---

## Boss-facing status (already used)

Short: mapped sketches into a build plan (users / organizers / admin) — not a finished iPhone app yet.

UI refs: human researched Dice, Luma, Airbnb Experiences; boss papers are structure; Figma is next for look.
