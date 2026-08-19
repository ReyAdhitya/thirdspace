# Paste this into the **coder** terminal (not planner).

You are the **coder**. **Do not ask questions.** Restyle the existing Thirdspace Expo app so the UI matches **this design board exactly**. Keep all working features and `src/services`. Do not start a new product. Do not switch to SwiftUI.

## The picture (source of truth for LOOK)

Open and match pixel-intent (layout, color, type, radius, icons, spacing):

1. **In the repo:** `docs/frontendui.png`
2. **Original:** `C:\Users\reyse\Downloads\frontendui.png`

If those differ, use `docs/frontendui.png`. Put the image on your screen and **copy it**. Do not “interpret a new aesthetic.” Do not keep the current dark near-black UI. This board is **light, editorial, stone/pine**.

Board title on the file: **Thirdspace** — Hong Kong events between home and work. Clean, calm, human.

---

## Design tokens (use these exact hex)

| Name | Hex | Use |
|---|---|---|
| Stone | `#F6F4F1` | App background |
| Paper | `#EDEAD8` | Cards / secondary surface |
| Ink | `#1A1A1A` | Text, icons |
| Pine | `#1F3D34` | Primary buttons, active tab, logo |
| Harbor | `#8DA29A` | Secondary / muted accent |

- **Headings:** Noto Serif TC  
- **Body:** Noto Sans TC  
- **Icons:** thin outline (search, pin, ticket, person, heart, chat, calendar). Same weight as the board.  
- **Radius:** ~12–16px on cards, inputs, pills. Soft, not sharp 2px, not 999 mega-pills on every box.  
- **Logo:** dark green arch / doorway mark + word **Thirdspace** as on the board.

Status bar: **dark** content on light stone.

---

## Platform

Keep **Expo + React Native + TypeScript**. Web preview must look like an **iPhone** (max-width ~390, bottom tabs), not a desktop website. `npx expo start --web` must still run. Demo logins must still work (`demo@` / `host@` / `admin@`, password `thirdspace`).

Screens still **must not** talk to storage directly — `src/services` only.

---

## Screens to match (every frame on the board)

**Tabs (4, bottom):** Discover · Districts · Tickets · Profile  
(Chinese labels as on the board: 发现/地區 etc. Default language 繁中.)

1. **Discover** — title + search; mood **rounded-square icon buttons** (Quiet / Create / Meet people / Weekend / Nearby); large photo cards for popular (title/location/time/price over the image); recommended as a vertical list of smaller cards.  
2. **Districts** — search; **Hong Kong map** (NT / Kowloon / HK Island); popular district **photo tiles** (Central, Sham Shui Po, Wan Chai, …).  
3. **Tickets** — Upcoming | Past; ticket cards with **big date** on the left, event info, faint photo; calendar strip if on the board.  
4. **Profile** — avatar, name, HK; stats row (attended / saved / following / fans) **as drawn**; My Journey / explorer level; badges; saved carousel. **This board wins** over the old “no vanity stats” lock.  
5. **Event detail** — hero image; back / share / heart; title; host row + Follow; date, pin+address, price; attendees; **full-width Join** (Pine).  
6. **Login** — logo, Pine **Login with Email**, white **Google**, create account link.  
7. **Create activity** — photo upload, title, description, location, date, time, free/paid, attendee limit, Pine submit.  
8. **Host page** — bio, hosted list with 12/20 style counts.  
9. **Chat** — ticket-holder thread, bubbles, avatars, input.  
10. **Admin reports** — Pending / Processed / All; reason, reporter email; Review / Resolve.  
11. **Settings** — language, notifications, security, privacy, terms, logout.

If a board frame is slightly different from `PLAN.md`, **the PNG wins for UI**. Keep Join rules, no QR, waitlist/pay/admin **behavior** from the existing app.

---

## Do not

- Do not invent neon, dark-mode, glass, purple, or a new IA.  
- Do not eject Expo.  
- Do not drop the three roles.  
- Do not ask for Figma — this PNG **is** the UI spec.  
- Do not leave the current dark theme.

---

## Done when

Side-by-side with `docs/frontendui.png`, a human would say the running app (phone preview at localhost) is **the same design**. Then commit:

`fix: match frontendui.png design board`

Start now. Open the PNG first. Then change `src/theme` and every screen until it matches.
