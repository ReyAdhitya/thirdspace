# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Stack stays **Expo + React Native + TypeScript**. Do **not** eject. Do **not** submit to App Store / TestFlight. Do **not** add live Stripe. Do **not** rebuild screens that already work.

**Owner split (locked)**

- **This repo / you:** fully **build** the product so it works and Lok can deploy.
- **Lok (boss):** 上架 — Apple, TestFlight, App Store. He said he will deploy. Do not pay Apple. Do not `eas submit`.

**Do not break** demo emails, Join, tickets, waitlist, chat, admin, Districts Google map, three roles, phone-width web preview, `src/services` API.

---

## What “fully built” means for THIS app

A clone of `D:\thirdspace` that Lok can run and later EAS-build. Every product job works. Google Sign-In is real (not a stub). README tells **him** how to 上架. Data may stay AsyncStorage until **he** pastes Firebase keys.

It does **not** mean: live on the App Store, real HK$ charges, company Firebase already filled in.

---

## Already done — do not redo

Email login + chips (Alex / Lin / Admin), Discover, event Join, tickets (no QR), waitlist/cancel, chat/comments, create/edit event, host page (no stars), follow/save/stamps, settings 3 languages, test pay `4242`, Admin hide/feature/ban/reports, Districts **Google Embed map** + **event cards** (no blob map, no Central `0` list), `MapCard` / `src/lib/maps.ts`.

Password `thirdspace`. Bundle id `hk.thirdspace.app`.

---

## Your job (the holes)

### 1. Google Sign-In must actually work

`src/services/auth.ts` → `signInWithGoogle` **always throws**, even if `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is set. That is not fully built.

- `npx expo install expo-auth-session expo-web-browser`
- Implement Google OAuth (web first: Chrome phone preview on `localhost:8082`). Native using the same flow so Lok’s iOS build can work when he adds an iOS client id.
- After Google returns: read **email + name**. If that email exists in the store, log them in. If not, **create** a `role: 'user'` (same as email sign-up), set session. Do not use Firebase for this pass.
- Real Google **G** is already `GoogleMark`. Keep it.
- If the env client id is **empty**: keep today’s banner (`googleMissing`). If it is **set**: tapping Google **must** open the Google account picker. Never throw `google-missing` when the id exists.
- `.env` is gitignored. Document the var. **Never commit secrets.**
- README: exact Cloud steps for a **Web** OAuth client — type Web, authorized JS origins `http://localhost:8082`, authorized redirect URIs that match `AuthSession.makeRedirectUri()` / Expo web. Optional iOS client id for later: `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.

Human / Lok paste the id. You wire the code.

### 2. Handover so Lok can deploy (you do not deploy)

Add `eas.json` (preview + production iOS profiles, app version from `app.json`). You **do not** run `eas login` / `eas build` / `eas submit` unless credentials already exist in this environment (they do not — skip the commands, leave the file).

Rewrite README **EAS / TestFlight** from “Skipped, app complete” to:

- **Rey built the app. Lok deploys / 上架.**
- Commands: `eas build -p ios` then `eas submit -p ios`
- Needs: Apple Developer, Expo account, his Google iOS client id if he wants Google on iPhone
- Firebase: still “later / his keys” — copy `.env.example`, swap `src/services/*` bodies, keep function names. Do not implement Firestore in this pass.
- Demo table stays.

### 3. Sanity, don’t expand

- `npx tsc --noEmit` clean.
- Web still starts. Phone frame. One language per screen (don’t mix EN/中文 on one card).
- Do not put New Territories chips or the 18-district `0`/`1` list back.
- Do not add App Store screenshots, privacy policy site, or push notifications.

---

## Done when

- Google with a client id in `.env` logs in a real Gmail and lands in the app.
- Google without a client id still shows the missing banner (email demo still works).
- `eas.json` exists. README says Lok 上架, not “we skipped because no account.”
- Alex / Lin / Admin still work. Map still Google. Join/tickets still work.

Commit: `feat: working Google Sign-In and EAS handover for deploy`

Start: `src/services/auth.ts` `signInWithGoogle`, then README + `eas.json`.
