'use client';

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { BalanceInput } from './BalanceInput';
import { ContributionInput } from './ContributionInput';
import { TargetInput } from './TargetInput';
import { NotesInput } from './NotesInput';
import type { SavingsCategory, SavingsCategoryData } from '@/types/savingsReport';

export interface CategoryAccordionProps {
  /** The savings category to display */
  category: SavingsCategory;
  /** Whether the accordion is expanded */
  isExpanded: boolean;
  /** Callback to toggle expand/collapse */
  onToggle: () => void;
  /** Actual hourly wage for life energy calculations */
  actualHourlyWage: number | null;
  /** Callback when category data changes */
  onChange: (data: Partial<SavingsCategoryData>) => void;
  /** Callback to toggle category visibility */
  onToggleVisibility: () => void;
}

/**
 * CategoryAccordion - Single savings category with expandable details
 *
 * Features:
 * - Accordion header with icon, name, balance total, expand indicator (chevron)
 * - Expandable content with input fields
 * - Balance input with life energy display
 * - Contribution input with life energy display
 * - Optional target input with progress bar
 * - Optional notes textarea
 * - Hide/show category button
 *
 * Requirements: US-1, US-2, US-3, US-4, US-7, Task 3.2
 */
export function CategoryAccordion({
  category,
  isExpanded,
  onToggle,
  actualHourlyWage,
  onChange,
  onToggleVisibility,
}: CategoryAccordionProps) {
  const { data, isHidden } = category;
  const hasData = data.balance > 0 || data.monthlyContribution > 0;

  // Calculate total display (balance + contribution indicator)
  const displayTotal = data.balance;
  const hasContribution = data.monthlyContribution > 0;

  return (
    <div
      className={cn(
        'bg-white rounded-lg border transition-all duration-200',
        isExpanded
          ? 'border-primary-300 shadow-sm'
          : 'border-neutral-200 hover:border-neutral-300',
        isHidden && 'opacity-60'
      )}
    >
      {/* Accordion header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-50 rounded-t-lg transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`category-${category.id}-content`}
        aria-label={`${category.name} - ${isExpanded ? 'Loka' : 'Opna'}`}
      >
        {/* Left side: Icon and name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">
            {category.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-neutral-900 truncate">
              {category.name}
            </h4>
            {!isExpanded && hasData && (
              <p className="text-xs text-neutral-600 mt-0.5 truncate">
                {formatCurrency(data.balance)}
                {hasContribution && ` • ${formatCurrency(data.monthlyContribution)}/mán`}
              </p>
            )}
            {!isExpanded && !hasData && (
              <p className="text-xs text-neutral-500 mt-0.5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Total and expand indicator */}
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          {/* Balance total */}
          {hasData && (
            <div className="text-right">
              <div className="font-semibold text-neutral-900 text-sm">
                {formatCurrency(displayTotal)}
              </div>
              {hasContribution && (
                <div className="text-xs text-primary-600">
                  +{formatCurrency(data.monthlyContribution)}/mán
                </div>
              )}
            </div>
          )}

          {/* Expand/collapse chevron */}
          <svg
            className={cn(
              'w-5 h-5 text-neutral-400 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div
          id={`category-${category.id}-content`}
          className="px-4 py-4 border-t border-neutral-200 space-y-6"
        >
          {/* Category description */}
          <p className="text-sm text-neutral-600 -mt-2">
            {category.description}
          </p>

          {/* Balance input */}
          <BalanceInput
            value={data.balance}
            onChange={(balance) => onChange({ balance })}
            actualHourlyWage={actualHourlyWage}
            categoryId={category.id}
          />

          {/* Contribution input */}
          <ContributionInput
            value={data.monthlyContribution}
            onChange={(monthlyContribution) => onChange({ monthlyContribution })}
            actualHourlyWage={actualHourlyWage}
            categoryId={category.id}
          />

          {/* Target input */}
          <TargetInput
            currentBalance={data.balance}
            value={data.targetAmount}
            onChange={(targetAmount) => onChange({ targetAmount })}
            actualHourlyWage={actualHourlyWage}
            categoryId={category.id}
          />

          {/* Notes input */}
          <NotesInput
            value={data.notes}
            onChange={(notes) => onChange({ notes })}
            categoryId={category.id}
          />

          {/* Hide/show category button */}
          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
              }}
            >
              {isHidden ? (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Sýna flokk
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  Fela flokk
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
