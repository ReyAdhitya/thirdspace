# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Rebuild the **Profile tab** to match the boss screenshot IA (member card + stacked menu rows). Do **not** clone the other app’s brand, tabs, or QR.

Reference image (structure only): `C:\Users\reyse\Downloads\75ff803e-ce3b-4897-9750-7b6471cff748.jpg`

That file is **another app**. Steal **layout**, not orange gold, not 5 tabs, not CHECKIN QR, not the Android robot, not the word “Guest”.

---

## What the screenshot is saying

Top to bottom:

1. Screen title **Profile** (centred is fine; our `Screen` header is OK).
2. A **big membership card** (rounded, green, name on it).
3. A **vertical stack of cream rows**: icon · label · chevron.
   - Edit Profile
   - History
   - Your Events
   - Become an organizer
   - Language
4. Bottom tabs stay **ours**.

Their bottom bar is Home / Calendar / Organize / Explore / Profile. **Ignore it.** Thirdspace stays **exactly 4 tabs:** Discover, Districts, Tickets, Profile.

---

## Locked (do not reopen)

- Look: stone `#F6F4F1`, paper/cream rows, **pine `#1F3D34`** card and icons. **Not** orange. **Not** purple.
- **No QR.** No CHECKIN badge. Ticket is still a card you show. Pass copy stays “no QR”.
- **No 5th tab.** Saved is **not** a tab. Saved is a **menu row** on Profile.
- App still **requires login**. Never render their “Guest” state on this tab. The card shows the **logged-in person**.
- Demo password `thirdspace`. Alex / Lin / Admin / Chen still work.
- OSM, calendar, bundled photos, deny-photos, checkout `4242`, chat = holders only — **do not touch** unless a type/nav export forces it.
- Do **not** eject. Do **not** add Firebase or Google Maps.
- One language per screen (繁中 / EN / 简体). Add keys to `en.ts`, `zh-Hant.ts`, `zh-Hans.ts`.
- Alex can still become an organizer (boss row **Become an organizer**). Do not remove that ability.

---

## Current Profile (what you are replacing)

`src/screens/profile/ProfileScreen.tsx` is a long social dashboard: avatar row, fake fans stat, Explorer level, stamp shelf, Saved list, Following list, a fat **Create event** button, Admin button, hosted list.

**Move those jobs into the new rows / pushed screens.** Do not delete the data or the journeys. Do not leave Saved / History / hosted events / Admin / logout unreachable.

---

## Profile home (the only screen that should look like the JPEG)

`ProfileScreen` becomes short:

### 1. Member card

A wide rounded pine card (`colors.pine`, radius `xxl` / 20). Not a tiny avatar row.

- **ArchMark** (white / stone) — Thirdspace doorway, **not** a robot head.
- Optional faint grid or hairline (subtle). No Android logo.
- **Photo** of the user (circle). Alex / Lin / Admin already have faces — they must still show.
- **Name** large on the card (`userName(user, lang)`). 阿樂 / Alex / 林岸 / Admin — **never** the string `Guest`.
- One quiet line under the name: district · Hong Kong, or role (user / organizer / admin) — not a stat strip of four fake numbers.
- **Delete `statFans`** (it was `hosting.length * 5`). Do not bring that lie onto the card.

### 2. Menu rows

Each row = cream/paper rounded rect, hairline border, **pine** Feather icon left, label, **chevron-right** right. Even vertical gap. Full-width in the gutter. Looks like the JPEG stack, in our skin.

**Always (every role):**

| Row | Icon | Opens |
| --- | --- | --- |
| Edit Profile | `edit-3` | new **EditProfile** screen |
| History | `clock` | new **History** screen (joined events + stamps) |
| Your Events | `calendar` | new **YourEvents** screen (hosted + create if host) |
| Saved | `heart` | new **Saved** screen (list that used to sit on Profile) |
| Following | `users` | list of followed hosts (same rows as today → Organizer) |
| Language | `globe` | expand 3 options **on Profile** (same behaviour as Settings language). Whole app language changes. |
| Settings | `settings` | existing `Settings` (logout lives here; keep it) |

