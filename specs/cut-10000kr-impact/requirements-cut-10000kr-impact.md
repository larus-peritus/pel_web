# Requirements: "Cut 10.000 kr" Impact Cards

## Overview

**Feature**: "Cut 10.000 kr" Impact Cards (2.2.2)
**App**: peninganaedalifid.is (Peningarnir og Æða Lífið)
**Priority**: Phase 2 - Savings Calculators
**Book Reference**: "Your Money or Your Life" by Vicki Robin - Understanding spending impact

## Problem Statement

When people consider cutting expenses to accelerate their path to Financial Independence, they often think in abstract terms: "Should I cancel Netflix?" or "Should I eat out less?" These questions are difficult to answer because:

- **Abstract savings**: "Saving 10.000 kr/month" doesn't feel concrete or meaningful
- **Unclear impact**: How much does cutting one category actually move my FI date?
- **Life energy disconnect**: People don't see spending cuts in terms of hours of life reclaimed
- **Category blindness**: They don't know which spending categories have the most impact
- **Motivation gap**: Without seeing tangible impact, it's hard to maintain spending cuts

The "Cut 10.000 kr" Impact Cards tool makes spending cuts **concrete and visual**. By showing category-specific cards that display:
1. How much earlier you'll reach FI by cutting 10.000 kr from that category
2. How many hours of life energy you reclaim per month/year
3. The future value of investing those savings instead

This transforms abstract decisions into concrete, motivating insights that help users prioritize where to cut spending for maximum FI impact.

## User Stories

### US-1: See Impact Cards by Category

**As a** person trying to reach FI faster,
**I want to** see impact cards for different spending categories,
**So that** I can understand which cuts will accelerate my FI date the most.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** display impact cards for at least 6 major spending categories:
   - Subscriptions (streymi og áskriftir)
   - Dining Out (matarútgjöld)
   - Transportation (samgöngur)
   - Shopping/Retail (verslanir)
   - Entertainment (skemmtun)
   - Other recurring expenses (önnur útgjöld)

2. **WHEN** the user views impact cards, **the system SHALL** display each card with:
   - Category name and icon
   - "Cut 10.000 kr" headline
   - FI date shift (months/years earlier)
   - Life energy reclaimed (hours/month and hours/year)
   - Future value if invested (10 years and 20 years)

3. **WHEN** displaying cards, **the system SHALL** rank categories by FI impact (greatest FI date shift first).

4. **WHEN** the user has actual hourly wage calculated, **the system SHALL** use it for life energy calculations.

5. **IF** actual hourly wage is not available, **the system SHALL** show a message: "Reiknaðu raunverulegt tímakaup þitt fyrst til að sjá lífsorku áhrif" (Calculate your actual hourly wage first to see life energy impact).

---

### US-2: Customize Cut Amount

**As a** user with different income levels,
**I want to** adjust the cut amount from the default 10.000 kr,
**So that** I can see impact for realistic cuts based on my situation.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** provide a slider or input to adjust the monthly cut amount.

2. **THE system SHALL** support cut amounts from 1.000 kr to 100.000 kr in 1.000 kr increments.

3. **THE system SHALL** default to 10.000 kr (approximately $100 USD equivalent for Iceland).

4. **WHEN** the user changes the cut amount, **the system SHALL** update all impact cards in real-time (within 100ms).

5. **THE system SHALL** display the current cut amount prominently above the cards.

6. **WHEN** the cut amount changes, **the system SHALL** recalculate:
   - FI date shift for each category
   - Life energy reclaimed
   - Future value projections

---

### US-3: See Life Energy Reclaimed

**As a** user who values time over money,
**I want to** see how many hours of my life I reclaim by cutting spending,
**So that** I can understand the true benefit beyond just money.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** displaying each impact card, **the system SHALL** show life energy reclaimed as:
   - Hours per month (e.g., "5,3 klst/mán")
   - Total hours per year (e.g., "63,6 klst/ári")
   - Days per year if >= 24 hours (e.g., "2,7 dagar/ári")

2. **THE system SHALL** calculate life energy using: `Cut Amount / Actual Hourly Wage`.

