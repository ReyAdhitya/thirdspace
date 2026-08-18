# Paste this into the **coder** terminal. Do not paste into planner.

You are the **coder**. The planner is done. **Do not ask the user questions.** If something is missing, use `PLAN.md` and the defaults below. **Execute until the whole product in `PLAN.md` works**, parts 1→2→3→4, one Expo app.

Read **`PLAN.md` first**. It is the spec. Boss papers are listed in section 0 (Windows paths under Downloads). Implement those **jobs**. Do not copy the purple JPEG look.

---

## Hard rules

- Stack: **Expo + React Native + TypeScript**. One app for iOS, Android, and **web** (phone UI in the browser — how we test on Windows).
- Look: **quiet future** — spacious, one accent, dark or light, big type. **Not purple. Not glass/neon soup. Not Inter-only.** Fonts must support 中文.
- No Figma yet: ship theme tokens from the spec; match Figma later if it appears.
- Screens do **not** talk to Firebase directly. Use `src/services`.
- **Do not stop at MVP.** After part 1 runs, immediately do parts 2, 3, 4 (Stripe = **test/demo checkout UI** that records a paid ticket; no live keys required. If Stripe keys missing, simulate success in test mode and label it).
- **Do not ask** for Firebase, Apple, or Stripe accounts. Make the app **run**.
- Never commit secrets (`.env`, Firebase private keys, `google-services.json` with prod secrets).

---

## Backend (do not block)

1. Service layer matching `PLAN.md` types: User, Activity/Event, Ticket, Message, Follow, Report.
2. If you can create/configure a Firebase project **non-interactively**, do it and use Auth (email + Google if keys exist), Firestore, Storage.
3. If you **cannot**, ship a **real local backend** (AsyncStorage / in-memory with seed) behind the **same** service API so Join, tickets, create event, chat, follow, save, report, admin hide **all work** on web and Expo Go. README: how to point at Firebase later.
4. Seed **~8 HK events** (繁中 titles, mix 免費 / HK$, districts from the locked list).

---

## Product locks (do not reopen)

- App name: **Thirdspace**. Timezone: **Asia/Hong_Kong**.
- Roles: `user` | `organizer` | `admin`. Anyone logged in can create (becomes organizer). Admin can hide events / ban users.
- Tabs (4): Discover · Districts · Tickets · Profile. Heart/save lives in Profile, not a 5th tab.
- Ticket = card (title, time, address, price/free, 已報名). **No QR.** Show the phone. One ticket per user per event.
- Part 1: if full → 額滿. No cancel. No join after start.
- Later: waitlist + cancel (when someone cancels, next waitlist gets a ticket).
- Chat + after-event comments = **ticket holders only**.
- Host page: name, photo, bio, their events. **No star score. No extra pass.**
- Stamps on profile (join count → badge). Not a real coupon.
- Follow host → their new events surface on Discover.
- Moods: Quiet / Create / Meet people / This weekend / Nearby (安靜 創作 想識人 今個週末 附近).
- Districts: fixed HK list (Central, Wan Chai, Causeway Bay, Sheung Wan, Tai Hang, Sham Shui Po, Mong Kok, Tsim Sha Tsui, Kwun Tong, Sai Kung, and the rest of a standard 18-district-style list). Address = free text.
- Create form: photo, title, summary, district+address, date+time, price/free, capacity, mood, event language.
- i18n: **繁中 first**, then English + 简体 in part 3.
- Pay: show HK$; part 4 = test checkout, not live bank money.
- Notifications: in-app banners OK; OS push optional if it would block you — do not block the build.
- Report user/host/event; admin screens in the same app.

---

## Build until the end (order)

**Part 1 — must run on `expo start --web`:** Expo app, theme, auth (email; Google if possible), Discover, event page, Join, Tickets. Seed data.

**Part 2:** Create/edit event, host public page, roles.

**Part 3:** Chat, comments after end, Districts, first-run interests, Profile (follow, saved, footprint, stamps), Settings (language, log out), EN + 简体.

**Part 4:** Test pay on paid Join, waitlist+cancel, admin hide/feature/ban, report inbox. EAS/TestFlight only if credentials exist; otherwise skip store submit and document it. App must still be complete in the repo.

Empty, loading, error states on every main screen.

---

## GitHub (commit-friendly)

**Suggestion implemented here:** private GitHub repo, **one commit per part**, never secrets.

1. `git init` if needed. Root `.gitignore`: `node_modules/`, `.env`, `.env.*`, `*.jks`, `*.p8`, `*.p12`, `dist/`, `.expo/`, web-build, OS junk. **Do not commit** Firebase Admin SDKs keys.
2. You may omit `.agents/` (skill packs) from the product repo if they bloat it; **do** commit `PLAN.md`, `CODER_PROMPT.md`, and the Expo app.
3. After each part is working:

```
git add -A
git commit -m "feat: part N — <short why>"
```

Use messages like:

- `feat: part 1 — join an event and see a ticket`
- `feat: part 2 — hosts can create events`
- `feat: part 3 — chat, profile, and languages`
- `feat: part 4 — test pay, waitlist, and admin`

4. Create **private** GitHub repo if `gh` is logged in:

```
gh repo create thirdspace --private --source=. --remote=origin --push
```

If `gh` is not logged in, still make local commits; put remote instructions in README. **Do not** force-push. **Do not** `git add .env`.

5. README: how to `npm install`, `npx expo start`, `npx expo start --web`, how to add Firebase env later.

---

## Done when

A user can: log in → see HK events → Join → open a ticket card; a host can create; ticket-holders can chat; profile has saves/stamps; paid events have a test pay path; admin can hide/ban. `expo start --web` works on Windows. Git history has part 1–4 commits. README exists.

**Start now. No questions. Build to the end.**
