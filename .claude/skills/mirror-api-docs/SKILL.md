---
name: mirror-api-docs
description: "Mirrors a merged or open change in api-reference/** or openapi/**.json into every integration-guide page (and sibling api-reference page) that describes the same field or behavior, written in this repo's own voice. Never pushes to the source branch — always opens a separate PR for review. Use when the user says \"mirror this PR\", \"sync the integration guide with PR #N\", \"does the integration guide match the api reference\", or \"/mirror-api-docs <PR#|branch>\"."
compatibility: "Requires the `gh` CLI authenticated against `akhil-kumar-mg-mint/docs`, and network access for `npx mint@latest broken-links`. Run with this repo (`~/docs`) as the working directory."
metadata:
  author: anil
  version: "1.0"
---

## What this skill does

A change to a field name, a dropped key, a new required value, a behavior clarification — anything in `api-reference/**` or `openapi/**.json` — has to show up everywhere else that field or behavior is described in prose: the integration guide, the FAQ, the glossary, and any *other* api-reference page that names the same field on a different endpoint. Mintlify doesn't check this for you; nothing fails to build when `remitter_name` is dropped from one page and still sitting in three others.

This skill takes a source PR (or branch, or commit range) that touched `api-reference/**`/`openapi/**`, works out exactly what changed in plain terms, finds every other place in the repo that says the old thing, and rewrites those places — in this repo's voice, not a mechanical find-and-replace. It never commits to the source branch. It always ends in a new PR someone reads before it merges.

This grew out of two real passes syncing PR #92 against PR #93's `principal`→`amount_to_be_settled` / `remitter_name`→Verify PAN / `primary_person_*`→`student_*` rename — both times the first attempt caught only the field-name grep and missed the accompanying prose (a dropped `Warning`, a merged refusal-code row, a table column that needed splitting). Treat that as the baseline of care this skill is built to give every time, not a one-off list to consult.

## The standard this repo writes to

Every mirrored edit has to sound like it was written by the same person who wrote the page, not pasted in from a diff. Concretely:

- **Bold claim, then reason, in one breath.** A `<Note>`/`<Warning>` opens with a bolded one-line verdict, then the next sentence justifies it. Never a heading that restates itself before the content arrives.
- **Say where the value lives now, not just that it's gone.** A dropped field isn't "removed" — the page says where the reader gets that information instead (`remitter_name` → the name is what Verify PAN recorded; TCS → EximPe computes it, read `tcs_inr` off the quote).
- **No "coming soon."** If a purpose code or field is speced but the backend can't actually complete it yet, it stays out of the integration guide with an honest note — never a stub.
- **Tables carry the comparison; prose carries the reasoning.** Don't turn a table row into three sentences, and don't leave a table stale when a rename should have split or merged its rows.
- **Every JSON example is complete and realistic**, never a fragment with `...` — except where truncation is itself labeled (`"… the same fourteen field entries as S0305 …"`, with the count actually recomputed).
- **Cross-links do the explaining.** `[Verify PAN](/api-reference/v3/lrs/verify-pan)` instead of re-explaining what that endpoint does.
- **Don't let the reader branch on an enum client-side.** If the source page says "read the checklist, don't hardcode it," a mirrored page describing the same checklist says the same thing.

## Workflow

### Step 0 — Resolve the source change

Get the PR (or branch): `gh pr view <n> --repo akhil-kumar-mg-mint/docs --json number,title,body,url,state,mergedAt,baseRefName,headRefName,files`.

- If **open**: diff against its merge-base — `git merge-base <base> <head>`, then `git diff <merge-base>...<head>`. The mirror will branch off `<head>` (Step 6), so the mirrored change ships alongside it.
- If **merged**: diff the merge commit against its first parent — `git show --first-parent <merge_sha>`. The mirror branches off the current default branch.
- A bare branch or commit range (no PR) works the same way — diff it against whatever it forked from.

