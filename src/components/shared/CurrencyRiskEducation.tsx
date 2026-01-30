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

/**
 * Historical ISK exchange rate data (vs EUR) from 1999
 * Source: Seðlabanki Íslands (Central Bank of Iceland)
 * Note: EUR introduced in 1999, earlier data converted from predecessor currencies
 */
const ISK_EUR_HISTORY: { year: number; rate: number; event?: string }[] = [
  { year: 1999, rate: 72 },
  { year: 2000, rate: 78 },
  { year: 2001, rate: 97 },
  { year: 2002, rate: 91 },
  { year: 2003, rate: 86 },
  { year: 2004, rate: 87 },
  { year: 2005, rate: 78 },
  { year: 2006, rate: 92 },
  { year: 2007, rate: 87, event: 'Fyrir hrun' },
  { year: 2008, rate: 127, event: 'Hrunið' },
  { year: 2009, rate: 172, event: 'Eftir hrun' },
  { year: 2010, rate: 162 },
  { year: 2011, rate: 161 },
  { year: 2012, rate: 161 },
  { year: 2013, rate: 163 },
  { year: 2014, rate: 155 },
  { year: 2015, rate: 143 },
  { year: 2016, rate: 133 },
  { year: 2017, rate: 121, event: 'Styrkur ISK' },
  { year: 2018, rate: 127 },
  { year: 2019, rate: 137 },
  { year: 2020, rate: 154, event: 'COVID' },
  { year: 2021, rate: 150 },
  { year: 2022, rate: 143 },
  { year: 2023, rate: 150 },
  { year: 2024, rate: 150 },
];

/**
 * CurrencyRiskEducation Props
 */
