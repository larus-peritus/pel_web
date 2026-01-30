# Iceland FIRE Adaptation Implementation Plan

## Overview

This document outlines the implementation plan for adapting FIRE (Financial Independence, Retire Early) calculators to Iceland's unique financial landscape, including the three-pillar pension system, higher inflation, and TR means-testing rules.

## Key Iceland-Specific Factors

### 1. Three-Pillar Pension System
- **Pillar I (TR/Tryggingastofnun)**: State pension, means-tested, max ~315,000 ISK/month at age 67
- **Pillar II (Lífeyrissjóður)**: Mandatory occupational pension (15.5% of salary), accessible 60-67
- **Pillar III (Séreign)**: Voluntary private pension (2-4% + employer match), accessible from age 60

### 2. Critical Insight: Séreign Strategy
**Séreign withdrawals do NOT count against TR means-testing!** This makes séreign the optimal "bridge" for ages 60-67.

### 3. TR Means-Testing Rules
- Max TR (single): ~315,000 ISK/month
- Income exemption: ~25,000 ISK/month
- Wage exemption: ~200,000 ISK/month
- Reduction rate: 45% of income above exemptions
- Zero benefit threshold: ~726,000 ISK/month other income

### 4. Withdrawal Ages
| Source | Earliest Access | Standard Age | Notes |
|--------|----------------|--------------|-------|
| Personal savings | Any time | - | Fully flexible |
| Séreign (Pillar III) | 60 | 60 | Doesn't affect TR! |
| Occupational (Pillar II) | 60 (reduced) | 67 | Early = permanent reduction |
| TR (Pillar I) | 65 (conditions) | 67 | Means-tested |

### 5. Inflation Considerations
- Iceland historical average: ~4.4% (vs US ~2.5%)
- Recommended withdrawal rate: 3.0-3.33% (vs US 4%)
- Recommended multiplier: 30x-33x (vs US 25x)
- Real returns from pension funds: ~4% average

### 6. Tax Considerations
- Capital gains tax: 22% flat rate
- Pension withdrawals: Taxed as ordinary income (31-46%)
- Personal tax credit can offset low retirement income

---

## Implementation Phases

### Phase 1: Foundation (COMPLETED)

#### 1.1 Update Multiplier Defaults ✅
- Changed all calculator defaults from 25x to 30x
- Updated help text to explain Iceland context
- Files modified:
  - `src/lib/constants/fi.ts`
  - `src/lib/constants/coastFire.ts`
  - `src/lib/constants/fireTypes.ts`
  - `src/lib/constants/icelandic.ts`

#### 1.2 Three-Phase Planning (FI Number Builder) ✅
- Created `ThreePhasePlanningSection.tsx` component
- Phase 1: Personal savings (retirement → 60)
- Phase 2: Séreign bridge (60 → 67)
- Phase 3: Pensions + FI gap (67+)
- Added Iceland pension constants to `fiNumber.ts`
- Integrated into `FINumberBuilderCalculator.tsx`

#### 1.3 TR Means-Test Calculator ✅
- Created shared `TRMeansTestCalculator.tsx` component
- Shows TR pension calculation based on other income
- Highlights séreign advantage
- Integrated into LeanFIRE and BaristaFIRE calculators

---

### Phase 2: Enhanced Integration (COMPLETED)

#### 2.1 Séreign Optimization Panel ✅
**Goal**: Help users optimize their séreign contributions and withdrawal strategy

**Features**:
- ✅ Séreign contribution calculator (4% employee + 2% employer match)
- ✅ Projected séreign balance at age 60
- ✅ Optimal withdrawal schedule (60-67)
- ✅ Comparison: séreign vs taxable investments
- ✅ "Free money" employer match highlight

**Files created**:
- `src/components/shared/SereignOptimizer.tsx`
- Integrated into Coast FIRE Calculator

#### 2.2 Bridge Amount Calculator ✅
**Goal**: Calculate exact savings needed to bridge early retirement to pension age

