# Implementation Tasks: Bank Statement Categorization

## Task Overview

**Feature:** Bank Statement Categorization (Flokkun bankayfirlits)
**Requirements:** [requirements-bank-statement-categorization.md](requirements-bank-statement-categorization.md)
**Design:** [design-bank-statement-categorization.md](design-bank-statement-categorization.md)
**Status:** Not started

Epic 1 is a hard gate. If it fails, skip Epics 4–5 and ship manual import only (Epics 2, 3, 6, 7 without the automatic path).

## Epic Summary

| Epic | Scope | Depends on | Est. |
|---|---|---|---|
| 1. Phase 0 evaluation | Dataset, eval script, go/no-go | — | 1–1.5 d |
| 2. Types & constants | `statementImport` types and constants | — | 0.25 d |
| 3. Client pipeline | Parse, normalise, aggregate, privacy filter, gating, line items | 2 | 1.5 d |
| 4. Server route | TypeSafe route, cache, rate limit, budget | 1 (pass), 2 | 1 d |
| 5. Consent & privacy | Consent step, `/personuvernd` update, legal check | 4 | 0.5 d |
| 6. Review UI | Dialog, review screen, import confirm | 3 | 2 d |
| 7. Integration & QA | Wire into Current Expense Report, E2E, mobile | 3, 6 (+4, 5) | 1 d |
| 8. Phase 2: local-first | Lookup bundle, optional browser classifier, local metrics | 7 live ≥ 4 weeks, ≥ 1,000 cached merchants | 2 d (+2 d if Stage B) |

---

## Epic 1: Phase 0 Evaluation (Gate)

### Task 1.1: Collect and Label Descriptors
**Requirements:** US-9

- Gather anonymised transaction descriptors from real statements across ≥ 3 banks (Landsbankinn, Íslandsbanki, Arion, Indó).
- Normalise with a draft `normaliseMerchant`, dedupe, remove anything naming a private person.
- Label ≥ 200 keys: `category`, `isEssential`, `isRecurring`, `isBusiness`.
- Mark ≥ 30% as "unseen" (not named in any criteria example).
- Record one sample export per bank (column names, delimiter, encoding, sign convention) → answers Open Question 1.

**Acceptance Criteria:**
- [ ] ≥ 200 labelled keys, ≥ 60 unseen
- [ ] No personal names or kennitala in the dataset
- [ ] Dataset stored outside git (or confirmed non-identifying before committing)
- [ ] Per-bank export format notes added to design doc

### Task 1.2: Evaluation Script
**Requirements:** US-9

- `scripts/eval-statement-categorization.ts` using `@typesafe-ai/sdk` and the exact question set from the design.
- Outputs: per-category accuracy, confusion matrix, accuracy vs coverage at thresholds 0.3–0.95, flag accuracy, seen vs unseen split, tokens and latency per call.

**Acceptance Criteria:**
- [ ] Script runs with `TYPESAFE_API_KEY` from env, never committed
- [ ] Question text imported from the same module the route will use (single source of truth)
- [ ] Results written as a markdown report

### Task 1.3: Go / No-Go
**Requirements:** US-9

- Choose `GATES` values from the accuracy/coverage curve.
- Estimate cost per import (cold cache) and at an assumed 70% cache hit rate.
- Record decision and numbers in this file and in the project decision log.

**Acceptance Criteria:**
- [ ] Auto-assigned accuracy ≥ 90% at coverage ≥ 60% → GO; otherwise manual-only
- [ ] Chosen thresholds written into `src/lib/constants/statementImport.ts`
- [ ] Optional: test adding a coarse amount band to state; record whether it earns its privacy cost

---

## Epic 2: Types & Constants

### Task 2.1: Type Definitions
**Requirements:** US-3, US-4, US-5, US-6

- Create `src/types/statementImport.ts` per design; export from `src/types/index.ts`.

**Acceptance Criteria:**
- [ ] `ExpenseCategoryId` matches `DEFAULT_CURRENT_EXPENSE_CATEGORIES` IDs (add a type test that fails if they drift)
- [ ] JSDoc on each interface, including which types never leave the browser
- [ ] No TypeScript errors

### Task 2.2: Constants
- Create `src/lib/constants/statementImport.ts` per design.

**Acceptance Criteria:**
- [ ] Thresholds marked provisional until Task 1.3 sets them
- [ ] `QUESTION_SET_VERSION` documented as cache-busting

---

## Epic 3: Client Pipeline

### Task 3.1: Statement Parser
**Requirements:** US-1

- `parseStatement(input: string | ArrayBuffer)` → `{ rows: RawTransaction[]; skipped: number; mapping: ColumnMapping | null }`.
- Header alias detection per bank formats from Task 1.1; encoding fallback; Icelandic number parsing.

**Acceptance Criteria:**
- [ ] Parses each collected bank sample
- [ ] Handles `12.345`, `-12.345,00`, `12 345 kr.`
- [ ] Returns `mapping: null` when columns can't be detected
- [ ] 2,000 rows parse in < 300 ms

