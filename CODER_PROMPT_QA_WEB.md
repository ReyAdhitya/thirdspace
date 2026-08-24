# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. QA **FAIL** on the web app (`http://localhost:8082`, Chrome, three viewports). Fix the three **Majors** and the two copy **Minors** below. Do not redesign Profile. Do not touch OSM, tabs, QR, pay, or Expo SDK.

Evidence: `D:\thirdspace\qa-artifacts\web\` (e.g. `05-PC-search-Pottery.png`, `23-Android-search-Jazz.png`, `303-PC-hant.png`, `309-PC-wait.png`).

---

## Do not “fix”

- iOS DevTools tab stack landing on Sketch — walker flake, not a product bug.
- Waitlist / ban-then-login — QA skipped those on purpose.
- WEB-6 (Pixel 8 still in a 390 frame) — leave `PHONE_MAX_WIDTH`. Phone-in-stage on a wide window is intended.
- WEB-7 (Admin Reports under Create) — Profile is already the member-card + rows (`dac1617`). Do not put Create event back on Profile home.
- Google Sign-In missing client id, Settings “soon” rows, Expo Go.

---

## WEB-1 (Major, all surfaces) — Discover English search is empty

**Bug:** Search `Jazz` or `Pottery` → “Nothing here yet”. Search `爵士` or `陶藝` hits. Districts search for `Wan Chai` already works.

**Cause:** `searchActivities` in `src/services/activities.ts` only joins `title`, `summary`, `address`, `district` (Chinese + the id `wan_chai`). Seed English lives in `titleEn` / `summaryEn` / `addressEn`.

**Fix:** Search the same haystack Districts already uses:

- `title`, `titleEn`, `summary`, `summaryEn`, `address`, `addressEn`
- `districtLabel(..., 'en' | 'zh-Hant' | 'zh-Hans')`

Empty query still returns the full published list. Do not add Nominatim / a geocoder.

**Done when:** Discover search `Jazz` → After-work Jazz. `Pottery` → Pottery Evening. `爵士` / `陶藝` still work. Clear restores the list.

---

## WEB-2 (Major) — Settings / Profile language row is mixed 繁+EN

**Bug:** 繁中 Settings first row is **「語言 Language」**. Rest of the screen is 繁 (`設定`, `登出`). Violates one language per screen.

**Cause:** literal strings, not a missing `t()`:

- `src/i18n/zh-Hant.ts` → `rowLanguage: '語言 Language'`
- `src/i18n/zh-Hans.ts` → `rowLanguage: '语言 Language'`

English `rowLanguage: 'Language'` is fine.

**Fix:** 繁 = `語言` only. 简 = `语言` only. Profile Language row uses the same key — it will follow. Grep both zh files for a second English word glued onto a Chinese label and kill those too if you see them. Do not invent new bilingual labels.

**Done when:** whole Settings + Profile stack is 繁 or 简 with no English sitting on the same row.

---

## WEB-3 (Major, web file picker) — picked cover is a grey slab

**Bug:** Lin → Create event → Add a photo → pick a jpg → publish. Stock chips paint. The **file-picked** cover is empty grey on the form and the event hero (`309-PC-wait.png`). Cancel/deny must still **not** become jazz stock.

**Cause:** `pickPhoto()` (`src/services/storage.ts`) returns a **`blob:` / `data:` / `file:`** URI. `Photo` (`src/components/Photo.tsx`) only paints:

1. demo keys via `resolveDemoId` + RN `Image`
2. `http(s):` via `expo-image`

Anything else (including `blob:http://localhost:8082/...`) hits the empty `pineSoft` `View`. Create then **saves that URI**, so the event page is also blank. `photoUrl || STOCK_PHOTOS[0]` does not run because the URI is non-empty.

**Fix (one place — `Photo`):** if `uri` is `blob:`, `data:`, `file:`, `content:`, or `ph:` (and http(s) as today), render it with `expo-image` or RN `Image`. Keep demo keys on RN `Image`. Keep deny → throw `photos-denied` (no silent `STOCK_PHOTOS[0]`).

Edit Profile photo uses the same `Photo` + `pickPhoto` — it must start painting too.

**Done when:** pick a local jpg on web → form preview **and** event hero show that photo. Stock chips still work. Deny still errors, not jazz.

---

## WEB-4 (Minor) — empty Discover search uses ticket copy

`DiscoverScreen` empty results use `body={t('ticketsEmpty')}` → “No tickets yet. Join something on Discover.”

Add `searchEmpty` (or reuse a real empty-search string) in **en / zh-Hant / zh-Hans**. Point Discover’s empty state at it. Tickets tab keeps `ticketsEmpty`.

---

## WEB-5 (Minor) — “1 events”

`DistrictsScreen` caption is `` `${events.length} ${t('eventsCount')}` ``. EN `eventsCount` is `events` → **1 events**.

Use one interpolated string (e.g. `{n} event` / `{n} events` in EN; 繁/简 can stay `N 個活動`). Do not leave “1 events”.

---

## Locked

Same app. 4 tabs. No QR. Pine/stone. OSM. `4242`. Demo password `thirdspace`. No Firebase, no Google Maps, no eject, no SDK 54 work in this pass.

`npx tsc --noEmit` clean.

Commit:

`fix: English search, language labels, and web-picked event photos`

Start with `searchActivities`, then `rowLanguage`, then `Photo`. Do not stop at README.