**Features**:
- ✅ Input: Target retirement age, monthly expenses, pension estimates
- ✅ Output: Phase 1, 2, 3 bridge amounts
- ✅ Visual timeline showing funding sources by age
- ✅ Summary showing total savings from pension system

**Files created**:
- `src/lib/calculations/bridgeAmount.ts`
- `src/components/shared/BridgeAmountCalculator.tsx`
- Already integrated via ThreePhasePlanningSection

#### 2.3 Occupational Pension Estimator ✅
**Goal**: Estimate occupational pension based on work history

**Features**:
- ✅ Input: Years of contributions, average salary
- ✅ Output: Estimated monthly pension at 67
- ✅ Early withdrawal impact calculator (60, 62, 65, 67)
- ✅ Custom age early withdrawal calculator
- ✅ Integration with TR means-test (shows combined pension)

**Files created**:
- `src/components/shared/OccupationalPensionEstimator.tsx`
- Integrated into Coast FIRE Calculator

#### 2.4 Wage Exemption Calculator (Barista FIRE) ✅
**Goal**: Show how part-time wages interact with TR pension

**Features**:
- ✅ Wage exemption calculator (200k ISK/month)
- ✅ Shows optimal wage level for maximum TR
- ✅ Total income breakdown (wages + pension + TR)
- ✅ Optimization recommendations

**Files created**:
- `src/components/shared/WageExemptionCalculator.tsx`
- Integrated into BaristaFIRE Calculator

#### 2.5 FIRE Type Descriptions Update ✅
**Goal**: Update all FIRE type descriptions with Iceland context

**Changes completed**:
- ✅ LeanFIRE: TR safety net, séreign bridge strategy
- ✅ Regular FIRE: Three-phase approach, 30x multiplier
- ✅ Fat FIRE: Tax implications, no TR benefit
- ✅ Barista FIRE: Wage exemption (200k), pension contributions
- ✅ Coast FIRE: Pension growth, séreign compounding

**Files modified**:
- `src/lib/constants/fireTypes.ts`

#### 2.6 Calculator Integrations ✅

**Coast FIRE Calculator**:
- ✅ Added TRMeansTestCalculator
- ✅ Added OccupationalPensionEstimator
- ✅ Added SereignOptimizer
- ✅ Iceland pension planning collapsible section

**Barista FIRE Calculator**:
- ✅ Added TRMeansTestCalculator
- ✅ Added WageExemptionCalculator

**FI Number Builder**:
- ✅ Already has ThreePhasePlanningSection (comprehensive)

#### 2.7 Geographic Cost Comparison (DEFERRED)
**Status**: Moved to Phase 3 - requires additional regional data research

**Files to modify**:
- `src/components/leanFire/GeographicComparison.tsx`
- Add regional cost data to constants

---

### Phase 3: Advanced Features (COMPLETED)

#### 3.1 Withdrawal Sequence Optimizer ✅
**Goal**: Optimize which accounts to draw from and when

**Features implemented**:
- ✅ Tax-efficient withdrawal ordering by age/phase
- ✅ TR benefit preservation strategy
- ✅ Sequence: Taxable → Séreign → Occupational visualization
- ✅ Optimal withdrawal path by retirement phase (pre-60, 60-67, 67+)
- ✅ Recommendations based on account balances

**Files created**:
- `src/lib/calculations/withdrawalSequence.ts`
- `src/components/shared/WithdrawalSequenceOptimizer.tsx`

#### 3.2 Inflation Stress Testing ✅
**Goal**: Show impact of various inflation scenarios

**Features implemented**:
- ✅ Four scenarios: Low (2.5%), Medium (4%), High (6%), Crisis (10%)
- ✅ Portfolio survival probability calculation
- ✅ Historical Iceland inflation chart (2015-2024)
- ✅ Recommended multiplier by inflation scenario
- ✅ Asset allocation suggestions by risk tolerance

**Files created**:
- `src/lib/calculations/inflationStress.ts`
- `src/components/shared/InflationStressTester.tsx`

