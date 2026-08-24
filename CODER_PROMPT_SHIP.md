# Paste into the **coder** terminal. Do not ask the user questions.

You are the **coder**. This is **not** another bug pass.

QA **PASS** for `04e5f26` (Chrome, one surface, hard-refresh). WEB-1 … WEB-5 are done. Do **not** reopen search, `rowLanguage`, `Photo`, `searchEmpty`, or `eventsCount`. Do **not** “improve” Profile, OSM, tabs, or SDK.

---

## What you will do

`master` is **3 commits ahead** of `origin/master` and **not pushed**:

1. `f4a88e2` — iOS photo permission, map not inside ScrollView, device EAS profile  
2. `dac1617` — Profile member card + cream menu  
3. `04e5f26` — English search, language labels, web-picked photos  

**Push those three** to `origin/master` so Lok has them.

```bash
cd D:\thirdspace
git status
git log origin/master..HEAD --oneline
git push origin HEAD
```

No force push. No `--no-verify`. No amend.

---

## Do not commit / do not push

- `CODER_PROMPT_*.md`, `QA_PROMPT_*.md`, `qa-artifacts/`
- Any new feature

Working tree may show `src/components/Photo.tsx` dirty — that is a **comment-only** leftover. **Do not** make a fourth commit for it. Leave it, or `git restore src/components/Photo.tsx`. Do not change Photo behaviour.

---

## Done when

`git status` says `master` is **even with** `origin/master` (or ahead 0).  
`git log origin/master -3 --oneline` includes `04e5f26`.

If push is rejected (auth / network), stop and report the error. Do not open a PR unless `git push` itself tells you to.

Do not start SDK 54. Do not start another QA fix.