3. **WHEN** life energy is displayed, **the system SHALL** format hours with 1 decimal place.

4. **WHEN** annual hours exceed 24, **the system SHALL** also display as days with 1 decimal place.

5. **THE system SHALL** use Icelandic formatting and units throughout.

---

### US-4: See FI Date Shift

**As a** FIRE-focused user,
**I want to** see how much earlier I'll reach FI by cutting each category,
**So that** I can prioritize high-impact cuts.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** the user has entered FI planning inputs (current savings rate, FI number, current net worth), **the system SHALL** calculate FI date shift for each card.

2. **WHEN** displaying FI date shift, **the system SHALL** show:
   - Months earlier if < 24 months (e.g., "8 mánuðum fyrr")
   - Years and months if >= 24 months (e.g., "2 ár og 3 mánuðum fyrr")

3. **IF** FI date shift is less than 1 month, **the system SHALL** display "Minni áhrif" (Minor impact) with neutral indicator.

4. **IF** FI date shift is 1-12 months, **the system SHALL** display with moderate impact indicator.

5. **IF** FI date shift is 12-36 months, **the system SHALL** display with high impact indicator.

6. **IF** FI date shift is over 36 months, **the system SHALL** display with very high impact indicator.

7. **IF** FI planning inputs are not available, **the system SHALL** hide FI date shift and show: "Settu upp FI markmið til að sjá tímalínu áhrif" (Set up FI goals to see timeline impact).

---

### US-5: See Future Value of Cuts

**As a** user planning long-term,
**I want to** see what the saved money would grow to if invested,
**So that** I understand the compounding benefit of cutting spending.

**Acceptance Criteria (EARS Format)**:

1. **WHEN** displaying each impact card, **the system SHALL** show future value projections for:
   - 10 years at 7% annual return
   - 20 years at 7% annual return

2. **THE system SHALL** calculate future value using the formula:
   ```
   FV = Monthly Savings × ((1 + r)^n - 1) / r
   where r = 0.07/12 (monthly rate), n = months
   ```

3. **WHEN** displaying future value, **the system SHALL** format as whole ISK with thousands separators (e.g., "2.753.421 kr").

4. **THE system SHALL** display a disclaimer: "Miðað við 7% ársávöxtun" (Based on 7% annual return).

5. **THE system SHALL** include a tooltip explaining: "7% er sögulegt meðaltal hlutabréfavísitölu, leiðrétt fyrir verðbólgu" (7% is the historical stock market average, adjusted for inflation).

---

### US-6: Compare Multiple Categories

**As a** user deciding where to cut,
**I want to** see all categories side-by-side,
**So that** I can easily compare impact across categories.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** display all impact cards in a grid layout (2-3 columns on desktop, 1 column on mobile).

2. **THE system SHALL** maintain consistent card heights for visual alignment.

3. **THE system SHALL** use color coding or visual indicators to distinguish impact levels:
   - Green/high impact: FI date shift > 12 months
   - Yellow/moderate impact: FI date shift 3-12 months
   - Gray/low impact: FI date shift < 3 months

4. **THE system SHALL** allow sorting by:
   - FI impact (default)
   - Life energy reclaimed
   - Future value (20-year projection)
   - Category name (alphabetical)

5. **WHEN** the user changes sort order, **the system SHALL** animate card reordering smoothly.

---

### US-7: Icelandic Context and Presets

**As an** Icelandic user,
**I want to** see realistic category examples and amounts,
**So that** the tool feels relevant to my life.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** use Icelandic category names:
   - "Áskriftir" (Subscriptions)
   - "Veitingastaðir" (Dining out)
   - "Samgöngur" (Transportation)
   - "Verslanir" (Shopping)
   - "Skemmtun" (Entertainment)
   - "Annað" (Other)

2. **WHEN** displaying each category card, **the system SHALL** show realistic Icelandic examples:
   - Áskriftir: "t.d. Netflix, Spotify, líkamsrækt"
   - Veitingastaðir: "t.d. hádegisverður, kaffihús, kvöldverður"
   - Samgöngur: "t.d. eldsneyti, bílastæði, Strætó"
   - Verslanir: "t.d. föt, raftæki, húsgögn"
   - Skemmtun: "t.d. bíó, tónleikar, ferðalög"
   - Annað: "t.d. fötþvottur, tómstundir, gjafir"

