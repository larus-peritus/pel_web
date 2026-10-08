# Technical Design: Bank Statement Categorization

## Design Overview

A three-stage pipeline where code owns the workflow and TypeSafe supplies narrow semantic judgments:

1. **Browser:** parse → normalise → aggregate by merchant key → privacy filter → apply local corrections.
2. **Server route:** validate → shared cache lookup → TypeSafe `systemOne` for cache misses → cache businesses → return typed judgments.
3. **Browser:** confidence gating → review UI → build `LineItem`s → write to `CurrentExpenseReport` on confirm.

Amounts, dates and account data never leave stage 1. All thresholds live in one constants file so they can be tuned from evaluation data without touching logic.

Design principles (from TypeSafe's building guidance):
- **Select, don't generate.** The model picks a category ID from the site's existing set; it never writes labels, amounts or explanations.
- **Code decides what code can decide.** Recurrence is computed from transaction history whenever the statement allows it; the model's recurring judgment is only a fallback.
- **Keep raw judgments, apply policy separately.** Probabilities are stored per merchant in the review state so changing a threshold re-gates without re-calling the API.
- **Typed output guarantees the interface, not truth.** Every result is reviewable before it affects calculations.

---

## System Architecture

### High-Level Architecture

```
┌──────────────────────────── Browser ────────────────────────────┐
│  StatementImportDialog                                          │
│   ├─ parseStatement()        CSV/paste → RawTransaction[]       │
│   ├─ normaliseMerchant()     "BONUS SMARALIND 1234" → "BONUS"   │
│   ├─ aggregateByMerchant()   → MerchantAggregate[]              │
│   ├─ privacyFilter()         kennitala / P2P → manual only      │
│   ├─ applyLocalCorrections() localStorage overrides             │
│   └─ POST merchant keys only ───────────────┐                   │
└─────────────────────────────────────────────┼───────────────────┘
                                              ▼
┌──────────────── Next.js route: /api/flokka-seljendur ───────────┐
│  validate body (≤150 keys, ≤80 chars, no digits-only)           │
│  rate limit (IP) + daily budget + kill switch                   │
│  cache.getMany(keys, QUESTION_SET_VERSION)                      │
│  misses → TypeSafe systemOne (concurrency 8, SDK retries)       │
│  cache.setMany(results where is_business ≥ 0.9)                 │
│  → MerchantJudgment[]                                           │
└─────────────────────────────────────────────┬───────────────────┘
                                              ▼
┌──────────────────────────── Browser ────────────────────────────┐
│  gateJudgments()  thresholds → auto / flagged / unassigned      │
│  StatementReview  user edits (no network)                       │
│  buildLineItems() → merge into CurrentExpenseReport on confirm  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User opens import from the Current Expense Report and supplies a file or pasted text.
2. `parseStatement` detects delimiter/encoding (UTF-8, then Windows-1252 fallback), finds header columns by known aliases (`Dagsetning`, `Texti`, `Skýring`, `Upphæð`, …), else asks the user to map columns.
3. Only negative (outgoing) and positive refund rows are kept; each gets a `merchantKey`.
4. `privacyFilter` removes keys matching kennitala (`\d{6}-?\d{4}`) or P2P markers (`MILLIF`, `MILLIFÆRSLA`, `AUR`, `KASS`) — these go straight to manual review and are never sent.
5. Keys with a local correction are resolved locally.
6. User consents; remaining unique keys are POSTed.
7. Route returns one `MerchantJudgment` per key (or `null` on failure for that key).
8. Client gates, renders review, and on confirm writes line items.

---

## Component Design

### Component Hierarchy

```
CurrentExpenseReportCalculator (existing)
└── StatementImportButton
    └── StatementImportDialog
        ├── StatementSourceStep        (upload / paste)
        ├── ColumnMappingStep          (only if auto-detect fails)
        ├── ConsentStep                (what is / isn't sent)
        ├── CategorizationProgress
        └── StatementReview
            ├── ReviewSummaryBar       (months, totals, excluded)
            ├── ReviewQueue            (unassigned + "athugaðu" first)
            ├── CategoryGroup ×12
            │   └── MerchantReviewRow  (category select, essential/recurring toggles)
            ├── ExcludedList           (ekki_utgjold)
            └── ImportConfirm          (bæta við / skipta út)
```

### Component Specifications

#### StatementImportDialog
- Owns the import state machine: `source → mapping? → consent → categorizing → review → done`.
- Holds `MerchantAggregate[]` and `MerchantJudgment[]` in component state only; nothing is persisted until confirm.
- Declining consent jumps from `consent` to `review` with every merchant unassigned.

#### ConsentStep
- Lists, in Icelandic, the exact payload: "Aðeins heiti seljenda, t.d. `BONUS`, `N1`. Engar upphæðir, dagsetningar, reikningsnúmer eða kennitölur."
- Shows the count of descriptors withheld by the privacy filter.
- Links to `/personuvernd`.

#### StatementReview
- Recomputes totals from `MerchantAggregate` + current assignments on every change (pure function, no network).
- `MerchantReviewRow` shows: display name, monthly amount, transaction count, total, category select, two toggles, and a subtle "athugaðu" badge when flagged.

---

## Data Models

### Type Definitions

New file `src/types/statementImport.ts`:

```ts
import type { LineItem } from '@/types/currentExpenses';

export type ExpenseCategoryId =
  | 'husnaedi' | 'matur' | 'samgongur' | 'veitur' | 'askriftir' | 'heilsa'
  | 'tryggingar' | 'personuleg' | 'ferdalog' | 'afthreying' | 'born' | 'annad';

export type CategorizationTarget = ExpenseCategoryId | 'ekki_utgjold';

/** One parsed row. Never leaves the browser. */
export interface RawTransaction {
  date: string;          // ISO yyyy-mm-dd
  description: string;   // as exported
  amount: number;        // ISK, negative = outgoing
}

/** Transactions grouped by normalised merchant key. Never leaves the browser. */
export interface MerchantAggregate {
  merchantKey: string;       // normalised, e.g. "BONUS"
  displayName: string;       // most common original descriptor, trimmed
  transactionCount: number;
  netOutgoing: number;       // ISK, positive number, refunds netted
  monthsPresent: number;     // distinct calendar months with activity
  amountStable: boolean;     // per-month totals within ±15%
  withheld: boolean;         // blocked by privacy filter
}

/** Server response per merchant key: raw judgments, no policy applied. */
export interface MerchantJudgment {
  merchantKey: string;
  category: {
    choice: CategorizationTarget;
    probabilities: Record<CategorizationTarget, number>;
    confidence: number;
  };
  essentialProbability: number;
  recurringProbability: number;
  businessProbability: number;
  source: 'cache' | 'model';
  questionSetVersion: string;
}

export type GateOutcome = 'auto' | 'flagged' | 'unassigned';

/** Review state per merchant, after gating and user edits. */
export interface MerchantAssignment {
  merchantKey: string;
  category: CategorizationTarget | null;
  isEssential: boolean;
  isRecurring: boolean;
  gate: GateOutcome;
  userEdited: boolean;
}

/** Stored in localStorage; wins over cache and model. */
export interface LocalCorrection {
  category: CategorizationTarget;
  isEssential: boolean;
  isRecurring: boolean;
  updatedAt: string;
}

export type ImportMode = 'append' | 'replace';

export type BuiltLineItem = LineItem & { categoryId: ExpenseCategoryId };
```

### Constants

New file `src/lib/constants/statementImport.ts`:

```ts
/** Bump when any question text or criteria changes; invalidates the shared cache. */
export const QUESTION_SET_VERSION = 'v1';

/** Provisional — replace with values chosen from Phase 0 evaluation. */
export const GATES = {
  categoryAuto: 0.8,
  categoryReview: 0.5,
  essential: 0.6,
  recurring: 0.6,
  cacheBusiness: 0.9,
} as const;

export const RECURRING_STABILITY_TOLERANCE = 0.15;
export const MAX_MERCHANTS_PER_REQUEST = 150;
export const MAX_MERCHANT_KEY_LENGTH = 80;
export const LOCAL_CORRECTIONS_KEY = 'pel.statementImport.corrections.v1';

export const P2P_MARKERS = ['MILLIF', 'MILLIFÆRSLA', 'AUR ', 'KASS '] as const;
export const KENNITALA_PATTERN = /\b\d{6}-?\d{4}\b/;
```

---

## TypeSafe Question Design

One `systemOne` request per merchant key. All four questions share the same state and run in parallel inside that request.

### State

```ts
state: {
  merchant_descriptor: 'N1 HRINGBRAUT',
  context: 'A transaction descriptor from an Icelandic personal bank statement (debit card or direct debit). Descriptors are usually uppercase, may drop Icelandic characters (Æ→AE, Ö→O), and may include a branch or location.'
}
```

No amounts or dates are included, by design (privacy). Phase 0 should also test whether adding a coarse amount band improves accuracy enough to justify revisiting that decision.

### Questions

```ts
import { choice, noul, TypeSafeClient } from '@typesafe-ai/sdk';

questions: {
  category: choice(
    'Which household expense category does a payment to the merchant in `merchant_descriptor` most likely belong to?',
    {
      husnaedi:   'Housing: rent, mortgage, housing association, property tax, home maintenance and hardware stores (e.g. Húsasmiðjan, BYKO).',
      matur:      'Food: grocery stores (Bónus, Krónan, Nettó, Hagkaup, 10-11, Krambúðin), restaurants, cafés, fast food, food delivery (Wolt).',
      samgongur:  'Transport: fuel (N1, Olís, Orkan, ÓB, Atlantsolía), car loans and leasing, parking (Parka, EasyPark), public transport (Strætó), scooters (Hopp), tolls, car repair.',
      veitur:     'Utilities and telecom: electricity, heating and water (Orkuveitan, HS Veitur, Veitur), internet and mobile (Síminn, Nova, Vodafone/Sýn, Hringdu).',
      askriftir:  'Subscriptions: streaming (Netflix, Spotify, Disney+), gyms (World Class), software and cloud services, magazines, gaming subscriptions.',
      heilsa:     'Health: pharmacies (Lyfja, Lyf og heilsa, Apótekarinn), dentists, doctors, opticians, therapy.',
      tryggingar: 'Insurance: Sjóvá, VÍS, TM, Vörður — any insurance premium.',
      personuleg: 'Personal care and clothing: clothing and shoe stores, hairdressers, cosmetics.',
      ferdalog:   'Travel: airlines (Icelandair, Play), hotels, accommodation booking, car rental, travel abroad.',
      afthreying: 'Entertainment and leisure: cinemas, concerts, events, sports, hobbies, bookstores, bars.',
      born:       'Children: preschool and after-school fees, children\'s activities, toys and children\'s clothing stores.',
      annad:      'An expense that fits none of the categories above, or a general retailer where the purchase type cannot be inferred (e.g. Costco, Elko, Amazon).',
      ekki_utgjold: 'Not a consumption expense: income, refund, transfer between own accounts, savings or investment deposit, pension contribution, loan disbursement, cash withdrawal.',
    },
  ),
  is_essential: noul(
    'Is a payment to the merchant in `merchant_descriptor` typically a necessary household cost (housing, groceries, utilities, insurance, health, commuting, childcare) rather than a discretionary purchase (restaurants, entertainment, travel, non-essential shopping)?',
  ),
  is_recurring: noul(
    'Is a payment to the merchant in `merchant_descriptor` typically a regular recurring charge such as a monthly bill, subscription or membership, rather than an occasional purchase?',
  ),
  is_business: noul(
    'Does `merchant_descriptor` name a business, organisation or public body, rather than a private individual?',
  ),
}
```

Notes:
- Examples in criteria are anchors, not an exhaustive merchant list; Phase 0 checks unseen merchants separately.
- `annad` covers "real expense, no better fit"; `ekki_utgjold` is the no-match option for non-expenses. There is deliberately no generic "unknown" option — low confidence plays that role.
- Question IDs are for code only; every instruction is self-contained.
- Exact SDK helper signatures (`noul` criteria shape, `model` default `jev-latest`) must be re-checked against the installed `@typesafe-ai/sdk` version at implementation time.

---

## Calculation Engine

All pure functions in `src/lib/calculations/statementImport.ts`, unit-tested.

### Merchant Normalisation

```
normaliseMerchant(description):
  upper-case, trim
  strip trailing card/terminal refs:      /\s+\*?\d{3,}$/
  strip dates:                            /\d{1,2}[./]\d{1,2}([./]\d{2,4})?/
  strip common suffixes: HF, EHF, SF, OHF
  collapse whitespace
  keep first 3 tokens
```
Examples: `BONUS SMARALIND 4471` → `BONUS SMARALIND`; `NOVA HF` → `NOVA`; `SPOTIFY P1A2B3C4D5` → `SPOTIFY P1A2B3C4D5` (then token cap). Known over-/under-merging is logged in Phase 0 and tuned.

### Aggregation

```
monthsCovered = distinct months between min(date) and max(date), inclusive, min 1
for each merchantKey:
  netOutgoing   = max(0, −Σ amount)          // refunds reduce spend
  monthsPresent = distinct months with rows
  amountStable  = monthsPresent ≥ 2 AND every month total within ±15% of median
monthlyAmount = round(netOutgoing / monthsCovered)
```

### Gating

```
gateCategory(j):
  if j.category.confidence ≥ GATES.categoryAuto   → auto
  if j.category.confidence ≥ GATES.categoryReview → flagged (keep choice)
  else                                            → unassigned (category null)

isRecurring = monthsPresent ≥ 2
                ? amountStable                          // data wins
                : j.recurringProbability ≥ GATES.recurring
isEssential = j.essentialProbability ≥ GATES.essential
```
Precedence per merchant: **local correction → withheld (manual) → judgment**. Phase 2 inserts bundled lookup and local classifier before the server judgment (see [Phase 2](#phase-2-local-first-categorization)).

### Line Item Construction

On confirm, each assigned merchant with `category ≠ ekki_utgjold` and `monthlyAmount > 0` becomes a `LineItem` `{ id, label: displayName, amount: monthlyAmount, isRecurring, isEssential, notes: "Úr bankayfirliti: N færslur" }`. `append` adds to the category's `lineItems`; `replace` clears line items only in categories receiving imported items.

---

## Server Route

`src/app/api/flokka-seljendur/route.ts` (Node runtime).

```
POST { merchantKeys: string[] }
→ 200 { judgments: (MerchantJudgment | null)[], questionSetVersion }
→ 400 invalid body
→ 429 rate limited
→ 503 disabled / budget exhausted
```

- **Validation:** array of strings, 1–150 items, each 1–80 chars, rejects any key matching `KENNITALA_PATTERN` (defence in depth), dedupes.
- **Server env:** new `src/lib/server/env.ts` importing `server-only`; `TYPESAFE_API_KEY`, `STATEMENT_IMPORT_ENABLED`, `STATEMENT_IMPORT_DAILY_CALL_BUDGET`, cache credentials. The existing `src/lib/env.ts` stays client-safe.
- **Client:** single `TypeSafeClient` instance; SDK default retry policy handles 429/529.
- **Concurrency:** at most 8 in-flight `systemOne` calls per request; per-key failures become `null`.
- **Cache:** key `stmt:${QUESTION_SET_VERSION}:${merchantKey}`, value = judgment minus `source`; TTL 90 days; written only when `businessProbability ≥ GATES.cacheBusiness`.
- **Budget:** atomic daily counter in the cache store; once exceeded, return 503.
- **Logging:** counts only (keys requested, cache hits, model calls, failures, latency). No descriptors.
- Add a `vercel.json` header or route config so responses are `Cache-Control: no-store`.

---

## State Management

### Context Integration
- Import state is local to `StatementImportDialog`; on confirm it dispatches the existing Current Expense Report update path so all dependent calculators see the change through `CalculatorContext` as today.

### localStorage Persistence
- `LOCAL_CORRECTIONS_KEY` holds `Record<merchantKey, LocalCorrection>` via existing `safeGetItem` / `safeSetItem`.
- Written when the user confirms an import, for every merchant they edited.
- Included in the site's existing reset behaviour.

---

## Error Handling

### Validation Rules
| Case | Behaviour |
|---|---|
| Empty or unreadable file | Inline error, stay on source step |
| No amount/description columns detected | Column mapping step |
| > 5,000 rows | Refuse with message (protects the browser) |
| All rows unparseable | Error with example of expected format |
| Route 400/429/503/network error | Toast + all remaining merchants unassigned (manual) |
| Partial `null` judgments | Those merchants unassigned |

### User-Facing Warnings
- Statement shorter than 1 month: note that monthly amounts may be unrepresentative.
- Statement longer than 12 months: note that older spending may not reflect current costs.

---

## Phase 2: Local-First Categorization

### Goal

Use the TypeSafe judgments collected in Phase 1 as training data, so that common merchants are categorised **in the browser with no network call**. TypeSafe becomes the fallback for merchants the local layer doesn't know, not the default path.

Why this is worth it:
- **Privacy:** most imports should need no data sent anywhere, and therefore no consent step.
- **Cost:** model calls scale with *new* merchants, not with users.
- **Latency and resilience:** instant results, and the feature works even if the TypeSafe route is off.
- **Determinism:** the same merchant always gets the same answer for a given bundle version.

Classic ML is a good fit here once labelled data exists; the Phase 1 problem was that it didn't. TypeSafe produces the labels, and a free local model does most of the work afterwards.

**Entry criteria:** Phase 1 live in production for ≥ 4 weeks, and ≥ 1,000 distinct cached business merchants.

### Resolution Order (Phase 2)

```
1. local correction          (localStorage, user's own edits)
2. withheld                  (privacy filter → manual)
3. bundled lookup table      (exact merchantKey match)
4. local classifier          (only if its top probability ≥ GATES.localClassifier)
5. server route / TypeSafe   (only unresolved keys, only after consent)
6. manual review
```

If steps 1–4 resolve every merchant, the consent step is skipped entirely and the UI states that nothing left the browser.

### Stage A: Bundled Lookup Table

The simplest win: a static, versioned JSON file shipped with the site.

**Build pipeline** (`scripts/build-merchant-lookup.ts`, run manually, output committed):

```
export cached judgments for current QUESTION_SET_VERSION
  keep only businessProbability ≥ GATES.cacheBusiness
  keep only keys seen by ≥ 3 distinct imports       (hit counter, see below)
split by category confidence:
  ≥ GATES.categoryAuto  → include directly
  < GATES.categoryAuto  → operator review queue (CSV); include only confirmed rows
write public/data/merchant-lookup.v{N}.json
```

**Format** (compact, loaded lazily when the import dialog opens):

```ts
interface MerchantLookupBundle {
  version: number;
  questionSetVersion: string;
  generatedAt: string;
  // merchantKey → [categoryIndex, essential 0|1, recurring 0|1]
  entries: Record<string, [number, 0 | 1, 0 | 1]>;
  categories: CategorizationTarget[];   // index → id
}
```

Estimated size: ~5,000 merchants × ~30 bytes ≈ 150 KB raw, ~40 KB gzipped.

**Hit counter:** the Phase 1 cache entry gains an integer `hits` field, incremented on each cache read or write for that key. It is stored only on business-judged keys that are already cached, so it adds no new personal data. It exists so the bundle contains merchants many users share, not one-offs.

**Refresh cadence:** monthly, or when review has queued ≥ 200 new confirmed merchants. Bumping `QUESTION_SET_VERSION` requires rebuilding the bundle from re-judged data.

### Stage B: Local Classifier (optional)

The lookup table only matches exact keys. A small classifier generalises to variants the table hasn't seen (`BONUS SKEIFAN` when only `BONUS SMARALIND` is in the table, new branches, spelling variants).

**Only build Stage B if** the lookup table leaves > 25% of merchants in real imports unresolved (measured from count-only route logs: keys sent vs keys received).

**Model:**
- Features: character n-grams (2–4) of `merchantKey`, hashed to a fixed size (e.g. 2¹⁶).
- Model: multinomial logistic regression for `category`; two binary logistic regressions for `essential` and `recurring`.
- Training data: the reviewed lookup entries plus all business-judged cache entries with category confidence ≥ `GATES.categoryAuto`.
- Training runs offline (Python/scikit-learn is fine); export the weights as sparse JSON.
- Inference: a small pure TypeScript function in `src/lib/calculations/merchantClassifier.ts`, no ML runtime dependency.
- Target size: < 200 KB gzipped.

**Gating:** a separate threshold `GATES.localClassifier` (initially stricter than `categoryAuto`, e.g. 0.9), chosen from evaluation. Below it, the key falls through to the server. Local classifier results are always shown with the "athugaðu" badge unless they were confirmed by a lookup match.

**Evaluation:**
- Hold out 20% of merchants by *brand* (not by key), so variants of the same chain don't leak between train and test.
- Report accuracy and coverage at candidate thresholds against (a) the held-out TypeSafe labels and (b) the hand-labelled Phase 0 set.
- Ship only if accuracy at the chosen threshold ≥ Phase 1 auto-assign accuracy.

### Data and Privacy Rules

- The bundle and training set contain only merchant keys judged to be businesses **and** seen by ≥ 3 imports. Anything resembling a person's name is excluded at review.
- No amounts, dates, user corrections or per-user data are ever used for training in Phase 2. (Opt-in correction sharing remains Open Question 4.)
- The bundle is public (served from `/public`), so it must pass the same review as any published content.
- `/personuvernd` is updated to say that common merchants are recognised locally and that data is only sent for unrecognised ones.

### Measuring Phase 2

Count-only metrics per import, logged client-side as aggregates (no descriptors):
- share resolved by lookup, by classifier, by server, and left for manual review
- share of imports that needed no network call
- share of local results the user changed during review (a proxy for local accuracy)

**Success target:** ≥ 70% of merchants resolved locally, and ≥ 40% of imports need no network call.

### Phase 2 Changes to Existing Components

| Component | Change |
|---|---|
| `StatementImportDialog` | Resolve locally before the consent step; skip consent when nothing is left |
| `ConsentStep` | Show "X of Y recognised locally; only Z names will be sent" |
| `MerchantJudgment.source` | Add `'lookup' \| 'local-model'` |
| Route cache entry | Add `hits` counter |
| `src/lib/constants/statementImport.ts` | Add `GATES.localClassifier`, `MERCHANT_LOOKUP_VERSION` |

---

## Testing Strategy

### Unit Tests (Vitest)
- `parseStatement`: delimiters, Icelandic number formats, sign conventions, encoding fallback.
- `normaliseMerchant`: table-driven cases from anonymised real descriptors.
- `aggregateByMerchant`: refunds, multi-month stability, single-month statements.
- `privacyFilter`: kennitala and P2P patterns are withheld.
- `gateJudgments`: boundary values at every threshold; local correction precedence.
- `buildLineItems`: append vs replace, `ekki_utgjold` exclusion.

### Route Tests
- Body validation limits; kennitala rejection; cache-hit path makes no SDK call (mocked client); per-key failure isolation; disabled/budget 503.

### Phase 0 Evaluation (before UI work)
- Script `scripts/eval-statement-categorization.ts` runs the exact question set over a labelled CSV (`merchantKey, category, isEssential, isRecurring, isBusiness`), outputs accuracy per category, confusion matrix, accuracy/coverage curve across confidence thresholds, and flag accuracy.
- Dataset: ≥ 200 descriptors from real, anonymised statements across at least three banks; ≥ 30% held out as merchants not named in any criteria examples.
- The labelled dataset stays out of git if it could identify anyone.

### Manual QA
- One real statement per supported bank, end-to-end, on mobile and desktop.
- Network tab check that request bodies contain only merchant keys.
