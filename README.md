# Thirdspace

Hong Kong events between home and work. One Expo app for iOS, Android, and **web** (phone layout in the browser — how to test on Windows).

Quiet-future look: stone paper, one harbor-pine accent, Noto Serif/Sans TC on web. Not the purple reference JPEG.

## Run

```bash
npm install
npx expo start
```

- Press `w` or run `npx expo start --web` for Chrome on Windows.
- Expo Go: scan the QR from `npx expo start`.

Demo accounts (password `thirdspace`):

| Email | Role |
| --- | --- |
| demo@thirdspace.hk | user (already has tickets) |
| host@thirdspace.hk | organizer 林岸 |
| admin@thirdspace.hk | admin |
| chen@thirdspace.hk | organizer 陳書 |

## What works

- Log in / sign up (email). Google shows a banner until `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set.
- Discover: search, mood chips, popular, featured, recommended, save heart.
- Event page: Join, 額滿 → waitlist, no join after start, ticket-holder chat, comments after end.
- Tickets: card pass (no QR) + upcoming calendar chips.
- Create / edit event (anyone logged in becomes organizer).
- Host page: name, photo, bio, events. Follow. No star score.
- Profile: saved, footprint, stamps, settings (繁中 / English / 简体).
- Paid Join → test checkout (card `4242…`). No live Stripe keys needed.
- Cancel promotes the next waitlist person.
- Admin: hide / feature events, ban users, report inbox.

Data lives in **AsyncStorage** (local). Screens talk only to `src/services`.

## Firebase later

Copy `.env.example` to `.env`. Fill:

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Then replace the bodies of `src/services/auth.ts`, `activities.ts`, `tickets.ts` with Firebase Auth / Firestore / Storage. Keep the same function names. See `src/services/firebase.ts`. **Do not commit `.env` or admin SDK keys.**

## EAS / TestFlight

Skipped: no Apple / Expo account in this environment. App is complete in the repo.

When you have credentials:

```bash
npm i -g eas-cli
eas login
eas build -p ios
eas submit -p ios
```

## Reset local data

Clear site data for localhost in the browser, or in Expo Go clear the app storage. Seed is eight HK events (繁中 titles, mix of 免費 / HK$).
