'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  SubscriptionForm,
  SubscriptionList,
  SubscriptionSummary,
  SubscriptionCategoryBreakdown,
} from '@/components/subscriptions';
import type { Subscription } from '@/types/calculator';
import { cn } from '@/lib/utils';

/**
 * Props for SubscriptionBurnMeter component
 */
export interface SubscriptionBurnMeterProps {
  className?: string;
}

/**
 * SubscriptionBurnMeter - Main subscription tracking component
 *
 * Combines all subscription subcomponents into a unified interface:
 * - "Bæta við áskrift" button to add new subscriptions
 * - SubscriptionList showing all subscriptions grouped by category
 * - SubscriptionSummary showing total costs and life energy impact
 * - SubscriptionCategoryBreakdown showing visual breakdown by category
 * - SubscriptionForm modal for adding/editing subscriptions
 *
 * Layout:
 * - 2-column layout on desktop (list on left, summary/breakdown on right)
 * - Stacked layout on mobile
 * - Form appears inline above the list when open
 *
 * Features:
 * - Add new subscriptions
 * - Edit existing subscriptions
 * - Toggle active/inactive state
 * - Delete subscriptions with confirmation
 * - See total impact on life energy
 * - See category breakdown
 *
 * @example
 * ```tsx
 * <SubscriptionBurnMeter />
 * ```
 */
export function SubscriptionBurnMeter({
  className,
}: SubscriptionBurnMeterProps) {
  const { subscriptions, addSubscription, updateSubscription } = useCalculator();

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  /**
   * Open form in "add" mode
   */
  const handleAddClick = () => {
    setEditingSubscription(null);
    setIsFormOpen(true);
  };

  /**
   * Open form in "edit" mode
   */
  const handleEditClick = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  /**
   * Save subscription (add or update)
   */
  const handleSave = (data: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, data);
    } else {
      addSubscription(data);
    }
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  /**
   * Cancel form (close without saving)
   */
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Add button */}
      {!isFormOpen && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleAddClick} size="md">
            + Bæta við áskrift
          </Button>
        </div>
      )}

      {/* Form (shown inline when open) */}
      {isFormOpen && (
        <div className="animate-fadeIn">
          <SubscriptionForm
            mode={editingSubscription ? 'edit' : 'add'}
            subscription={editingSubscription || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Main content - 2 column layout on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column - Subscription list */}
        <div className="space-y-6">
          <SubscriptionList onEdit={handleEditClick} />
        </div>

        {/* Right column - Summary and breakdown */}
        <div className="space-y-6">
          <SubscriptionSummary />
          <SubscriptionCategoryBreakdown />
        </div>
      </div>

      {/* Empty state hint (only shown when no subscriptions and form is not open) */}
      {subscriptions.length === 0 && !isFormOpen && (
        <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
              📊
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900">
              Byrjaðu að fylgjast með áskriftum
            </h2>
            <p className="mb-6 text-neutral-600">
              Bættu við áskriftum þínum til að sjá hversu mikla lífsorku þær kosta þig
            </p>
            <Button variant="primary" onClick={handleAddClick} size="lg">
              + Bæta við fyrstu áskriftinni
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
