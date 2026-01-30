'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { CurrencyInput } from '@/components/ui';
import { Checkbox } from '@/components/ui/Checkbox';
import { useCalculator } from '@/context/CalculatorContext';
import type { LineItem } from '@/types/currentExpenses';

export interface LineItemRowProps {
  categoryId: string;
  lineItem: LineItem;
  lifeEnergyHours: number | null;
}

/**
 * LineItemRow - Editable expense line item
 *
 * Features:
 * - Editable label (inline text input)
 * - Editable amount (CurrencyInput)
 * - Life energy display
 * - Essential checkbox (Nauðsyn)
 * - Delete button
 * - Auto-save on blur
 *
 * Requirements: FR-3.5, FR-3.6, FR-3.7, US-3
 */
export function LineItemRow({
  categoryId,
  lineItem,
  lifeEnergyHours,
}: LineItemRowProps) {
  const { updateCurrentExpenseLineItem, deleteCurrentExpenseLineItem } = useCalculator();

  // Local state for editing
  const [label, setLabel] = useState(lineItem.label);
  const [amount, setAmount] = useState(lineItem.amount);
  const [isEssential, setIsEssential] = useState(lineItem.isEssential);

  // Track if we're editing the label
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    setLabel(lineItem.label);
    setAmount(lineItem.amount);
    setIsEssential(lineItem.isEssential);
  }, [lineItem.label, lineItem.amount, lineItem.isEssential]);

  // Auto-focus label input when editing starts
  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [isEditingLabel]);

  // Save label changes
  const handleLabelBlur = useCallback(() => {
    setIsEditingLabel(false);
    const trimmedLabel = label.trim();

    // Revert if empty
    if (!trimmedLabel) {
      setLabel(lineItem.label);
      return;
    }

    // Save if changed
    if (trimmedLabel !== lineItem.label) {
      updateCurrentExpenseLineItem(categoryId, lineItem.id, {
        label: trimmedLabel,
      });
    }
  }, [label, lineItem.label, lineItem.id, categoryId, updateCurrentExpenseLineItem]);

  // Save label on Enter key
  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        labelInputRef.current?.blur();
      } else if (e.key === 'Escape') {
        setLabel(lineItem.label);
        setIsEditingLabel(false);
      }
    },
    [lineItem.label]
  );

  // Save amount changes
  const handleAmountChange = useCallback(
    (newAmount: number) => {
      setAmount(newAmount);
      updateCurrentExpenseLineItem(categoryId, lineItem.id, {
        amount: newAmount,
      });
    },
    [categoryId, lineItem.id, updateCurrentExpenseLineItem]
  );

  // Save essential changes
  const handleEssentialChange = useCallback(
    (checked: boolean) => {
      setIsEssential(checked);
      updateCurrentExpenseLineItem(categoryId, lineItem.id, {
        isEssential: checked,
      });
    },
    [categoryId, lineItem.id, updateCurrentExpenseLineItem]
  );

  // Delete line item
  const handleDelete = useCallback(() => {
    if (window.confirm(`Ertu viss um að þú viljir eyða "${lineItem.label}"?`)) {
      deleteCurrentExpenseLineItem(categoryId, lineItem.id);
    }
  }, [categoryId, lineItem.id, lineItem.label, deleteCurrentExpenseLineItem]);

  return (
    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="flex items-start gap-3">
        {/* Label - click to edit */}
        <div className="flex-1 min-w-0">
          {isEditingLabel ? (
            <input
              ref={labelInputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
              className="w-full px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={100}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingLabel(true)}
              className="text-left w-full px-2 py-1 text-sm font-medium text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
            >
              {label}
            </button>
          )}

          {/* Life energy display */}
          {lifeEnergyHours !== null && lifeEnergyHours > 0 && (
            <div className="text-xs text-neutral-600 mt-1 px-2">
              {lifeEnergyHours.toFixed(1)} klst lífsorkustundir
            </div>
          )}
        </div>

        {/* Amount input */}
        <div className="w-32">
          <CurrencyInput
            value={amount}
            onChange={handleAmountChange}
            className="text-sm"
          />
        </div>

        {/* Essential checkbox */}
        <div className="flex items-center pt-2">
          <Checkbox
            checked={isEssential}
            onChange={handleEssentialChange}
            label="Nauðsyn"
            className="text-xs"
            id={`essential-${lineItem.id}`}
          />
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={handleDelete}
          className="p-2 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-colors"
          aria-label={`Eyða ${lineItem.label}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
