# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. Profile QA+review **PASS** for Become. Two review items only. Polish them. Do **not** reopen search, OSM, Photo, tabs, or SDK. Do **not** put Create event back on Profile home. Do **not** bring back `Alert.alert`.

Evidence: `D:\thirdspace\qa-artifacts\profile-retest\03-PC-become-sheet.png`, `06-PC-after-confirm.png`.

---

## REV-1 (Nit) — Become confirm is an accordion; the card leaves the frame

**Now:** tap Become → cream panel **under the row** + `scrollToEnd` (`askHost` in `ProfileScreen`). The pine **membership card scrolls away**. Hint + Not now / Confirm already work.

**Wanted:** a confirm that feels like a **door**, with the **card still on screen** (dimmed is OK).

**Fix:**

- Stop scrolling the page for Become. Do **not** `scrollToEnd` when `askHost` is true. Language expand may still scroll so 简体 stays above the tabs.
- Become confirm = **in-app Modal** (same family as `MonthCalendar`: `transparent`, scrim, sheet). Not `window.confirm`. Not RN `Alert`.
- Sheet sits on a dim scrim over Profile. Card remains **visible behind** the dim (you still see it is a membership card).
- Same copy: title `becomeOrganizer`, hint `becomeOrganizerHint`, **Not now** (paper) → close, still Member; **Confirm** (pine) → `updateProfile` role organizer → close modal → card reads Host, row gone.
- Tap scrim = Not now. Confirm still the stronger button.

Keep the Language accordion as-is (that is not this nit).

---

## REV-2 (Minor) — success banner covers Settings

**Now:** `InAppBanner` is `position: 'absolute'; bottom: 92` (`Screen.tsx`). After Confirm, “You can host events now.” sits **on top of the Settings row** until it clears.

**Wanted:** banner readable, **no row covered** (especially Settings / last menu rows / tab bar).

**Fix:** move the global banner to the **top** of the phone frame (below the screen title / header air), not above the tab bar. Keep `pointerEvents="none"`. Pine/warn styles stay. Every screen that uses `showBanner` benefits — do not special-case Profile only unless the top placement fights the membership card badly; if it covers the **name** on the card, sit it just under the **Profile** title, overlaying the top padding, not the Settings row.

Do not delete the success banner. Role change on the card stays the source of truth; the toast is extra.

---

## Locked

4 tabs. No QR. Pine/stone. Become still Member-only. `npx tsc --noEmit` clean.

Commit:

`fix: Become confirm as a modal door; move toast off the Settings row`

Start with `ProfileScreen` (modal, kill Become `scrollToEnd`) then `InAppBanner` top. Do not restyle the whole Profile stack.
