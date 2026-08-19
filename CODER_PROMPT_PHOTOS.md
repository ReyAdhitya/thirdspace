# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Expo + React Native + TypeScript. Do **not** eject. Do **not** add Next.js, Leaflet, Firebase, Google Maps, or an AI image API.

**Do not break** OSM Districts, ticket month calendar, demo logins (`thirdspace`), three roles, Join, phone-width web (~390).

This pass is **only photos**. Lok: *“fake AI image like this” / “demo UI image takes an important role”* — meaning **every card has a real picture**, like the collage. Not Midjourney in the app. **Stock photos that actually load.**

---

## What is broken (open this screenshot)

`C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 165213.png`

**Popular now** — two hero cards, titles visible, **no photo**. Solid dark grey `#2A2E2B` (the `ActivityHeroCard` fallback).

Those two events are:

- After-work Jazz in Wan Chai → seed `photos.jazz` = `photo-1511192336575-5a79af67a986` → **HTTP 404**
- Old Street Sketching in Tai Hang → seed `photos.sketch` = `photo-1513364776144-60967b0f8002` → **HTTP 404**

`expo-image` then shows the placeholder background. That is why he thinks there are “no AI photos.” Avatars last pass did **not** fix event covers.

Confirmed dead IDs (HEAD from this machine). **Do not keep them.**

Working replacements (HEAD 200 here — use these or others you HEAD-check yourself):

- Jazz / live music: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80`
- Sketch / drawing: `https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80`

---

## What to build

### 1. Every seed image must load (non-negotiable)

In `src/data/seed.ts` + `LoginScreen` door URL + `STOCK_PHOTOS` in `src/services/storage.ts` (if it re-exports seed):

**HEAD-check every `images.unsplash.com` URL you ship.** If it is not 200, replace it. Cover:

- all 8 event covers
- Lin, Chen, Alex, Admin portraits
- login cover photo

No card, thumb, ticket ghost, activity hero, organizer banner, checkout, create-event stock chip, profile/admin/chat avatar may depend on a 404.

Bump `SCHEMA_VERSION` **4 → 5** so old AsyncStorage (still holding dead jazz/sketch URLs) re-seeds.

### 2. Bundle the demo photos (so this cannot 404 again)

Unsplash IDs die. For a boss demo, **do not depend on live Unsplash**.

1. Download the **working** jpegs into `assets/demo/` (jazz, library, film, hike, clay, roof, market, sketch, portraitLin, portraitChen, portraitAlex, portraitAdmin, loginDoor).
2. Export them from something like `src/data/photos.ts` via `require('../../assets/demo/jazz.jpg')`.
3. Resolve to a URI the existing `Image source={{ uri }}` path can use (`Image.resolveAssetSource(mod).uri`, or pass `source={require(...)}` through a small `Photo` wrapper). **One pattern for the whole app** — do not mix broken remote URLs with local requires on some screens only.
4. Create-event stock picker uses the **same** bundled set.

Keep Unsplash **attribution** in a code comment (photo ids / unsplash.com). Do not invent a Midjourney pipeline.

### 3. Popular / all event chrome must show the picture

`src/components/ActivityCard.tsx` `ActivityHeroCard`:

- Photo is the card. Gradient may darken the **bottom** for white type. It must **not** look like an empty black rectangle when the file exists.
- Give the `Image` a real size (parent already `height: 190`). If `absoluteFill` fails on web, use `width: '100%', height: '100%'`.
- Keep overflow hidden + radius.

Same rule for `ActivityScreen` hero, `TicketCard` ghost, `ActivityRow` thumb, `OrganizerScreen` banner, `CheckoutScreen`.

If a URL is still missing, show a **pine/stone** placeholder — never a mystery black void that looks like “no photo.” Prefer never hitting that because every seed photo is bundled.

### 4. People (already started — finish the surface)

Alex / Lin / Chen / Admin all have portraits in seed after v4. After v5 local assets, confirm these screens actually **paint** the face (not empty circle):

- Profile (all three logins)
- Organizer page
- Admin user row
- Activity host row
- Chat avatars when those users speak

Do not reuse one face for two people.

### 5. Look (Lok’s collage, not purple JPEG)

Lifestyle photos that match the event (jazz club, books, film, trail, clay, night market, sketch). Full-bleed on Popular cards. Phone-width 390. Stone / pine UI **unchanged**. Do not restyle Discover.

---

## Do not

- Google Maps, Leaflet, Firebase, eject, QR, 5th tab, Figma MCP.
- Call an image-generation API.
- Leave jazz/sketch 404 URLs in the repo.
- “It works if Unsplash is up.” Bundle files.

## Done when

1. Screenshot `165213.png` would now show **photos** on both Popular cards, not `#2A2E2B` slabs.
2. All 8 events have a visible photo on Discover, event page, tickets, districts rows.
3. Alex, Lin, Chen, Admin faces visible on Profile.
4. Offline-ish: `assets/demo/` files exist; app does not need Unsplash at runtime.
5. `SCHEMA_VERSION` is 5. `npx tsc --noEmit` clean. Hard-refresh `http://localhost:8082`.

Commit: `fix: bundle demo photos so event cards are not blank`

Start by HEAD-checking current seed URLs, replace jazz + sketch, then bundle `assets/demo/`.