3. **THE system SHALL** use Icelandic króna (kr) formatting throughout.

4. **THE system SHALL** use Icelandic number formatting (periods for thousands: "10.000 kr").

5. **THE system SHALL** display all UI text in Icelandic.

---

### US-8: Mobile-Optimized Experience

**As a** user on mobile,
**I want** the impact cards to be easy to read and interact with,
**So that** I can explore cuts on any device.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** be fully functional on screens 320px and wider.

2. **WHEN** on mobile (< 768px), **the system SHALL** display cards in single-column layout.

3. **WHEN** on tablet (768-1024px), **the system SHALL** display cards in 2-column layout.

4. **WHEN** on desktop (> 1024px), **the system SHALL** display cards in 3-column layout.

5. **THE system SHALL** use touch-friendly controls (minimum 44px tap targets).

6. **THE system SHALL** use minimum 16px font size for all text to prevent iOS zoom.

7. **WHEN** the user taps a card on mobile, **the system SHALL** expand to show full details without navigating away.

---

### US-9: Data Persistence and Sharing

**As a** user who wants to save my exploration,
**I want to** have my settings and customizations persist,
**So that** I don't lose my work when I close the browser.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** save the following to localStorage:
   - Selected cut amount
   - Sort order preference
   - FI planning inputs (if entered)

2. **WHEN** the user returns to the page, **the system SHALL** restore previous settings within 500ms.

3. **THE system SHALL** include impact card data in the main app's export/import functionality.

4. **WHEN** the user exports data, **the system SHALL** include:
   - Cut amount setting
   - FI inputs used for calculations
   - Timestamp of last calculation

5. **THE system SHALL** maintain privacy by storing all data locally (no server transmission).

---

### US-10: Visual Clarity and Engagement

**As a** user motivated by visual feedback,
**I want** the cards to be visually engaging and easy to understand,
**So that** I feel motivated to take action.

**Acceptance Criteria (EARS Format)**:

1. **THE system SHALL** use distinct icons for each category (e.g., 📺 for subscriptions, 🍽️ for dining).

2. **THE system SHALL** use color coding to indicate impact level:
   - High impact: Green gradient
   - Moderate impact: Blue/yellow gradient
   - Low impact: Gray gradient

3. **WHEN** displaying numbers, **the system SHALL** use large, bold typography for key metrics (FI shift, life energy).

4. **THE system SHALL** use progress bars or visual indicators to show relative impact across categories.

5. **THE system SHALL** include hover effects on desktop (subtle shadow/lift) to indicate interactivity.

6. **THE system SHALL** maintain WCAG 2.1 AA contrast ratios (minimum 4.5:1 for text).

7. **THE system SHALL** use animations sparingly and respect `prefers-reduced-motion` user preference.

---

## Input Specifications

### Required Inputs (from existing calculators)

| Field | Type | Default | Validation | Source |
|-------|------|---------|------------|--------|
| Actual Hourly Wage | Currency | (auto-loaded) | > 0 | Actual Hourly Wage Calculator |
| Current Savings Rate | Percentage | (optional) | 0-100% | User input or future savings calculator |
| FI Number | Currency | (optional) | > 0 | User input or future FI calculator |
| Current Net Worth | Currency | (optional) | >= 0 | User input or future FI calculator |

### Tool-Specific Inputs

| Field | Type | Default | Validation | Notes |
|-------|------|---------|------------|-------|
| Monthly Cut Amount | Currency | 10000 | 1000-100000 | Adjustable via slider/input |
| Sort Order | Enum | 'fi-impact' | One of: fi-impact, life-energy, future-value, alphabetical | User preference |

### Category Definitions

