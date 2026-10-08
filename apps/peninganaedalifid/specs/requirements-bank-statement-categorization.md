# Requirements: Bank Statement Categorization

## Feature Overview

**Feature Name:** Bank Statement Categorization (Flokkun bankayfirlits)
**Feature ID:** TBD (assign in APP_PLAN.md)
**Version:** 0.1
**Status:** Draft — gated on Phase 0 evaluation (see US-9)
**Created:** 2026-09-17

### Problem Statement

The Current Expense Report (`CurrentExpenseReportCalculator`) is the most useful input on the site: it feeds the cut-impact, savings report and FIRE calculators. It is also the slowest to fill in. Users have to recall a month of spending from memory, category by category. The numbers come out incomplete (subscriptions and small recurring items get forgotten) and many users give up before reaching the calculators that depend on them.

Every Icelandic bank already exports this data as a transaction list. The hard part is not the arithmetic but the language: turning `BONUS SMARALIND`, `N1 HRINGBRAUT` or `NOVA HF` into *Matur*, *Samgöngur* and *Veitur*.

### Solution

Let the user upload or paste a bank statement. The browser parses it and groups transactions by merchant. Only the **merchant descriptor** (never amounts, dates, account numbers or kennitala) is sent to a server route. That route uses TypeSafe (System One model Jev) to return typed judgments per merchant: category, whether it is essential, whether it is typically recurring, and whether the descriptor names a business rather than a private person. Code aggregates the transactions into monthly line items. Confident results are pre-filled; uncertain ones go to a short review list. The user confirms before anything is written into the Current Expense Report.

All arithmetic stays in code. TypeSafe only selects from categories the site already defines; it never generates text or numbers.

### Non-Goals

- No bank API / open-banking connection (file upload or paste only).
- No server-side storage of any user's transactions, amounts or corrections.
- No financial advice, product recommendations or generated commentary.
- No categorization of income; income and own-account transfers are excluded, not analysed.

---

## User Stories

### US-1: Import a Bank Statement
**As a** user filling in my current expenses
**I want to** upload or paste my bank's transaction export
**So that** I don't have to reconstruct my spending from memory

**Acceptance Criteria (EARS Format):**
- WHEN the user uploads a CSV file or pastes tabular text, the system SHALL parse it entirely in the browser
- WHEN the column layout is recognised, the system SHALL map date, description and amount columns automatically
- IF the column layout is not recognised, the system SHALL let the user pick the date, description and amount columns from a preview of the first rows
- WHEN parsing amounts, the system SHALL handle Icelandic number formats (`12.345`, `-12.345,00`, `12 345 kr.`)
- IF a row cannot be parsed, the system SHALL skip it and show the count of skipped rows
- WHEN the statement covers a date range, the system SHALL display that range and the number of months covered

### US-2: Explicit Consent Before Anything Leaves the Browser
**As a** privacy-conscious user
**I want to** know exactly what is sent to a server before it is sent
**So that** I can decide whether to use automatic categorization

**Acceptance Criteria (EARS Format):**
- WHEN the statement is parsed, the system SHALL show which data will be sent (merchant descriptors only) and which will not (amounts, dates, account numbers, kennitala, balances)
- The system SHALL NOT send any data to the server until the user actively gives consent for that import
- IF the user declines, the system SHALL offer fully manual categorization of the parsed lines with no network calls
- WHEN a descriptor contains a kennitala pattern or a person-to-person transfer marker, the system SHALL withhold it from the server and place it in the manual review list

### US-3: Automatic Categorization
**As a** user who has imported a statement
**I want** each merchant to be placed in one of the existing expense categories
**So that** my expense report is filled in for me

**Acceptance Criteria (EARS Format):**
- WHEN merchant descriptors are sent, the system SHALL assign each one to one of the existing category IDs (`husnaedi`, `matur`, `samgongur`, `veitur`, `askriftir`, `heilsa`, `tryggingar`, `personuleg`, `ferdalog`, `afthreying`, `born`, `annad`) or to `ekki_utgjold`
- WHEN a merchant is judged `ekki_utgjold` (income, refund, own-account transfer, savings/investment deposit, loan disbursement), the system SHALL exclude its transactions from expense totals and list them separately
- WHEN the category confidence is at or above the auto-assign threshold, the system SHALL pre-assign the category without a flag
- WHEN the confidence is between the review and auto-assign thresholds, the system SHALL pre-assign the most likely category and mark it "athugaðu"
- IF the confidence is below the review threshold, the system SHALL leave the merchant unassigned in the review list
- The system SHALL never categorise transactions by amount alone

### US-4: Essential and Recurring Flags
**As a** user planning cuts
**I want** each line item flagged as essential or discretionary, and recurring or one-off
**So that** cut-impact and subscription views work without extra input

**Acceptance Criteria (EARS Format):**
- WHEN a merchant appears in two or more calendar months of the statement with a stable amount (±15%), the system SHALL set `isRecurring = true` from the data, regardless of the model's judgment
- IF the statement covers fewer than two months, the system SHALL use the model's recurring probability, thresholded
- WHEN the essential probability is at or above the threshold, the system SHALL set `isEssential = true`
- The user SHALL be able to toggle both flags on every line during review

