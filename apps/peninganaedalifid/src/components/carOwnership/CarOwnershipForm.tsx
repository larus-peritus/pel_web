'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Select, SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { CarPresetSelector } from './CarPresetSelector';
import { validateCarOwnershipInputs } from '@/lib/validation/car';
import { DEFAULT_CAR_INPUTS } from '@/lib/defaults/car';
import { FUEL_TYPE_LABELS } from '@/types/car-ownership';
import type {
  CarOwnershipScenario,
  CarOwnershipInputs,
  CarPreset,
} from '@/types/car-ownership';

/**
 * Props for CarOwnershipForm component
 */
export interface CarOwnershipFormProps {
  mode: 'add' | 'edit';
  scenario?: CarOwnershipScenario; // Required for edit mode
  onSave: (inputs: CarOwnershipInputs & { name: string }) => void;
  onCancel: () => void;
}

/**
 * CarOwnershipForm - Form for adding or editing car ownership scenarios
 *
 * Features:
 * - Dynamic form with conditional financing fields
 * - Preset selector for quick setup
 * - Real-time validation with Icelandic error messages
 * - Supports add and edit modes
 * - All labels and messages in Icelandic
 * - Organized into sections: Basic info, Financing, Driving, Annual costs, Monthly costs
 *
 * @example
 * ```tsx
 * // Add mode
 * <CarOwnershipForm
 *   mode="add"
 *   onSave={(inputs) => addCarOwnershipScenario(inputs)}
 *   onCancel={() => setShowForm(false)}
 * />
 *
 * // Edit mode
 * <CarOwnershipForm
 *   mode="edit"
 *   scenario={existingScenario}
 *   onSave={(inputs) => updateCarOwnershipScenario(scenario.id, inputs)}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export function CarOwnershipForm({
  mode,
  scenario,
  onSave,
  onCancel,
}: CarOwnershipFormProps) {
  // Initialize form state from scenario or defaults
  const initialInputs = scenario?.inputs || DEFAULT_CAR_INPUTS;

  // Basic info state
  const [name, setName] = useState(scenario?.name || '');
  const [purchasePrice, setPurchasePrice] = useState<number>(
    initialInputs.purchasePrice
  );
  const [currentMarketValue, setCurrentMarketValue] = useState<number | undefined>(
    initialInputs.currentMarketValue
  );
  const [estimatedLifetimeYears, setEstimatedLifetimeYears] = useState<number>(
    initialInputs.estimatedLifetimeYears
  );

  // Financing state
  const [hasFinancing, setHasFinancing] = useState<boolean>(
    initialInputs.hasFinancing
  );
  const [downPayment, setDownPayment] = useState<number>(
    initialInputs.financing?.downPayment || 0
  );
  const [loanAmount, setLoanAmount] = useState<number>(
    initialInputs.financing?.loanAmount || 0
  );
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(
    initialInputs.financing?.annualInterestRate || 7
  );
  const [loanTermYears, setLoanTermYears] = useState<number>(
    initialInputs.financing?.loanTermYears || 5
  );

  // Driving state
  const [monthlyKm, setMonthlyKm] = useState<number>(initialInputs.monthlyKm);
  const [fuelType, setFuelType] = useState<'gasoline' | 'diesel' | 'electric' | 'hybrid'>(
    initialInputs.fuelType
  );
  const [fuelConsumption, setFuelConsumption] = useState<number>(
    initialInputs.fuelConsumption
  );
  const [fuelPrice, setFuelPrice] = useState<number>(initialInputs.fuelPrice);

  // Annual costs state
  const [annualInsurance, setAnnualInsurance] = useState<number>(
    initialInputs.annualInsurance
  );
  const [annualRegistrationTax, setAnnualRegistrationTax] = useState<number>(
    initialInputs.annualRegistrationTax
  );
  const [biannualInspection, setBiannualInspection] = useState<number>(
    initialInputs.biannualInspection
  );
  const [annualMaintenance, setAnnualMaintenance] = useState<number>(
    initialInputs.annualMaintenance
  );
  const [tiresEveryNYears, setTiresEveryNYears] = useState<number>(
    initialInputs.tiresEveryNYears
  );
  const [tiresCost, setTiresCost] = useState<number>(initialInputs.tiresCost);

  // Monthly costs state
  const [monthlyParking, setMonthlyParking] = useState<number>(
    initialInputs.monthlyParking
  );
  const [monthlyTolls, setMonthlyTolls] = useState<number>(
    initialInputs.monthlyTolls
  );

  // Kilometer-based costs state
  const [kilometerTaxPerKm, setKilometerTaxPerKm] = useState<number>(
    initialInputs.kilometerTaxPerKm
  );

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  /**
   * Handle preset selection - populate form with preset values
   */
  const handlePresetSelect = useCallback((preset: CarPreset) => {
    const inputs = preset.inputs;
    setPurchasePrice(inputs.purchasePrice);
    setCurrentMarketValue(inputs.currentMarketValue);
    setEstimatedLifetimeYears(inputs.estimatedLifetimeYears);
    setHasFinancing(inputs.hasFinancing);
    setMonthlyKm(inputs.monthlyKm);
    setFuelType(inputs.fuelType);
    setFuelConsumption(inputs.fuelConsumption);
    setFuelPrice(inputs.fuelPrice);
    setAnnualInsurance(inputs.annualInsurance);
    setAnnualRegistrationTax(inputs.annualRegistrationTax);
    setBiannualInspection(inputs.biannualInspection);
    setAnnualMaintenance(inputs.annualMaintenance);
    setTiresEveryNYears(inputs.tiresEveryNYears);
    setTiresCost(inputs.tiresCost);
    setMonthlyParking(inputs.monthlyParking);
    setMonthlyTolls(inputs.monthlyTolls);
    setKilometerTaxPerKm(inputs.kilometerTaxPerKm);
  }, []);

  /**
   * Validate inputs and return validation result
   */
  const validateInputs = useCallback((): boolean => {
    const inputs: CarOwnershipInputs = {
      purchasePrice,
      currentMarketValue,
      estimatedLifetimeYears,
      hasFinancing,
      financing: hasFinancing
        ? {
            downPayment,
            loanAmount,
            annualInterestRate,
            loanTermYears,
          }
        : undefined,
      monthlyKm,
      fuelType,
      fuelConsumption,
      fuelPrice,
      annualInsurance,
      annualRegistrationTax,
      biannualInspection,
      annualMaintenance,
      tiresEveryNYears,
      tiresCost,
      monthlyParking,
      monthlyTolls,
      kilometerTaxPerKm,
    };

    const validation = validateCarOwnershipInputs(inputs);
    setErrors(validation.errors);
    setWarnings(validation.warnings || {});
    return validation.isValid;
  }, [
    purchasePrice,
    currentMarketValue,
    estimatedLifetimeYears,
    hasFinancing,
    downPayment,
    loanAmount,
    annualInterestRate,
    loanTermYears,
    monthlyKm,
    fuelType,
    fuelConsumption,
    fuelPrice,
    annualInsurance,
    annualRegistrationTax,
    biannualInspection,
    annualMaintenance,
    tiresEveryNYears,
    tiresCost,
    monthlyParking,
    monthlyTolls,
    kilometerTaxPerKm,
  ]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Heiti er nauðsynlegt' }));
      return;
    }

    const inputs: CarOwnershipInputs = {
      purchasePrice,
      currentMarketValue,
      estimatedLifetimeYears,
      hasFinancing,
      financing: hasFinancing
        ? {
            downPayment,
            loanAmount,
            annualInterestRate,
            loanTermYears,
          }
        : undefined,
      monthlyKm,
      fuelType,
      fuelConsumption,
      fuelPrice,
      annualInsurance,
      annualRegistrationTax,
      biannualInspection,
      annualMaintenance,
      tiresEveryNYears,
      tiresCost,
      monthlyParking,
      monthlyTolls,
      kilometerTaxPerKm,
    };

    onSave({ ...inputs, name: name.trim() });
  };

  // Fuel type options
  const fuelTypeOptions: SelectOption[] = Object.entries(FUEL_TYPE_LABELS).map(
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
            {mode === 'edit' ? 'Breyta bíl' : 'Bæta við bíl'}
          </h3>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Preset selector (only in add mode) */}
            {mode === 'add' && (
              <CarPresetSelector onSelect={handlePresetSelect} />
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Grunnupplýsingar</h4>

              <Input
                label="Heiti bíls"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="t.d. Toyota Corolla 2018"
                error={errors.name}
                required
              />

              <CurrencyInput
                label="Kaupverð"
                value={purchasePrice}
                onChange={setPurchasePrice}
                suffix="kr"
                error={errors.purchasePrice}
                required
              />

              <CurrencyInput
                label="Núverandi markaðsverð (valfrjálst)"
                value={currentMarketValue ?? 0}
                onChange={(val) => setCurrentMarketValue(val > 0 ? val : undefined)}
                suffix="kr"
                error={errors.currentMarketValue}
                helpText="Fyrir notaða bíla - ef þú veist núverandi markaðsverð"
              />

              <NumberInput
                label="Áætlaður líftími (ár)"
                value={estimatedLifetimeYears}
                onChange={setEstimatedLifetimeYears}
                min={1}
                max={30}
                error={errors.estimatedLifetimeYears}
                required
              />
            </div>

            {/* Financing */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Fjármögnun</h4>

              <Checkbox
                label="Ég er með lán á bílnum"
                checked={hasFinancing}
                onChange={setHasFinancing}
              />

              {hasFinancing && (
                <div className="pl-6 space-y-4 border-l-2 border-gray-200">
                  <CurrencyInput
                    label="Útborgun"
                    value={downPayment}
                    onChange={setDownPayment}
                    suffix="kr"
                    error={errors['financing.downPayment']}
                  />

                  <CurrencyInput
                    label="Lánsupphæð"
                    value={loanAmount}
                    onChange={setLoanAmount}
                    suffix="kr"
                    error={errors['financing.loanAmount']}
                    required
                  />

                  <NumberInput
                    label="Árlegir vextir (%)"
                    value={annualInterestRate}
                    onChange={setAnnualInterestRate}
                    min={0}
                    max={30}
                    step={0.1}
                    error={errors['financing.annualInterestRate']}
                    required
                  />

                  <NumberInput
                    label="Lánstími (ár)"
                    value={loanTermYears}
                    onChange={setLoanTermYears}
                    min={1}
                    max={15}
                    error={errors['financing.loanTermYears']}
                    required
                  />

                  {warnings['financing.total'] && (
                    <p className="text-sm text-yellow-600">{warnings['financing.total']}</p>
                  )}
                </div>
              )}
            </div>

            {/* Driving */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Akstur</h4>

              <NumberInput
                label="Mánaðarlegur akstur (km)"
                value={monthlyKm}
                onChange={setMonthlyKm}
                min={0}
                max={10000}
                error={errors.monthlyKm}
                required
              />

              <Select
                label="Eldsneytistegund"
                value={fuelType}
                onChange={(value) => setFuelType(value as typeof fuelType)}
                options={fuelTypeOptions}
                error={errors.fuelType}
                required
              />

              <NumberInput
                label={fuelType === 'electric' ? 'Eyðsla (kWh/100km)' : 'Eyðsla (L/100km)'}
                value={fuelConsumption}
                onChange={setFuelConsumption}
                min={0}
                max={50}
                step={0.1}
                error={errors.fuelConsumption}
                required
              />

              <NumberInput
                label={fuelType === 'electric' ? 'Rafmagnsverð (kr/kWh)' : 'Eldsneytisverð (kr/L)'}
                value={fuelPrice}
                onChange={setFuelPrice}
                min={0}
                max={1000}
                step={0.1}
                error={errors.fuelPrice}
                required
              />
            </div>

            {/* Annual Costs */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Árlegur kostnaður</h4>

              <CurrencyInput
                label="Tryggingar"
                value={annualInsurance}
                onChange={setAnnualInsurance}
                suffix="kr/ár"
                error={errors.annualInsurance}
                required
              />

              <CurrencyInput
                label="Bifreiðagjald"
                value={annualRegistrationTax}
                onChange={setAnnualRegistrationTax}
                suffix="kr/ár"
                error={errors.annualRegistrationTax}
                required
                helpText="Árgjald til ríkisins"
              />

              <CurrencyInput
                label="Skoðun á 2 ár"
                value={biannualInspection}
                onChange={setBiannualInspection}
                suffix="kr"
                error={errors.biannualInspection}
              />

              <CurrencyInput
                label="Viðhald"
                value={annualMaintenance}
                onChange={setAnnualMaintenance}
                suffix="kr/ár"
                error={errors.annualMaintenance}
                required
              />

              <NumberInput
                label="Ný dekk á hvert N ár"
                value={tiresEveryNYears}
                onChange={setTiresEveryNYears}
                min={1}
                max={10}
                error={errors.tiresEveryNYears}
              />

              <CurrencyInput
                label="Kostnaður dekk"
                value={tiresCost}
                onChange={setTiresCost}
                suffix="kr"
                error={errors.tiresCost}
              />
            </div>

            {/* Monthly Costs */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Mánaðarlegur kostnaður</h4>

              <CurrencyInput
                label="Bílastæðagjöld"
                value={monthlyParking}
                onChange={setMonthlyParking}
                suffix="kr/mán"
                error={errors.monthlyParking}
              />

              <CurrencyInput
                label="Veggjöld"
                value={monthlyTolls}
                onChange={setMonthlyTolls}
                suffix="kr/mán"
                error={errors.monthlyTolls}
              />
            </div>

            {/* Kilometer-based Costs */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Kílómetragjald</h4>

              <NumberInput
                label="Kílómetragjald (kr/km)"
                value={kilometerTaxPerKm}
                onChange={setKilometerTaxPerKm}
                min={0}
                max={100}
                step={0.1}
                error={errors.kilometerTaxPerKm}
                helpText="Nýtt íslenskt vegskattsgjald - greitt fyrir hvern ekinn kílómetra"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex gap-3 justify-end w-full">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Hætta við
            </Button>
            <Button type="submit" variant="primary">
              {mode === 'edit' ? 'Vista breytingar' : 'Bæta við bíl'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