| Category ID | Icelandic Name | Icon | Example Expenses |
|-------------|---------------|------|------------------|
| subscriptions | Áskriftir | 📺 | Netflix, Spotify, líkamsrækt |
| dining | Veitingastaðir | 🍽️ | Hádegisverður, kaffihús, kvöldverður |
| transportation | Samgöngur | 🚗 | Eldsneyti, bílastæði, Strætó |
| shopping | Verslanir | 🛍️ | Föt, raftæki, húsgögn |
| entertainment | Skemmtun | 🎉 | Bíó, tónleikar, ferðalög |
| other | Annað | 📦 | Fötþvottur, tómstundir, gjafir |

## Calculation Formulas

### Life Energy Reclaimed

```
Monthly Life Energy (hours) = Monthly Cut Amount / Actual Hourly Wage
Annual Life Energy (hours) = Monthly Life Energy × 12
Annual Life Energy (days) = Annual Life Energy / 24  (if >= 24 hours)
```

### Future Value Calculation

```
FV = Monthly Savings × ((1 + r)^n - 1) / r

Where:
- Monthly Savings = Monthly Cut Amount
- r = 0.07 / 12  (7% annual return, monthly compounding)
- n = months (120 for 10 years, 240 for 20 years)

Example: 10.000 kr/month for 10 years
FV = 10,000 × ((1.00583)^120 - 1) / 0.00583
FV ≈ 1,730,849 kr
```

### FI Date Shift Calculation

**If FI inputs are available:**

```
Current Annual Savings = Current Income × Savings Rate
New Annual Savings = Current Annual Savings + (Monthly Cut × 12)
Amount Needed for FI = FI Number - Current Net Worth

Years to FI (Current) = Amount Needed / Current Annual Savings
Years to FI (With Cut) = Amount Needed / New Annual Savings
FI Date Shift = Years to FI (Current) - Years to FI (With Cut)

Convert to months: FI Date Shift (months) = FI Date Shift (years) × 12
```

**Simplified assumption**: Linear savings, no investment growth during accumulation phase. This is conservative and easier to understand than complex compound growth models.

### Impact Ranking

```
For sorting by FI impact:
  Primary: FI Date Shift (months, descending)
  Secondary: Life Energy Reclaimed (hours/year, descending)

For sorting by Life Energy:
  Primary: Annual Life Energy (hours, descending)

For sorting by Future Value:
  Primary: 20-year FV (ISK, descending)
```

## Output Specifications

### Impact Card Structure

Each card displays:

```
┌─────────────────────────────────────┐
│ [Icon] Category Name                │
│                                     │
│ DRAGA ÚR UM 10.000 KR/MÁN          │
│                                     │
│ 📅 FI ÁHRIF                        │
│   8 mánuðum fyrr                    │
│                                     │
│ ⏰ LÍFSORKA                        │
│   5,3 klst/mán • 63,6 klst/ári     │
│   (2,7 dagar/ári)                   │
│                                     │
│ 💰 EF FJÁRFEST                     │
│   Eftir 10 ár: 1.730.849 kr        │
│   Eftir 20 ár: 5.024.312 kr        │
│                                     │
│ t.d. Netflix, Spotify, líkamsrækt  │
└─────────────────────────────────────┘
```

### Summary Header

Above all cards:

```
┌─────────────────────────────────────────────────────┐
│ DRAGA ÚR UM [10.000] KR Á MÁNUÐI                   │
│ [Slider: 1.000 kr ──●──────────── 100.000 kr]      │
│                                                     │
│ Sjáðu hversu miklu skiptir að draga úr útgjöldum   │
│ í mismunandi flokkum                                │
└─────────────────────────────────────────────────────┘
```

### Visual Indicators

**FI Impact Levels:**
- 🟢 High Impact (> 12 months): Green gradient background
- 🟡 Moderate Impact (3-12 months): Blue/yellow gradient
- ⚪ Low Impact (< 3 months): Gray gradient
- ⚫ No FI data: Neutral gray, show only life energy and future value

**Sort Controls:**
```
Raða eftir: [FI áhrif ▼] [Lífsorka] [Framtíðarvirði] [Flokki]
```

### Mobile Card (Collapsed State)

```
┌──────────────────────────────┐
│ [Icon] Áskriftir         [>] │
│ 8 mánuðum fyrr               │
│ 5,3 klst/mán                 │
└──────────────────────────────┘
```

