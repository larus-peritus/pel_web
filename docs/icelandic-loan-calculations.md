# Icelandic Loan Calculations (Islandsbanki-style)

This document explains the loan calculation methods used in this application, which match Icelandic banking standards (specifically Islandsbanki's calculator).

## Key Concepts

### 1. Day Count Convention: Actual/360

Icelandic banks use the **actual/360** day count convention for calculating interest:

```
Monthly Interest = Principal × Annual Rate × (actual days in month / 360)
```

This means:
- January (31 days): `Principal × Rate × (31/360)`
- February (28/29 days): `Principal × Rate × (28/360)` or `(29/360)`
- April (30 days): `Principal × Rate × (30/360)`

**Implementation:**
```typescript
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function calculateMonthlyInterest(
  balance: number,
  annualRate: number,
  year: number,
  month: number
): number {
  const daysInMonth = getDaysInMonth(year, month);
  return balance * annualRate * (daysInMonth / 360);
}
```

### 2. Loan Types in Iceland

#### Óverðtryggð lán (Non-indexed loans)
- Fixed principal amount
- Nominal interest rate (e.g., 9%)
- Payment stays constant (annuity) or principal portion stays constant (linear)

#### Verðtryggð lán (Indexed loans)
- Principal is indexed to inflation (CPI)
- Real interest rate (e.g., 3.5-4.5%)
- **Both balance AND payment grow with inflation each month**

### 3. Verðtryggð Loan Calculation (Islandsbanki-style)

This is the key difference from simple calculations:

**Each month:**
1. Apply inflation to the balance: `balance = balance × (1 + monthlyInflation)`
2. Apply inflation to the payment: `payment = payment × (1 + monthlyInflation)`
3. Calculate interest using actual/360: `interest = balance × realRate × (days/360)`
4. Calculate principal: `principal = payment - interest`
5. Update balance: `balance = balance - principal`

**Monthly inflation rate (compound):**
```typescript
const monthlyInflation = Math.pow(1 + annualInflationRate, 1/12) - 1;
```

**Result:**
- Balance INCREASES initially (inflation adds more than principal reduces)
- Payment GROWS with inflation each month
- This matches Islandsbanki's calculator output

### 4. Payment Methods

Both loan types support two payment methods:

#### Jafngreiðslulán (Annuity)
- Equal total payment each month (in real terms for indexed loans)
- Payment = higher interest at start, more principal over time
- Formula: `P = L × [r(1+r)^n] / [(1+r)^n - 1]`

#### Jafnar afborganir (Linear)
- Equal principal payment each month
- Total payment decreases over time as interest decreases
- Principal payment = `Original Amount / Term`

### 5. Base Payment Calculation

For verðtryggð loans, the base payment is calculated using **only the real interest rate**:

```typescript
function calculateBasePayment(loan: SnowballLoanInput): number {
  // Use ONLY the real interest rate (not effective rate with inflation)
  const monthlyRate = loan.annualInterestRate / 12;
  const n = loan.loanTermMonths;
  const L = loan.originalLoanAmount;

  // Annuity formula
  const factor = Math.pow(1 + monthlyRate, n);
  return L * (monthlyRate * factor) / (factor - 1);
}
```

The payment then grows with inflation each month in the main calculation loop.

## Example: 30M kr Verðtryggð Loan

**Parameters:**
- Original amount: 30,000,000 kr
- Real interest rate: 4.55%
- Inflation rate: 3.7%
- Term: 480 months

**Month 1:**
- Opening balance: 30,000,000 kr
- After inflation: 30,090,833 kr (+90,833 kr)
- Payment: ~145,000 kr (base, grows each month)
- Interest: ~106,000 kr
- Principal: ~39,000 kr
- Closing balance: 30,051,833 kr (HIGHER than opening)

**Month 2:**
- Opening balance: 30,051,833 kr
- After inflation: 30,143,500 kr
- Payment: ~145,440 kr (grew by inflation)
- Interest: ~106,300 kr
- Principal: ~39,100 kr
- Closing balance: 30,104,400 kr

## Files Using This Calculation

1. **Snowball Calculator** (`/src/lib/calculations/snowball.ts`)
   - Full implementation with all three scenarios
   - Post-payoff investment tracking

2. **Debt Payoff Calculator** (`/src/lib/calculations/debtPayoff.ts`)
   - `calculateIndexedAmortization()` - verðtryggð loans
   - `calculateStandardAmortization()` - óverðtryggð loans
   - `generateAmortizationSchedule()` - detailed breakdown

3. **Housing Calculator** (`/src/lib/calculations/housing.ts`)
   - Should use the same calculation (needs update)

## References

- Islandsbanki húsnæðislánareiknavél: https://www.islandsbanki.is/is/reiknivel/husnaedislan/husnaedislanareiknivel
- Icelandic Central Bank (Seðlabanki) inflation data
