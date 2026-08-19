# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Stack stays **Expo + React Native + TypeScript**. Do **not** eject. Do **not** add Next.js, shadcn, Framer, or the **paid** Google Maps JavaScript / Dynamic Maps SDK.

**Do not break** `src/services`, demo logins, Join, tickets, three roles, phone-width web preview (~390px).

Web = phone frame. Not a desktop map site.

---

## What the user hates

Screenshots:

- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 120457.png` — fake blob “map” (New Territories / Kowloon / HK Island). Not Google. Looks like a kids’ diagram.
- `C:\Users\reyse\OneDrive\Pictures\Screenshots 1\Screenshot 2026-08-19 121245.png` — long list: Central 1, Eastern 0, Southern 0… Users do **not** know what this is. The numbers are “how many events in that district.” Grey `0` rows are empty districts. It feels like homework, not an events app.

As a user: “what territories?” “this is complicated.” They want a **real Google map** and a **simple** screen.

---

## Territories + the list (same priority as the map)

The user called these out by name. If either is still on Districts after your commit, **you failed.**

**Territories** = the three labels **New Territories / Kowloon / HK Island** on the blob map. Normal users do not navigate HK that way. Delete the blobs. Delete those three names. Do not put them back as chips, tabs, filters, or a legend on the Google map.

**The list** = the white card of districts with numbers (`Central 1`, `Eastern 0`, `Southern 0`…). That is an admin spreadsheet, not a consumer UI. Delete the whole index. Do not keep “only rows with 1.” Do not replace it with 18 district buttons. Empty districts must not appear anywhere on this tab.

**What sits under the map instead:** event cards (title, photo, time) — jazz, hike, clay, etc. Same events as Discover. If there is no event, there is no row.

---

## Product (locked)

**Districts tab = a real Google Map of Hong Kong + the events that exist.**

That is the whole job of this tab. One way to pick a place: look at the map / search / tap an event.

### Kill (do not rebuild)

- The SVG blob map (`HongKongMap` silhouettes).
- **New Territories / Kowloon / HK Island** anywhere on this tab.
- The 18-row district index (`Screenshot 2026-08-19 121245.png`). File: the `indexRows` list in `DistrictsScreen.tsx`.
- “Popular districts” photo tiles (third way to pick a place — too much).

### Keep / build

1. **Search** at the top (search events or a place name). Typing filters the event list and **recenters** the Google map on that query (e.g. “Sai Kung”, “Sheung Wan”).
2. **Real Google Map** — Hong Kong, pan + zoom, Google tiles and Google chrome. Default: whole HK (harbour / Kowloon / Island in view), not a random country.
3. **Event cards under the map** — only **real events** (the 8 seed events, plus any created ones). Never list empty districts. Never show `Eastern 0`.
4. Tap a card → open the **event page** (existing `Activity` route). Also pan the map to that event’s address.
5. Language: one language per screen (existing i18n rule). Map `hl` follows app lang (`en` / `zh-TW` / `zh-CN`).

**Do not** add a Google map on the event page in this pass.

Create-event still uses a district dropdown. That form is not this screen.

---

## Free Google Map (non-negotiable)

User wants **free**. Use **Maps Embed** only (Google: $0, unlimited).

- **Web:** `<iframe>` to Google Maps Embed (or `maps.google.com/...&output=embed` if no key).
- **iOS/Android:** same URL in a WebView (`react-native-webview` via `npx expo install`).
- Optional: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env` / `.env.example` for official Embed `https://www.google.com/maps/embed/v1/place?...`. If the key is missing, **still show a real Google map** with the no-key embed URL so the boss demo works.

### Do not

- Do **not** install Maps JavaScript API / Dynamic Maps / custom overlay pins billed per load.
- Do **not** use Apple MapKit (`react-native-maps` default) and call it Google.
- Do **not** use OpenStreetMap / Leaflet. They asked for Google.
- Do **not** invent a Google Cloud key. Do not commit secrets.

**Embed cannot draw 8 custom event pins on one map.** Do not fake that with a paid SDK. The map shows **Hong Kong / the searched or selected place**. The **list under the map** is how you see every event. Selecting an event recenters Embed with `q=` that address (or lat,lng).

Add `lat` + `lng` on each seed activity (HK WGS84). Use them for the embed query. Approximate district centers are fine if the street is not geocoded.

---

## Look

Same stone / pine app. Map sits in a rounded card, height ~280–320, enough to **read as a map**, not a sticker. Air around it. Search not glued to the frame. Event rows already exist (`ActivityRow`) — reuse them.

---

## Done when

Districts tab: real Google map of HK. No blobs. No “New Territories” chrome. No Central/Eastern `0`/`1` spreadsheet. A short list of actual events. Search pans the map. Tap event opens the event. `expo start --web` still runs. Demo password `thirdspace`.

Commit: `feat: real Google Map on Districts, drop district index`

Start with the two screenshots, then `src/screens/districts/DistrictsScreen.tsx` and `src/components/HongKongMap.tsx`.