Tap to expand to full details.

## Non-Functional Requirements

### Performance

1. **WHEN** the user changes cut amount, **the system SHALL** recalculate and update all cards within 100ms.

2. **WHEN** the page loads, **the system SHALL** render all impact cards within 1 second on 3G connection.

3. **THE system SHALL** perform all calculations client-side (no server requests).

4. **THE system SHALL** debounce slider input to update calculations at most every 100ms during dragging.

### Usability

1. **THE system SHALL** auto-populate actual hourly wage from the core calculator if available.

2. **THE system SHALL** display helpful tooltips explaining:
   - "Raunverulegt tímakaup" (What is actual hourly wage?)
   - "7% ávöxtun" (Why 7% return rate?)
   - "FI númer" (What is FI number?)

3. **THE system SHALL** provide clear messaging when required data is missing.

4. **THE system SHALL** use consistent Icelandic terminology across all cards.

### Accessibility

1. **THE system SHALL** meet WCAG 2.1 AA standards.

2. **THE system SHALL** be fully keyboard navigable (tab through cards, adjust slider with arrow keys).

3. **THE system SHALL** be screen reader compatible with proper ARIA labels on all interactive elements.

4. **THE system SHALL** maintain minimum 4.5:1 color contrast ratios for all text.

5. **THE system SHALL** provide text alternatives for all icons.

6. **THE system SHALL** respect `prefers-reduced-motion` for animations.

### Privacy

1. **THE system SHALL** store all data in browser localStorage only (no server transmission).

2. **THE system SHALL** include cut amount settings in main app export/import.

3. **THE system SHALL** include privacy notice about local-only storage.

### Localization

1. **THE system SHALL** use Icelandic throughout the UI.

2. **THE system SHALL** use Icelandic króna (kr) formatting.

3. **THE system SHALL** use Icelandic number formatting (period for thousands: "10.000 kr").

4. **THE system SHALL** use Icelandic category names and examples relevant to Iceland.

## Dependencies

### Required

- **Actual Hourly Wage Calculator** (Feature 1.3): Provides actual hourly wage for life energy calculations
- **localStorage persistence layer**: For saving settings and integration with export/import

### Optional (Enhance functionality if available)

- **Savings Rate Calculator** (Future 2.2.1): Auto-populate savings rate
- **FI Number Builder** (Future 3.5): Auto-populate FI number
- **FI Timeline Calculator**: Provide current net worth and projections

### Future Integrations

- **Spending Tracker**: Could auto-populate actual spending by category to show realistic cut feasibility
- **Budget Tool**: Integration to show which categories user actually spends in

## Constraints and Assumptions

### Constraints

1. **Client-side only**: No backend for complex FI modeling or user account storage
2. **Simplified FI calculation**: Linear savings model, no market volatility or sequence-of-returns risk
3. **Fixed return rate**: 7% is hardcoded (not user-adjustable in MVP)
4. **Category granularity**: Limited to 6 main categories for simplicity
5. **Icelandic focus**: MVP is Icelandic-only (no multi-currency support)

### Assumptions

1. **User has calculated actual hourly wage**: Core calculator is completed before using this tool
2. **Monthly cuts are sustainable**: User can realistically cut the selected amount monthly
3. **Cuts are invested**: Future value assumes cuts are invested, not spent elsewhere
4. **7% return is reasonable**: Historical stock market average, inflation-adjusted
5. **Categories are universal**: Six categories cover most discretionary spending for most users
6. **FI inputs are accurate**: If user provides FI data, it's realistic for their situation
7. **Spending is recurring**: Tool assumes monthly recurring spending, not one-time expenses

## Success Criteria

### Functional Success

- ✓ Displays 6 category-specific impact cards
- ✓ Calculates life energy reclaimed accurately
- ✓ Calculates FI date shift when inputs available
- ✓ Calculates future value at 7% return for 10 and 20 years
- ✓ Allows cut amount adjustment from 1.000 to 100.000 kr
- ✓ Updates all cards in real-time when cut amount changes
- ✓ Sorts cards by FI impact, life energy, future value, or alphabetically
- ✓ Uses Icelandic throughout with realistic local examples
- ✓ Persists settings to localStorage
- ✓ Works smoothly on mobile, tablet, and desktop