Filter the diff to `api-reference/**` and `openapi/**.json` only. Anything the source PR *also* touched under `integration-guide/**` is a hint about author intent, not the target — treat those hunks as read-only context, never as content to copy verbatim (the mirror still has to fit the target branch's own structure, which may differ — see Gotchas).

### Step 1 — Turn the diff into a vocabulary map

Read the filtered diff like a person, not a patch tool. For every rename, drop, addition, or behavior change, write down:

- old name/value → new name/value (or → *removed, replaced by <endpoint/flow>*)
- which purpose codes / business models / flows it applies to (a field can be dropped on one flow and untouched on a same-named field elsewhere — see Gotchas)
- the *reason*, in the source PR's own words if it gave one (commit body, PR description) — you'll need this to write the mirrored prose, not just the mirrored field name

### Step 2 — Find every mirror target

For each old term in the vocabulary map:

```
grep -rn '<old_term>' --include="*.mdx" --include="*.json" . | grep -v node_modules
```

Check **every** hit, not just the ones in `integration-guide/`. A sibling `api-reference/v3/**` page not in the source diff can name the same field (this is exactly how PR #93 got ahead of PR #92 — `b2b/verification-requirements.mdx` already had the fix, `b2b/submit-verification-details.mdx` and the LRS pages didn't).

### Step 3 — Judge each hit before touching it

**The same field name is not always the same field.** Read the surrounding endpoint/schema context before editing. In this repo, `remitter_name` exists on both the LRS/B2B verification flow (dropped by the rename) and the VBA Simulate Transfer flow (`/pg/vba/simulate-transfer/`, a bank-account holder name on a completely different object) — touching the VBA one would be a real regression, not a mirror. When in doubt, open the file and confirm the endpoint before editing, never edit off the grep line alone.

### Step 4 — Apply the edits

Rewrite each confirmed hit to match the vocabulary map, in the target file's own structure — don't assume the target page groups purpose codes, tables, or examples the same way the source PR's page did. Re-derive anything downstream of a field list changing size: a "same N field entries as X" placeholder count, a table column split (one field becoming two per-flow variants), a `Dates (...)` or `Amounts (...)` values list, an errors table row.

Apply the [standard](#the-standard-this-repo-writes-to) above — this is prose, not template substitution.

### Step 5 — Verify

- Every touched `.json` still parses: `python3 -c "import json; json.load(open('<path>'))"`.
- `npx mint@latest broken-links` — compare the output against a baseline run on the unmodified branch (`git stash` and re-run if needed). This repo has ~40 pre-existing broken links on v1/v2 pages; the bar is **no new ones**, not zero.
- Re-grep every old term from the vocabulary map (Step 2's query) and confirm every remaining hit is a deliberate, judged exception (Step 3), not a miss.

### Step 6 — Ship as a review PR, never a direct push

Never commit to the source branch or push straight to an open PR. Always:

1. `git checkout -b docs/mirror-<short-description> <base-from-step-0>`
2. Commit the mirrored edits with a message describing the rename/behavior change and citing the source PR/commit, in this repo's commit-message voice (see recent `git log` for tone — plain sentences explaining *why*, not a changelog).
3. `git push -u origin <branch>`
4. `gh pr create` with a body that names: the source PR/commit, the vocabulary map from Step 1, every file touched, and — explicitly — anything judged **not** to need mirroring and why (the VBA-flow kind of exception from Step 3). A reviewer should be able to sanity-check the boundary calls without re-doing Step 2 and 3 themselves.

Report the PR URL back to the user. Do not merge it.

## Known gotchas

- **A field rename is a rename, not a deletion.** Don't drop a conditional field entirely when the source diff renamed it — check whether it still needs to exist under the new name before assuming it was cut.
- **Renumber truncated placeholders.** `"… the same N field entries as X …"` style text needs the count recomputed by hand whenever the underlying field list's length changes.
- **Structural drift between branches is normal.** The target branch may have split or merged purpose-code groupings differently than whatever the source PR shows — adapt the edit to the target's actual structure, never paste the source's table shape wholesale.
- **`openapi.json` carries the same renames as the `.mdx` prose, separately.** It's easy to fix five prose pages and forget the schema examples buried in the OpenAPI file — always include it in Step 2's grep.
- **Two "different" fields can share a name.** See Step 3. This is the single most likely way this skill introduces a real bug if rushed.
