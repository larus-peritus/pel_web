'use client';

/**
 * Monthly Breakdown Component
 * Displays detailed month-by-month breakdown for selected scenario
 *
 * Task 5.3: Create Monthly Breakdown Table
 */

import { useState, useMemo } from 'react';
import type { SnowballResults, MonthlyRow } from '@/types/snowball';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface MonthlyBreakdownProps {
  results: SnowballResults;
  actualHourlyWage?: number;
}

type ScenarioKey = 'base' | 'snowballLoan' | 'snowballInvest';

interface ScenarioOption {
  value: ScenarioKey;
  label: string;
}

const SCENARIO_OPTIONS: ScenarioOption[] = [
  { value: 'base', label: 'Grunnur (aukagreiðsla eingöngu)' },
  { value: 'snowballLoan', label: 'Snjóbolti → Lán' },
  { value: 'snowballInvest', label: 'Snjóbolti → Fjárfesting' },
];

interface TableRow {
  month: number;
  openingBalance: number;
  payment: number;
  interest: number;
  principal: number;
  closingBalance: number;
  investmentBalance?: number;
  interestSavings?: number;
  extraFromSavings?: number;
}

export function MonthlyBreakdown({ results, actualHourlyWage }: MonthlyBreakdownProps) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('base');
  const [showAll, setShowAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Transform monthly schedule data based on selected scenario
  const tableData = useMemo<TableRow[]>(() => {
    return results.monthlySchedule.map((row: MonthlyRow) => {
      if (selectedScenario === 'base') {
        return {
          month: row.month,
          openingBalance: row.baseOpeningBalance,
          payment: row.basePayment,
          interest: row.baseInterest,
          principal: row.basePrincipal,
          closingBalance: row.baseClosingBalance,
          interestSavings: 0, // Base case has no savings
        };
      } else if (selectedScenario === 'snowballLoan') {
        return {
          month: row.month,
          openingBalance: row.snowballLoanOpeningBalance,
          payment: row.snowballLoanPayment,
          interest: row.snowballLoanInterest,
          principal: row.snowballLoanPrincipal,
          closingBalance: row.snowballLoanClosingBalance,
          interestSavings: row.interestSavingsThisMonth,
          extraFromSavings: row.snowballLoanExtraFromSavings,
        };
      } else {
        // snowballInvest
        return {
          month: row.month,
          openingBalance: row.snowballInvestOpeningBalance,
          payment: row.snowballInvestPayment,
          interest: row.snowballInvestInterest,
          principal: row.snowballInvestPrincipal,
          closingBalance: row.snowballInvestClosingBalance,
          investmentBalance: row.snowballInvestmentBalance,
          interestSavings: row.interestSavingsThisMonth,
        };
      }
    });
  }, [results.monthlySchedule, selectedScenario]);

  // Calculate totals
  const totals = useMemo(() => {
    return tableData.reduce(
      (acc, row) => ({
        payment: acc.payment + row.payment,
        interest: acc.interest + row.interest,
        principal: acc.principal + row.principal,
        interestSavings: acc.interestSavings + (row.interestSavings || 0),
      }),
      { payment: 0, interest: 0, principal: 0, interestSavings: 0 }
    );
  }, [tableData]);

  // Show first 12 months or all
  const displayedRows = showAll ? tableData : tableData.slice(0, 12);

  if (tableData.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold">Mánaðarleg sundurliðun</h3>
            <p className="text-sm text-gray-600">
              Nákvæmar upplýsingar um hverja greiðslu ({tableData.length} mánuðir)
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Fela' : 'Sýna'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {/* Scenario Selector */}
          <div className="mb-4">
            <Select
              label="Veldu atburðarás"
              value={selectedScenario}
              onChange={(value) => setSelectedScenario(value as ScenarioKey)}
              options={SCENARIO_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
            />
          </div>

          {/* Summary Row */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Heildargreiðslur</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totals.payment)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Vextir samtals</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totals.interest)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Höfuðstóll</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totals.principal)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 uppercase tracking-wide">Vaxtasparnaður</div>
                <div className="text-lg font-bold text-blue-900">{formatCurrency(totals.interestSavings)}</div>
              </div>
            </div>

            {/* Life energy totals if wage available */}
            {actualHourlyWage && actualHourlyWage > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-center">
                  <div className="text-xs text-purple-600 uppercase tracking-wide">Lífsorka (vextir)</div>
                  <div className="text-lg font-bold text-purple-900">
                    {formatNumber(totals.interest / actualHourlyWage, 1)} klst
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 px-2 font-medium text-gray-700">Mán.</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Opnunarstaða</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Greiðsla</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Vextir</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Höfuðstóll</th>
                  <th className="py-2 px-2 font-medium text-gray-700 text-right">Lokastaða</th>
                  {selectedScenario !== 'base' && (
                    <th className="py-2 px-2 font-medium text-gray-700 text-right">Sparnaður</th>
                  )}
                  {selectedScenario === 'snowballLoan' && (
                    <th className="py-2 px-2 font-medium text-gray-700 text-right">Auka frá sparnaði</th>
                  )}
                  {selectedScenario === 'snowballInvest' && (
                    <th className="py-2 px-2 font-medium text-gray-700 text-right">Fjárfesting</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedRows.map((row) => (
                  <tr
                    key={row.month}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2 text-gray-900 font-medium">{row.month}</td>
                    <td className="py-2 px-2 text-right text-gray-600">
                      {formatCurrency(row.openingBalance)}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-900 font-medium">
                      {formatCurrency(row.payment)}
                    </td>
                    <td className="py-2 px-2 text-right text-red-600">
                      {formatCurrency(row.interest)}
                    </td>
                    <td className="py-2 px-2 text-right text-green-600">
                      {formatCurrency(row.principal)}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-600">
                      {formatCurrency(row.closingBalance)}
                    </td>
                    {selectedScenario !== 'base' && (
                      <td className="py-2 px-2 text-right text-purple-600">
                        {formatCurrency(row.interestSavings || 0)}
                      </td>
                    )}
                    {selectedScenario === 'snowballLoan' && (
                      <td className="py-2 px-2 text-right text-blue-600">
                        {formatCurrency(row.extraFromSavings || 0)}
                      </td>
                    )}
                    {selectedScenario === 'snowballInvest' && (
                      <td className="py-2 px-2 text-right text-green-600">
                        {formatCurrency(row.investmentBalance || 0)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show more/less toggle */}
          {tableData.length > 12 && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll
                  ? 'Sýna fyrstu 12 mánuði'
                  : `Sýna alla ${tableData.length} mánuði`}
              </Button>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-100 rounded"></span>
                <span>Vextir (greiðslur til banka)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-100 rounded"></span>
                <span>Höfuðstóll (lækkar skuldina)</span>
              </div>
              {selectedScenario !== 'base' && (
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-purple-100 rounded"></span>
                  <span>Vaxtasparnaður (snjóboltaáhrif)</span>
                </div>
              )}
              {selectedScenario === 'snowballLoan' && (
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-100 rounded"></span>
                  <span>Auka úr sparnaði (bætt við greiðslu)</span>
                </div>
              )}
              {selectedScenario === 'snowballInvest' && (
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-100 rounded"></span>
                  <span>Fjárfesting staða (sparnaður ávaxtast)</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
