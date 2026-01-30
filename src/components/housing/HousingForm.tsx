'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Select, SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { validateHousingInputs } from '@/lib/utils/housingValidation';
import {
  HOUSING_TYPE_LABELS,
  LOAN_TYPE_LABELS,
  type HousingScenario,
  type HousingInputs,
  type HousingType,
  type LoanType,
} from '@/types/calculator';

/**
 * Props for HousingForm component
 */
export interface HousingFormProps {
  mode: 'add' | 'edit';
  scenario?: HousingScenario; // Required for edit mode
  onSave: (inputs: HousingInputs & { name: string }) => void;
  onCancel: () => void;
}

/**
 * Default values for new rental scenarios
 */
const DEFAULT_RENTAL = {
  monthlyRent: 0,
  heatIncluded: false,
  electricityIncluded: false,
  monthlyHeatCost: 20000,
  monthlyElectricityCost: 10000,
};

/**
 * Default values for new loan scenarios
 */
const DEFAULT_LOAN = {
  loanType: 'indexed' as LoanType,
  totalLoanAmount: 40000000,
  annualInterestRate: 5.5,
  loanTermYears: 40,
  annualInflationRate: 3.5,
  annualPropertyTax: 200000,
  annualHomeInsurance: 50000,
  annualMaintenanceCost: 150000,
  monthlyHOAFees: 0,
  monthlyHeatCost: 20000,
  monthlyElectricityCost: 10000,
};

/**
 * Default values for owned paid off scenarios
 */
const DEFAULT_OWNED_PAID_OFF = {
  estimatedPropertyValue: undefined,
  annualPropertyTax: 200000,
  annualHomeInsurance: 50000,
  annualMaintenanceCost: 150000,
  monthlyHOAFees: 0,
  monthlyHeatCost: 20000,
  monthlyElectricityCost: 10000,
};

