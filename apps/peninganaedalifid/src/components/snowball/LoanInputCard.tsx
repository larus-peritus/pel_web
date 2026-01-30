'use client';

/**
 * Loan Input Card Component for Snowball Calculator
 * Provides form fields for all loan parameters with conditional fields based on loan type
 */

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import type { SnowballLoanInput, LoanType, PaymentMethod } from '@/types/snowball';
import { TYPICAL_INFLATION_RATE } from '@/lib/constants/snowball';

interface LoanInputCardProps {
  loan: SnowballLoanInput;
  onChange: (loan: SnowballLoanInput) => void;
  errors?: Partial<Record<keyof SnowballLoanInput, string>>;
}

export function LoanInputCard({ loan, onChange, errors = {} }: LoanInputCardProps) {
  // Helper to update a single field
  const updateField = <K extends keyof SnowballLoanInput>(
    field: K,
    value: SnowballLoanInput[K]
  ) => {
    onChange({ ...loan, [field]: value });
  };

  // Handle loan type change with automatic field resets
  const handleLoanTypeChange = (newLoanType: LoanType) => {
    const updates: Partial<SnowballLoanInput> = {
      loanType: newLoanType,
    };

    // Set defaults based on loan type
    if (newLoanType === 'verdtryggd') {
      // Indexed loans: set inflation rate AND payment method (both are valid in Iceland)
      updates.inflationRate = loan.inflationRate ?? TYPICAL_INFLATION_RATE;
      updates.paymentMethod = loan.paymentMethod ?? 'annuity';
    } else {
      // Non-indexed loans: set payment method, clear inflation rate
      updates.paymentMethod = loan.paymentMethod ?? 'annuity';
      updates.inflationRate = undefined;
    }

    onChange({ ...loan, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Upplýsingar um lán</h2>
        <p className="text-sm text-gray-600 mt-1">
          Færðu inn grunnupplýsingar um lánið þitt
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loan Type Selector */}
          <div className="md:col-span-2">
            <Select
              label="Tegund láns"
              value={loan.loanType}
              onChange={(val) => handleLoanTypeChange(val as LoanType)}
              options={[
                {
                  value: 'verdtryggd',
                  label: 'Verðtryggt lán',
                  description: 'Höfuðstóll hækkar með verðbólgu',
                },
                {
                  value: 'oVerdtryggd',
                  label: 'Óverðtryggt lán',
                  description: 'Fastur höfuðstóll',
                },
              ]}
              error={errors.loanType}
              required
            />
          </div>

          {/* Original Loan Amount */}
          <CurrencyInput
            label="Upphafleg lánsfjárhæð"
            value={loan.originalLoanAmount}
            onChange={(val) => updateField('originalLoanAmount', val)}
            helpText="Heildarupphæð lánsins við upphaf"
            error={errors.originalLoanAmount}
            required
          />

          {/* Current Balance */}
          <CurrencyInput
            label="Núverandi staða"
            value={loan.currentBalance}
            onChange={(val) => updateField('currentBalance', val)}
            helpText="Það sem eftir er að borga"
            error={errors.currentBalance}
            required
          />

          {/* Annual Interest Rate */}
          <NumberInput
            label="Árlega vextir (%)"
            value={Math.round(loan.annualInterestRate * 10000) / 100}
            onChange={(val) => updateField('annualInterestRate', val / 100)}
            min={0}
            max={100}
            step={0.1}
            helpText={
              loan.loanType === 'verdtryggd'
                ? 'Raunvextir fyrir verðtryggð lán'
                : 'Nafnvextir fyrir óverðtryggð lán'
            }
            error={errors.annualInterestRate}
            required
          />

          {/* Conditional: Inflation Rate for Indexed Loans */}
          {loan.loanType === 'verdtryggd' && (
            <NumberInput
              label="Áætluð verðbólga (árleg %)"
              value={Math.round((loan.inflationRate ?? TYPICAL_INFLATION_RATE) * 10000) / 100}
              onChange={(val) => updateField('inflationRate', val / 100)}
              min={0}
              max={20}
              step={0.1}
              helpText="Verðbólga hækkar höfuðstól verðtryggðra lána"
              error={errors.inflationRate}
              required
            />
          )}

          {/* Payment Method - available for both loan types in Iceland */}
          <Select
            label="Greiðslumáti"
            value={loan.paymentMethod ?? 'annuity'}
            onChange={(val) => updateField('paymentMethod', val as PaymentMethod)}
            options={[
              {
                value: 'annuity',
                label: 'Jafngreiðslulán',
                description: 'Sama heildargreiðsla í hverjum mánuði (annuity)',
              },
              {
                value: 'linear',
                label: 'Jafnar afborganir',
                description: 'Sama höfuðstólsgreiðsla, lækkandi heildargreiðsla',
              },
            ]}
            error={errors.paymentMethod}
            required
          />

          {/* Loan Term in Months */}
          <NumberInput
            label="Lánstími (mánuðir)"
            value={loan.loanTermMonths}
            onChange={(val) => updateField('loanTermMonths', val)}
            min={1}
            max={600}
            step={1}
            helpText="Heildarfjöldi mánaða frá upphafi lánsins"
            error={errors.loanTermMonths}
            required
          />

          {/* Remaining Payments */}
          <NumberInput
            label="Eftirstandandi greiðslur"
            value={loan.remainingPayments}
            onChange={(val) => updateField('remainingPayments', val)}
            min={1}
            max={600}
            step={1}
            helpText="Fjöldi greiðslna sem eftir eru"
            error={errors.remainingPayments}
            required
          />
        </div>

        {/* Informational Alert */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <strong>Ábending:</strong>{' '}
              {loan.loanType === 'verdtryggd'
                ? 'Verðtryggð lán hækka með verðbólgu, en raunvextir eru venjulega lægri en á óverðtryggðum lánum.'
                : 'Óverðtryggð lán hafa fastan höfuðstól en oft hærri nafnvexti en verðtryggð lán.'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
