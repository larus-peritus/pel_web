# Job Offer Comparison Calculator - Implementation Summary

## Feature Overview
Implemented a Job Offer Comparison calculator (Starfstilboðasamanburður) for the Icelandic FIRE app "Peningana eða lífið". This calculator allows users to compare two job offers side by side based on actual hourly wage, accounting for all time spent (work hours + commute) versus total compensation.

## Implementation Date
2026-01-22

## Files Created

### 1. Type Definitions
**File**: `src/types/jobOffer.ts`
- `JobOffer` interface - represents a single job offer
- `MonetaryBenefit` interface - represents benefits (e.g., lunch, car, phone)
- `JobOfferMetrics` interface - calculated metrics for an offer
- `JobComparisonResult` interface - comparison results between offers

### 2. Calculation Logic
**File**: `src/lib/calculations/jobOfferComparison.ts`
- `calculateOfferMetrics()` - calculates actual hourly wage for a single offer
- `compareOffers()` - compares multiple offers and identifies the best one
- `createEmptyOffer()` - helper to create new offer with Icelandic defaults

**Calculation Formula**:
- Work weeks/year = 52 - (vacation days ÷ 5)
- Annual work hours = work weeks × weekly hours
- Annual commute hours = (commute minutes/60) × 5 days × work weeks
- Total annual hours = work hours + commute hours
- Actual hourly wage = (salary + benefits) ÷ total annual hours

### 3. Test Suite
**File**: `src/lib/calculations/jobOfferComparison.test.ts`
- 6 comprehensive tests covering all calculation scenarios
- All tests passing ✅

### 4. UI Components

#### Main Component
**File**: `src/components/jobOffer/JobOfferComparison.tsx`
- MVP version comparing 2 offers side by side
- Live calculation preview
- Assumptions panel

#### Job Offer Input Card
**File**: `src/components/jobOffer/JobOfferCard.tsx`
- Input fields for all offer details
- Live preview of actual hourly wage
- Collapsible benefits section

#### Comparison Results
**File**: `src/components/jobOffer/ComparisonResults.tsx`
- Plain language summary with winner badge
- Detailed comparison table
- Life energy perspective panel

### 5. Integration
**Modified File**: `src/components/calculator/CalculatorPageContent.tsx`
- Added import for `JobOfferComparison`
- Set `starfssamanburdur` calculator to `available: true`
- Added routing logic and hero section

## Features Implemented

✅ Compare 2 job offers side by side
✅ All key input fields (salary, hours, vacation, commute, benefits)
✅ Live calculation preview
✅ Detailed comparison table
✅ Winner identification with badge
✅ Plain language Icelandic summary
✅ Life energy visualization (hours/days/weeks)
✅ Assumptions panel
✅ Responsive design

## Icelandic Defaults
- 40-hour work week
- 24 vacation days
- All text in Icelandic

## Testing Status
All 6 unit tests passing ✅

## Location in App
- Tab: "Áhrif innkomu" (Income Impact)
- Calculator: "Starfstilboðasamanburður"
- Icon: ⚖️