#### 3.3 Currency Risk Education ✅
**Goal**: Educate on ISK volatility for international investments

**Features implemented**:
- ✅ Historical ISK/EUR chart (2007-2024)
- ✅ Four currency scenarios (ISK +20%, current, -20%, crisis)
- ✅ Portfolio impact calculations
- ✅ Travel budget impact analysis
- ✅ Hedging strategy recommendations
- ✅ Asset allocation suggestions

**Files created**:
- `src/components/shared/CurrencyRiskEducation.tsx`

#### 3.4 Tax Planning Integration ✅
**Goal**: Show after-tax retirement income

**Features implemented**:
- ✅ Iceland tax brackets visualization (31-46%)
- ✅ Capital gains tax (22%) calculation
- ✅ Personal tax credit optimization (~65k/month)
- ✅ Strategy comparison (all pension vs mixed vs capital gains)
- ✅ Optimal income level for tax credit

**Files created**:
- `src/lib/calculations/taxPlanning.ts`
- `src/components/shared/TaxPlanningCalculator.tsx`

#### 3.5 Calculator Integrations ✅
**Goal**: Integrate Phase 3 components into calculators

**Integrations completed**:
- ✅ FI Number Builder: Advanced Analysis section with all 4 components
- ✅ Coast FIRE: Advanced Analysis section with all 4 components

---

## Calculator-Specific Changes Summary

### FI Number Builder
- ✅ Three-phase planning section
- ✅ 30x default multiplier
- ✅ Bridge amount calculations built into ThreePhasePlanningSection
- ✅ Séreign and pension inputs
- ✅ TR pension estimation
- ✅ Advanced Analysis section (Phase 3):
  - ✅ Withdrawal Sequence Optimizer
  - ✅ Tax Planning Calculator
  - ✅ Inflation Stress Tester
  - ✅ Currency Risk Education

### LeanFIRE Calculator
- ✅ TR means-test calculator
- ✅ 30x default multiplier
- ✅ Updated FIRE type description
- [ ] Enhanced geographic comparison (Phase 3)
- [ ] Séreign bridge strategy guidance (Phase 3)

### BaristaFIRE Calculator
- ✅ TR means-test calculator
- ✅ Wage exemption calculator (200k ISK/month)
- ✅ Part-time income scenarios with pension impact
- ✅ Updated FIRE type description

### Coast FIRE Calculator
- ✅ 30x default multiplier
- ✅ Iceland pension planning section (collapsible)
- ✅ OccupationalPensionEstimator integration
- ✅ SereignOptimizer integration
- ✅ TRMeansTestCalculator integration
- ✅ Updated FIRE type description
- ✅ Advanced Analysis section (Phase 3):
  - ✅ Withdrawal Sequence Optimizer
  - ✅ Tax Planning Calculator
  - ✅ Inflation Stress Tester
  - ✅ Currency Risk Education

### FatFIRE Calculator
- ✅ Updated FIRE type description (22% tax, no TR)
- ✅ Tax planning available via shared components
- ✅ High-income considerations in type description

### FIRE Type Explorer
- ✅ Updated type descriptions for all 5 FIRE types
- ✅ Iceland-specific recommendations in descriptions
- ✅ Pension considerations in each type description

### Retirement Simulator (Future)
- [ ] Three-phase income streams
- [ ] Pension start age modeling
- [ ] TR means-testing simulation

---

## Constants and Calculations Reference

### Key Constants (in `src/lib/constants/fiNumber.ts`)

