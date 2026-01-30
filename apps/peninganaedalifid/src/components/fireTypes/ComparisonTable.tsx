'use client';

/**
 * Comparison Table Component (Desktop)
 *
 * Side-by-side comparison of all FIRE types in a sortable table format.
 * Features:
 * - Sortable columns (click header to sort)
 * - Color-coded rows per FIRE type
 * - Effort level visual indicators
 * - Clickable rows for selection
 * - Sticky header on scroll
 * - Accessible table markup
 *
 * Task 4.1: Create ComparisonTable Component (Desktop)
 * Epic 4: Comparison Table
 * FIRE Type Explorer Feature
 */

import { useState, useMemo } from 'react';
import type { FIRECalculation, FIRETypeId } from '@/types/fireTypes';
import { FIRE_TYPE_DEFINITIONS, getFIRETypeColors } from '@/lib/constants/fireTypes';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

export interface ComparisonTableProps {
  calculations: {
    leanfire: FIRECalculation;
    regularfire: FIRECalculation;
    coastfire: FIRECalculation;
    baristafire: FIRECalculation;
    fatfire: FIRECalculation;
  };
  selectedType: FIRETypeId | null;
  onSelectType: (typeId: FIRETypeId) => void;
}

type SortColumn = 'name' | 'nestEgg' | 'expenses' | 'savingsRate' | 'years' | 'effort';
type SortDirection = 'asc' | 'desc';

interface TableRow {
  typeId: FIRETypeId;
  name: string;
  icon: string;
  nestEgg: number;
  expenses: number;
  savingsRate: number | null;
  years: number | null;
  effort: number; // Numeric for sorting (0-3)
  effortLabel: string;
  colorScheme: ReturnType<typeof getFIRETypeColors>;
}

/**
 * Convert effort level to numeric value for sorting
 */
function effortToNumber(effort: string): number {
  switch (effort) {
    case 'low': return 0;
    case 'moderate': return 1;
    case 'high': return 2;
    case 'extreme': return 3;
    default: return 1;
  }
}

/**
 * Get Icelandic effort label
 */
function getEffortLabel(effort: string): string {
  switch (effort) {
    case 'low': return 'Lítil';
    case 'moderate': return 'Hófleg';
    case 'high': return 'Mikil';
    case 'extreme': return 'Öfgafull';
    default: return 'Hófleg';
  }
}

/**
 * Effort indicator dots (visual representation)
 */
