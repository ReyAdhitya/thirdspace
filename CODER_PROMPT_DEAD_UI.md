# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Expo + RN + TypeScript. Do **not** eject. Do **not** rebuild the product. Fix **dead chrome** only.

Planner locked **all A’s**. Human said do not implement from the planner chat.

---

## What is wrong

Looks clickable. Does nothing. User thought the app was finished.

| Control | File | Actual code |
| --- | --- | --- |
| Profile **See all** on My journey | `ProfileScreen.tsx` | `onAction={() => {}}` |
| Profile **See all** on Badges | same | `onAction={() => {}}` |
| Discover **bell** | `DiscoverScreen.tsx` | banner “push later” — push was locked **don’t block** |
| Search **sliders** | Discover `onFilter={() => setMood(null)}` | does **not** open filters; **clears mood**. Moods are already under search. Districts sliders = clear search, wrong icon. |

**Badges already work.** Join 1 / 2 / 3 / 5 / 8 → tiles light up. Not a later feature. See all was the missing list.

---

## Do this (locked)

**Q1 A — My journey See all**  
Toggle on the same Profile screen (not a new tab). Expand = **joined events** (footprint) as `ActivityRow`s. Empty: short line “Join an event. It shows up here.” Action label flips to Hide / 收起. Fix “1 events” → singular when `toNext === 1`.

**Q2 A — Badges See all**  
Toggle on Profile. Expand = every badge with **name**, locked/unlocked, “join N to unlock.” Keep `stampsHint` (not a coupon). Same five thresholds as now.

**Q3 A — Bell**  
**Remove** the Discover header bell. Title + caption only. Neater. Settings can keep the notifications row.

**Q4 A — Sliders**  
**Remove** `onFilter` on Discover and Districts search. Do not build a filter sheet. Mood chips *are* the filter. Popular **See all** that expands extra cards **stays** (that one works).

**Audit:** no other `onAction={() => {}}`. No control that looks tappable and no-ops.

---

## Do not

- New tabs, push notifications, Figma, Firebase, Google Cloud.
- Don’t break Join, tickets, map, demo logins.

i18n: `showLess`, `nextLevelOne`, `noJourneyYet`, badge name keys — **en + 繁中 + 简体**, one language per screen.

Done when: Profile See all expands for real; badges list locked/unlocked; no bell; no sliders; `tsc` clean.

Commit: `fix: wire Profile See all, drop dead bell and search sliders`

Start: `ProfileScreen.tsx` lines with `onAction={() => {}}`, then Discover header + SearchField call sites.
