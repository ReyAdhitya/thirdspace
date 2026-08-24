# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. The demo is rotting. Today is **24 Aug 2026**. Most seed events already started, so Discover looks dead: Jazz, Film (HK$150), Hike, Market all show **Already started**. That is **seed dates**, not a Join bug. Do **not** change Join rules (still no join after `startsAt`).

Do **not** rename Discover **By mood → Create**. That tile is mood **創作** (pottery / sketch / film), not “create an event.” Create event stays on **Your Events**.

Do **not** work SDK 54 / Expo Go launch in this ticket.

---

## Bug

`src/data/seed.ts` hardcodes `hkIso(2026, 8, …)`. Clock moved; Popular is a graveyard.

**Wanted:** a boss/demo can open Discover, tap a **photo card**, and **Join** (or pay `4242`). Tickets still has **Past**. History still has joined events.

---

## Fix (locked)

1. Add a small helper (in `time.ts` or `seed.ts`): **Hong Kong clock + N days, at HH:MM**, returning the same `+08:00` ISO shape as `hkIso`. Use it for **startsAt / endsAt** (and ticket/message timestamps that must stay before/after those events).

2. Split the eight events:

   **Stay in the past** (so Past / History / “already started” still exist):
   - `a_sketch` — finished (copy already says it ended). Keep Alex’s ticket.
   - `a_lib` — past. Keep Alex’s ticket + Library chat.

   **Must be in the future** (Join / pay still work after a hard-refresh next week too — **relative to now**, not another hardcoded August day):
   - `a_jazz` — after-work evening, ~2–4 days out (Popular photo card).
   - `a_film` — HK$150, weekend-ish, ~3–6 days out.
   - `a_hike` — morning, ~4–7 days out, **free Join**.
   - `a_clay` — paid pottery, ~5–8 days out (`4242` path).
   - `a_roof` — meet, ~7–10 days out.
   - `a_market` — keep **8/8 full**. Put it **in the future** so waitlist is demoable (Join waitlist, not Already started).

3. `endsAt` = same calendar day as `startsAt`, original duration (jazz ~2.5h, etc.).

4. Bump `SCHEMA_VERSION` **6 → 7** so existing browsers re-seed. Hard-refresh picks this up.

5. Alex tickets stay **library + sketch** only. Do not auto-join him to future Jazz.

6. `npx tsc --noEmit` clean. Same photos, districts, prices, moods, OSM coords.

---

## Done when

Hard-refresh web (wipe if needed). **Jazz** and **Film** show **Join** (or checkout), not Already started. **Sketch** / **Library** still Already started. Alex **Tickets → Past** still has Library + Sketch. Mood **Create** still filters creative events, still not a create-event button.

Commit:

`fix: seed event times relative to now so the demo can still Join`

Start in `src/data/seed.ts`. Do not rewrite Profile or the map.
