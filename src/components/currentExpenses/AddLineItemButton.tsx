'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, CurrencyInput } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useCalculator } from '@/context/CalculatorContext';
import { DEFAULT_CURRENT_EXPENSE_CATEGORIES, isItemEssential } from '@/lib/constants/currentExpenses';

export interface AddLineItemButtonProps {
  categoryId: string;
}

/**
 * AddLineItemButton - Inline form for adding new line items
 *
 * Features:
 * - Toggle between button and form views
 * - Label and amount inputs
 * - Recurring checkbox
 * - Suggested line items (quick add buttons)
 * - Auto-focus on label input
 * - Form validation
 * - Cancel button
 *
 * Requirements: FR-3.8, US-3
 */
export function AddLineItemButton({ categoryId }: AddLineItemButtonProps) {
  const { addCurrentExpenseLineItem, currentExpenses } = useCalculator();

  // Form state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [isEssential, setIsEssential] = useState(true); // Default to essential
  const [error, setError] = useState<string | null>(null);

  // Refs
  const labelInputRef = useRef<HTMLInputElement>(null);

  // Get suggested line items for this category
  const categoryConfig = DEFAULT_CURRENT_EXPENSE_CATEGORIES.find(
    (cat) => cat.id === categoryId
  );
  const suggestedLineItems = categoryConfig?.suggestedLineItems || [];

  // Get already used labels to filter suggestions
  const usedLabels = currentExpenses?.categories
    .find((cat) => cat.id === categoryId)
    ?.lineItems.map((item) => item.label) || [];

  // Filter out already used suggestions
  const availableSuggestions = suggestedLineItems.filter(
    (suggestion) => !usedLabels.includes(suggestion)
  );

  // Auto-focus label input when form becomes visible
  useEffect(() => {
    if (isFormVisible && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isFormVisible]);

  // Show form
  const showForm = useCallback(() => {
    setIsFormVisible(true);
    setError(null);
  }, []);

  // Hide form
  const hideForm = useCallback(() => {
    setIsFormVisible(false);
    setLabel('');
    setAmount(0);
    setIsEssential(true); // Reset to default essential
    setError(null);
  }, []);

  // Validate form
  const validate = useCallback((): boolean => {
    if (!label.trim()) {
      setError('Lýsing er nauðsynleg');
      return false;
    }

    if (amount < 0) {
      setError('Upphæð getur ekki verið neikvæð');
      return false;
    }

    setError(null);
    return true;
  }, [label, amount]);

  // Add line item
  const handleAdd = useCallback(() => {
    if (!validate()) return;

    const trimmedLabel = label.trim();
    addCurrentExpenseLineItem(categoryId, {
      label: trimmedLabel,
      amount,
      isRecurring: true, // Always recurring for expense tracking
      isEssential, // Use user's selection
      notes: undefined,
    });

    hideForm();
  }, [validate, addCurrentExpenseLineItem, categoryId, label, amount, isEssential, hideForm]);

  // Quick add from suggestion
  const handleQuickAdd = useCallback(
    (suggestion: string) => {
      addCurrentExpenseLineItem(categoryId, {
        label: suggestion,
        amount: 0,
        isRecurring: false,
        isEssential: isItemEssential(categoryId, suggestion),
        notes: undefined,
      });
    },
    [addCurrentExpenseLineItem, categoryId]
  );

  // Handle Enter key in label input
  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      } else if (e.key === 'Escape') {
        hideForm();
      }
    },
    [handleAdd, hideForm]
  );

  if (!isFormVisible) {
    return (
      <div className="space-y-3">
        {/* Add button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={showForm}
          className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50"
        >
          + Bæta við útgjaldaliðum
        </Button>

        {/* Suggested line items (quick add) */}
        {availableSuggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-neutral-600 font-medium">Algeng útgjöld:</p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleQuickAdd(suggestion)}
                  className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-primary-300 p-3 space-y-3">
      <h5 className="text-sm font-semibold text-neutral-900">
        Bæta við nýjum útgjaldaliðum
      </h5>

      {/* Error message */}
      {error && (
        <div className="text-sm text-danger-600 bg-danger-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Label input */}
      <Input
        ref={labelInputRef}
        label="Lýsing"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyDown={handleLabelKeyDown}
        placeholder="t.d. Bónus, Netflix, Eldsneyti"
        required
        error={error && !label.trim() ? error : undefined}
      />

      {/* Amount input */}
      <CurrencyInput
        label="Mánaðarleg upphæð"
        value={amount}
        onChange={setAmount}
        placeholder="0"
      />

      {/* Essential checkbox */}
      <Checkbox
        label="Nauðsynlegur kostnaður"
        checked={isEssential}
        onChange={setIsEssential}
        helpText="Merktu við ef þetta er nauðsynlegur kostnaður (húsnæði, matur, heilsa)"
      />

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          className="flex-1"
        >
          Bæta við
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={hideForm}
          className="flex-1"
        >
          Hætta við
        </Button>
      </div>
    </div>
  );
}
