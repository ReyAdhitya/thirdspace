# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Profile QA **FAIL**. One **Blocker**. Members cannot become hosts on web.

Do **not** redesign Profile. Do **not** touch Discover search, OSM, tickets, Photo, or SDK.

---

## PROF-1 (Blocker, all Chrome surfaces) — Become does nothing

**Steps:** new signup (Skip) → Profile → **Become an organizer**. Same as Alex.

**Expected:** hint + **Not now** / **Confirm**. Confirm → banner, row gone, card **Host**, Your Events shows **Create**.

**Actual:** tap does **nothing**. No sheet, no dialog. Card stays Member. `Alert.alert` does not run on this web bundle.

**Cause:** `ProfileScreen.becomeHost` uses RN `Alert.alert`. That is a no-op on Expo web here.

**Fix:** delete `Alert.alert` for this flow. Use an **in-app** confirm on Profile (same family as the Language expand, or a `Modal` like `MonthCalendar` — both already work on web).

Must have:

- Title = `becomeOrganizer`
- Body = `becomeOrganizerHint`
- **Not now** → close, still `role === 'user'`, row still there
- **Confirm** → `updateProfile(uid, { role: 'organizer' })` → `becomeOrganizerDone` banner → row gone → card role Host

Do **not** use `window.confirm` / `window.alert`. Do **not** auto-promote on first tap. Do **not** put Create event back on Profile home.

Reuse existing `Button`. Pine Confirm, paper/outline Not now. Keys already in en / zh-Hant / zh-Hans.

**Done when:** on **web** Chrome, tap Become → you can see and press Not now and Confirm. Confirm makes them a host. Lin/Admin still have no Become row.

---

## PROF-2 (Minor, PC) — 简体 sits on the tab bar

Profile → Language expand → **简体中文** is last, on top of **Tickets**. Taps often switch tab instead of language.

**Fix:** when the language list is open, the screen must **scroll** so all three options sit **above** the tab bar (more `paddingBottom` on the ScrollView, and/or scroll the expand into view). Hit targets must not be the NavBar. 繁 already works; 简 and EN must too.

Do not hide Language inside Settings only — the Profile row stays.

---

## Locked

4 tabs. No QR. Pine/stone. `demo@` stays a user until QA confirms Become. `npx tsc --noEmit` clean.

Commit:

`fix: in-app Become an organizer confirm so web can host`

Start with `ProfileScreen.tsx`. Kill `Alert` for Become.