/**
 * HousingForm - Form for adding or editing housing scenarios
 *
 * Features:
 * - Dynamic form with conditional fields based on housingType
 * - Conditional loan fields based on loanType (indexed/non-indexed)
 * - Real-time validation with Icelandic error messages
 * - Supports add and edit modes
 * - All labels and messages in Icelandic
 *
 * @example
 * ```tsx
 * // Add mode
 * <HousingForm
 *   mode="add"
 *   onSave={(inputs) => addHousingScenario(inputs)}
 *   onCancel={() => setShowForm(false)}
 * />
 *
 * // Edit mode
 * <HousingForm
 *   mode="edit"
 *   scenario={existingScenario}
 *   onSave={(inputs) => updateHousingScenario(scenario.id, inputs)}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export function HousingForm({ mode, scenario, onSave, onCancel }: HousingFormProps) {
  // Initialize form state from scenario (edit mode) or defaults (add mode)
  const [name, setName] = useState(scenario?.name ?? '');
  const [housingType, setHousingType] = useState<HousingType>(
    scenario?.inputs.housingType ?? 'rental'
  );

  // Rental state
  const [monthlyRent, setMonthlyRent] = useState(
    scenario?.inputs.rental?.monthlyRent ?? DEFAULT_RENTAL.monthlyRent
  );
  const [heatIncluded, setHeatIncluded] = useState(
    scenario?.inputs.rental?.heatIncluded ?? DEFAULT_RENTAL.heatIncluded
  );
  const [electricityIncluded, setElectricityIncluded] = useState(
    scenario?.inputs.rental?.electricityIncluded ?? DEFAULT_RENTAL.electricityIncluded
  );
  const [rentalHeatCost, setRentalHeatCost] = useState(
    scenario?.inputs.rental?.monthlyHeatCost ?? DEFAULT_RENTAL.monthlyHeatCost
  );
  const [rentalElectricityCost, setRentalElectricityCost] = useState(
    scenario?.inputs.rental?.monthlyElectricityCost ?? DEFAULT_RENTAL.monthlyElectricityCost
  );

  // Loan state
  const [loanType, setLoanType] = useState<LoanType>(
    scenario?.inputs.loan?.loanType ?? DEFAULT_LOAN.loanType
  );
  const [totalLoanAmount, setTotalLoanAmount] = useState(
    scenario?.inputs.loan?.totalLoanAmount ?? DEFAULT_LOAN.totalLoanAmount
  );
  const [annualInterestRate, setAnnualInterestRate] = useState(
    scenario?.inputs.loan?.annualInterestRate ?? DEFAULT_LOAN.annualInterestRate
  );
  const [loanTermYears, setLoanTermYears] = useState(
    scenario?.inputs.loan?.loanTermYears ?? DEFAULT_LOAN.loanTermYears
  );
  const [annualInflationRate, setAnnualInflationRate] = useState(
    scenario?.inputs.loan?.annualInflationRate ?? DEFAULT_LOAN.annualInflationRate
  );
  const [loanPropertyTax, setLoanPropertyTax] = useState(
    scenario?.inputs.loan?.annualPropertyTax ?? DEFAULT_LOAN.annualPropertyTax
  );
  const [loanHomeInsurance, setLoanHomeInsurance] = useState(
    scenario?.inputs.loan?.annualHomeInsurance ?? DEFAULT_LOAN.annualHomeInsurance
  );
  const [loanMaintenanceCost, setLoanMaintenanceCost] = useState(
    scenario?.inputs.loan?.annualMaintenanceCost ?? DEFAULT_LOAN.annualMaintenanceCost
  );
  const [loanHOAFees, setLoanHOAFees] = useState(
    scenario?.inputs.loan?.monthlyHOAFees ?? DEFAULT_LOAN.monthlyHOAFees
  );
  const [loanHeatCost, setLoanHeatCost] = useState(
    scenario?.inputs.loan?.monthlyHeatCost ?? DEFAULT_LOAN.monthlyHeatCost
  );
  const [loanElectricityCost, setLoanElectricityCost] = useState(
    scenario?.inputs.loan?.monthlyElectricityCost ?? DEFAULT_LOAN.monthlyElectricityCost
  );

  // Owned paid off state
  const [estimatedPropertyValue, setEstimatedPropertyValue] = useState(
    scenario?.inputs.ownedPaidOff?.estimatedPropertyValue ?? undefined
  );
  const [paidOffPropertyTax, setPaidOffPropertyTax] = useState(
    scenario?.inputs.ownedPaidOff?.annualPropertyTax ?? DEFAULT_OWNED_PAID_OFF.annualPropertyTax
  );
  const [paidOffHomeInsurance, setPaidOffHomeInsurance] = useState(
    scenario?.inputs.ownedPaidOff?.annualHomeInsurance ?? DEFAULT_OWNED_PAID_OFF.annualHomeInsurance
  );
  const [paidOffMaintenanceCost, setPaidOffMaintenanceCost] = useState(
    scenario?.inputs.ownedPaidOff?.annualMaintenanceCost ?? DEFAULT_OWNED_PAID_OFF.annualMaintenanceCost
  );
  const [paidOffHOAFees, setPaidOffHOAFees] = useState(
    scenario?.inputs.ownedPaidOff?.monthlyHOAFees ?? DEFAULT_OWNED_PAID_OFF.monthlyHOAFees
  );
  const [paidOffHeatCost, setPaidOffHeatCost] = useState(
    scenario?.inputs.ownedPaidOff?.monthlyHeatCost ?? DEFAULT_OWNED_PAID_OFF.monthlyHeatCost
  );
  const [paidOffElectricityCost, setPaidOffElectricityCost] = useState(
    scenario?.inputs.ownedPaidOff?.monthlyElectricityCost ?? DEFAULT_OWNED_PAID_OFF.monthlyElectricityCost
  );

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Handle housing type change
   */
  const handleHousingTypeChange = useCallback((value: string) => {
    setHousingType(value as HousingType);
    setErrors({}); // Clear errors when changing type
  }, []);

  /**
   * Handle loan type change
   */
  const handleLoanTypeChange = useCallback((value: string) => {
    setLoanType(value as LoanType);
    setErrors({}); // Clear errors when changing type
  }, []);

  /**
   * Build HousingInputs object from form state
   */
  const buildInputs = useCallback((): HousingInputs => {
    if (housingType === 'rental') {
      return {
        housingType: 'rental',
        rental: {
          monthlyRent,
          heatIncluded,
          electricityIncluded,
          monthlyHeatCost: heatIncluded ? 0 : rentalHeatCost,
          monthlyElectricityCost: electricityIncluded ? 0 : rentalElectricityCost,
        },
      };
    } else if (housingType === 'owned_with_loan') {
      return {
        housingType: 'owned_with_loan',
        loan: {
          loanType,
          totalLoanAmount,
          annualInterestRate,
          loanTermYears,
          annualInflationRate: loanType === 'indexed' ? annualInflationRate : undefined,
          annualPropertyTax: loanPropertyTax,
          annualHomeInsurance: loanHomeInsurance,
          annualMaintenanceCost: loanMaintenanceCost,
          monthlyHOAFees: loanHOAFees,
          monthlyHeatCost: loanHeatCost,
          monthlyElectricityCost: loanElectricityCost,
        },
      };
    } else {
      // owned_paid_off
      return {
        housingType: 'owned_paid_off',
        ownedPaidOff: {
          estimatedPropertyValue,
          annualPropertyTax: paidOffPropertyTax,
          annualHomeInsurance: paidOffHomeInsurance,
          annualMaintenanceCost: paidOffMaintenanceCost,
          monthlyHOAFees: paidOffHOAFees,
          monthlyHeatCost: paidOffHeatCost,
          monthlyElectricityCost: paidOffElectricityCost,
        },
      };
    }
  }, [
    housingType,
    monthlyRent,
    heatIncluded,
    electricityIncluded,
    rentalHeatCost,
    rentalElectricityCost,
    loanType,
    totalLoanAmount,
    annualInterestRate,
    loanTermYears,
    annualInflationRate,
    loanPropertyTax,
    loanHomeInsurance,
    loanMaintenanceCost,
    loanHOAFees,
    loanHeatCost,
    loanElectricityCost,
    estimatedPropertyValue,
    paidOffPropertyTax,
    paidOffHomeInsurance,
    paidOffMaintenanceCost,
    paidOffHOAFees,
    paidOffHeatCost,
    paidOffElectricityCost,
  ]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validate inputs
      const inputs = buildInputs();
      const validation = validateHousingInputs(inputs);

      // Validate name separately
      if (!name || name.trim().length === 0) {
        validation.errors.name = 'Heiti má ekki vera tómt';
        validation.isValid = false;
      }

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Clear errors and call onSave
      setErrors({});
      onSave({ ...inputs, name: name.trim() });
    },
    [buildInputs, name, onSave]
  );

  // Housing type options
  const housingTypeOptions: SelectOption[] = Object.entries(HOUSING_TYPE_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  // Loan type options
  const loanTypeOptions: SelectOption[] = Object.entries(LOAN_TYPE_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {mode === 'add' ? 'Bæta við húsnæðisatburðarás' : 'Breyta atburðarás'}
          </h3>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Name */}
          <div>
            <Input
              label="Heiti atburðarásar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.d. Núverandi íbúð, Kaup á húsi, etc."
              error={errors.name}
              required
            />
          </div>

          {/* Housing Type */}
          <div>
            <Select
              label="Tegund húsnæðis"
              value={housingType}
              onChange={handleHousingTypeChange}
              options={housingTypeOptions}
              error={errors.housingType}
            />
          </div>

          {/* Rental Fields */}
          {housingType === 'rental' && (
            <div className="space-y-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
              <h4 className="font-medium text-neutral-900">Leiguupplýsingar</h4>

              <CurrencyInput
                label="Mánaðarleg leiga"
                value={monthlyRent}
                onChange={setMonthlyRent}
                suffix="kr/mán"
                error={errors.monthlyRent}
                required
              />

              <div className="space-y-3">
                <Checkbox
                  label="Hiti innifalinn í leigu"
                  checked={heatIncluded}
                  onChange={setHeatIncluded}
                />

                {!heatIncluded && (
                  <CurrencyInput
                    label="Mánaðarlegur hitakostnaður"
                    value={rentalHeatCost}
                    onChange={setRentalHeatCost}
                    suffix="kr/mán"
                    error={errors.monthlyHeatCost}
                    required
                  />
                )}
              </div>

              <div className="space-y-3">
                <Checkbox
                  label="Rafmagn innifalið í leigu"
                  checked={electricityIncluded}
                  onChange={setElectricityIncluded}
                />

                {!electricityIncluded && (
                  <CurrencyInput
                    label="Mánaðarlegur rafmagnskostnaður"
                    value={rentalElectricityCost}
                    onChange={setRentalElectricityCost}
                    suffix="kr/mán"
                    error={errors.monthlyElectricityCost}
                    required
                  />
                )}
              </div>
            </div>
          )}

          {/* Owned with Loan Fields */}
          {housingType === 'owned_with_loan' && (
            <div className="space-y-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
              <h4 className="font-medium text-neutral-900">Lánsupplýsingar</h4>

              <Select
                label="Tegund láns"
                value={loanType}
                onChange={handleLoanTypeChange}
                options={loanTypeOptions}
                error={errors.loanType}
              />

              <CurrencyInput
                label="Lánsupphæð"
                value={totalLoanAmount}
                onChange={setTotalLoanAmount}
                suffix="kr"
                error={errors.totalLoanAmount}
                required
              />

              <NumberInput
                label="Ársvextir"
                value={annualInterestRate}
                onChange={setAnnualInterestRate}
                min={0}
                max={20}
                step={0.1}
                suffix="%"
                error={errors.annualInterestRate}
                required
              />

              <NumberInput
                label="Lánstími"
                value={loanTermYears}
                onChange={setLoanTermYears}
                min={1}
                max={40}
                step={1}
                suffix="ár"
                error={errors.loanTermYears}
                required
              />

              {loanType === 'indexed' && (
                <NumberInput
                  label="Verðbólga (áætluð)"
                  value={annualInflationRate}
                  onChange={setAnnualInflationRate}
                  min={0}
                  max={20}
                  step={0.1}
                  suffix="%"
                  error={errors.annualInflationRate}
                  required
                  helpText="Áætluð verðbólga fyrir verðtryggð lán"
                />
              )}

              <h4 className="font-medium text-neutral-900 pt-4">Eignarhalds- og rekstrarkostnaður</h4>

              <CurrencyInput
                label="Fasteignagjöld (árlega)"
                value={loanPropertyTax}
                onChange={setLoanPropertyTax}
                suffix="kr/ár"
                error={errors.annualPropertyTax}
                required
              />

              <CurrencyInput
                label="Húseigendatrygging (árlega)"
                value={loanHomeInsurance}
                onChange={setLoanHomeInsurance}
                suffix="kr/ár"
                error={errors.annualHomeInsurance}
                required
              />

              <CurrencyInput
                label="Viðhaldskostnaður (árlega)"
                value={loanMaintenanceCost}
                onChange={setLoanMaintenanceCost}
                suffix="kr/ár"
                error={errors.annualMaintenanceCost}
                required
                helpText="Áætlaður viðhaldskostnaður á ári (t.d. 1-2% af verðmæti)"
              />

              <CurrencyInput
                label="Félagsgjöld (mánaðarlega)"
                value={loanHOAFees}
                onChange={setLoanHOAFees}
                suffix="kr/mán"
                error={errors.monthlyHOAFees}
                required
                helpText="Sláðu inn 0 ef engin félagsgjöld"
              />

              <CurrencyInput
                label="Hitakostnaður (mánaðarlega)"
                value={loanHeatCost}
                onChange={setLoanHeatCost}
                suffix="kr/mán"
                error={errors.monthlyHeatCost}
                required
              />

              <CurrencyInput
                label="Rafmagnskostnaður (mánaðarlega)"
                value={loanElectricityCost}
                onChange={setLoanElectricityCost}
                suffix="kr/mán"
                error={errors.monthlyElectricityCost}
                required
              />
            </div>
          )}

          {/* Owned Paid Off Fields */}
          {housingType === 'owned_paid_off' && (
            <div className="space-y-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
              <h4 className="font-medium text-neutral-900">Eignarhaldsupplýsingar</h4>

              <CurrencyInput
                label="Áætlað verðmæti eignar (valfrjálst)"
                value={estimatedPropertyValue ?? 0}
                onChange={setEstimatedPropertyValue}
                suffix="kr"
                error={errors.estimatedPropertyValue}
                helpText="Notað til að reikna fórnarkostnað (7% ávöxtun)"
              />

              <CurrencyInput
                label="Fasteignagjöld (árlega)"
                value={paidOffPropertyTax}
                onChange={setPaidOffPropertyTax}
                suffix="kr/ár"
                error={errors.annualPropertyTax}
                required
              />

              <CurrencyInput
                label="Húseigendatrygging (árlega)"
                value={paidOffHomeInsurance}
                onChange={setPaidOffHomeInsurance}
                suffix="kr/ár"
                error={errors.annualHomeInsurance}
                required
              />

              <CurrencyInput
                label="Viðhaldskostnaður (árlega)"
                value={paidOffMaintenanceCost}
                onChange={setPaidOffMaintenanceCost}
                suffix="kr/ár"
                error={errors.annualMaintenanceCost}
                required
                helpText="Áætlaður viðhaldskostnaður á ári (t.d. 1-2% af verðmæti)"
              />

              <CurrencyInput
                label="Félagsgjöld (mánaðarlega)"
                value={paidOffHOAFees}
                onChange={setPaidOffHOAFees}
                suffix="kr/mán"
                error={errors.monthlyHOAFees}
                required
                helpText="Sláðu inn 0 ef engin félagsgjöld"
              />

              <CurrencyInput
                label="Hitakostnaður (mánaðarlega)"
                value={paidOffHeatCost}
                onChange={setPaidOffHeatCost}
                suffix="kr/mán"
                error={errors.monthlyHeatCost}
                required
              />

              <CurrencyInput
                label="Rafmagnskostnaður (mánaðarlega)"
                value={paidOffElectricityCost}
                onChange={setPaidOffElectricityCost}
                suffix="kr/mán"
                error={errors.monthlyElectricityCost}
                required
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hætta við
          </Button>
          <Button type="submit" variant="primary">
            {mode === 'add' ? 'Vista' : 'Uppfæra'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
