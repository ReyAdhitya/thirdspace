# HANDOFF — Thirdspace (give this to the next AI)

Read this file first, then `PLAN.md`. Repo: `D:\thirdspace`.  
GitHub (private): https://github.com/ReyAdhitya/thirdspace — `master` is **pushed** (latest: `c54759c` Google Sign-In + EAS handover).

Human: SWE, not a native Chinese speaker. Speak simply. Often says “idgi” / “simplify.” Boss is **Lok** (HK).

---

## Ask the human first

**Planner vs coder vs frontend?** Do not mix.

- **Planner:** grill-me (`grilling` skill — whole frontier, numbered Qs + recommended answers). **No code.** Plans → coder prompt markdown. Human yelled **JUST PLAN BRO** when planner started editing `ProfileScreen` / Discover. Those edits were **reverted**.
- **Coder:** implement the pasted prompt. Do not ask product questions. Stay Expo, don’t eject.
- **Frontend:** look only, after Figma/screenshots exist.

Three terminals in their workflow.

---

## What Lok (boss) actually said

- Build **Thirdspace**.
- **Three roles:** admin, organizers, normal users.
- React → **React Native** (Expo). Stay on Expo; he warned eject used to be messy.
- **iOS downloadable app.** Design in **Figma**.
- Papers (Windows):
  - `C:\Users\reyse\Downloads\thirdspace reference.jpg` — Home jobs (HK events, 5 moods, hearts). Purple = jobs, **not** pixel clone. Boss drew **5 tabs**; product locked **4** (Saved in Profile).
  - `C:\Users\reyse\Downloads\thirdspace wireframe1.jpg` — login email+Google, event Chat+Join, host, review, footprint, settings, calendar. **Approval crossed out.**
  - `C:\Users\reyse\Downloads\thirdspacewireframe2.jpg` — profile, Action = create, personalization, chat.
- Product: HK **third place** (not home, not work) = join **real events**, not a chat cafe.
- **上架:** human asked demo vs App Store. Lok: *Don’t worry about put-on-shelf. **I will deploy it.***  
  **Human’s job = working Expo repo. Lok’s job = Apple / TestFlight / Store.**

---

## What “done” means (locked this chat)

**Human (Rey) done:** working React Native + Expo **MVP/prototype** on GitHub. Email login, three roles, Join, tickets, map, admin, test pay `4242`, `eas.json` + README for Lok. **Not** App Store.

**Not Rey:** Apple $99, EAS submit, cloud **Firebase**, live Stripe, Figma paid Dev Mode.

**Stage language:** not a skeleton. **Prototype / MVP** with local data. **Production** = Lok.

**Stack language:** TypeScript + React Native + Expo. Web = **phone-width preview** (~390px), not a desktop site. Preview: `http://localhost:8082`. Boss cannot open localhost — screen-share or he clones GitHub.

---

## Locked product (do not reopen)

See also `PLAN.md` / old `HANDOFF` table. Highlights:

- 4 tabs: Discover, Districts, Tickets, Profile.
- Ticket card, **no QR**. Waitlist + cancel. No join after start. Chat = ticket holders.
- No host star score. Pass = ticket. Stamps = join-count badges, not HK$ coupons.
- 繁中 / EN / 简体 — **one language per screen** (no mix EN+中文 on one card). Default demo UI often English.
- AsyncStorage now; same `src/services` API for Firebase later.
- Create event: anyone logged in can create → becomes organizer (Alex is not locked to “user-only”).
- Notifications / OS push: **don’t block.**

UI board: `docs/frontendui.png` — Stone `#F6F4F1`, Pine `#1F3D34`. Sans (Outfit + Noto Sans TC), no serif headings.

Industry refs (inspiration, **not** clone): **Luma** (lu.ma), Meetup, DICE, Airbnb Experiences. Klook = tourist mall, different product.

---

## Demo

Password **`thirdspace`** for all.

