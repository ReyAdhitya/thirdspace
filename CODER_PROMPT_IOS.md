# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Expo + React Native + TypeScript. Do **not** eject. Do **not** add Next.js, Firebase, Google Maps, Leaflet, or an AI image API.

**Do not** `eas submit`. **Do not** `eas build` unless Apple credentials are already on this machine and the user explicitly ran a build in this chat. QA failed because **no iOS binary exists** and **App Store Expo Go is SDK 54** — that is Apple/Lok, not a missing Discover screen.

Repo: `D:\thirdspace`. Owner `reyyzhrr`. EAS project already linked: `extra.eas.projectId` `7f31c964-71af-4578-b902-d8ff451baab4`. **Do not** `eas init` a second project.

QA source: iOS report **IOS-0** + engineer unblock list. Implement **code** items below. Chrome `localhost:8081` / `8082` is not an iOS pass.

---

## 1. Photo library on a real iOS build (Blocker 18)

`expo-image-picker` is in `package.json`. It **must** be in `app.json` `plugins` with a Photos usage string so the IPA gets `NSPhotoLibraryUsageDescription`.

Also set `ios.infoPlist.NSPhotoLibraryUsageDescription` to the same sentence.

Without this, the first device build crashes or fails silently when picking a cover.

---

## 2. Denied Photos is not a photo (QA item 5)

`src/services/storage.ts` `pickPhoto()`:

- If permission is **not** granted → throw `'photos-denied'` (map in `src/lib/errors.ts` + `errPhotosDenied` in en / zh-Hant / zh-Hans).
- **Never** return `STOCK_PHOTOS[0]` on Deny. That looks like a successful pick (jazz).
- Cancel / no asset → `null` (no banner).
- Create event: on throw, `showBanner(..., 'warn')`. Stock chips still work.

---

## 3. Map vs page scroll (Blocker 19)

`DistrictsScreen`: **do not** wrap `MapCard` in the same `ScrollView` as the event list. Search + map stay fixed; **only the event list** scrolls.

`MapCard` (native): WebView may pan inside the card (`nestedScrollEnabled`, `bounces={false}`). Keep OSM embed URL. Do not put a map on the event detail page.

`MapCard.web.tsx` stays iframe.

---

## 4. EAS profiles for a **phone**, not only simulator

`eas.json`:

- Keep `development` with `ios.simulator: true` (simulator).
- Add **`development-device`**: `developmentClient: true`, `distribution: internal`, `ios.simulator: false`.
- `preview` stays internal device IPA (`simulator: false`).

README Deploying: App Store Expo Go = SDK 54, this app = SDK 57, `Project is incompatible` is expected. Physical preview = [sign.expo.dev](https://sign.expo.dev) SDK 57 **or** `eas build -p ios --profile preview` (Lok / Apple $99). Do not tell QA to use store Expo Go.

---

## 5. Google on iOS (item 6)

Leave `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` empty in `.env.example`. Email login is the product path. Do **not** invent a Google iOS client id. Do not fail the app if Google is unconfigured.

---

## Do not

- `eas submit`, App Store Connect, pay Apple, Firebase, eject.
- Treat web QA as iOS QA.
- Reopen frozen product (4 tabs, no QR, no host stars, OSM not Google Maps, no 5th Saved tab).
- Break demo logins `thirdspace`, three roles, OSM, month calendar, bundled photos.

## Done when

1. Create-event library pick asks Photos on a **future** native build (plugin + infoPlist).
2. Deny Photos → warning, **not** jazz stock auto-set.
3. Districts: finger on map pans the map; finger on the list scrolls the list.
4. README + `eas.json` match the SDK 54 vs 57 story and `development-device`.
5. `npx tsc --noEmit` clean. Web still phone-width.

Commit:

`fix: iOS photo permission, map not inside ScrollView, device EAS profile`

If this working tree **already** has those diffs, verify each item against this prompt, fill any hole, then commit. Start with `app.json` plugins + `storage.ts`, then `DistrictsScreen`, then `eas.json` / README.