### US-5: Monthly Line Items
**As a** user
**I want** transactions turned into monthly amounts
**So that** the numbers match what the expense report expects

**Acceptance Criteria (EARS Format):**
- WHEN aggregating, the system SHALL sum each merchant's expense transactions and divide by the months covered to produce a monthly amount in ISK, rounded to whole krónur
- WHEN a merchant has several descriptor variants that normalise to the same key, the system SHALL merge them into one line item
- WHEN displaying a line item, the system SHALL show the number of transactions and the total it was derived from
- IF refunds from the same merchant exist, the system SHALL net them against that merchant's expenses

### US-6: Review Before Import
**As a** user
**I want to** confirm and correct results before they change my report
**So that** wrong guesses never silently enter my calculations

**Acceptance Criteria (EARS Format):**
- WHEN categorization finishes, the system SHALL show a review screen grouped by category with unassigned and flagged items first
- WHEN the user changes a category or flag, the system SHALL update totals immediately without another model call
- WHEN the user confirms, the system SHALL offer "bæta við" (append to existing line items) or "skipta út" (replace line items in affected categories)
- The system SHALL NOT modify the Current Expense Report until the user confirms
- WHEN the user corrects a merchant, the system SHALL remember that correction in the browser and apply it on future imports ahead of any model or cache result

### US-7: Graceful Degradation
**As a** user
**I want** the import to work even if the AI service is unavailable
**So that** I'm never blocked

**Acceptance Criteria (EARS Format):**
- IF the categorization route fails, times out or is disabled, the system SHALL fall back to manual categorization of the parsed, aggregated lines
- IF only some merchants fail, the system SHALL show those as unassigned and keep the rest
- WHEN the feature kill switch is off, the system SHALL hide the automatic option and keep manual import available

### US-8: Cost and Abuse Controls
**As the** operator of a free site
**I want** model usage bounded
**So that** a spike or abuse can't create an unbounded bill

**Acceptance Criteria (EARS Format):**
- WHEN a merchant key already has a cached result for the current question-set version, the system SHALL return it without a model call
- The route SHALL reject requests with more than 150 merchant descriptors or descriptors longer than 80 characters
- The route SHALL rate-limit per client IP (initial: 5 imports per hour, 20 per day)
- WHEN the daily model-call budget is exhausted, the route SHALL respond as disabled and clients SHALL fall back per US-7
- The TypeSafe API key SHALL only exist server-side

### US-9: Phase 0 Evaluation Gate
**As the** product owner
**I want** evidence that Jev handles Icelandic merchant descriptors before building the UI
**So that** we don't ship a feature that mostly sends users to manual review

**Acceptance Criteria (EARS Format):**
- WHEN Phase 0 runs, the system SHALL evaluate at least 200 anonymised, hand-labelled Icelandic merchant descriptors
- The evaluation SHALL report per-category accuracy, accuracy of auto-assigned items, coverage (share auto-assigned) and the essential/recurring flag accuracy
- The feature SHALL proceed past Phase 0 only IF auto-assigned accuracy ≥ 90% at coverage ≥ 60% (thresholds chosen from the evaluation data, not from docs defaults)
- IF the gate fails, the evaluation results SHALL be recorded and the feature SHALL ship as manual import only (US-1, US-5, US-6)

---

## Non-Functional Requirements

### Privacy
- Only normalised merchant descriptors leave the browser; the request body schema enforces this.
- The shared server cache SHALL store only descriptors judged to be businesses (`is_business` probability ≥ 0.9); others are answered but not cached.
- `/personuvernd` SHALL be updated before launch to name TypeSafe as a processor, describe exactly what is sent, and state that nothing is stored per user.
- No request logging of descriptors beyond aggregate counts.

### Performance
- A 3-month statement (~300 transactions, ~80 unique merchants) SHALL complete categorization in under 8 seconds at p95 with a cold cache.
- Parsing and aggregation SHALL run client-side in under 300 ms for 2,000 rows.

### Accessibility and Language
- All UI text in Icelandic, consistent with the existing calculators.
- The review screen SHALL be fully keyboard-operable and usable at 375px width.

### Compliance
- The feature SHALL NOT present any output as advice; copy describes it as automatic sorting that the user must check.

---

## Open Questions

1. **Bank export formats:** which column layouts do Landsbankinn, Íslandsbanki, Arion and Indó actually export (CSV vs XLSX, encoding, sign convention)? Need one real sample per bank, anonymised.
2. **Cache store:** Upstash Redis via Vercel Marketplace, or a simpler Edge Config / static seed file for the top ~500 merchants?
3. **Credit card statements:** same flow, or a later phase (different descriptors, foreign merchants)?
4. **Opt-in correction sharing:** should users be able to contribute corrections to the shared cache in a later version?
5. **Legal basis:** confirm consent is the right GDPR basis and whether a DPA with TypeSafe is needed before launch.
