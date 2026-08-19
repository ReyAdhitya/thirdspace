# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Stack stays **Expo + React Native + TypeScript**. Do **not** add Next.js, shadcn/ui, or Framer Motion. The **look** should feel like a trendy minimal shadcn site (clean type, air, one accent) but it is still the **iOS app**. Web = **phone-width preview** (~390px), bottom tabs, not a desktop website.

**Do not break** `src/services`, demo logins, Join, tickets, three roles.

---

## What is wrong (user + screenshots)

Files the user hates:

- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 114146.png` — login mixed EN/中文, fake Google **G**
- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 114303.png` — Discover: English chrome + Chinese event titles + English dates; mood labels **truncated** (`Meet peo…`)
- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 114352.png` — search/filter icon cramped, messy padding

As a user: language switching mid-card is exhausting. Truncated moods look broken. Fake Google looks cheap. Serif “Discover” + mixed type looks dated, not minimal.

---

## Language (non-negotiable)

**One language per screen, 100%.**

- Locale **English:** every label, button, date, district, mood, demo chip, ticket, settings. Event **titles and summaries in English** (add `titleEn` / use English seed copy when `lang === 'en'`). No leftover 繁中 on the same card.
- Locale **繁中:** everything 繁中 including dates (e.g. 8月21日 星期五), districts, buttons.
- Locale **简体:** same rule.
- Default for this pass: **English** (user said the UI should be English). Keep the language switcher in Settings; switching must re-render **all** visible copy.

Demo chips: `Alex / demo`, `Lin / host`, `Admin / admin` in English mode — not 阿樂 sitting under an English title.

---

## Google

Use the **official colorful Google “G”** (asset or well-known SVG). Never a serif letter G, never a random blue G. If Google Sign-In has no client id, **still show the real logo**; keep the existing “not configured” behavior.

---

## Layout / mess

- Mood row: labels **fully visible**. No ellipsis. Smaller type, two-line label, or horizontal scroll with `minWidth` — pick one that does not clip.
- Search: enough padding; filter/sliders icon not glued to the rounded corner.
- Heart on cards: aligned, consistent hit target, not a random red sticker if it fights the layout.
- Spacing: 8pt grid. Lots of air. Nothing touching the safe-edge.

---

## Fonts (trendy, minimal)

User **does not like** the current serif headings (Playfair / Noto Serif look).

- **One sans family** for UI: on web load a geometric sans (e.g. **Outfit** or **DM Sans**) for Latin; **Noto Sans TC** for CJK. No Inter if it looks generic — Outfit/DM Sans is the “shadcn-adjacent” feel.
- **No serif** on Discover title, login title, or section headers.
- Weights: Regular + Medium. Few sizes. High contrast ink on stone.

Colors may stay Stone `#F6F4F1`, Ink `#1A1A1A`, Pine `#1F3D34`, Harbor `#8DA29A` from `docs/frontendui.png` unless they fight the new type. Light theme. Dark status bar content.

---

## Do not

- Do not install shadcn, Tailwind-for-Next, or `framer-motion`.
- Do not eject Expo.
- Do not build a desktop web shell.
- Do not mix languages on one component.

---

## Done when

English mode: login, Discover, tickets, profile read like **one English product**. Google shows the real mark. Moods not cut off. Search not cramped. Type is sans, quiet, minimal. `expo start --web` still runs. Demo password `thirdspace`.

Commit: `fix: English-only chrome, real Google mark, no truncated moods`

Start by opening the three screenshots, then `src/i18n/en.ts` + seed titles + Login + Discover.
