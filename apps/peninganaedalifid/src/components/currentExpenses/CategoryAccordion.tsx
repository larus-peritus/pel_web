'use client';

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { LineItemRow } from './LineItemRow';
import { AddLineItemButton } from './AddLineItemButton';
import type { ExpenseCategory } from '@/types/currentExpenses';

export interface CategoryAccordionProps {
  category: ExpenseCategory;
  isExpanded: boolean;
  onToggle: () => void;
  total: number;
  percentage: number;
  lifeEnergyHours: number | null;
}

/**
 * CategoryAccordion - Expandable category with line items
 *
 * Features:
 * - Category header with icon, name, total, percentage, life energy
 * - Expand/collapse animation
 * - List of line items when expanded
 * - Add new line item button
 * - ARIA accessibility
 *
 * Requirements: FR-3.3, FR-3.4, US-3
 */
export function CategoryAccordion({
  category,
  isExpanded,
  onToggle,
  total,
  percentage,
  lifeEnergyHours,
}: CategoryAccordionProps) {
  const hasLineItems = category.lineItems.length > 0;

  return (
    <div
      className={cn(
        'bg-white rounded-lg border transition-all duration-200',
        isExpanded
          ? 'border-primary-300 shadow-sm'
          : 'border-neutral-200 hover:border-neutral-300'
      )}
    >
      {/* Category header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-50 rounded-lg transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`category-${category.id}-content`}
      >
        {/* Left side: Icon and name */}
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl" aria-hidden="true">
            {category.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-neutral-900 truncate">
              {category.name}
            </h4>
            {hasLineItems && (
              <p className="text-sm text-neutral-600 mt-0.5">
                {category.lineItems.length} {category.lineItems.length === 1 ? 'liður' : 'liðir'}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Total, percentage, life energy */}
        <div className="flex items-center gap-4 ml-4">
          {/* Total amount */}
          <div className="text-right">
            <div className="font-semibold text-neutral-900">
              {formatCurrency(total)}
            </div>
            {percentage > 0 && (
              <div className="text-sm text-neutral-600">
                {percentage.toFixed(1)}%
              </div>
            )}
          </div>

          {/* Life energy */}
          {lifeEnergyHours !== null && lifeEnergyHours > 0 && (
            <div className="text-sm text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded">
              {lifeEnergyHours.toFixed(1)} klst
            </div>
          )}

          {/* Expand/collapse icon */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Category content - line items */}
      {isExpanded && (
        <div
          id={`category-${category.id}-content`}
          className="border-t border-neutral-200 px-4 py-3 space-y-2"
          role="region"
          aria-label={`${category.name} útgjöld`}
        >
          {/* Line items */}
          {hasLineItems ? (
            <div className="space-y-2">
              {category.lineItems.map((lineItem) => (
                <LineItemRow
                  key={lineItem.id}
                  categoryId={category.id}
                  lineItem={lineItem}
                  lifeEnergyHours={
                    lifeEnergyHours !== null
                      ? (lineItem.amount / total) * lifeEnergyHours
                      : null
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 italic py-2">
              Engir liðir í þessum flokki. Bættu við nýjum lið hér að neðan.
            </p>
          )}

          {/* Add new line item button */}
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <AddLineItemButton categoryId={category.id} />
          </div>
        </div>
      )}
    </div>
  );
}
