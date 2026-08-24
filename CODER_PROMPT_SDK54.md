# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. This is **not** another photo/map/EAS-profile pass. Those already shipped (`f4a88e2`). They do **not** open the app on an iPhone.

## The actual bug (IOS-0)

```
ERROR  Project is incompatible with this version of Expo Go
The project you requested requires a newer version of Expo Go.
```

**Cause:** `package.json` has `expo: ~57`. App Store Expo Go is **SDK 54** and Apple has not shipped 55+. Expo Go runs **one** SDK. 57 ≠ 54 → the project **never launches**.

**You will make App Store Expo Go on a physical iPhone open Thirdspace.** That is the only “done.”

Do **not** tell the user to use sign.expo.dev. Do **not** write another README paragraph and stop. Do **not** `eas build` / `eas submit` (no Apple money from this machine).

---

## How (locked)

**Downgrade the project Expo SDK 57 → 54** so it matches store Expo Go.

Official align:

```bash
cd D:\thirdspace
npx expo install expo@^54.0.0 --fix
npx expo install --fix
npx expo-doctor@latest
```

SDK 54 expects **React Native 0.81** and **React 19.1** (not RN 0.86 / React 19.2 from 57). `expo install --fix` must move:

- `expo`, every `expo-*` we use (`auth-session`, `constants`, `crypto`, `font`, `image`, `image-picker`, `linear-gradient`, `status-bar`, `web-browser`)
- `@expo/metro-runtime`, `@expo/vector-icons`, `babel-preset-expo`
- `react`, `react-dom`, `react-native`, `react-native-web`
- `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-webview`
- `@react-native-async-storage/async-storage`
- `@types/react` if doctor says so

Keep `@react-navigation/*` unless doctor/install says they must move. Keep `@expo/ngrok` if present.

If `expo-doctor` fails, **fix the versions**. Do not leave 57 packages mixed with 54.

No `sdkVersion` field in `app.json` unless Expo 54 requires it (prefer omit).

---

## Do not break the product

Same app. Same demo password `thirdspace`. Three roles. OSM Districts (map **not** inside the event list ScrollView). Ticket month calendar. Bundled `assets/demo` photos via `Photo` + RN Image. `pickPhoto` deny → `photos-denied`, never jazz stock. `expo-image-picker` plugin + `NSPhotoLibraryUsageDescription`. Phone-width web. Do **not** eject. Do **not** add Firebase or Google Maps.

If a 54 API changed (`expo-image`, AuthSession, ImagePicker `mediaTypes`), update the **minimum** call sites so `tsc` and the app still work.

---

## Prove it

1. `npx tsc --noEmit` clean.
2. `npx expo start` (LAN). Terminal / Expo must report **SDK 54**, not 57.
3. README: this app is **SDK 54** so **App Store Expo Go** can open it. Remove the “57 / sign.expo.dev only” story as the main path (sign.expo.dev can stay as optional).
4. Done when: scanning the QR with **App Store Expo Go** would no longer print `Project is incompatible`. You cannot hold the phone — the **runtime SDK in the project must be 54**. That is the fix.

Commit:

`fix: downgrade to Expo SDK 54 so App Store Expo Go can open the app`

Start with `npx expo install expo@^54.0.0 --fix`. Do not stop at a comment in README.