**Role rows:**

| Who | Extra row |
| --- | --- |
| `role === 'user'` only | **Become an organizer** (`user-plus` — add the Feather name to `Icon.tsx` if missing, or use `plus`) → confirm → `updateProfile(uid, { role: 'organizer' })` → banner → row **disappears**. They now use Your Events to create. |
| already `organizer` or `admin` | **Do not** show Become an organizer. |
| `admin` only | **Reports** (`shield`) → existing `Admin` screen. |

Do **not** put a fat Create event button on Profile home. Create lives on **Your Events** after they are a host.

Language on Profile **and** in Settings may both exist. Same `setLanguage`. Do not mix EN + 中文 on one row.

---

## Pushed screens (keep them quiet, same stone/paper)

Add to `RootStackParamList` + `RootNavigator`:

```ts
EditProfile: undefined;
History: undefined;
YourEvents: undefined;
Saved: undefined;
Following: undefined;
```

(`Following` can be a tiny screen. Do not add a 5th **tab**.)

### Edit Profile

Fields that already exist on `User` / `updateProfile`:

- Photo: `pickPhoto()` — **deny throws `photos-denied`**, never silently set `STOCK_PHOTOS[0]` / jazz.
- Display name (and `displayNameEn` if you already localize names that way — do not invent a second product field).
- Bio
- Home district (reuse the district picker from Settings)

Save → `updateProfile` → back. Face on the member card updates.

### History

Everything that used to be Journey + Impressions:

- Joined tickets as `ActivityRow` → event page.
- Stamp / badge shelf + locked copy. Stamps are **join badges, not coupons.** Keep `stampsHint`.
- Empty: `noJourneyYet` / `noFootprint`.

### Your Events

- Hosted events (`organizerId === user.uid`), including hidden, with `joined / capacity`.
- **Create event** button here if `role` is `organizer` or `admin`.
- If they are still `user` (should not land here often): empty + point them at Become an organizer.
- Tap row → event page (host can still edit from the event page as today).

`createActivity` already promotes `user` → `organizer` on first create. Leave that safety. Your Events is the **door**. Profile home is not.

### Saved

The Saved list that used to be inline on Profile. Heart still lives on Discover / event. Empty state unchanged.

### Following

Followed hosts → `Organizer`. Empty state if none.

---

## Settings

Keep. Language, district, soon-rows, **Log out**. You may remove the duplicate district from Settings if Edit Profile owns it — **or** keep both in sync. Do not lose logout.

Profile header: **no settings gear required** (Settings is a row). No QR on the left. Title = Profile.

---

## What you will not build

- Guest mode / browse without login.
- QR check-in, scanner, CHECKIN header icon.
- 5 tabs, Organize tab, renaming Discover → Home.
- Orange/gold accent, Android robot, graph-paper toy card from the other app.
- Host stars. Approval queue. Firebase. Google Maps.
- Pixel-clone of their type or the Android system nav.

---

## i18n

Add keys (all three files), e.g.:

- `editProfile`
- `history`
- `yourEvents`
- `becomeOrganizer`
- `becomeOrganizerHint` (one-line confirm)
- `alreadyOrganizer` (optional, unused if you hide the row)
- reuse `saved`, `following`, `rowLanguage`, `settings`, `createEvent`, `hostEvents`, `reportsTitle`

---

## Done when

1. Profile tab = **pine member card + cream chevron rows**. Looks like the JPEG’s **structure**, Thirdspace **skin**.
2. Alex, Lin, Admin still have **three different faces** on the card.
3. Alex: sees Become an organizer; after confirm, can create from Your Events; new event hits Discover.
4. Lin: no Become row; Your Events lists her hosted events.
5. Admin: Reports row still works.
6. History / Saved / Following / Language / Settings / logout all reachable. Nothing orphaned.
7. Still **4 tabs**. **No QR.**
8. `npx tsc --noEmit` clean.

Commit:

`feat: rebuild Profile as member card and menu (boss layout)`

Start with `ProfileScreen`. Do not rewrite Discover, Districts, Tickets, or the map.
