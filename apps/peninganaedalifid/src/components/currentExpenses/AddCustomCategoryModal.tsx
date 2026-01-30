'use client';

import React, { useState, useCallback } from 'react';
import { Button, Alert, Card, CardHeader, CardContent, CardFooter } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { useCalculator } from '@/context/CalculatorContext';

export interface AddCustomCategoryModalProps {
  onClose: () => void;
}

// Common emoji icons for quick selection
const PRESET_ICONS = [
  '🏠', '🍽️', '🚗', '🏥', '🛡️', '💡', '👤', '🎬', '💰', '📦',
  '🎓', '✈️', '🎮', '📱', '🏋️', '🐕', '🎨', '📚', '🚀', '☕',
  '🛒', '👕', '💻', '🏃', '🎵', '🌳', '🐱', '🚲', '🏖️', '🍺',
];

/**
 * AddCustomCategoryModal - Modal for adding custom expense category
 *
 * Features:
 * - Modal dialog overlay
 * - Category name input
 * - Icon picker (emoji selector with presets)
 * - Custom icon text input
 * - Validation
 * - Save/Cancel buttons
 * - Keyboard navigation (Escape to close)
 * - Click outside to close
 *
 * Requirements: FR-3.9, US-5
 */
export function AddCustomCategoryModal({ onClose }: AddCustomCategoryModalProps) {
  const { addCurrentExpenseCategory, currentExpenses } = useCalculator();

  // Form state
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [error, setError] = useState<string | null>(null);

  // Get next order number
  const nextOrder = currentExpenses
    ? Math.max(...currentExpenses.categories.map((c) => c.order)) + 1
    : 0;

  // Validate form
  const validate = useCallback((): boolean => {
    // Name required
    if (!name.trim()) {
      setError('Nafn flokks er nauðsynlegt');
      return false;
    }

    // Check for duplicate name
    const isDuplicate = currentExpenses?.categories.some(
      (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError('Flokkur með þessu nafni er þegar til');
      return false;
    }

    setError(null);
    return true;
  }, [name, currentExpenses]);

  // Handle save
  const handleSave = useCallback(() => {
    if (!validate()) return;

    addCurrentExpenseCategory({
      name: name.trim(),
      icon,
      isCustom: true,
      isHidden: false,
      order: nextOrder,
    });

    onClose();
  }, [validate, addCurrentExpenseCategory, name, icon, nextOrder, onClose]);

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
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <h3 id="add-category-title" className="text-xl font-semibold text-neutral-900">
            Bæta við sérsniðnum flokki
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            Búðu til nýjan útgjaldaflokk fyrir útgjöld sem passa ekki í aðra flokka
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
          <Input
            label="Nafn flokks"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.d. Gæludýr, Áhugamál, Gjafir"
            required
            maxLength={50}
            error={error && !name.trim() ? error : undefined}
            helpText="Stuttur og lýsandi titill fyrir flokkinn"
          />

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
                  aria-pressed={icon === emoji}
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
              aria-label="Sérsniðið emoji"
            />
            <p className="text-xs text-neutral-600 mt-1">
              Veldu emoji úr valmyndinni eða skrifaðu þitt eigið
            </p>
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
