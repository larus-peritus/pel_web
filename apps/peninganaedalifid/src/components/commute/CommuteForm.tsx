'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select, SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { CommutePresetSelector } from './CommutePresetSelector';
import { validateCommuteInputs } from '@/lib/validation/commute';
import { COMMUTE_METHOD_LABELS } from '@/types/calculator';
import type {
  CommuteScenario,
  CommuteInputs,
  CommuteMethod,
  CommutePreset,
} from '@/types/calculator';

/**
 * Props for CommuteForm component
 */
export interface CommuteFormProps {
  mode: 'add' | 'edit';
  scenario?: CommuteScenario; // Required for edit mode
  onSave: (inputs: CommuteInputs & { name: string }) => void;
  onCancel: () => void;
}

/**
 * Default car costs for new scenarios
 */
const DEFAULT_CAR_COSTS = {
  fuelType: 'gasoline' as const,
  parkingCostPerDay: 0,
  monthlyDepreciation: 35000,
  monthlyInsurance: 15000,
  monthlyMaintenance: 10000,
  inspectionCost: 12000,
};

/**
 * Fuel type specific defaults for Iceland
 * - Gasoline: 200 kr/L, 8 L/100km
 * - Diesel: 220 kr/L, 7 L/100km
 * - Electric: 12 kr/kWh (home charging), 23 kWh/100km
 */
const FUEL_TYPE_DEFAULTS = {
  gasoline: { fuelPrice: 200, fuelConsumption: 8 },
  diesel: { fuelPrice: 220, fuelConsumption: 7 },
  electric: { fuelPrice: 12, fuelConsumption: 23 },
};

/**
 * Electric charging type presets (kr/kWh) - Iceland 2026
 */
export type ElectricChargingType = 'home' | 'destination' | 'fast' | 'custom';

const ELECTRIC_CHARGING_PRESETS: Record<Exclude<ElectricChargingType, 'custom'>, number> = {
  home: 12,        // Heimahleðsla
  destination: 33, // Hverfahleðsla
  fast: 69,        // Hraðhleðsla
};

/**
 * Default transit costs
 */
const DEFAULT_TRANSIT_COSTS = {
  ticketType: 'monthly' as const,
  monthlyCost: 10500,
};

/**
 * Default active costs
 */
const DEFAULT_ACTIVE_COSTS = {
  monthlyMaintenanceCost: 2000,
};