### Task 3.2: Normalise, Aggregate, Privacy Filter
**Requirements:** US-2, US-5, US-4

- `normaliseMerchant`, `aggregateByMerchant`, `privacyFilter` in `src/lib/calculations/statementImport.ts`.

**Acceptance Criteria:**
- [ ] Refunds net against the same merchant
- [ ] `amountStable` correct at ±15% boundary
- [ ] Kennitala and P2P descriptors marked `withheld`
- [ ] Table-driven tests from Phase 0 descriptors

### Task 3.3: Gating and Line Items
**Requirements:** US-3, US-4, US-6

- `gateJudgments`, `buildLineItems`, local corrections read/write via `safeGetItem` / `safeSetItem`.

**Acceptance Criteria:**
- [ ] Precedence: local correction → withheld → judgment
- [ ] Data-derived recurrence overrides model when `monthsPresent ≥ 2`
- [ ] `ekki_utgjold` never becomes a line item
- [ ] Append vs replace behave per design

---

## Epic 4: Server Route (skip if Epic 1 = no-go)

### Task 4.1: Server Env and SDK Client
**Requirements:** US-8

- Add `@typesafe-ai/sdk` and `server-only`; create `src/lib/server/env.ts`.
- Add `TYPESAFE_API_KEY`, `STATEMENT_IMPORT_ENABLED`, `STATEMENT_IMPORT_DAILY_CALL_BUDGET`, cache credentials to Vercel env (production + preview) — **approval required before touching production env**.

**Acceptance Criteria:**
- [ ] Build fails if server env is imported from a client component
- [ ] Re-verify SDK helper signatures against the installed version

### Task 4.2: Cache Store
**Requirements:** US-8

- Resolve Open Question 2; implement `getMany` / `setMany` / daily counter behind a small interface with an in-memory implementation for tests.

**Acceptance Criteria:**
- [ ] Keys include `QUESTION_SET_VERSION`
- [ ] Only `businessProbability ≥ 0.9` results are written
- [ ] 90-day TTL

### Task 4.3: Route Handler
**Requirements:** US-3, US-7, US-8

- `src/app/api/flokka-seljendur/route.ts` per design: validation, IP rate limit, kill switch, budget, cache, concurrency-limited `systemOne` calls, per-key failure isolation, count-only logging, `no-store`.

**Acceptance Criteria:**
- [ ] 400 on > 150 keys, > 80 chars, or kennitala pattern
- [ ] Cache hit path makes zero SDK calls (test with mocked client)
- [ ] 503 when disabled or budget exhausted
- [ ] No descriptor strings in logs
- [ ] p95 < 8 s for 80 cold keys (measured on preview deployment)

---

## Epic 5: Consent & Privacy (skip route-related parts if no-go)

### Task 5.1: Consent Step
**Requirements:** US-2

**Acceptance Criteria:**
- [ ] No request sent before explicit consent in the same import
- [ ] Shows withheld count and link to `/personuvernd`
- [ ] Declining goes to manual review with zero network calls (verified in network tab)

### Task 5.2: Privacy Policy and Legal Check
**Requirements:** NFR Privacy, Open Question 5

**Acceptance Criteria:**
- [ ] `/personuvernd` names TypeSafe as processor and lists exactly what is sent and not stored
- [ ] Legal basis and DPA need confirmed by operator — **approval required before publishing policy change**

---

## Epic 6: Review UI

### Task 6.1: Import Dialog and Source/Mapping Steps
**Requirements:** US-1

**Acceptance Criteria:**
- [ ] Upload and paste both work
- [ ] Column mapping preview shows first 5 rows
- [ ] Skipped-row count and date range shown

### Task 6.2: Review Screen
**Requirements:** US-3, US-4, US-5, US-6

**Acceptance Criteria:**
- [ ] Unassigned and "athugaðu" items listed first
- [ ] Category/flag edits update totals instantly without network calls
- [ ] Excluded (`ekki_utgjold`) list with option to move an item back into expenses
- [ ] Keyboard-operable; usable at 375px

### Task 6.3: Import Confirm
**Requirements:** US-6

**Acceptance Criteria:**
- [ ] Append / replace choice with a summary of affected categories
- [ ] Report unchanged until confirm
- [ ] Edited merchants saved as local corrections

---

## Epic 7: Integration & QA

### Task 7.1: Wire Into Current Expense Report
**Acceptance Criteria:**
- [ ] Import entry point visible in `CurrentExpenseReportCalculator`
- [ ] Dependent calculators (cut-impact, savings report) reflect imported data
- [ ] Site reset clears local corrections
- [ ] Automatic option hidden when kill switch is off

### Task 7.2: End-to-End and Mobile QA
**Acceptance Criteria:**
- [ ] One real statement per supported bank end-to-end (anonymised)
- [ ] Request bodies inspected: merchant keys only
- [ ] Route failure simulated → manual fallback works
- [ ] `npm test` and lint pass

---

## Epic 8: Phase 2 — Local-First Categorization