| Chip | Email | Role | How to see difference |
| --- | --- | --- | --- |
| Alex | demo@thirdspace.hk | user | Tickets (library + sketch), saved jazz |
| Lin | host@thirdspace.hk | organizer | Profile hosting (jazz, hike, clay, roof) |
| Admin | admin@thirdspace.hk | admin | Profile → Reports (hide/feature/ban) |

Also `chen@thirdspace.hk`. Same login **screen** on purpose — one app, not three apps. Log out in Settings to switch.

---

## Code that already shipped (do not rebuild)

- Parts 1–4 + UI passes + Districts **Google Maps Embed** (free; no blob map; **no** 18-district `Central 1 / Eastern 0` list; **no** New Territories / Kowloon / Island chrome).
- Google **Sign-In code** (`src/services/google.ts`, `expo-auth-session`). **No `.env` on disk** → button shows not-configured; email still works. Human/Lok paste `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` to make Gmail work on web. iOS client = Lok when he builds.
- `eas.json` + README: **Rey built, Lok 上架.** Commands documented; do **not** `eas submit` from this env.
- GitHub private, in sync with local `master`.

**Data:** AsyncStorage only. Shared cloud DB = **Lok** (Firebase later, README).

---

## Open coder work (not done in GitHub yet)

**`CODER_PROMPT_DEAD_UI.md`** (untracked until someone commits). Paste to **coder**. Locked all **A**:

1. Profile **See all** on My journey → expand **joined events** (not empty `() => {}`).
2. Profile **See all** on Badges → names + locked/unlocked. Stamps **already** unlock from join count — not “later.”
3. **Remove** Discover **bell** (push don’t-block; header felt messy).
4. **Remove** search **sliders** (they don’t filter; moods under search are the filter).

Planner started implementing this then **reverted** on human order.

---

## Figma (this chat)

- Human copied **Mobbin → Figma** Luma screens:  
  `https://www.figma.com/design/d9AKmwAJRKk948h0NQkrV3/Mobbin-—-Copy-to-Figma--Community-?node-id=0-1`  
  That’s a **screenshot dump**, not full Thirdspace frames. **Do not** give that link to the coder as spec.
- Cursor **Figma MCP** `plugin-figma-figma`: **needsAuth**; “waiting for callback” = broken remote OAuth. Desktop Dev Mode MCP **paywalled**. Human must **not** buy Figma just for this.
- **Skip MCP.** Optional later: free Design mode screenshot of a **complete** 390×844 frame → coder match. Incomplete Luma scraps = moodboard only.
- Boss still “wants Figma”; pixel-perfect can wait on Lok’s file/seat.

---

## Other prompts in repo (history)

| File | What |
| --- | --- |
| `CODER_PROMPT.md` | Original build-all-parts |
| `CODER_PROMPT_UI.md` | Match `docs/frontendui.png` |
| `CODER_PROMPT_LANG_UI.md` | One language, real Google G, no truncated moods |
| `CODER_PROMPT_MAP.md` | Real Google map, kill territories + district index |
| `CODER_PROMPT_FULL.md` | Google OAuth + EAS handover (**done** in `c54759c`) |
| `CODER_PROMPT_DEAD_UI.md` | **Next** — dead See all / bell / sliders |

---

## Architecture

Screens → `src/services` → `store.ts`. Types in `src/types`. Bundle id `hk.thirdspace.app`. Timezone Asia/Hong_Kong.

Do not eject. Do not Next.js / shadcn / Framer as the product.

---

## Suggested first message

> Read HANDOFF.md. I am [planner / coder / frontend]. Thirdspace is Expo RN, HK events, three roles. Human’s build is on GitHub; Lok deploys/上架. Do not eject. Do not pay Figma MCP. If planner: no code; next job is CODER_PROMPT_DEAD_UI.md unless they say otherwise. If coder: execute the prompt they paste; don’t ask product questions.

---

## Boss-facing one-liner

Working Expo **MVP** (not skeleton, not App Store). He can clone GitHub and 上架 when ready.