```typescript
// Pension Ages
ICELAND_PENSION_AGES = {
  SEREIGN_ACCESS_AGE: 60,
  OCCUPATIONAL_EARLY_AGE: 60,
  OCCUPATIONAL_STANDARD_AGE: 67,
  TR_STANDARD_AGE: 67,
  TR_EARLY_AGE: 65,
}

// TR Means-Testing
TR_MEANS_TEST = {
  MAX_MONTHLY_SINGLE: 315_000,
  MAX_MONTHLY_COUPLE: 280_000,
  INCOME_EXEMPTION: 25_000,
  WAGE_EXEMPTION: 200_000,
  REDUCTION_RATE: 0.45,
  ZERO_BENEFIT_INCOME: 726_000,
}

// Occupational Pension
OCCUPATIONAL_PENSION = {
  TOTAL_CONTRIBUTION_RATE: 0.155,  // 15.5%
  EMPLOYER_CONTRIBUTION: 0.115,    // 11.5%
  EMPLOYEE_CONTRIBUTION: 0.04,     // 4%
  TARGET_REPLACEMENT_RATE: 0.56,   // 56% after 40 years
  FULL_BENEFIT_YEARS: 40,
}

// Séreign
SEREIGN_PENSION = {
  TYPICAL_CONTRIBUTION_RATE: 0.04,  // 4%
  TYPICAL_EMPLOYER_MATCH: 0.02,     // 2%
  ACCESS_AGE: 60,
  COUNTS_AGAINST_TR: false,  // KEY INSIGHT!
}
```

### Key Formulas

```typescript
// TR Pension Calculation
function calculateTRPension(otherMonthlyIncome: number): number {
  if (otherMonthlyIncome <= INCOME_EXEMPTION) {
    return MAX_MONTHLY_SINGLE;
  }
  const reduction = (otherMonthlyIncome - INCOME_EXEMPTION) * 0.45;
  return Math.max(0, MAX_MONTHLY_SINGLE - reduction);
}

// Bridge Amount (retirement to age 60)
function calculatePhase1Bridge(
  retirementAge: number,
  monthlyExpenses: number
): number {
  const years = Math.max(0, 60 - retirementAge);
  return years * monthlyExpenses * 12;
}

// Séreign projection
function projectSereignBalance(
  currentBalance: number,
  monthlyContribution: number,
  yearsToAge60: number,
  annualReturn: number
): number {
  // Future value with regular contributions
  const r = annualReturn / 12;
  const n = yearsToAge60 * 12;
  const fvContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
  const fvBalance = currentBalance * Math.pow(1 + annualReturn, yearsToAge60);
  return fvBalance + fvContributions;
}

// Occupational pension estimate
function estimateOccupationalPension(
  yearsContributed: number,
  averageSalary: number
): number {
  const replacementRate = Math.min(0.56, (yearsContributed / 40) * 0.56);
  return averageSalary * replacementRate;
}
```

---

## Educational Content Topics

### Must-Have Educational Sections

1. **Why 30x not 25x?**
   - Iceland's higher inflation history
   - Lower safe withdrawal rate needed
   - Conservative planning for ISK volatility

2. **The Séreign Advantage**
   - Tax-advantaged growth
   - Employer matching (free money!)
   - Doesn't reduce TR benefits
   - Optimal bridge for 60-67

3. **Three-Phase Retirement Planning**
   - Phase 1: Personal savings only
   - Phase 2: Séreign available (60-67)
   - Phase 3: Full pension income (67+)

4. **TR Means-Testing Explained**
   - How income reduces TR
   - What counts vs what doesn't
   - Optimization strategies

5. **Early Withdrawal Trade-offs**
   - Taking occupational pension at 60 vs 67
   - Permanent reduction calculation
   - When early withdrawal makes sense

---

## Success Metrics

- All calculators show Iceland-appropriate defaults (30x)
- Users can see three-phase breakdown of their FI journey
- TR means-test impact is visible in LeanFIRE/BaristaFIRE
- Séreign strategy is highlighted across calculators
- Educational content explains Iceland-specific factors

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-29 | Initial plan created |
| 1.1 | 2026-01-29 | Phase 1 completed |
| 2.0 | 2026-01-29 | Phase 2 completed: All shared pension components created, integrated into Coast FIRE and Barista FIRE, FIRE type descriptions updated |
| 3.0 | 2026-01-29 | Phase 3 completed: Advanced features - Withdrawal Sequence Optimizer, Inflation Stress Tester, Tax Planning Calculator, Currency Risk Education. Integrated into FI Number Builder and Coast FIRE calculators. |