function EffortIndicator({ level }: { level: number }) {
  const dots = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Erfiðleikastig ${level} af 4`}>
      {dots.map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i <= level
              ? level === 0 ? 'bg-green-500'
              : level === 1 ? 'bg-yellow-500'
              : level === 2 ? 'bg-orange-500'
              : 'bg-red-500'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export function ComparisonTable({
  calculations,
  selectedType,
  onSelectType,
}: ComparisonTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('years');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Prepare table data
  const tableData: TableRow[] = useMemo(() => {
    return Object.entries(calculations).map(([typeId, calc]) => {
      const definition = FIRE_TYPE_DEFINITIONS.find(d => d.id === typeId);
      const colorScheme = getFIRETypeColors(typeId as FIRETypeId);

      // Calculate savings rate if possible
      const savingsRate = calc.yearsToFI !== null && calc.yearsToFI > 0
        ? (calc.amountRemaining / (calc.yearsToFI * 12)) / calc.monthlyExpenses * 100
        : null;

      return {
        typeId: typeId as FIRETypeId,
        name: definition?.nameIs || typeId,
        icon: definition?.icon || '',
        nestEgg: calc.fiNumber,
        expenses: calc.monthlyExpenses,
        savingsRate,
        years: calc.yearsToFI,
        effort: effortToNumber(calc.effortLevel),
        effortLabel: getEffortLabel(calc.effortLevel),
        colorScheme,
      };
    });
  }, [calculations]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...tableData].sort((a, b) => {
      let aVal: number | string | null;
      let bVal: number | string | null;

      switch (sortColumn) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'nestEgg':
          aVal = a.nestEgg;
          bVal = b.nestEgg;
          break;
        case 'expenses':
          aVal = a.expenses;
          bVal = b.expenses;
          break;
        case 'savingsRate':
          aVal = a.savingsRate ?? Infinity;
          bVal = b.savingsRate ?? Infinity;
          break;
        case 'years':
          aVal = a.years ?? Infinity;
          bVal = b.years ?? Infinity;
          break;
        case 'effort':
          aVal = a.effort;
          bVal = b.effort;
          break;
        default:
          aVal = a.years ?? Infinity;
          bVal = b.years ?? Infinity;
      }

      // String comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal, 'is')
          : bVal.localeCompare(aVal, 'is');
      }

      // Numeric comparison
      const aNum = aVal as number;
      const bNum = bVal as number;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return sorted;
  }, [tableData, sortColumn, sortDirection]);

  // Handle column header click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort indicator
  const SortIndicator = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null;
    return (
      <span className="ml-1" aria-label={sortDirection === 'asc' ? 'Raðað hækkandi' : 'Raðað lækkandi'}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        {/* Sticky header */}
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            <th
              scope="col"
              className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('name')}
            >
              FIRE tegund
              <SortIndicator column="name" />
            </th>
            <th
              scope="col"
              className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('nestEgg')}
            >
              Nest Egg
              <SortIndicator column="nestEgg" />
            </th>
            <th
              scope="col"
              className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('expenses')}
            >
              Útgjöld/mán
              <SortIndicator column="expenses" />
            </th>
            <th
              scope="col"
              className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('savingsRate')}
            >
              Sparnaðarhlutfall
              <SortIndicator column="savingsRate" />
            </th>
            <th
              scope="col"
              className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('years')}
            >
              Ár til FIRE
              <SortIndicator column="years" />
            </th>
            <th
              scope="col"
              className="text-center py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('effort')}
            >
              Erfiðleiki
              <SortIndicator column="effort" />
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row) => {
            const isSelected = selectedType === row.typeId;

            return (
              <tr
                key={row.typeId}
                onClick={() => onSelectType(row.typeId)}
                className={`
                  border-b border-gray-100 cursor-pointer transition-colors
                  hover:bg-gray-50
                  ${isSelected ? 'bg-primary-50 hover:bg-primary-100' : ''}
                `}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectType(row.typeId);
                  }
                }}
                aria-pressed={isSelected}
              >
                {/* Name + Icon */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-hidden="true">
                      {row.icon}
                    </span>
                    <span className={`font-medium ${row.colorScheme.text}`}>
                      {row.name}
                    </span>
                    {isSelected && (
                      <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                        Valið
                      </span>
                    )}
                  </div>
                </td>

                {/* Nest Egg */}
                <td className="text-right py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(row.nestEgg)}
                </td>

                {/* Monthly Expenses */}
                <td className="text-right py-3 px-4 text-gray-700">
                  {formatCurrency(row.expenses)}
                </td>

                {/* Savings Rate */}
                <td className="text-right py-3 px-4 text-gray-700">
                  {row.savingsRate !== null
                    ? `${formatNumber(row.savingsRate, 1)}%`
                    : '—'}
                </td>

                {/* Years to FI */}
                <td className="text-right py-3 px-4 font-medium text-gray-900">
                  {row.years !== null
                    ? `${formatNumber(row.years, 1)} ár`
                    : 'Ekki mögulegt'}
                </td>

                {/* Effort Level */}
                <td className="py-3 px-4">
                  <div className="flex flex-col items-center gap-1">
                    <EffortIndicator level={row.effort} />
                    <span className="text-xs text-gray-600">
                      {row.effortLabel}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Accessibility hint */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedType && `${FIRE_TYPE_DEFINITIONS.find(d => d.id === selectedType)?.nameIs} valið`}
      </div>
    </div>
  );
}
