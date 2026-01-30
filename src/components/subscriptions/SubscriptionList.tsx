'use client';

import React, { useState, useMemo } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatters';
import { SUBSCRIPTION_CATEGORY_LABELS } from '@/lib/calculations/subscriptions';
import type { Subscription, SubscriptionCategory } from '@/types/calculator';
import { cn } from '@/lib/utils';

/**
 * Props for SubscriptionList component
 */
export interface SubscriptionListProps {
  onEdit: (subscription: Subscription) => void;
  className?: string;
}

/**
 * Color mapping for subscription categories (matching CategoryBreakdown)
 */
const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  streaming: 'text-blue-600',
  software: 'text-purple-600',
  fitness: 'text-green-600',
  news: 'text-orange-600',
  gaming: 'text-red-600',
  other: 'text-gray-600',
};

/**
 * Toggle Switch Component
 * Simple inline toggle for subscription active/inactive state
 */
interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  id: string;
  ariaLabel: string;
}

function ToggleSwitch({ checked, onChange, id, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      id={id}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        checked ? 'bg-success-600' : 'bg-neutral-300'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

/**
 * SubscriptionList Component
 *
 * Displays all user subscriptions grouped by category, with controls to:
 * - Toggle active/inactive state
 * - Edit subscription details
 * - Delete subscriptions
 *
 * Features:
 * - Groups by category (sorted by total cost)
 * - Shows category headers with totals
 * - Inactive subscriptions shown with reduced opacity
 * - Delete confirmation dialog
 * - Empty state when no subscriptions
 * - Fully responsive (mobile-friendly)
 *
 * @example
 * ```tsx
 * <SubscriptionList onEdit={(sub) => handleEdit(sub)} />
 * ```
 */
export function SubscriptionList({
  onEdit,
  className,
}: SubscriptionListProps) {
  const { subscriptions, toggleSubscription, deleteSubscription, subscriptionSummary } =
    useCalculator();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Group subscriptions by category, using the order from subscriptionSummary
  const groupedSubscriptions = useMemo(() => {
    if (!subscriptionSummary) return [];

    // Get category order from summary (sorted by cost)
    const categoryOrder = subscriptionSummary.byCategory.map((cat) => cat.category);

    // Create map of subscriptions by category
    const byCategory = new Map<SubscriptionCategory, Subscription[]>();

    for (const sub of subscriptions) {
      if (!byCategory.has(sub.category)) {
        byCategory.set(sub.category, []);
      }
      byCategory.get(sub.category)!.push(sub);
    }

    // Sort within each category by name
    byCategory.forEach((subs) => {
      subs.sort((a, b) => a.name.localeCompare(b.name, 'is'));
    });

    // Return categories in order with their subscriptions
    return categoryOrder
      .map((category) => ({
        category,
        label: SUBSCRIPTION_CATEGORY_LABELS[category],
        subscriptions: byCategory.get(category) || [],
        total: (byCategory.get(category) || [])
          .filter((s) => s.isActive)
          .reduce((sum, s) => sum + s.monthlyCost, 0),
      }))
      .filter((group) => group.subscriptions.length > 0);
  }, [subscriptions, subscriptionSummary]);

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteSubscription(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <div className="px-6 py-12 text-center">
          <p className="text-lg font-medium text-neutral-700 mb-2">
            Engar áskriftir skráðar
          </p>
          <p className="text-sm text-neutral-500">
            Bættu við fyrstu áskriftinni þinni hér að ofan
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn('w-full', className)}>
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">Mínar áskriftir</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {groupedSubscriptions.map((group) => (
            <div key={group.category} className="px-6 py-4">
              {/* Category header */}
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={cn(
                    'text-sm font-semibold uppercase tracking-wide',
                    CATEGORY_COLORS[group.category]
                  )}
                >
                  {group.label}
                </h3>
                {group.total > 0 && (
                  <span className="text-sm font-medium text-neutral-600">
                    {formatCurrency(group.total)}/mán
                  </span>
                )}
              </div>

              {/* Subscriptions in category */}
              <div className="space-y-2">
                {group.subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border border-neutral-200 p-3 transition-opacity duration-200',
                      !subscription.isActive && 'opacity-50'
                    )}
                  >
                    {/* Toggle switch */}
                    <div className="shrink-0">
                      <ToggleSwitch
                        checked={subscription.isActive}
                        onChange={() => toggleSubscription(subscription.id)}
                        id={`toggle-${subscription.id}`}
                        ariaLabel={`${subscription.isActive ? 'Afvirkja' : 'Virkja'} ${subscription.name}`}
                      />
                    </div>

                    {/* Subscription details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 truncate">
                          {subscription.name}
                        </p>
                        {!subscription.isActive && (
                          <Badge variant="neutral" size="sm">
                            Óvirk
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">
                        {SUBSCRIPTION_CATEGORY_LABELS[subscription.category]}
                      </p>
                    </div>

                    {/* Cost and actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          {formatCurrency(subscription.monthlyCost)}
                        </p>
                      </div>

                      {/* Edit button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(subscription)}
                        aria-label={`Breyta ${subscription.name}`}
                        className="shrink-0"
                      >
                        ✏️
                      </Button>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(subscription.id)}
                        aria-label={`Eyða ${subscription.name}`}
                        className="shrink-0 text-danger-600 hover:bg-danger-50"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Delete confirmation dialog */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleCancelDelete}
        >
          <Card
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">
                Eyða áskrift?
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-neutral-700">
                Ertu viss um að þú viljir eyða{' '}
                <span className="font-semibold">
                  {subscriptions.find((s) => s.id === deleteConfirmId)?.name}
                </span>
                ?
              </p>
            </div>
            <div className="px-6 py-4 border-t border-neutral-200 flex gap-2 justify-end">
              <Button variant="secondary" onClick={handleCancelDelete}>
                Hætta við
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eyða
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