/**
 * CommuteForm - Form for adding or editing commute scenarios
 *
 * Features:
 * - Dynamic form with conditional fields based on commuteMethod
 * - Preset selector for quick setup
 * - Real-time validation with Icelandic error messages
 * - Supports add and edit modes
 * - All labels and messages in Icelandic
 *
 * @example
 * ```tsx
 * // Add mode
 * <CommuteForm
 *   mode="add"
 *   onSave={(inputs) => addCommuteScenario(inputs)}
 *   onCancel={() => setShowForm(false)}
 * />
 *
 * // Edit mode
 * <CommuteForm
 *   mode="edit"
 *   scenario={existingScenario}
 *   onSave={(inputs) => updateCommuteScenario(scenario.id, inputs)}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export function CommuteForm({ mode, scenario, onSave, onCancel }: CommuteFormProps) {
  // Form state - Basic fields (with defaults for add mode)
  const [name, setName] = useState(scenario?.name || '');
  const [distanceKm, setDistanceKm] = useState<number>(
    scenario?.inputs.distanceKm ?? 10
  );
  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    scenario?.inputs.daysPerWeek ?? 5
  );
  const [commuteMethod, setCommuteMethod] = useState<CommuteMethod>(
    scenario?.inputs.commuteMethod || 'car'
  );
  const [timeMinutesOneWay, setTimeMinutesOneWay] = useState<number>(
    scenario?.inputs.timeMinutesOneWay ?? 20
  );

  // Car-specific state
  const initialFuelType = scenario?.inputs.car?.fuelType || DEFAULT_CAR_COSTS.fuelType;
  const [fuelType, setFuelType] = useState<'gasoline' | 'diesel' | 'electric'>(
    initialFuelType
  );

  // Determine initial charging type based on existing fuel price
  const getInitialChargingType = (): ElectricChargingType => {
    if (initialFuelType !== 'electric') return 'home';
    const existingPrice = scenario?.inputs.car?.fuelPrice;
    if (existingPrice === ELECTRIC_CHARGING_PRESETS.home) return 'home';
    if (existingPrice === ELECTRIC_CHARGING_PRESETS.destination) return 'destination';
    if (existingPrice === ELECTRIC_CHARGING_PRESETS.fast) return 'fast';
    return existingPrice !== undefined ? 'custom' : 'home';
  };

  const [electricChargingType, setElectricChargingType] = useState<ElectricChargingType>(
    getInitialChargingType()
  );
  const [fuelPrice, setFuelPrice] = useState<number>(
    scenario?.inputs.car?.fuelPrice ?? FUEL_TYPE_DEFAULTS[initialFuelType].fuelPrice
  );
  const [fuelConsumption, setFuelConsumption] = useState<number>(
    scenario?.inputs.car?.fuelConsumption ?? FUEL_TYPE_DEFAULTS[initialFuelType].fuelConsumption
  );
  const [parkingCostPerDay, setParkingCostPerDay] = useState<number>(
    scenario?.inputs.car?.parkingCostPerDay ?? DEFAULT_CAR_COSTS.parkingCostPerDay
  );
  const [monthlyDepreciation, setMonthlyDepreciation] = useState<number>(
    scenario?.inputs.car?.monthlyDepreciation ?? DEFAULT_CAR_COSTS.monthlyDepreciation
  );
  const [monthlyInsurance, setMonthlyInsurance] = useState<number>(
    scenario?.inputs.car?.monthlyInsurance ?? DEFAULT_CAR_COSTS.monthlyInsurance
  );
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(
    scenario?.inputs.car?.monthlyMaintenance ?? DEFAULT_CAR_COSTS.monthlyMaintenance
  );
  const [inspectionCost, setInspectionCost] = useState<number>(
    scenario?.inputs.car?.inspectionCost ?? DEFAULT_CAR_COSTS.inspectionCost
  );

  // Handle fuel type change - update defaults for price and consumption
  const handleFuelTypeChange = useCallback((newFuelType: 'gasoline' | 'diesel' | 'electric') => {
    setFuelType(newFuelType);
    // Update fuel price and consumption to defaults for new fuel type
    setFuelPrice(FUEL_TYPE_DEFAULTS[newFuelType].fuelPrice);
    setFuelConsumption(FUEL_TYPE_DEFAULTS[newFuelType].fuelConsumption);
    // Reset electric charging type to home when switching to electric
    if (newFuelType === 'electric') {
      setElectricChargingType('home');
    }
  }, []);

  // Handle electric charging type change - update fuel price based on preset
  const handleElectricChargingTypeChange = useCallback((newChargingType: ElectricChargingType) => {
    setElectricChargingType(newChargingType);
    // Update fuel price if a preset is selected (not custom)
    if (newChargingType !== 'custom') {
      setFuelPrice(ELECTRIC_CHARGING_PRESETS[newChargingType]);
    }
  }, []);

  // Handle manual fuel price change - set charging type to custom if different from presets
  const handleElectricPriceChange = useCallback((newPrice: number) => {
    setFuelPrice(newPrice);
    // Check if the new price matches any preset
    if (newPrice === ELECTRIC_CHARGING_PRESETS.home) {
      setElectricChargingType('home');
    } else if (newPrice === ELECTRIC_CHARGING_PRESETS.destination) {
      setElectricChargingType('destination');
    } else if (newPrice === ELECTRIC_CHARGING_PRESETS.fast) {
      setElectricChargingType('fast');
    } else {
      setElectricChargingType('custom');
    }
  }, []);

  // Transit-specific state
  const [ticketType, setTicketType] = useState<'monthly' | 'per_ride'>(
    scenario?.inputs.transit?.ticketType || DEFAULT_TRANSIT_COSTS.ticketType
  );
  const [monthlyCost, setMonthlyCost] = useState<number>(
    scenario?.inputs.transit?.monthlyCost ?? DEFAULT_TRANSIT_COSTS.monthlyCost
  );
  const [costPerRide, setCostPerRide] = useState<number>(
    scenario?.inputs.transit?.costPerRide ?? 550
  );

  // Active-specific state
  const [monthlyMaintenanceCost, setMonthlyMaintenanceCost] = useState<number>(
    scenario?.inputs.active?.monthlyMaintenanceCost ?? DEFAULT_ACTIVE_COSTS.monthlyMaintenanceCost
  );

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Commute method options
  const methodOptions: SelectOption[] = Object.entries(COMMUTE_METHOD_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  // Fuel type options
  const fuelTypeOptions: SelectOption[] = [
    { value: 'gasoline', label: 'Bensín' },
    { value: 'diesel', label: 'Dísel' },
    { value: 'electric', label: 'Rafmagn' },
  ];

  // Electric charging type options
  const electricChargingTypeOptions: SelectOption[] = [
    { value: 'home', label: `Heimahleðsla (${ELECTRIC_CHARGING_PRESETS.home} kr/kWh)` },
    { value: 'destination', label: `Hverfahleðsla (${ELECTRIC_CHARGING_PRESETS.destination} kr/kWh)` },
    { value: 'fast', label: `Hraðhleðsla (${ELECTRIC_CHARGING_PRESETS.fast} kr/kWh)` },
    { value: 'custom', label: 'Sérsniðið verð' },
  ];

  // Ticket type options
  const ticketTypeOptions: SelectOption[] = [
    { value: 'monthly', label: 'Mánaðarkort' },
    { value: 'per_ride', label: 'Stakir farmiðar' },
  ];

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: CommutePreset) => {
    const { inputs } = preset;

    // Set basic fields
    setDistanceKm(inputs.distanceKm);
    setDaysPerWeek(inputs.daysPerWeek);
    setCommuteMethod(inputs.commuteMethod);
    setTimeMinutesOneWay(inputs.timeMinutesOneWay);

    // Set method-specific fields
    if (inputs.car) {
      setFuelType(inputs.car.fuelType);
      setFuelPrice(inputs.car.fuelPrice);
      setFuelConsumption(inputs.car.fuelConsumption);
      setParkingCostPerDay(inputs.car.parkingCostPerDay);
      setMonthlyDepreciation(inputs.car.monthlyDepreciation);
      setMonthlyInsurance(inputs.car.monthlyInsurance);
      setMonthlyMaintenance(inputs.car.monthlyMaintenance);
      setInspectionCost(inputs.car.inspectionCost);

      // Set electric charging type based on price
      if (inputs.car.fuelType === 'electric') {
        if (inputs.car.fuelPrice === ELECTRIC_CHARGING_PRESETS.home) {
          setElectricChargingType('home');
        } else if (inputs.car.fuelPrice === ELECTRIC_CHARGING_PRESETS.destination) {
          setElectricChargingType('destination');
        } else if (inputs.car.fuelPrice === ELECTRIC_CHARGING_PRESETS.fast) {
          setElectricChargingType('fast');
        } else {
          setElectricChargingType('custom');
        }
      }
    }

    if (inputs.transit) {
      setTicketType(inputs.transit.ticketType);
      setMonthlyCost(inputs.transit.monthlyCost ?? DEFAULT_TRANSIT_COSTS.monthlyCost);
      setCostPerRide(inputs.transit.costPerRide ?? 550);
    }

    if (inputs.active) {
      setMonthlyMaintenanceCost(inputs.active.monthlyMaintenanceCost);
    }

    // Clear errors
    setErrors({});
  }, []);

  // Build inputs object for validation and submission
  const buildInputs = useCallback((): Partial<CommuteInputs> => {
    const inputs: Partial<CommuteInputs> = {
      distanceKm,
      daysPerWeek,
      commuteMethod,
      timeMinutesOneWay,
    };

    if (commuteMethod === 'car') {
      inputs.car = {
        fuelType,
        fuelPrice: fuelPrice ?? 0,
        fuelConsumption: fuelConsumption ?? 0,
        parkingCostPerDay: parkingCostPerDay ?? 0,
        tollsPerDay: 0, // Iceland doesn't have tolls
        monthlyDepreciation: monthlyDepreciation ?? 0,
        monthlyInsurance: monthlyInsurance ?? 0,
        monthlyMaintenance: monthlyMaintenance ?? 0,
        inspectionCost: inspectionCost ?? 0,
      };
    }

    if (commuteMethod === 'transit') {
      inputs.transit = {
        ticketType,
        monthlyCost: ticketType === 'monthly' ? monthlyCost : undefined,
        costPerRide: ticketType === 'per_ride' ? costPerRide : undefined,
      };
    }

    if (commuteMethod === 'bike' || commuteMethod === 'walk') {
      inputs.active = {
        monthlyMaintenanceCost: monthlyMaintenanceCost ?? 0,
      };
    }

    return inputs;
  }, [
    distanceKm,
    daysPerWeek,
    commuteMethod,
    timeMinutesOneWay,
    fuelType,
    fuelPrice,
    fuelConsumption,
    parkingCostPerDay,
    monthlyDepreciation,
    monthlyInsurance,
    monthlyMaintenance,
    inspectionCost,
    ticketType,
    monthlyCost,
    costPerRide,
    monthlyMaintenanceCost,
  ]);

  // Validate name
  const validateName = useCallback((value: string): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Heiti má ekki vera tómt';
    }
    if (trimmed.length > 50) {
      return 'Heiti má ekki vera lengra en 50 stafir';
    }
    return undefined;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      // Validate name
      const nameError = validateName(name);
      if (nameError) {
        setErrors({ name: nameError });
        return;
      }

      // Build inputs
      const inputs = buildInputs();

      // Validate inputs
      const validation = validateCommuteInputs(inputs);

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // All valid - call onSave
      onSave({
        name: name.trim(),
        ...(inputs as CommuteInputs),
      });
    },
    [name, buildInputs, validateName, onSave]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card variant="outlined">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">
            {mode === 'add' ? 'Bæta við vinnuferð' : 'Breyta vinnuferð'}
          </h3>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Preset selector (only in add mode) */}
          {mode === 'add' && (
            <CommutePresetSelector onSelect={handlePresetSelect} />
          )}

          {/* Basic fields */}
          <div className="space-y-4">
            <Input
              label="Heiti"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.d. Núverandi vinna, Nýtt starf"
              required
              error={errors.name}
              helpText="Stutt heiti til að auðkenna þessa vinnuferð"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NumberInput
                label="Fjarlægð (km)"
                value={distanceKm}
                onChange={setDistanceKm}
                min={0}
                max={200}
                step={0.1}
                suffix="km"
                required
                error={errors.distanceKm}
                helpText="Einfaldur leggur, ekki báðar leiðir"
              />

              <NumberInput
                label="Dagar á viku"
                value={daysPerWeek}
                onChange={setDaysPerWeek}
                min={1}
                max={7}
                step={1}
                suffix="dagar"
                required
                error={errors.daysPerWeek}
              />
            </div>

            <Select
              label="Ferðamáti"
              value={commuteMethod}
              onChange={(value) => setCommuteMethod(value as CommuteMethod)}
              options={methodOptions}
              required
            />

            <NumberInput
              label="Ferðatími (mínútur)"
              value={timeMinutesOneWay}
              onChange={setTimeMinutesOneWay}
              min={0}
              max={300}
              step={1}
              suffix="mín"
              required
              error={errors.timeMinutesOneWay}
              helpText="Einfaldur leggur, ekki báðar leiðir"
            />
          </div>

          {/* Car-specific fields */}
          {commuteMethod === 'car' && (
            <div className="space-y-4 border-t border-neutral-200 pt-4">
              <h4 className="font-medium text-neutral-900">Bílakostnaður</h4>

              <Select
                label="Eldsneytistegund"
                value={fuelType}
                onChange={(value) =>
                  handleFuelTypeChange(value as 'gasoline' | 'diesel' | 'electric')
                }
                options={fuelTypeOptions}
                required
              />

              {/* Electric charging type selector */}
              {fuelType === 'electric' && (
                <div className="space-y-1">
                  <Select
                    label="Tegund hleðslu"
                    value={electricChargingType}
                    onChange={(value) =>
                      handleElectricChargingTypeChange(value as ElectricChargingType)
                    }
                    options={electricChargingTypeOptions}
                  />
                  <p className="text-xs text-neutral-500">
                    Veldu hleðslutegund eða sláðu inn sérsniðið verð
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberInput
                  label={
                    fuelType === 'electric'
                      ? 'Rafmagnsverð (kr/kWh)'
                      : 'Eldsneytisverð (kr/L)'
                  }
                  value={fuelPrice}
                  onChange={fuelType === 'electric' ? handleElectricPriceChange : setFuelPrice}
                  min={0}
                  max={1000}
                  step={1}
                  suffix="kr"
                  required
                  error={errors['car.fuelPrice']}
                  helpText={
                    fuelType === 'electric' && electricChargingType !== 'custom'
                      ? `${electricChargingTypeOptions.find(o => o.value === electricChargingType)?.label.split(' (')[0]}`
                      : undefined
                  }
                />

                <NumberInput
                  label={
                    fuelType === 'electric'
                      ? 'Eyðsla (kWh/100km)'
                      : 'Eyðsla (L/100km)'
                  }
                  value={fuelConsumption}
                  onChange={setFuelConsumption}
                  min={0}
                  max={50}
                  step={0.1}
                  suffix={fuelType === 'electric' ? 'kWh' : 'L'}
                  required
                  error={errors['car.fuelConsumption']}
                />
              </div>

              <NumberInput
                label="Stæði (kr/dag)"
                value={parkingCostPerDay}
                onChange={setParkingCostPerDay}
                min={0}
                step={100}
                suffix="kr"
                error={errors['car.parkingCostPerDay']}
                helpText="Kostnaður á vinnudag"
              />

              <div className="space-y-3 rounded-md border border-warning-200 bg-warning-50 p-4">
                <p className="text-sm font-medium text-warning-900">
                  Óbeinn bílakostnaður (mánaðarlega)
                </p>
                <p className="text-sm text-warning-700">
                  Þessir kostnaðarliðir eru oft gleymdur en skipta miklu máli fyrir
                  raunverulegan kostnað.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberInput
                    label="Afskriftir"
                    value={monthlyDepreciation}
                    onChange={setMonthlyDepreciation}
                    min={0}
                    step={1000}
                    suffix="kr/mán"
                    error={errors['car.monthlyDepreciation']}
                    helpText="Verðrýrnun bíls"
                  />

                  <NumberInput
                    label="Tryggingar"
                    value={monthlyInsurance}
                    onChange={setMonthlyInsurance}
                    min={0}
                    step={1000}
                    suffix="kr/mán"
                    error={errors['car.monthlyInsurance']}
                  />

                  <NumberInput
                    label="Viðhald"
                    value={monthlyMaintenance}
                    onChange={setMonthlyMaintenance}
                    min={0}
                    step={1000}
                    suffix="kr/mán"
                    error={errors['car.monthlyMaintenance']}
                    helpText="Meðaltal á mánuði"
                  />

                  <NumberInput
                    label="Skoðun"
                    value={inspectionCost}
                    onChange={setInspectionCost}
                    min={0}
                    step={1000}
                    suffix="kr/2 ár"
                    error={errors['car.inspectionCost']}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Transit-specific fields */}
          {commuteMethod === 'transit' && (
            <div className="space-y-4 border-t border-neutral-200 pt-4">
              <h4 className="font-medium text-neutral-900">Almenningssamgöngur</h4>

              <Select
                label="Tegund miða"
                value={ticketType}
                onChange={(value) => setTicketType(value as 'monthly' | 'per_ride')}
                options={ticketTypeOptions}
                required
              />

              {ticketType === 'monthly' && (
                <NumberInput
                  label="Mánaðarkostnaður"
                  value={monthlyCost}
                  onChange={setMonthlyCost}
                  min={0}
                  step={100}
                  suffix="kr/mán"
                  required
                  error={errors['transit.monthlyCost']}
                  helpText="t.d. Strætó mánaðarkort 10.500 kr"
                />
              )}

              {ticketType === 'per_ride' && (
                <NumberInput
                  label="Kostnaður á ferð"
                  value={costPerRide}
                  onChange={setCostPerRide}
                  min={0}
                  step={10}
                  suffix="kr"
                  required
                  error={errors['transit.costPerRide']}
                  helpText="t.d. Strætó stakur farmiði 550 kr"
                />
              )}
            </div>
          )}

          {/* Bike/Walk-specific fields */}
          {(commuteMethod === 'bike' || commuteMethod === 'walk') && (
            <div className="space-y-4 border-t border-neutral-200 pt-4">
              <h4 className="font-medium text-neutral-900">
                {commuteMethod === 'bike' ? 'Hjólreiðar' : 'Ganga'}
              </h4>

              <NumberInput
                label="Viðhaldskostnaður"
                value={monthlyMaintenanceCost}
                onChange={setMonthlyMaintenanceCost}
                min={0}
                step={100}
                suffix="kr/mán"
                error={errors['active.monthlyMaintenanceCost']}
                helpText={
                  commuteMethod === 'bike'
                    ? 'Meðaltal viðhalds og viðgerða'
                    : 'Skór, fatnaður o.fl.'
                }
              />
            </div>
          )}

          {/* Remote - informational message */}
          {commuteMethod === 'remote' && (
            <div className="rounded-md border border-success-200 bg-success-50 p-4">
              <p className="text-sm font-medium text-success-900">
                Fjarvinnu - enginn ferðakostnaður
              </p>
              <p className="mt-1 text-sm text-success-700">
                Þar sem þú vinnur heima eru engir ferðakostnaður eða ferðatími. Þetta
                sparar bæði peninga og lífsorku!
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Hætta við
          </Button>
          <Button type="submit" variant="primary">
            {mode === 'add' ? 'Bæta við' : 'Vista breytingar'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
