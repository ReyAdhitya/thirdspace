# Paste into the **QA + reviewer** terminal. Do not write app code. Do not write a coder prompt.

You are **two jobs in one seat**:

1. **QA** — prove the Profile **Blocker is gone** and the rows still work.
2. **Reviewer** — judge whether this Profile is a **good Thirdspace screen** (boss layout, our skin), not only “the button didn’t crash.”

Web only. `http://localhost:8082`  
Hard-refresh (**Ctrl+Shift+R**). If down: `npx expo start --web --port 8082` from `D:\thirdspace`.

Password **`thirdspace`**. Log out in **Profile → Settings** before switching.

| Email | Should see |
| --- | --- |
| **new signup** | Become an organizer (use this for PROF-1, not `demo@` first) |
| `demo@thirdspace.hk` Alex | Become; leave him a **user** if you can |
| `host@thirdspace.hk` Lin | Host; Create on **Your Events** only |
| `admin@thirdspace.hk` Admin | Reports; no Become |

Timezone HK. ~24 Aug 2026.

Boss JPEG (structure only): `C:\Users\reyse\Downloads\75ff803e-ce3b-4897-9750-7b6471cff748.jpg`  
Steal **card + cream stack**. Do **not** want Guest, robot, QR/CHECKIN, orange, or 5 tabs.

Last FAIL: **PROF-1** Become = dead `Alert.alert` on web. **PROF-2** 简体 under the tab bar.

---

## Out of scope

Expo Go / 上架 / Google Maps / live Stripe / pixel-clone of the JPEG’s orange app. Settings “soon”. Discover search / “1 event” already passed unless Profile **broke** them.

---

# Part 1 — QA (must pass)

## PROF-1 retest (Blocker)

New signup → Skip interests → Profile.

1. Tap **Become an organizer**.
2. You must see an **in-app** confirm (title, hint, **Not now**, **Confirm**). Not a dead tap. Browser `alert` with only OK is still a **fail**.
3. **Not now** → still Member, row still there, Your Events has **no** Create.
4. **Confirm** → banner, row **gone**, card **Host**, Your Events shows **Create**. Create a free future event → it hits Discover.
5. Repeat tap-Become on **Android** viewport (and iOS if you can). Same confirm must work.

Fail = Blocker if Confirm never appears or Confirm does not promote.

## PROF-2 retest (Minor)

6. Profile → Language → open the three options. **简体中文** must be tappable **without** hitting Tickets. Whole stack becomes 简; row label **语言** only (no glued “Language”). Then 繁 = **語言**. Then EN = Language.

## Smoke (do not skip)

7. Pine card, arch, **real faces**, never Guest, no QR, **4 tabs**, no Create on Profile home.
8. Alex: Edit / History / Saved / Following still open. Lin: Create on Your Events. Admin: Reports.
9. Logout still in Settings.

---

# Part 2 — Reviewer (this is not a second click-test)

Walk the same screens as a **product + visual reviewer**. File **REV-** items. Severity: Blocker / Major / Minor / Nit.

You are allowed to fail the **look** even if QA clicks passed.

### Against the boss ask

- Card on top, cream chevron rows below — **yes or no**. If it still feels like the old stats/Explorer dashboard, fail.
- We kept Thirdspace: pine `#1F3D34`, stone, arch mark, logged-in name. If it looks like the other app (orange, Guest, robot, CHECKIN QR, Home/Calendar/Organize/Explore), fail.

### Become (the door)

- Confirm should feel like a **door**, not a hidden native dialog and not a raw dump of buttons.
- Hint readable. Not now is easy. Confirm is the stronger action (pine).
- After Confirm, the card/role change is obvious. They should not hunt for Create — it lives on **Your Events**.

### Card

- Reads as a **membership card** (name + face + quiet meta), not a game HUD, not a blank green slab.
- Faces of Alex / Lin / Admin stay **three different people**.
- Grid/arch should stay quiet. If the grid fights the name or the photo, say so (Minor/Nit unless it hides the name).

### Stack

- Rows look like one family (icon, label, chevron, cream). Uneven gaps, clipped last row, or Language expand trapped under tabs = fail (PROF-2).
- Saved / Following extra rows are **correct** for this product (Saved is not a 5th tab). Do not fail “JPEG had 5 rows, we have more.”
- Become only for Member. Reports only for Admin. Create **not** on Profile home.

### Copy + language

- One language per screen. 繁/简 rows must not mix English.
- Stamps still “not a coupon” if you open History.

### Chrome

- Phone frame on a wide window. Header not under the notch. Tab bar always reachable. Last Profile controls must not sit under the tabs.

---

## Report

```
QA + REVIEW — PROFILE
URL: http://localhost:8082
Devices:
Become: Not now / Confirm both worked? yes/no
Alex still user? yes/no
```

QA fails: `PROF-…` (keep PROF-1 / PROF-2 ids if they still fail).  
Review fails: `REV-…`

```
ID: PROF-1 | REV-1
Severity: Blocker | Major | Minor | Nit
Hat: QA | Review
Surface:
Character:
What:
Expected:
Actual:
Screenshot:
```

End with **one verdict**:

- **PASS** — PROF-1 gone, PROF-2 gone or nit, no Review Blocker/Major that would embarrass a demo to the boss.
- **FAIL** — Become still dead, or the screen still isn’t the boss card+stack in our skin.

Two short paragraphs at the end (required):

1. **QA:** what you proved with clicks.
2. **Review:** would you show this Profile to Lok as “we did your screenshot”? Yes / yes with nits / no, because…

No patches. No coder prompt.

## Start

Hard-refresh → **new signup** → Become Not now then Confirm (screenshot the in-app confirm) → Language 简 above the tabs → Alex card faces → Lin Your Events → Admin Reports → write QA then Review.

Go.