export interface CurrencyRiskEducationProps {
  /** Portfolio value in ISK */
  portfolioValue?: number;
  /** Annual expenses in ISK */
  annualExpenses?: number;
  /** International travel budget (% of expenses) */
  travelBudgetPercent?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * Calculate currency-adjusted values
 */
function calculateCurrencyImpact(
  portfolioISK: number,
  expensesISK: number,
  travelPercent: number,
  currentRate: number,
  scenarioRate: number
) {
  // How much of portfolio is effectively in EUR (if invested internationally)
  const internationalPercent = 0.5; // Assume 50% international
  const internationalPortfolioISK = portfolioISK * internationalPercent;

  // Convert to EUR at current rate
  const portfolioEUR = internationalPortfolioISK / currentRate;

  // Value in ISK at new rate
  const newValueISK = portfolioEUR * scenarioRate;

  // Change in ISK value
  const portfolioChange = newValueISK - internationalPortfolioISK;
  const portfolioChangePercent = (portfolioChange / internationalPortfolioISK) * 100;

  // Travel budget impact
  const travelBudgetISK = expensesISK * (travelPercent / 100);
  const travelBudgetEUR = travelBudgetISK / currentRate;
  const newTravelCostISK = travelBudgetEUR * scenarioRate;
  const travelChange = newTravelCostISK - travelBudgetISK;

  return {
    portfolioChange,
    portfolioChangePercent,
    travelChange,
    newTravelCostISK,
    portfolioEUR,
    newValueISK,
  };
}

/**
 * CurrencyRiskEducation Component
 *
 * Educates users on ISK volatility and its impact on:
 * - International investments
 * - Travel and import costs
 * - Portfolio hedging strategies
 */
export const CurrencyRiskEducation: React.FC<CurrencyRiskEducationProps> = ({
  portfolioValue = 100000000,
  annualExpenses = 6000000,
  travelBudgetPercent = 10,
  className,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [localPortfolio, setLocalPortfolio] = useState(portfolioValue);
  const [localExpenses, setLocalExpenses] = useState(annualExpenses);
  const [localTravelPercent, setLocalTravelPercent] = useState(travelBudgetPercent);
  const [internationalPercent, setInternationalPercent] = useState(50);

  const currentRate = ISK_EUR_HISTORY[ISK_EUR_HISTORY.length - 1].rate;

  // Calculate scenarios
  const scenarios = useMemo(() => {
    return [
      {
        name: 'ISK styrkist 20%',
        rate: currentRate * 0.8,
        description: 'Gott fyrir ferðalög, slæmt fyrir erlend hlutabréf',
        color: 'blue',
      },
      {
        name: 'Núverandi gengi',
        rate: currentRate,
        description: 'Viðmiðunargildi',
        color: 'gray',
      },
      {
        name: 'ISK veikist 20%',
        rate: currentRate * 1.2,
        description: 'Gott fyrir erlend hlutabréf, slæmt fyrir ferðalög',
        color: 'orange',
      },
      {
        name: 'Kreppugengi',
        rate: currentRate * 1.5,
        description: 'Svipað og í hruninu 2008',
        color: 'red',
      },
    ].map((scenario) => ({
      ...scenario,
      impact: calculateCurrencyImpact(
        localPortfolio * (internationalPercent / 100),
        localExpenses,
        localTravelPercent,
        currentRate,
        scenario.rate
      ),
    }));
  }, [localPortfolio, localExpenses, localTravelPercent, internationalPercent, currentRate]);

  // Historical volatility
  const historicalVolatility = useMemo(() => {
    const rates = ISK_EUR_HISTORY.map((h) => h.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const range = ((max - min) / avg) * 100;
    return { min, max, avg, range };
  }, []);

  const getScenarioColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'gray':
        return 'bg-gray-100 border-gray-300 text-gray-800';
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
      className={cn('border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50', className)}
    >
      <CardHeader
        className={cn('cursor-pointer', compact && 'py-3')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-cyan-900">
                Gjaldmiðlaáhætta
              </h3>
              <Badge variant="info" size="sm">ISK</Badge>
            </div>
            <p className="text-sm text-cyan-700 mt-1">
              Hvernig hefur gengi krónunnar áhrif á fjárfestingar og útgjöld?
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <div className="text-right">
                <p className="text-xs text-cyan-600">ISK/EUR núna</p>
                <p className="text-lg font-bold text-cyan-800">{currentRate}</p>
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
          {/* Key Insight */}
          <Alert variant="warning">
            <div className="space-y-2">
              <p className="font-semibold text-sm">
                Íslenska krónan er einn sveiflukenndasti gjaldmiðill í heiminum
              </p>
              <p className="text-sm">
                Á síðustu 20 árum hefur gengi ISK/EUR farið frá 87 (2007) upp í 180 (2009) -
                <strong> meira en tvöföldun!</strong> Þetta hefur mikil áhrif á FIRE áætlun þína.
              </p>
            </div>
          </Alert>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CurrencyInput
              label="Safn (ISK)"
              value={localPortfolio}
              onChange={setLocalPortfolio}
              helpText="Heildarfjárfestingar"
            />
            <NumberInput
              label="Erlent hlutfall (%)"
              value={internationalPercent}
              onChange={setInternationalPercent}
              min={0}
              max={100}
              suffix="%"
              helpText="Hlutfall í erlendum eignum"
            />
            <CurrencyInput
              label="Árleg útgjöld (ISK)"
              value={localExpenses}
              onChange={setLocalExpenses}
              helpText="Heildarútgjöld á ári"
            />
            <NumberInput
              label="Ferðakostnaður (%)"
              value={localTravelPercent}
              onChange={setLocalTravelPercent}
              min={0}
              max={50}
              suffix="%"
              helpText="Hlutfall útgjalda erlendis"
            />
          </div>

          {/* Historical Line Chart */}
          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <h4 className="font-semibold text-cyan-900 mb-3">Söguleg þróun ISK/EUR (1999-2024)</h4>
            <div className="relative">
              {/* SVG Line Chart */}
              <svg
                viewBox="0 0 800 200"
                className="w-full h-48"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Gradients */}
                <defs>
                  <linearGradient id="currencyLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="40%" stopColor="#0891b2" />
                    <stop offset="60%" stopColor="#0891b2" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="currencyAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines - ISK values */}
                {[80, 100, 120, 140, 160, 180].map((val) => {
                  const y = 180 - ((val - 60) / 140) * 160;
                  return (
                    <g key={val}>
                      <line
                        x1="50"
                        y1={y}
                        x2="780"
                        y2={y}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray={val === 100 ? "4,4" : "0"}
                      />
                      <text x="45" y={y + 4} textAnchor="end" className="text-xs fill-neutral-500" fontSize="11">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Crisis zone highlight (2008-2010) */}
                <rect
                  x={50 + (9 / (ISK_EUR_HISTORY.length - 1)) * 730 - 15}
                  y="20"
                  width="60"
                  height="160"
                  fill="#fecaca"
                  opacity="0.3"
                />

                {/* Area under the line */}
                <path
                  d={`
                    M 50 180
                    ${ISK_EUR_HISTORY.map((d, i) => {
                      const x = 50 + (i / (ISK_EUR_HISTORY.length - 1)) * 730;
                      const y = 180 - ((d.rate - 60) / 140) * 160;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                    L 780 180
                    Z
                  `}
                  fill="url(#currencyAreaGradient)"
                />

                {/* Main line */}
                <path
                  d={`
                    M ${50} ${180 - ((ISK_EUR_HISTORY[0].rate - 60) / 140) * 160}
                    ${ISK_EUR_HISTORY.slice(1).map((d, i) => {
                      const x = 50 + ((i + 1) / (ISK_EUR_HISTORY.length - 1)) * 730;
                      const y = 180 - ((d.rate - 60) / 140) * 160;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                  `}
                  fill="none"
                  stroke="url(#currencyLineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {ISK_EUR_HISTORY.map((d, i) => {
                  const x = 50 + (i / (ISK_EUR_HISTORY.length - 1)) * 730;
                  const y = 180 - ((d.rate - 60) / 140) * 160;
                  const isHighlight = d.event !== undefined;
                  const isCrisis = d.rate > 160;
                  return (
                    <g key={d.year} className="group">
                      <circle
                        cx={x}
                        cy={y}
                        r={isHighlight ? 5 : 3}
                        fill={isCrisis ? '#ef4444' : d.rate > 140 ? '#f97316' : '#06b6d4'}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer"
                      />
                      {/* Tooltip trigger area */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill="transparent"
                        className="cursor-pointer"
                      >
                        <title>{d.year}: {d.rate} ISK/EUR{d.event ? ` (${d.event})` : ''}</title>
                      </circle>
                      {/* Year labels for key years */}
                      {(d.year === 1999 || d.year === 2005 || d.year === 2008 || d.year === 2010 || d.year === 2015 || d.year === 2017 || d.year === 2020 || d.year === 2024) && (
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
                      {(d.year === 2009) && (
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-xs fill-red-600 font-semibold"
                          fontSize="10"
                        >
                          {d.rate}
                        </text>
                      )}
                      {/* Event labels */}
                      {d.event && d.year !== 2009 && (
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-xs fill-cyan-700 font-medium"
                          fontSize="9"
                        >
                          {d.event}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Y-axis label */}
                <text
                  x="25"
                  y="100"
                  textAnchor="middle"
                  transform="rotate(-90, 25, 100)"
                  className="text-xs fill-neutral-500"
                  fontSize="10"
                >
                  ISK/EUR
                </text>
              </svg>
            </div>

            {/* Legend and stats */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-cyan-100">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-200 rounded"></span>
                  <span className="text-neutral-600">Kreppuár (2008-2010)</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-cyan-700">
                  Lægst: {historicalVolatility.min} | Hæst: {historicalVolatility.max}
                </span>
                <span className="text-xs text-neutral-500 ml-2">
                  (Sveiflubil: {formatNumber(historicalVolatility.range, 0)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Analysis */}
          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <h4 className="font-semibold text-cyan-900 mb-3">Gengisbreytingar - Áhrif</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className={cn('rounded-lg p-4 border-2', getScenarioColor(scenario.color))}
                >
                  <p className="font-semibold">{scenario.name}</p>
                  <p className="text-xs opacity-80 mb-3">{scenario.description}</p>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs opacity-70">Gengi</p>
                      <p className="font-bold">{formatNumber(scenario.rate, 0)} ISK/EUR</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Áhrif á erlent safn</p>
                      <p
                        className={cn(
                          'font-bold',
                          scenario.impact.portfolioChange > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {scenario.impact.portfolioChange > 0 ? '+' : ''}
                        {formatCurrency(scenario.impact.portfolioChange)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Áhrif á ferðakostnað</p>
                      <p
                        className={cn(
                          'font-bold',
                          scenario.impact.travelChange < 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {scenario.impact.travelChange > 0 ? '+' : ''}
                        {formatCurrency(scenario.impact.travelChange)}/ár
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Allocation Suggestion */}
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg p-4 border border-cyan-300">
            <h4 className="font-semibold text-cyan-900 mb-3">Mælt með eignadreifingu</h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/70 rounded-lg p-3 text-center">
                <p className="text-xs text-cyan-700">Íslensk hlutabréf</p>
                <p className="text-2xl font-bold text-cyan-800">20-30%</p>
                <p className="text-xs text-neutral-500">Minnkar gjaldmiðlaáhættu</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-700">Erlend hlutabréf (EUR/USD)</p>
                <p className="text-2xl font-bold text-blue-800">50-60%</p>
                <p className="text-xs text-neutral-500">Dreifing og vöxtur</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-700">Skuldabréf/reiðufé</p>
                <p className="text-2xl font-bold text-slate-800">20-30%</p>
                <p className="text-xs text-neutral-500">Stöðugleiki</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Fyrirvari:</strong> Þetta er almenn leiðsögn og er ekki persónuleg fjármálaráðgjöf.
                Raunveruleg eignadreifing ætti að taka tillit til aldurs, áhættuþols, fjárfestingartíma,
                tekna og persónulegra aðstæðna. Ráðfærðu þig við löggiltan fjármálaráðgjafa áður en þú
                tekur fjárfestingarákvarðanir.
              </p>
            </div>
          </div>

          {/* Hedging Strategies */}
          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <h4 className="font-semibold text-cyan-900 mb-3">Aðferðir til að draga úr gjaldmiðlaáhættu</h4>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl">🏠</div>
                <div>
                  <p className="font-medium text-cyan-900">Íslenskar eignir</p>
                  <p className="text-sm text-neutral-700">
                    Fasteignir og íslensk hlutabréf fylgja ISK - engin gjaldmiðlaáhætta
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl">🌍</div>
                <div>
                  <p className="font-medium text-cyan-900">Erlend dreifing</p>
                  <p className="text-sm text-neutral-700">
                    Ef ISK veikist, hækka erlend hlutabréf í ISK - náttúruleg vörn
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl">💶</div>
                <div>
                  <p className="font-medium text-cyan-900">EUR reikningur</p>
                  <p className="text-sm text-neutral-700">
                    Halda hluta sparnaðar í EUR fyrir ferðalög - læsir gengið
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-cyan-50 rounded-lg">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="font-medium text-cyan-900">Gengistryggðir sjóðir</p>
                  <p className="text-sm text-neutral-700">
                    Sumir sjóðir bjóða gengistryggingu (hedging) - kemur með kostnaði
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FIRE-Specific Tips */}
          <Alert variant="info">
            <div className="space-y-2">
              <p className="font-semibold">Gjaldmiðlaáhætta og FIRE á Íslandi:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>
                  <strong>Lífeyrissjóðir:</strong> Fjárfesta mikið erlendis - þú ert nú þegar
                  með gjaldmiðladreifingu
                </li>
                <li>
                  <strong>Ferðaáætlanir:</strong> Ef þú ætlar að ferðast mikið, íhugaðu að
                  halda meira í EUR
                </li>
                <li>
                  <strong>Veik króna = dýrari innflutningur:</strong> En styrkir útflutning og ferðaþjónustu
                </li>
                <li>
                  <strong>Langtímasjónarmið:</strong> Yfir 20-30 ár jafnast sveiflur oft út
                </li>
              </ul>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default CurrencyRiskEducation;