### User Success

- ✓ User identifies highest-impact spending cuts within 1 minute
- ✓ User understands life energy concept visually
- ✓ User feels motivated to take action based on concrete numbers
- ✓ User can compare multiple categories easily
- ✓ User sees personalized impact based on their actual wage

### Quality Success

- ✓ All calculations verified against manual computation
- ✓ Mobile experience is smooth and touch-friendly
- ✓ No accessibility violations (WCAG 2.1 AA compliant)
- ✓ Privacy maintained (all data local)
- ✓ Performance: <100ms calculation updates, <1s page load

## Out of Scope (Future Enhancements)

- **Custom categories**: User-defined spending categories beyond the default 6
- **Actual spending integration**: Pull real spending data from bank or manual tracking
- **Multiple cut scenarios**: Compare different cut amounts simultaneously
- **Combined cuts**: Show impact of cutting multiple categories together
- **Variable return rates**: User-adjustable investment return assumptions
- **Advanced FI modeling**: Sequence of returns, market volatility, variable withdrawal rates
- **Gamification**: Badges, challenges, progress tracking for achieving spending cuts
- **Social comparison**: Anonymous benchmarks against similar users
- **Export to CSV/PDF**: Share or print impact cards
- **Multi-currency**: Support for non-ISK currencies

## Disclaimers Required

**THE system SHALL** display prominent disclaimers:

1. **Financial Disclaimer**: "Þessi reiknivél er til fræðslu eina. Hún veitir ekki fjármálaráðgjöf, skattalega eða lagalega ráðgjöf. Leitaðu til fagaðila fyrir persónulega ráðgjöf." (This calculator is for educational purposes only. It does not provide financial, tax, or legal advice. Seek professional advice for personal guidance.)

2. **FI Calculation Disclaimer**: "FI tímalínu áætlanir gera ráð fyrir stöðugri ávöxtun og sparnaði, sem er óraunhæft. Markaðir sveiflast, líf breytist. Notaðu sem grófa leiðsögn." (FI timeline estimates assume constant returns and savings, which is unrealistic. Markets fluctuate, life changes. Use as rough guidance.)

3. **Investment Disclaimer**: "7% ávöxtun er sögulegur meðaltalur og enginn trygging fyrir framtíðinni. Raunveruleg ávöxtun getur verið hærri eða lægri." (7% return is a historical average and no guarantee of future results. Actual returns may be higher or lower.)

4. **Personal Decision Disclaimer**: "Fjárhagsleg gildi eru aðeins einn þáttur. Íhugaðu heilsu, samskipti, lífshamingju og markmið þegar þú metur breytingar á útgjöldum." (Financial metrics are just one factor. Consider health, relationships, life satisfaction, and goals when evaluating spending changes.)

---

## Requirements Traceability

| Requirement ID | User Story | Priority | Complexity | Depends On |
|----------------|------------|----------|------------|------------|
| REQ-1 | US-1: See Impact Cards by Category | High | Medium | Actual Hourly Wage Calculator |
| REQ-2 | US-2: Customize Cut Amount | High | Simple | - |
| REQ-3 | US-3: See Life Energy Reclaimed | High | Simple | Actual Hourly Wage Calculator |
| REQ-4 | US-4: See FI Date Shift | Medium | Medium | FI inputs (optional) |
| REQ-5 | US-5: See Future Value of Cuts | High | Simple | - |
| REQ-6 | US-6: Compare Multiple Categories | High | Medium | REQ-1 |
| REQ-7 | US-7: Icelandic Context and Presets | High | Simple | - |
| REQ-8 | US-8: Mobile-Optimized Experience | High | Medium | - |
| REQ-9 | US-9: Data Persistence and Sharing | Medium | Simple | localStorage layer |
| REQ-10 | US-10: Visual Clarity and Engagement | High | Medium | - |

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Ready for Design Phase
**Next Steps**: Proceed to design phase for technical architecture and component design
