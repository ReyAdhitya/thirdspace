# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Expo + React Native + TypeScript. Do **not** eject. Do **not** rebuild the app. Do **not** reopen product rules.

Screenshots (open them):

- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 134900.png` — Discover **By mood** with **See all >**. User cannot use it. (A dark box on the word “all” in the shot is likely **browser text selection**, not a feature. Do not paint “all” in a pine chip.)
- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 135001.png` — Profile (and same on Discover): **title/gear sit too tight under the top** of the phone frame.

---

## 1. By mood “See all” — remove it

Still in `DiscoverScreen.tsx`:

```tsx
<SectionHead
  title={t('moodSection')}
  caption={t('moodCaption')}
  action={t('seeAllBoard')}
  onAction={() => setMood(null)}
/>
```

That only **clears** the selected mood. If nothing is selected, tap does **nothing**. All five mood chips are already on the row. Locked earlier: moods **are** the filter; no extra See all.

**Delete** `action` and `onAction` on By mood. Title + caption only.

**Keep** Popular **See all** (expands extra hero cards). **Keep** Profile My journey / Badges See all (already expand).

Audit: no `SectionHead` with See all that no-ops or only clears mood.

---

## 2. Header too close to the top — fix once

`src/components/Screen.tsx` `styles.header`: `paddingTop: space.x2` (8px). On **web phone frame** SafeArea top is basically **0**, so “Discover” / Profile name + gear kiss the rounded bezel.

Increase **header** (and `stackHeader`) top padding so a human sees air under the phone chrome — about **20–24px** (`space.x5` or `space.x6`) on top of SafeArea, not 8px. Same component feeds Discover, Profile, Districts, Tickets. Do not add a second spacer in every screen.

Do not add the bell back. Do not add search sliders back.

---

## Do not

- New screens, Figma MCP, Firebase, Google Cloud, App Store.
- Don’t break Join, tickets, map, demo logins (`thirdspace`).
- Don’t mix languages on one control.

Done when: By mood has **no** See all; Popular/Profile See all still work; Discover + Profile titles have visible gap below the phone top; `npx tsc --noEmit` clean; web still phone-width.

Commit: `fix: drop dead By mood See all, air out Screen header`

Start with the two screenshots, then `DiscoverScreen.tsx` By mood `SectionHead`, then `Screen.tsx` header padding.
