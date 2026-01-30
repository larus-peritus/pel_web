'use client';

import React, { useState, useCallback } from 'react';
import { Button, CurrencyInput, Card, Alert } from '@/components/ui';
import { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { useCalculator } from '@/context/CalculatorContext';
import { TIER_LABELS } from '@/lib/constants/expenseBaseline';
import type { TierValues } from '@/types/expenseBaseline';

export interface AddCustomCategoryModalProps {
  onClose: () => void;
}

// Common emoji icons for quick selection
const PRESET_ICONS = [
  '🏠', '🍽️', '🚗', '🏥', '🛡️', '💡', '👤', '🎬', '💰', '📦',
  '🎓', '✈️', '🎮', '📱', '🏋️', '🐕', '🎨', '📚', '🚀', '☕',
];

/**
 * Add Custom Category Modal Component
 *
 * Modal for adding a new custom expense category.
 *
 * Features:
 * - Category name input
 * - Icon picker (emoji selector or text input)
 * - Three tier value inputs
 * - Validation (name required, values >= 0)
 * - Save/Cancel buttons
 *
 * Requirements: FR-1.2, US-5
 */
export function AddCustomCategoryModal({ onClose }: AddCustomCategoryModalProps) {
  const { addCustomCategory } = useCalculator();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [values, setValues] = useState<TierValues>({
    barebones: 0,
    comfortable: 0,
    deluxe: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Validate inputs
  const validate = useCallback((): boolean => {
    // Name required
    if (!name.trim()) {
      setError('Nafn flokks er nauðsynlegt');
      return false;
    }

    // Values must be >= 0
    if (
      values.barebones < 0 ||
      values.comfortable < 0 ||
      values.deluxe < 0
    ) {
      setError('Útgjöld geta ekki verið neikvæð');
      return false;
    }

    setError(null);
    return true;
  }, [name, values]);

  // Handle save
  const handleSave = useCallback(() => {
    if (!validate()) return;

    addCustomCategory(name.trim(), icon, values);
    onClose();
  }, [validate, addCustomCategory, name, icon, values, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-category-title"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <h3 id="add-category-title" className="text-xl font-semibold text-neutral-900">
            Bæta við sérsniðnum flokki
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Búðu til nýjan útgjaldaflokk með þínum eigin gildum
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          {/* Name Input */}
          <div>
            <label
              htmlFor="category-name"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Nafn flokks <span className="text-danger-500">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.d. Gæludýr, Áhugamál, Gjafir"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              maxLength={50}
              required
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tákn (emoji)
            </label>

            {/* Preset Icons */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    icon === emoji
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                  aria-label={`Velja ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Custom Icon Input */}
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="eða skrifaðu þitt eigið emoji"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              maxLength={2}
            />
          </div>

          {/* Tier Values */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-4">
              Útgjöld fyrir hverja þrep
            </h4>

            <div className="space-y-4">
              {/* Barebones */}
              <CurrencyInput
                label={TIER_LABELS.barebones}
                value={values.barebones}
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, barebones: val }))
                }
                placeholder="0"
                helpText="Lágmarksþörf til að lifa af"
              />

              {/* Comfortable */}
              <CurrencyInput
                label={TIER_LABELS.comfortable}
                value={values.comfortable}
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, comfortable: val }))
                }
                placeholder="0"
                helpText="Þægileg lífsgæði"
              />

              {/* Deluxe */}
              <CurrencyInput
                label={TIER_LABELS.deluxe}
                value={values.deluxe}
                onChange={(val) =>
                  setValues((prev) => ({ ...prev, deluxe: val }))
                }
                placeholder="0"
                helpText="Kjöraðstæður án áhyggjum"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Hætta við
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Vista flokk
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
