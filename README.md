# Thirdspace

Hong Kong events between home and work. One Expo app for iOS, Android, and **web** (phone-width preview in the browser — how to test on Windows).

Look: stone `#F6F4F1`, cream `#EDEAD8`, ink `#1A1A1A`, pine `#1F3D34`, harbor `#8DA29A`. One sans family (Outfit + Noto Sans TC). Design board: `docs/frontendui.png`.

**Ownership:** Rey builds the app in this repo. **Lok deploys / 上架** (Apple, TestFlight, App Store) — see [Deploying](#deploying--上架-lok).

## Run

```bash
npm install
npx expo start --web    # Chrome, phone-width preview on http://localhost:8082
npx expo start          # QR for Expo Go on a phone
```

Demo accounts, password `thirdspace`:

| Email | Name | Role |
| --- | --- | --- |
| demo@thirdspace.hk | Alex | user (already holds tickets) |
| host@thirdspace.hk | Lin | organizer |
| chen@thirdspace.hk | Chen Shu | organizer |
| admin@thirdspace.hk | Admin | admin |

Bundle id: `hk.thirdspace.app`. Timezone: `Asia/Hong_Kong`.

## What works

- **Auth** — email login/sign-up, plus **real Google Sign-In** (see below). Three roles: `user` / `organizer` / `admin`.
- **Discover** — search, mood tiles, popular photo cards, recommended list, save heart.
- **Districts** — a real **Google Map** of Hong Kong (free Embed API) with the actual events listed beneath it. Search recentres the map.
- **Event page** — Join, 額滿 → waitlist, no join after start, host row with Follow, attendees.
- **Tickets** — pass card with the big date, no QR. Upcoming / Past, calendar strip.
- **Chat** — ticket holders only, own screen. After-event comments on the event page.
- **Create / edit event** — anyone logged in becomes an organizer.
- **Profile** — stats, explorer level, badges, saved, following. Settings: 繁中 / English / 简体, one language per screen.
- **Paid Join** — test checkout with card `4242 4242 4242 4242`. No live Stripe, no real charge.
- **Admin** — hide / feature events, ban users, report inbox.

Data lives in **AsyncStorage** on the device. Screens never touch storage directly; they call `src/services`.

## Google Sign-In

The code is wired and working. It needs one OAuth client id, which is **not** committed.

1. Google Cloud Console → **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. **Authorised JavaScript origins:** `http://localhost:8082`
4. **Authorised redirect URIs:** `http://localhost:8082` (Expo web returns to the page origin — `AuthSession.makeRedirectUri()` on web resolves to exactly this. If you serve on another port, add that origin too.)
5. Copy the client id into `.env`:

```bash
cp .env.example .env
# then set:
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

6. Restart Metro (`npx expo start --web --clear`) so the env var is picked up.

Behaviour: with the id set, tapping the Google button opens the real Google account picker; a known email signs in, a new Gmail gets a fresh `user` account. With the id empty, the button shows a "not configured" banner and email login still works.

For a real iPhone build, create a second client of type **iOS** with bundle id `hk.thirdspace.app` and set `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`. The app already picks the right id per platform and uses the reversed-client-id redirect on iOS.

Note: the app reads the Google `id_token` claims to fill the profile and does **not** verify the signature, because there is no backend. Once a server exists, verify against Google's JWKS there.

## Deploying / 上架 (Lok)

**Rey built the app. Lok deploys it.** Nothing here has been submitted to Apple, and no Apple money has been spent from this repo. `eas.json` is committed and ready.

What Lok needs:

- An **Apple Developer** account (US$99/yr) for TestFlight and the App Store.
- An **Expo** account (`npx expo login`) for EAS Build.
- Optionally his **Google iOS client id** if he wants Google Sign-In on the iPhone build.

Then, from the repo root:

```bash
npm i -g eas-cli
eas login
eas init                  # links this project to his Expo account, once

eas build -p ios --profile preview      # internal / TestFlight-able build
eas submit -p ios --profile preview     # upload to App Store Connect → TestFlight

eas build -p ios --profile production   # App Store release build
eas submit -p ios --profile production
```

Profiles in `eas.json`: `development` (simulator + dev client), `preview` (internal device build), `production` (auto-increments build number). App version comes from `app.json` (`appVersionSource: "local"`).

Still to be done by whoever owns the store listing: App Store screenshots, description, privacy policy URL, age rating. Those are listing assets, not code.

## Firebase later (his keys)

The app ships with a local AsyncStorage backend so it runs with no accounts. To move to the company Firebase project:

1. `cp .env.example .env` and fill:

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
```

2. Replace the **bodies** of `src/services/auth.ts`, `activities.ts`, `tickets.ts`, `chat.ts`, `follows.ts`, `saves.ts`, `reports.ts` with Firestore / Firebase Auth / Storage calls. **Keep every function name and signature** — the screens depend on those, not on the storage engine. `src/services/firebase.ts` holds the env reader and the seam notes.

**Never commit `.env`, `google-services.json`, `GoogleService-Info.plist`, or an admin SDK key.** They are already gitignored.

## Maps

Districts uses the **Google Maps Embed API**, which is free and unmetered — not the Maps JavaScript or Dynamic Maps SDK, which bill per load. Web renders an `<iframe>`, native renders the same URL in `react-native-webview` (`src/components/MapCard.tsx` / `MapCard.web.tsx`). It works with no key at all; setting `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` switches to the official Embed endpoint.

Embed shows one place at a time, so it cannot draw a custom pin per event. The event list under the map is how you see them all; tapping one recentres the map on that address.

## Project layout

```
src/
  components/   Buttons, cards, map, icons, logo
  screens/      One folder per area (auth, discover, districts, tickets, profile, organizer, admin)
  navigation/   Bottom tabs + stack
  services/     The only place that touches storage
  data/         Seed events, districts
  i18n/         繁中 / English / 简体
  lib/          Time, localisation, errors, maps, jwt
  theme/        Colours, type, spacing, layout
```

## Checks

```bash
npx tsc --noEmit        # must be clean
npx expo start --web    # must boot
```

## Reset local data

Clear site data for `localhost` in the browser, or clear app storage in Expo Go. Seed is eight Hong Kong events with 繁中 and English copy, real coordinates, and a mix of 免費 / HK$.
