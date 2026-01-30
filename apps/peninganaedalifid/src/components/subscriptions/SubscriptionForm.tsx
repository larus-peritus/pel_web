'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import {
  SUBSCRIPTION_CATEGORY_LABELS,
  COMMON_SUBSCRIPTIONS,
} from '@/lib/calculations/subscriptions';
import type { Subscription, SubscriptionCategory } from '@/types/calculator';

// Special value for custom subscription option
const CUSTOM_SUBSCRIPTION_VALUE = 'custom';

/**
 * Props for SubscriptionForm component
 */
export interface SubscriptionFormProps {
  mode: 'add' | 'edit';
  subscription?: Subscription; // Required for edit mode
  onSave: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
}

/**
 * Validation error messages (all in Icelandic)
 */
const VALIDATION_MESSAGES = {
  nameRequired: 'Nafn má ekki vera tómt',
  nameMaxLength: 'Nafn má ekki vera lengra en 100 stafir',
  costRequired: 'Kostnaður verður að vera hærri en 0 kr',
  costMustBeNumber: 'Kostnaður verður að vera tala',
} as const;

/**
 * SubscriptionForm - Form for adding or editing subscriptions
 *
 * Features:
 * - Add or edit mode
 * - Validates name (required, max 100 chars) and cost (> 0)
 * - Category selection with Icelandic labels
 * - Quick presets for common Icelandic subscriptions
 * - Fully accessible with ARIA labels
 * - All text in Icelandic
 *
 * @example
 * ```tsx
 * // Add mode
 * <SubscriptionForm
 *   mode="add"
 *   onSave={(subscription) => handleSave(subscription)}
 *   onCancel={() => setShowForm(false)}
 * />
 *
 * // Edit mode
 * <SubscriptionForm
 *   mode="edit"
 *   subscription={existingSubscription}
 *   onSave={(subscription) => handleUpdate(subscription)}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export function SubscriptionForm({
  mode,
  subscription,
  onSave,
  onCancel,
}: SubscriptionFormProps) {
  // Form state
  const [name, setName] = useState(subscription?.name || '');
  const [monthlyCost, setMonthlyCost] = useState(
    subscription?.monthlyCost?.toString() || ''
  );
  const [category, setCategory] = useState<SubscriptionCategory>(
    subscription?.category || 'other'
  );
  const [quickSelect, setQuickSelect] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    monthlyCost?: string;
  }>({});

  // Category options for select dropdown
  const categoryOptions: SelectOption[] = Object.entries(
    SUBSCRIPTION_CATEGORY_LABELS
  ).map(([value, label]) => ({
    value,
    label,
  }));

  // Quick preset options (common subscriptions + custom option)
  const presetOptions: SelectOption[] = [
    { value: '', label: '-- Veldu áskrift --' },
    { value: CUSTOM_SUBSCRIPTION_VALUE, label: '✏️ Sérsniðin áskrift (sláðu inn sjálf/ur)' },
    ...COMMON_SUBSCRIPTIONS.map((sub, index) => ({
      value: index.toString(),
      label: `${sub.name} (${sub.monthlyCost.toLocaleString('is-IS')} kr)`,
    })),
  ];

  /**
   * Handle quick preset selection
   */
  const handleQuickSelect = useCallback((value: string) => {
    setQuickSelect(value);

    if (value === '') {
      return; // Placeholder selected, do nothing
    }

    if (value === CUSTOM_SUBSCRIPTION_VALUE) {
      // Clear fields for custom entry
      setName('');
      setMonthlyCost('');
      setCategory('other');
      setErrors({});
      return;
    }

    const index = parseInt(value, 10);
    const preset = COMMON_SUBSCRIPTIONS[index];

    if (preset) {
      setName(preset.name);
      setMonthlyCost(preset.monthlyCost.toString());
      setCategory(preset.category);
      // Clear any validation errors when preset is selected
      setErrors({});
    }
  }, []);

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: { name?: string; monthlyCost?: string } = {};

    // Validate name
    const trimmedName = name.trim();
    if (trimmedName === '') {
      newErrors.name = VALIDATION_MESSAGES.nameRequired;
    } else if (trimmedName.length > 100) {
      newErrors.name = VALIDATION_MESSAGES.nameMaxLength;
    }

    // Validate cost
    const costNumber = parseFloat(monthlyCost);
    if (monthlyCost === '' || isNaN(costNumber)) {
      newErrors.monthlyCost = VALIDATION_MESSAGES.costMustBeNumber;
    } else if (costNumber <= 0) {
      newErrors.monthlyCost = VALIDATION_MESSAGES.costRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, monthlyCost]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const subscriptionData: Omit<Subscription, 'id'> = {
        name: name.trim(),
        monthlyCost: parseFloat(monthlyCost),
        category,
        isActive: subscription?.isActive ?? true, // Default to active for new subscriptions
      };

      onSave(subscriptionData);
    },
    [validateForm, name, monthlyCost, category, subscription?.isActive, onSave]
  );

  /**
   * Handle cancel button
   */
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">
          {mode === 'add' ? 'Bæta við áskrift' : 'Breyta áskrift'}
        </h3>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Quick preset selector - only shown in add mode */}
          {mode === 'add' && (
            <div className="space-y-1">
              <Select
                label="Flýtival"
                options={presetOptions}
                value={quickSelect}
                onChange={handleQuickSelect}
                placeholder="-- Veldu áskrift --"
              />
              <p className="text-xs text-neutral-500">
                Veldu úr lista eða sláðu inn sérsniðna áskrift hér að neðan
              </p>
            </div>
          )}

          {/* Name field */}
          <Input
            label="Nafn áskriftar"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="t.d. Netflix, Spotify..."
            required
            maxLength={100}
          />

          {/* Monthly cost field */}
          <Input
            label="Mánaðarkostnaður"
            type="number"
            inputMode="decimal"
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(e.target.value)}
            error={errors.monthlyCost}
            placeholder="0"
            required
            min="0"
            step="1"
          />

          {/* Category selector */}
          <Select
            label="Flokkur"
            options={categoryOptions}
            value={category}
            onChange={(value) => setCategory(value as SubscriptionCategory)}
            required
          />
        </CardContent>

        <CardFooter className="justify-end">
          <Button variant="secondary" onClick={handleCancel} type="button">
            Hætta við
          </Button>
          <Button variant="primary" type="submit">
            Vista
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
