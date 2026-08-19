# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Stack stays **Expo + React Native + TypeScript**. Do **not** eject. Do **not** add Next.js, shadcn, Framer, Leaflet, `react-native-maps`, Nominatim, Firebase, or a Google Maps SDK/key.

**Do not break** demo logins (`thirdspace`), three roles, Join / waitlist / tickets (no QR), chat, create-event, admin, Google **Sign-In** (OAuth — that stays), phone-width web (~390×844), `src/services` as the only storage seam, timezone `Asia/Hong_Kong`.

This is a **revision pass** on a working MVP. The product is not new. Do not reopen frozen rules (4 tabs, Saved in Profile, no host stars, Pass = ticket, stamps = join badges, waitlist+cancel, one language per screen, test pay `4242`, AsyncStorage).

Boss (Lok) photos, for context only — do not invent extra features from them:

- Tickets: red circle on **查看全部 / show all** → he wants a **full month calendar** because only a few day chips show.
- Demo must look full of **photos** for **user + organizer + admin**, not only Alex.
- Maps: he asked **OpenStreetMap instead of Google** (no Maps API bill). Same vibe as rejecting Firebase.
- Scope stays: HK real-world events, three roles, iOS + Android same app. UI board is `docs/frontendui.png` / `C:\Users\reyse\Downloads\frontendui.png` — **do not** restyle the whole app in this pass.

---

## 1. Districts map → OpenStreetMap (kill Google Maps)

**Files:** `src/lib/maps.ts`, `src/components/MapCard.tsx`, `src/components/MapCard.web.tsx`, `src/screens/districts/DistrictsScreen.tsx`, `README.md` Maps section, `.env.example`.

**Replace** Google Embed / `maps.google.com/...&output=embed` / `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`.

Keep the **same Districts UX**:

1. Search at top (filters the event list).
2. Map card under search.
3. Event rows under the map (real events only — no blob map, no `Central 0` district index).
4. Tap a row → open `Activity` **and** recenter the map on that event.
5. Default view = whole Hong Kong (harbour / Kowloon / Island in frame).

**How to draw OSM (locked):** keep `MapCard` as WebView (native) + iframe (web). Change the **URL only**. Official OSM embed:

`https://www.openstreetmap.org/export/embed.html?bbox={west},{south},{east},{north}&layer=mapnik`

Plus `&marker={lat},{lng}` when you have a point (selected event or district centre).

Build bbox from a centre + span in degrees (WGS84). Rough spans:

- Territory (old `HK_DEFAULT_ZOOM`): centre ~ `22.32, 114.17`, span ~ `0.22` lat / `0.28` lng so the harbour fits.
- Place / event (old `PLACE_ZOOM`): span ~ `0.012`–`0.02` around the point.

Rename helpers in `maps.ts` (`osmEmbedUrl` or keep a generic name). **Zero** remaining `google.com/maps` / Embed v1 / API key reads in app code.

**Search must not call Google or Nominatim.** OSM embed has no geocoder. Recentre using coords we already have:

1. Selected event → `lat`/`lng` (fallback `DISTRICT_CENTER[district]`).
2. Else if the search string matches a district label in **en / zh-Hant / zh-Hans** (trim, case-insensitive for English) → that `DISTRICT_CENTER`.
3. Else if the filtered event list is non-empty → centre on the **first** matching event’s coords.
4. Else → whole-HK bbox, no marker.

Do **not** put a map on the event detail page in this pass.

OSM legal: the official embed chrome already credits OSM. Keep it visible (do not crop attribution off). Title/iframe name = OpenStreetMap, not Google.

`.env.example`: **delete** `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and its comments. **Keep** Google Sign-In client ids. README: Districts = OSM embed, free, no Maps API. Do not say Firebase is in use.

---

## 2. Tickets “查看全部” → month calendar (keep the 5-day strip)

**Files:** `src/screens/tickets/TicketsScreen.tsx`, maybe a small `src/components/MonthCalendar.tsx`, i18n `en.ts` / `zh-Hant.ts` / `zh-Hans.ts`, `src/lib/time.ts` if you need HK month helpers.

**Today:** Calendar section title `t('calendarPreview')`. Action is only **Clear** when a day is selected. Five chips built from the next upcoming ticket (`-4 … 0`). **No** show-all. Day keys currently go through `toISOString()` (UTC) — **wrong** for HK. Day keys must be Hong Kong calendar dates via `hkParts`: `` `${year}-${month}-${day}` ``.

**Build:**

- Keep Upcoming / Past tabs and the **5-day strip**.
- On the Calendar `SectionHead`, action is always `t('seeAllBoard')` (**See all** / **查看全部** / **查看全部**). Tap → open a **month sheet** on this same tab (React Native `Modal` is fine). **Not** a 5th tab. **Not** a new stack route unless you must; prefer Modal overlay, phone-width, stone/pine, existing type tokens.
- Sheet: month title (localised), prev / next month. Grid Sun–Sat (HK phone calendars). Days outside the month muted / not the main hit target.
- **Dot** on days where the **current tab’s** tickets have an event **starting** that HK date (`getActivity` + `hkParts(startsAt)`).
- Today: quiet outline. Selected day: pine fill (same language as the strip `dayOn`).
- Tap a day → set the existing `day` filter, close the sheet, ticket list filters as it already does. Empty day is **allowed** → existing empty state.
- While a day is filtered, keep **Clear** available (second control on the section or clear inside the sheet — list must be able to show all tickets again). Switching Upcoming/Past still clears the day (already does).
- Prev/next month must work for **past** tickets too (Past tab + older months).

Copy: reuse `seeAllBoard` for the action. Add strings if needed (`close`, month names via `Intl` + `Asia/Hong_Kong`, not a new English-only calendar). One language per screen.

---

## 3. Demo faces — Alex + Admin (Unsplash, not AI gen)

**File:** `src/data/seed.ts`

Lin (`photos.portrait`) and Chen (`photos.portrait2`) **keep** their URLs.

**Alex** (`demo@thirdspace.hk`) and **Admin** (`admin@thirdspace.hk`) have **no** `photoUrl` — Profile / host rows / admin user list look empty. Add two **different** Unsplash portrait URLs (people photos, not event covers). Do not reuse Lin/Chen URLs. Do **not** generate images. Do **not** replace the 8 event `photoUrl`s.

Bump `SCHEMA_VERSION` **3 → 4** so devices that already seeded get the new avatars (`store.ts` re-seeds on version mismatch).

---

## Do not

- Leaflet, Mapbox, Google Maps, Nominatim, paid tiles.
- AI image pipeline / Midjourney / extra seed events / reshuffle all covers.
- QR, 5th tab, Figma, eject, Firebase, App Store, desktop layout.
- Restyle Discover to match a Luma dump.
- Ask the user questions. If a file path is missing, use the code.

## Done when

1. Districts map is **OpenStreetMap** embed; no Google Maps URL or Maps API key in app code; search still filters events; recenter uses known lat/lng only.
2. Tickets Calendar **查看全部** opens a **month** grid; pick a day filters tickets; 5-day strip still there; day keys are HK not UTC.
3. Login as Alex, Lin, and Admin — **all three have a face** on Profile (and Admin on admin UI). Event photos unchanged.
4. `npx tsc --noEmit` clean; `npx expo start --web` still phone-width.

Commit:

`feat: OSM districts map, ticket month calendar, demo avatars`

Start with `src/lib/maps.ts` + MapCard titles, then `TicketsScreen`, then `seed.ts` version bump.
