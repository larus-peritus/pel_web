'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { useCalculator } from '@/context/CalculatorContext';
import {
  calculateAdditionalIncomeResults,
  TAX_RATES_BY_BRACKET,
} from '@/lib/calculations/additionalIncome';
import type {
  AdditionalIncomeInputs,
  NewExpenses,
  AdditionalTime,
  RecommendationLevel,
  TaxBracketSelection,
} from '@/types/additionalIncome';
import { formatCurrency, formatNumber, formatMonthlyCurrency, formatHourlyCurrency } from '@/lib/utils';

/**
 * Additional Income Impact Calculator
 *
 * Helps users evaluate if side work/extra income is worth their time
 * after accounting for taxes and new expenses.
 */
export function AdditionalIncomeCalculator() {
  const { inputs, results } = useCalculator();

  // Get actual wage and annual income from calculator context
  const actualHourlyWage = results?.actualHourlyWage ?? 0;
  const currentAnnualIncome = results?.netAnnualIncome ?? 0;
  const mainJobAnnualHours = results?.annualLifeEnergyHours ?? 0;

  // Track if data was imported from main calculator
  const [hasImportedData, setHasImportedData] = useState(false);

  // Input state
  const [grossHourlyRate, setGrossHourlyRate] = useState<number>(3000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(50);

  // Tax consideration toggle - default to true (consider tax)
  const [considerTax, setConsiderTax] = useState<boolean>(true);

  // Tax bracket selection - default to mid bracket
  const [selectedTaxBracket, setSelectedTaxBracket] = useState<TaxBracketSelection>('mid');

  // New expenses
  const [newExpenses, setNewExpenses] = useState<NewExpenses>({
    transportation: 0,
    equipment: 0,
    meals: 0,
    childcare: 0,
    other: 0,
  });

  // Additional time
  const [additionalTime, setAdditionalTime] = useState<AdditionalTime>({
    commuteHours: 0,
    preparationHours: 0,
    recoveryHours: 0,
  });

  // Calculate results
  const calculationResults = useMemo(() => {
    if (!actualHourlyWage || !currentAnnualIncome) return null;

    const calculatorInputs: AdditionalIncomeInputs = {
      grossHourlyRate,
      hoursPerWeek,
      weeksPerYear,
      newExpenses,
      additionalTime,
      currentAnnualIncome,
      considerTax,
      selectedTaxBracket,
    };

    return calculateAdditionalIncomeResults(
      calculatorInputs,
      actualHourlyWage,
      mainJobAnnualHours > 0 ? mainJobAnnualHours : undefined
    );
  }, [
    grossHourlyRate,
    hoursPerWeek,
    weeksPerYear,
    newExpenses,
    additionalTime,
    actualHourlyWage,
    currentAnnualIncome,
    considerTax,
    selectedTaxBracket,
    mainJobAnnualHours,
  ]);

  // Check if we can import from calculator
  const canImport = inputs && inputs.income.grossAnnualIncome > 0;

  // Import data from main calculator
  const handleImportFromCalculator = () => {
    if (!inputs) return;

    // Get current annual income from main calculator
    // This is the net annual income (after-tax base for reference)
    setHasImportedData(true);
  };

  // Show warning if calculator context not available
  if (!actualHourlyWage || !currentAnnualIncome) {
    return (
      <Card className="p-6">
        <Alert variant="warning">
          <p className="font-medium">Þú þarft að fylla út raunverulegt tímakaup fyrst</p>
          <p className="text-sm mt-2">
            Farðu á &quot;Raunverulegt Tímakaup&quot; flipann og fylltu út launaupplýsingar þínar
            til að nota þennan reiknivél.
          </p>
        </Alert>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Introduction with Import Button */}
      <Card className="bg-primary-50 border-primary-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Reiknaðu raunverulegt tímakaup aukavinnu
              </h3>
              <p className="text-neutral-700 text-sm">
                Þetta tól hjálpar þér að meta hvort aukavinna borgi sig miðað við skatta,
                kostnað og þann tíma sem fer í vinnuna.
              </p>
            </div>
            {canImport && (
              <button
                type="button"
                onClick={handleImportFromCalculator}
                className="flex-shrink-0 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Sækja úr reiknivél
              </button>
            )}
          </div>
          {hasImportedData && (
            <p className="text-sm text-success-700 mt-3">
              ✓ Gögn sótt úr aðalreiknivél - raunverulegt tímakaup þitt: {formatHourlyCurrency(actualHourlyWage)}
            </p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          {/* Basic Income Inputs */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upplýsingar um aukavinnu</h3>
              <div className="space-y-4">
                <CurrencyInput
                  label="Brúttó tímakaup"
                  value={grossHourlyRate}
                  onChange={setGrossHourlyRate}
                  placeholder="3000"
                  helpText="Hvað færðu fyrir hvern tíma?"
                />
                <NumberInput
                  label="Klukkustundir á viku"
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  min={0}
                  max={60}
                  step={1}
                  placeholder="10"
                />
                <NumberInput
                  label="Vikur á ári"
                  value={weeksPerYear}
                  onChange={setWeeksPerYear}
                  min={1}
                  max={52}
                  step={1}
                  placeholder="50"
                  helpText="Venjulega 50 (með 2 vikna fríi)"
                />
              </div>
            </div>
          </Card>

          {/* Tax Consideration */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Skattameðferð</h3>
              <div className="space-y-4">
                {/* Toggle for tax consideration */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-neutral-900">
                      Taka tillit til skatta
                    </label>
                    <p className="text-sm text-neutral-600">
                      Ef tekjur fara í gegnum skattkerfi
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={considerTax}
                    onClick={() => setConsiderTax(!considerTax)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      considerTax ? 'bg-primary-600' : 'bg-neutral-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        considerTax ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Legal disclaimer */}
                <Alert variant="info">
                  <p className="text-sm">
                    <strong>Athugið:</strong> Samkvæmt íslenskum lögum ber að skila öllum tekjum til skattyfirvalda,
                    óháð uppruna þeirra. Þetta á við um allar tekjur, þar með talið aukastörf og tilfallandi vinnu.
                  </p>
                </Alert>

                {/* Tax bracket selection - only shown if considerTax is true */}
                {considerTax && (
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Veldu skattþrep aukatekna
                    </label>
                    <p className="text-xs text-neutral-500 mb-3">
                      Aukatekjur skattleggjast á jaðarskattþrepi - veldu þrepið sem þú ert líklegast á.
                    </p>
                    <div className="space-y-2">
                      <TaxBracketOption
                        bracket="low"
                        label="Lægsta þrep"
                        rate={TAX_RATES_BY_BRACKET.low}
                        description="Tekjur undir 498.122 kr/mán"
                        selected={selectedTaxBracket === 'low'}
                        onSelect={() => setSelectedTaxBracket('low')}
                      />
                      <TaxBracketOption
                        bracket="mid"
                        label="Miðþrep"
                        rate={TAX_RATES_BY_BRACKET.mid}
                        description="Tekjur 498.123 - 1.398.450 kr/mán"
                        selected={selectedTaxBracket === 'mid'}
                        onSelect={() => setSelectedTaxBracket('mid')}
                      />
                      <TaxBracketOption
                        bracket="high"
                        label="Hæsta þrep"
                        rate={TAX_RATES_BY_BRACKET.high}
                        description="Tekjur yfir 1.398.450 kr/mán"
                        selected={selectedTaxBracket === 'high'}
                        onSelect={() => setSelectedTaxBracket('high')}
                      />
                    </div>
                  </div>
                )}

                {!considerTax && (
                  <div className="pt-2 text-sm text-neutral-500 italic">
                    Útreikningur mun ekki taka tillit til skatta á aukatekjum.
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* New Expenses - Monthly inputs, stored as yearly internally */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Nýr kostnaður vegna aukavinnu</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Útgjöld sem þú myndir ekki hafa ef þú værir ekki að vinna þessa aukavinnu.
                <span className="text-primary-600 ml-1">(mánaðarlegt)</span>
              </p>
              <div className="space-y-4">
                <CurrencyInput
                  label="Samgöngur á mánuði"
                  value={Math.round(newExpenses.transportation / 12)}
                  onChange={(val) =>
                    setNewExpenses((prev) => ({ ...prev, transportation: val * 12 }))
                  }
                  placeholder="0"
                  helpText="Aukinn bensínkostnaður, bifreiðaviðhald, strætó"
                />
                <CurrencyInput
                  label="Búnaður á mánuði"
                  value={Math.round(newExpenses.equipment / 12)}
                  onChange={(val) => setNewExpenses((prev) => ({ ...prev, equipment: val * 12 }))}
                  placeholder="0"
                  helpText="Verkfæri, hugbúnaður, föt"
                />
                <CurrencyInput
                  label="Matur á mánuði"
                  value={Math.round(newExpenses.meals / 12)}
                  onChange={(val) => setNewExpenses((prev) => ({ ...prev, meals: val * 12 }))}
                  placeholder="0"
                  helpText="Aukin útgjöld í mat, kaffi"
                />
                <CurrencyInput
                  label="Umönnun barna á mánuði"
                  value={Math.round(newExpenses.childcare / 12)}
                  onChange={(val) => setNewExpenses((prev) => ({ ...prev, childcare: val * 12 }))}
                  placeholder="0"
                  helpText="Aukin barnagæsla vegna aukavinnu"
                />
                <CurrencyInput
                  label="Annað á mánuði"
                  value={Math.round(newExpenses.other / 12)}
                  onChange={(val) => setNewExpenses((prev) => ({ ...prev, other: val * 12 }))}
                  placeholder="0"
                />
              </div>
            </div>
          </Card>

          {/* Additional Time */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Aukinn tími (ekki greiddur)</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Tími sem þú þarft að verja til viðbótar við raunverulegan vinnutíma.
              </p>
              <div className="space-y-4">
                <NumberInput
                  label="Ferðatími (klst/viku)"
                  value={additionalTime.commuteHours}
                  onChange={(val) =>
                    setAdditionalTime((prev) => ({ ...prev, commuteHours: val }))
                  }
                  min={0}
                  max={40}
                  step={0.5}
                  placeholder="0"
                />
                <NumberInput
                  label="Undirbúningstími (klst/viku)"
                  value={additionalTime.preparationHours}
                  onChange={(val) =>
                    setAdditionalTime((prev) => ({ ...prev, preparationHours: val }))
                  }
                  min={0}
                  max={40}
                  step={0.5}
                  placeholder="0"
                  helpText="Uppsetning, stjórnun, reikningar"
                />
                <NumberInput
                  label="Hvíldartími (klst/viku)"
                  value={additionalTime.recoveryHours}
                  onChange={(val) =>
                    setAdditionalTime((prev) => ({ ...prev, recoveryHours: val }))
                  }
                  min={0}
                  max={40}
                  step={0.5}
                  placeholder="0"
                  helpText="Aukin hvíld vegna þreytu"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {calculationResults && (
            <>
              {/* Net Hourly Rate Display */}
              <Card className="bg-gradient-to-br from-primary-50 to-white">
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-sm text-neutral-600 mb-2">
                      Raunverulegt tímakaup aukavinnu
                    </div>
                    <div className="text-5xl font-bold text-neutral-900 mb-4">
                      {formatCurrency(calculationResults.netHourlyRate)}
                      <span className="text-2xl text-neutral-600">/klst</span>
                    </div>
                    <RecommendationBadge recommendation={calculationResults.recommendation} />
                  </div>
                </div>
              </Card>

              {/* Average Impact Card - The key insight */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Áhrif á meðaltímakaup þitt
                  </h3>

                  {/* Comparison Table */}
                  <div className="overflow-hidden rounded-lg border border-neutral-200">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-neutral-600"></th>
                          <th className="px-4 py-3 text-right font-medium text-neutral-600">Tímakaup</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        <tr>
                          <td className="px-4 py-3 text-neutral-700">Núverandi meðaltímakaup</td>
                          <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                            {formatHourlyCurrency(actualHourlyWage)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-neutral-700">Nýtt meðaltímakaup</td>
                          <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                            {formatHourlyCurrency(calculationResults.combinedAverageHourlyWage)}
                          </td>
                        </tr>
                        <tr className={calculationResults.averageWageChange >= 0 ? 'bg-success-50' : 'bg-warning-50'}>
                          <td className="px-4 py-3 font-medium text-neutral-900">Breyting</td>
                          <td className={`px-4 py-3 text-right font-bold text-lg ${
                            calculationResults.averageWageChange >= 0 ? 'text-success-700' : 'text-warning-700'
                          }`}>
                            {calculationResults.averageWageChange >= 0 ? '+' : ''}
                            {formatCurrency(calculationResults.averageWageChange)} kr/klst
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Result badge */}
                  <div className={`mt-4 p-3 rounded-lg text-center ${
                    calculationResults.averageWageChange >= 0 ? 'bg-success-100' : 'bg-warning-100'
                  }`}>
                    <span className={`text-sm font-medium ${
                      calculationResults.averageWageChange >= 0 ? 'text-success-800' : 'text-warning-800'
                    }`}>
                      {calculationResults.averageWageChange >= 0
                        ? `↑ Hækkar um ${calculationResults.averageWageChangePercent.toFixed(1)}%`
                        : `↓ Lækkar um ${Math.abs(calculationResults.averageWageChangePercent).toFixed(1)}%`
                      }
                    </span>
                  </div>
                </div>
              </Card>

              {/* Monthly and Yearly Impact */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tekjuáhrif</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="text-sm text-neutral-600">Nettó á mánuði</div>
                      <div className="text-2xl font-bold text-success-700">
                        +{formatCurrency(calculationResults.netMonthlyIncome)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="text-sm text-neutral-600">Nettó á ári</div>
                      <div className="text-2xl font-bold text-success-700">
                        +{formatCurrency(calculationResults.netAnnualIncome)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Time Cost */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tímakostnaður</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Greiddar vinnustundir</span>
                      <span className="font-medium">{hoursPerWeek} klst/viku</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Ógreiddar stundir (ferðir, undirbúningur, hvíld)</span>
                      <span className="font-medium">
                        {(calculationResults.hoursPerWeek - hoursPerWeek).toFixed(1)} klst/viku
                      </span>
                    </div>
                    <div className="pt-3 border-t flex justify-between">
                      <span className="font-medium">Heildar tími sem fer í aukavinnu</span>
                      <span className="font-bold text-lg text-primary-700">
                        {calculationResults.hoursPerWeek.toFixed(1)} klst/viku
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Á ári</span>
                      <span>{formatNumber(calculationResults.extraHoursPerYear)} klst/ári</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Breakdown - Monthly */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Sundurliðun tekna (mánaðarlegt)</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Brúttó tekjur</span>
                      <span className="font-medium">
                        {formatMonthlyCurrency(calculationResults.grossMonthlyIncome)}
                      </span>
                    </div>
                    {calculationResults.taxApplied && (
                      <div className="flex justify-between text-error-700">
                        <span>- Skattur ({calculationResults.selectedTaxRate.toFixed(1)}%)</span>
                        <span className="font-medium">
                          {formatMonthlyCurrency(Math.round(calculationResults.marginalTax / 12))}
                        </span>
                      </div>
                    )}
                    {!calculationResults.taxApplied && (
                      <div className="flex justify-between text-neutral-400">
                        <span>- Skattur</span>
                        <span className="font-medium italic">Ekki reiknaður</span>
                      </div>
                    )}
                    {calculationResults.totalNewExpenses > 0 && (
                      <div className="flex justify-between text-error-700">
                        <span>- Nýr kostnaður</span>
                        <span className="font-medium">
                          {formatMonthlyCurrency(Math.round(calculationResults.totalNewExpenses / 12))}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t flex justify-between">
                      <span className="font-medium">Nettó tekjur</span>
                      <span className="font-bold text-success-700">
                        {formatMonthlyCurrency(calculationResults.netMonthlyIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Samantekt</h3>
                  <ImprovedSummary
                    results={calculationResults}
                    actualWage={actualHourlyWage}
                  />
                </div>
              </Card>

              {/* Life Impact Reflection */}
              <Card className="bg-amber-50 border-amber-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">
                    Hugleiðing um lífsgæði
                  </h3>
                  <div className="space-y-3 text-sm text-amber-800">
                    <p>
                      Áður en þú tekur ákvörðun um aukavinnu, hugleiddu:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>
                        <strong>Sambönd:</strong> Hafa þessir tímar áhrif á tíma með fjölskyldu og vinum?
                      </li>
                      <li>
                        <strong>Andleg heilsa:</strong> Ertu að búa til streitu sem hefur langtímaáhrif?
                      </li>
                      <li>
                        <strong>Líkamleg heilsa:</strong> Færðu næga hvíld, hreyfingu og nægjanlegan svefn?
                      </li>
                      <li>
                        <strong>Gleði:</strong> Er þessi vinna gefandi fyrir utan peningana?
                      </li>
                    </ul>
                    <p className="mt-4 font-medium text-amber-900">
                      Tíminn þinn er dýrmætasta auðlind þín. Verðu viss um að nota hann vel.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Tax Bracket Selection Option
 */
interface TaxBracketOptionProps {
  bracket: TaxBracketSelection;
  label: string;
  rate: number;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

function TaxBracketOption({
  label,
  rate,
  description,
  selected,
  onSelect,
}: TaxBracketOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
        selected
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <span className={`font-medium ${selected ? 'text-primary-900' : 'text-neutral-900'}`}>
            {label}
          </span>
          <span className={`ml-2 text-sm ${selected ? 'text-primary-700' : 'text-neutral-500'}`}>
            ({rate.toFixed(2)}%)
          </span>
        </div>
        {selected && (
          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <p className={`text-xs mt-1 ${selected ? 'text-primary-600' : 'text-neutral-500'}`}>
        {description}
      </p>
    </button>
  );
}

/**
 * Recommendation Badge Component
 */
function RecommendationBadge({ recommendation }: { recommendation: RecommendationLevel }) {
  const config = {
    excellent: { label: 'Frábært', variant: 'success' as const },
    good: { label: 'Gott', variant: 'success' as const },
    modest: { label: 'Í lagi', variant: 'neutral' as const },
    poor: { label: 'Ekki gott', variant: 'warning' as const },
    negative: { label: 'Neikvætt', variant: 'danger' as const },
  };

  const { label, variant } = config[recommendation];

  return <Badge variant={variant}>{label}</Badge>;
}

/**
 * Improved Summary Component - focused on time cost vs benefit
 */
interface ImprovedSummaryProps {
  results: ReturnType<typeof calculateAdditionalIncomeResults>;
  actualWage: number;
}

function ImprovedSummary({ results, actualWage }: ImprovedSummaryProps) {
  const isAvgHigher = results.averageWageChange >= 0;
  const netRate = results.netHourlyRate;
  const extraHoursWeekly = results.hoursPerWeek;
  const netMonthly = results.netMonthlyIncome;

  return (
    <div className="space-y-4">
      {/* Main conclusion */}
      <div className={`p-4 rounded-lg ${
        isAvgHigher ? 'bg-success-50' : 'bg-warning-50'
      }`}>
        <p className={`font-medium ${isAvgHigher ? 'text-success-900' : 'text-warning-900'}`}>
          {isAvgHigher
            ? `Þessi aukavinna hækkar meðaltímakaup þitt.`
            : `Þessi aukavinna lækkar meðaltímakaup þitt.`
          }
        </p>
      </div>

      {/* The trade-off */}
      <div className="space-y-2 text-neutral-700">
        <p>
          Fyrir <strong>{extraHoursWeekly.toFixed(1)} aukatíma á viku</strong> færðu{' '}
          <strong>{formatMonthlyCurrency(netMonthly)} nettó</strong>.
        </p>
        <p>
          Það samsvarar <strong>{formatHourlyCurrency(netRate)}</strong> raunverulegt tímakaup
          á aukavinnunni, samanborið við <strong>{formatHourlyCurrency(actualWage)}</strong> í
          aðalvinnunni.
        </p>
      </div>

      {/* Warning for low-value work */}
      {!isAvgHigher && (
        <Alert variant="warning">
          <p className="text-sm">
            Þó að þú græðir {formatMonthlyCurrency(netMonthly)}, lækkar þetta heildarmeðaltímakaup þitt.
            Þú ert að selja tíma þinn á lægra verði en í aðalvinnunni.
          </p>
        </Alert>
      )}

      {/* Positive reinforcement for good work */}
      {isAvgHigher && results.recommendation === 'excellent' && (
        <Alert variant="success">
          <p className="text-sm">
            Þessi aukavinna borgar vel fyrir sig! Þú færð meira fyrir tíma þinn en í aðalvinnunni.
          </p>
        </Alert>
      )}

      {/* Considerations */}
      {results.recommendation !== 'negative' && results.recommendation !== 'excellent' && (
        <div className="text-sm text-neutral-600 pt-2">
          <p className="font-medium mb-1">Hugleiddu einnig:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Eru færniþróunartækifæri í þessari vinnu?</li>
            <li>Nýtur þú vinnunnar eða er hún eingöngu fyrir peningana?</li>
            <li>Hefur þetta áhrif á heilsu þína og fjölskyldu?</li>
          </ul>
        </div>
      )}

      {/* Negative scenario */}
      {results.recommendation === 'negative' && (
        <Alert variant="error">
          <p className="text-sm">
            Þessi aukavinna skilar neikvæðu tímakaupi eftir skatta og kostnað.
            Þú ert í raun að tapa peningum á þessari vinnu.
          </p>
        </Alert>
      )}
    </div>
  );
}