**Design:** [Phase 2](design-bank-statement-categorization.md#phase-2-local-first-categorization)
**Entry criteria:** Epics 1–7 done with Epic 1 = GO; Phase 1 live in production ≥ 4 weeks; ≥ 1,000 distinct cached business merchants.

### Task 8.1: Cache Hit Counter
**Requirements:** US-8 (cost), NFR Privacy

- Add an integer `hits` field to cache entries; increment on every cache read or write for that key.
- This can ship with Phase 1 (Epic 4) so data accumulates before Phase 2 starts.

**Acceptance Criteria:**
- [ ] Counter exists only on business-judged cached keys
- [ ] No per-user or per-request identifiers stored
- [ ] Increment is atomic

### Task 8.2: Lookup Bundle Build Script
**Requirements:** Design § Stage A

- `scripts/build-merchant-lookup.ts`: export cache → filter (`businessProbability ≥ GATES.cacheBusiness`, `hits ≥ 3`) → split by category confidence → write review CSV for uncertain rows → merge confirmed rows → emit `public/data/merchant-lookup.v{N}.json`.

**Acceptance Criteria:**
- [ ] Output matches `MerchantLookupBundle` type
- [ ] Rows below `GATES.categoryAuto` included only after operator confirmation
- [ ] Bundle < 60 KB gzipped at 5,000 entries
- [ ] Operator reviews the full bundle for personal names before first commit — **approval required before publishing the bundle**

### Task 8.3: Client Lookup Resolution
**Requirements:** US-2, US-3, Design § Resolution Order

- Lazy-load the bundle when the import dialog opens; resolve exact `merchantKey` matches after local corrections and the privacy filter.
- Extend `MerchantJudgment.source` with `'lookup' | 'local-model'`; add `MERCHANT_LOOKUP_VERSION` constant.
- Skip the consent step when no unresolved keys remain; otherwise show "X af Y þekkt í vafranum; aðeins Z heiti verða send".

**Acceptance Criteria:**
- [ ] Resolution order matches design exactly (unit test with overlapping sources)
- [ ] Import with only known merchants makes zero network calls (verified in network tab)
- [ ] Bundle load failure falls back silently to the Phase 1 path

### Task 8.4: Local Resolution Metrics
**Requirements:** Design § Measuring Phase 2

- Count-only aggregates per import: resolved by lookup / classifier / server / manual; whether any network call was made; share of local results changed in review.

**Acceptance Criteria:**
- [ ] No merchant keys or amounts in any metric
- [ ] Metrics visible in existing analytics (GA event or equivalent)
- [ ] Baseline measured for 2 weeks after 8.3 ships → decides whether Stage B is needed (> 25% unresolved)

### Task 8.5: Local Classifier — Training and Evaluation (Stage B, conditional)
**Requirements:** Design § Stage B

- Only start if Task 8.4 shows > 25% of merchants unresolved after lookup.
- Offline training: character 2–4-gram hashed features; multinomial logistic regression for category, binary for essential/recurring.
- Brand-level 80/20 split; evaluate against held-out TypeSafe labels and the Phase 0 hand-labelled set; choose `GATES.localClassifier`.

**Acceptance Criteria:**
- [ ] No brand appears in both train and test
- [ ] Accuracy at chosen threshold ≥ Phase 1 auto-assign accuracy
- [ ] Coverage and accuracy report committed next to this spec
- [ ] Training script and exported weights are reproducible from the reviewed dataset

### Task 8.6: Local Classifier — Browser Inference (Stage B, conditional)
**Requirements:** Design § Stage B

- `src/lib/calculations/merchantClassifier.ts`: pure TypeScript inference over sparse JSON weights, no ML runtime dependency.
- Insert after lookup in the resolution order; results below `GATES.localClassifier` fall through to the server.

**Acceptance Criteria:**
- [ ] TypeScript inference matches offline model predictions on the test set (exact top class, probabilities within 1e-6)
- [ ] Weights < 200 KB gzipped, lazy-loaded
- [ ] Local classifier results always show the "athugaðu" badge
- [ ] Inference for 150 merchants < 50 ms on a mid-range phone

### Task 8.7: Privacy Policy and Refresh Runbook
**Requirements:** Design § Data and Privacy Rules

- Update `/personuvernd`: common merchants are recognised locally; data is sent only for unrecognised ones.
- Document the monthly refresh (8.2 → review → commit) and the rebuild required when `QUESTION_SET_VERSION` changes.

**Acceptance Criteria:**
- [ ] Policy text approved by operator before publishing
- [ ] Runbook added to the app's docs

### Epic 8 Success Criteria
- [ ] ≥ 70% of merchants resolved locally
- [ ] ≥ 40% of imports need no network call
- [ ] Share of local results changed in review ≤ the Phase 1 change rate for auto-assigned results

---

## Definition of Done

- [ ] Epic 1 decision recorded (go or manual-only)
- [ ] All applicable acceptance criteria checked
- [ ] Privacy policy updated and approved before the automatic path is enabled in production
- [ ] Kill switch and daily budget configured in production
- [ ] Phase 2 (Epic 8) tracked separately; Phase 1 Done does not require Epic 8
