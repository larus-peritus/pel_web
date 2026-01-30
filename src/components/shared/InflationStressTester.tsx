'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import {
  runInflationStressTest,
  getRecommendedMultiplier,
  suggestInflationProtection,
  ICELAND_INFLATION_SCENARIOS,
  ICELAND_HISTORICAL_INFLATION,
  type InflationStressInput,
} from '@/lib/calculations/inflationStress';

/**
 * InflationStressTester Props
 */
export interface InflationStressTesterProps {
  /** Initial portfolio value */
  portfolioValue?: number;
  /** Annual expenses */
  annualExpenses?: number;
  /** Current age */
  currentAge: number;
  /** Target retirement age */
  retirementAge: number;
  /** Expected investment return */
  expectedReturn?: number;
  /** Callbacks */
  onPortfolioChange?: (value: number) => void;
  onExpensesChange?: (value: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * InflationStressTester Component
 *
 * Shows impact of various inflation scenarios on retirement portfolio.
 * Iceland-specific with historical inflation data and recommendations.
 */
export const InflationStressTester: React.FC<InflationStressTesterProps> = ({
  portfolioValue = 100000000,
  annualExpenses = 6000000,
  currentAge,
  retirementAge,
  expectedReturn = 0.06,
  onPortfolioChange,
  onExpensesChange,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [localPortfolio, setLocalPortfolio] = useState(portfolioValue);
  const [localExpenses, setLocalExpenses] = useState(annualExpenses);
  const [localReturn, setLocalReturn] = useState(expectedReturn * 100);
  const [targetYears, setTargetYears] = useState(30);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');

  // Run stress tests
  const results = useMemo(() => {
    const input: InflationStressInput = {
      initialPortfolio: localPortfolio,
      annualExpenses: localExpenses,
      currentAge,
      retirementAge,
      targetYears,
      expectedReturn: localReturn / 100,
    };
    return runInflationStressTest(input);
  }, [localPortfolio, localExpenses, currentAge, retirementAge, targetYears, localReturn]);

  // Get multiplier recommendations
  const recommendations = useMemo(() => {
    return ICELAND_INFLATION_SCENARIOS.map((scenario) => ({
      scenario,
      ...getRecommendedMultiplier(scenario.rate),
    }));
  }, []);

  // Get allocation suggestion
  const allocation = useMemo(() => {
    return suggestInflationProtection(currentAge, riskTolerance);
  }, [currentAge, riskTolerance]);

  // Calculate average historical inflation
  const avgHistoricalInflation = useMemo(() => {
    const sum = ICELAND_HISTORICAL_INFLATION.reduce((acc, d) => acc + d.rate, 0);
    return sum / ICELAND_HISTORICAL_INFLATION.length;
  }, []);

  // Handle changes
  const handlePortfolioChange = (value: number) => {
    setLocalPortfolio(value);
    onPortfolioChange?.(value);
  };

  const handleExpensesChange = (value: number) => {
    setLocalExpenses(value);
    onExpensesChange?.(value);
  };

  // Get color class for scenario
  const getScenarioColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'orange':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'red':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <Card
      variant="elevated"
      className={cn('border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-rose-900">
                Verðbólguálagspróf
              </h3>
              <Badge variant="danger" size="sm">Áhættugreining</Badge>
            </div>
            <p className="text-sm text-rose-700 mt-1">
              Hvernig þolir safnið þitt mismunandi verðbólgusviðsmyndir?
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-rose-600">Meðalverðbólga (söguleg)</p>
                <p className="text-lg font-bold text-rose-800">
                  {formatNumber(avgHistoricalInflation * 100, 1)}%
                </p>
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={isExpanded ? 'Loka' : 'Opna'}
              aria-expanded={isExpanded}
            >
              <svg
                className={cn('h-5 w-5 transition-transform duration-200', isExpanded && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 pt-4">
          {/* Iceland Context Alert */}
          <Alert variant="warning">
            <div className="space-y-2">
              <p className="font-semibold text-sm">
                Verðbólga á Íslandi er hærri en í flestum löndum
              </p>
              <p className="text-sm">
                Meðalverðbólga síðustu 10 ára: <strong>{formatNumber(avgHistoricalInflation * 100, 1)}%</strong>.
                Þetta er mun hærra en 2-3% sem gengið er út frá í bandarískum FIRE útreikningum.
                Þess vegna mælum við með 30x margfaldara í stað 25x.
              </p>
            </div>
          </Alert>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CurrencyInput
              label="Safn við starfslok"
              value={localPortfolio}
              onChange={handlePortfolioChange}
              helpText="Heildarfjárfestingar"
            />
            <CurrencyInput
              label="Árleg útgjöld"
              value={localExpenses}
              onChange={handleExpensesChange}
              helpText="Útgjöld á ári"
            />
            <NumberInput
              label="Vænt ávöxtun (%)"
              value={localReturn}
              onChange={setLocalReturn}
              min={0}
              max={15}
              step={0.5}
              suffix="%"
              helpText="Fyrir skatt"
            />
            <NumberInput
              label="Markmiðsár"
              value={targetYears}
              onChange={setTargetYears}
              min={10}
              max={50}
              helpText="Hversu lengi á safn að endast?"
            />
          </div>

          {/* Historical Inflation Line Chart */}
          <div className="bg-white rounded-lg p-4 border border-rose-200">
            <h4 className="font-semibold text-rose-900 mb-3">Söguleg verðbólga á Íslandi (1998-2024)</h4>
            <div className="relative">
              {/* SVG Line Chart */}
              <svg
                viewBox="0 0 800 200"
                className="w-full h-48"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Grid lines */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="40%" stopColor="#ef4444" />
                    <stop offset="60%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 2.5, 5, 7.5, 10, 12.5].map((pct) => {
                  const y = 180 - (pct / 15) * 160;
                  return (
                    <g key={pct}>
                      <line
                        x1="50"
                        y1={y}
                        x2="780"
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray={pct === 2.5 ? "4,4" : "0"}
                      />
                      <text x="45" y={y + 4} textAnchor="end" className="text-xs fill-neutral-500" fontSize="11">
                        {pct}%
                      </text>
                    </g>
                  );
                })}

                {/* Central bank target line (2.5%) */}
                <line
                  x1="50"
                  y1={180 - (2.5 / 15) * 160}
                  x2="780"
                  y2={180 - (2.5 / 15) * 160}
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  opacity="0.7"
                />
                <text x="785" y={180 - (2.5 / 15) * 160 + 4} className="text-xs fill-green-600" fontSize="10">
                  Markmið
                </text>

                {/* Area under the line */}
                <path
                  d={`
                    M 50 180
                    ${ICELAND_HISTORICAL_INFLATION.map((d, i) => {
                      const x = 50 + (i / (ICELAND_HISTORICAL_INFLATION.length - 1)) * 730;
                      const y = 180 - (d.rate / 0.15) * 160;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                    L 780 180
                    Z
                  `}
                  fill="url(#areaGradient)"
                />

                {/* Main line */}
                <path
                  d={`
                    M ${50} ${180 - (ICELAND_HISTORICAL_INFLATION[0].rate / 0.15) * 160}
                    ${ICELAND_HISTORICAL_INFLATION.slice(1).map((d, i) => {
                      const x = 50 + ((i + 1) / (ICELAND_HISTORICAL_INFLATION.length - 1)) * 730;
                      const y = 180 - (d.rate / 0.15) * 160;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                  `}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {ICELAND_HISTORICAL_INFLATION.map((d, i) => {
                  const x = 50 + (i / (ICELAND_HISTORICAL_INFLATION.length - 1)) * 730;
                  const y = 180 - (d.rate / 0.15) * 160;
                  const isHighlight = d.year === 2008 || d.year === 2009 || d.year === 2022 || d.year === 2023;
                  return (
                    <g key={d.year} className="group">
                      <circle
                        cx={x}
                        cy={y}
                        r={isHighlight ? 5 : 3}
                        fill={d.rate > 0.08 ? '#ef4444' : d.rate > 0.05 ? '#f97316' : '#f43f5e'}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6"
                      />
                      {/* Tooltip trigger area */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill="transparent"
                        className="cursor-pointer"
                      >
                        <title>{d.year}: {formatNumber(d.rate * 100, 1)}%</title>
                      </circle>
                      {/* Year labels for key years */}
                      {(d.year === 1998 || d.year === 2000 || d.year === 2005 || d.year === 2008 || d.year === 2010 || d.year === 2015 || d.year === 2020 || d.year === 2024) && (
                        <text
                          x={x}
                          y="195"
                          textAnchor="middle"
                          className="text-xs fill-neutral-600"
                          fontSize="11"
                        >
                          {d.year === 2008 ? "'08" : d.year.toString().slice(-2)}
                        </text>
                      )}
                      {/* Value labels for crisis years */}
                      {(d.year === 2008 || d.year === 2009) && (
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-xs fill-red-600 font-semibold"
                          fontSize="10"
                        >
                          {formatNumber(d.rate * 100, 1)}%
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend and stats */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-rose-100">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-4 h-0.5 bg-green-500"></span>
                  <span className="text-neutral-600">Seðlabankamarkmið (2.5%)</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-rose-700">
                  Meðaltal: {formatNumber(avgHistoricalInflation * 100, 1)}%
                </span>
                <span className="text-xs text-neutral-500 ml-2">
                  (Hæst: 12.7% árið 2008)
                </span>
              </div>
            </div>
          </div>

          {/* Stress Test Results */}
          <div className="bg-white rounded-lg p-4 border border-rose-200">
            <h4 className="font-semibold text-rose-900 mb-3">Niðurstöður álagsprófs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((result) => (
                <div
                  key={result.scenario.name}
                  className={cn(
                    'rounded-lg p-4 border-2',
                    getScenarioColorClass(result.scenario.color)
                  )}
                >
                  <p className="font-semibold">{result.scenario.name}</p>
                  <p className="text-xs opacity-80">{result.scenario.description}</p>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs opacity-70">Safn endist í</p>
                      <p className="text-2xl font-bold">
                        {result.yearsLasted >= targetYears
                          ? `${targetYears}+ ár`
                          : `${result.yearsLasted} ár`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Líkur á að endast</p>
                      <p className="font-semibold">
                        {formatNumber(result.survivalProbability, 0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multiplier Recommendations */}
          <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-lg p-4 border border-rose-300">
            <h4 className="font-semibold text-rose-900 mb-3">Mælt með margfaldara eftir verðbólgu</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rose-200">
                    <th className="text-left py-2 px-3 text-rose-900 font-semibold">Sviðsmynd</th>
                    <th className="text-center py-2 px-3 text-rose-900 font-semibold">Verðbólga</th>
                    <th className="text-center py-2 px-3 text-rose-900 font-semibold">Margfaldari</th>
                    <th className="text-center py-2 px-3 text-rose-900 font-semibold">Úttektarhlutfall</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec) => (
                    <tr key={rec.scenario.name} className="border-b border-rose-100">
                      <td className="py-2 px-3 text-neutral-900">{rec.scenario.name}</td>
                      <td className="text-center py-2 px-3 text-neutral-800">
                        {formatNumber(rec.scenario.rate * 100, 1)}%
                      </td>
                      <td className="text-center py-2 px-3 font-bold text-rose-700">{rec.multiplier}x</td>
                      <td className="text-center py-2 px-3 text-neutral-800">
                        {formatNumber(rec.withdrawalRate * 100, 2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allocation Suggestion */}
          <div className="bg-white rounded-lg p-4 border border-rose-200">
            <h4 className="font-semibold text-rose-900 mb-3">Ráðlögð eignadreifing</h4>
            <div className="flex gap-4 mb-4">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRiskTolerance(level)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    riskTolerance === level
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  )}
                >
                  {level === 'low' ? 'Lágt' : level === 'medium' ? 'Meðal' : 'Hátt'} áhættuþol
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600">Hlutabréf</p>
                <p className="text-2xl font-bold text-blue-700">{allocation.stocks}%</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-amber-600">Verðtryggð skuldabréf</p>
                <p className="text-2xl font-bold text-amber-700">{allocation.inflationIndexedBonds}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">Óverðtryggð skuldabréf</p>
                <p className="text-2xl font-bold text-gray-700">{allocation.nominalBonds}%</p>
              </div>
            </div>

            <p className="text-sm text-neutral-700">{allocation.rationale}</p>

            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Fyrirvari:</strong> Þetta er almenn leiðsögn byggð á einföldum reglum og er ekki
                persónuleg fjármálaráðgjöf. Raunveruleg eignadreifing ætti að taka tillit til fjölmargra
                þátta eins og tekjur, skuldir, fjölskylduaðstæður, fjárfestingarreynslu og persónuleg
                markmið. Ráðfærðu þig við löggiltan fjármálaráðgjafa áður en þú tekur fjárfestingarákvarðanir.
              </p>
            </div>
          </div>

          {/* Iceland-Specific Tips */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="font-semibold">Verndun gegn verðbólgu á Íslandi:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li><strong>Verðtryggð skuldabréf:</strong> Vextir aðlagast verðbólgu</li>
                <li><strong>Fasteignir:</strong> Virði hækkar venjulega með verðbólgu</li>
                <li><strong>Erlend hlutabréf:</strong> Dreifing gjaldmiðlaáhættu</li>
                <li><strong>Lífeyrissjóðir:</strong> Skylduframlög halda áfram að vaxa</li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default InflationStressTester;
