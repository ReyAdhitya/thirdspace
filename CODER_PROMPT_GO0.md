# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Expo Go QA **FAIL**. Hunt 1–3 (map, photos, join, Profile) **never ran**. Do **not** “fix the map” in this pass. The JS app **never launched**.

---

## GO-0 (Blocker) — red screen, then stop

```
ERROR  Project is incompatible with this version of Expo Go
The project you requested requires a newer version of Expo Go.
How to fix this error:
Download the latest version of Expo Go from the App Store.
```

Scanned `exp://192.168.50.162:8081` twice. Tunnel was up; **no native client connected**. Updating Expo Go from the store **does not** fix this.

**Cause:** `package.json` has `expo: ~57`. Expo Go on the **Apple App Store stops at SDK 54**. One Go build = one SDK. 57 ≠ 54 → red screen, no Login.

**Done when:** scanning the QR with **App Store Expo Go** opens Thirdspace (login reachable). Project reports **SDK 54**, not 57.

Do **not** tell the user to use sign.expo.dev as the fix. Do **not** stop at README. Do **not** `eas submit`. Do **not** eject.

---

## How

```bash
cd D:\thirdspace
npx expo install expo@^54.0.0 --fix
npx expo install --fix
npx expo-doctor@latest
```

SDK 54 expects **React Native 0.81** and **React 19.1** (not RN 0.86 / React 19.2). `expo install --fix` must move every `expo-*` we use, `@expo/metro-runtime`, `@expo/vector-icons`, `babel-preset-expo`, `react`, `react-dom`, `react-native`, `react-native-web`, gesture-handler, safe-area, screens, svg, webview, async-storage. Keep `@expo/ngrok` if present.

If `expo-doctor` fails, **fix the versions**. No mix of 57 + 54 packages.

If a 54 API changed (`expo-image`, AuthSession, ImagePicker `mediaTypes`), update the **minimum** call sites so `tsc` and the app still work.

---

## Do not break the product

Same demo password `thirdspace`. Three roles. 4 tabs. OSM Districts (map **not** inside the event list ScrollView; `nestedScrollEnabled` on native WebView). Ticket month calendar. Bundled demo photos via `Photo`. Web `blob:` still paints. Deny photos → `photos-denied`, not jazz stock. Profile = pine card + cream rows. Become = **in-app modal**, not `Alert.alert`. Banner at **top**, not covering Settings. No QR. No Firebase. No Google Maps. No eject.

---

## Android note (do not ignore)

After 54, **iPhone App Store Go** should open. If Play Store Expo Go on a phone is already **57**, that phone may then mismatch the other way. Do not chase that in this commit. 54 is the lock for **this** red screen.

---

## Prove

1. `npx tsc --noEmit` clean.
2. `npx expo start` — terminal / Expo must say **SDK 54**.
3. Done = store Expo Go would no longer print `Project is incompatible`. You may not hold the phone — the **runtime SDK in the project must be 54**.

Commit:

`fix: downgrade to Expo SDK 54 so App Store Expo Go can launch`

Start with `npx expo install expo@^54.0.0 --fix`. After this ships, QA will re-run Expo Go for **map pan** and features. Not this ticket.
