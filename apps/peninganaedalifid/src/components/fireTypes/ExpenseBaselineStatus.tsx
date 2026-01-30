'use client';

import * as React from 'react';
import Link from 'next/link';
import { useCalculator } from '@/context/CalculatorContext';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

/**
 * ExpenseBaselineStatus Component
 *
 * Shows status of expense baseline and provides quick access to create/edit it.
 * Features:
 * - Visual indicator if expense baseline exists
 * - Show selected tier and monthly expenses
 * - Summary of all three tiers
 * - Link to expense baseline tool
 * - Call-to-action button if missing
 */
export function ExpenseBaselineStatus() {
  const { expenseBaseline, expenseBaselineResults } = useCalculator();

  const hasBaseline = expenseBaseline !== null;

  // Get tier totals from results
  const tierTotals = expenseBaselineResults?.totals;

  /**
   * Format tier name in Icelandic
   */
  const formatTierName = (tier: string): string => {
    const names: Record<string, string> = {
      barebones: 'Lágmarks',
      comfortable: 'Þægileg',
      deluxe: 'Lúxus',
    };
    return names[tier] || tier;
  };

  /**
   * Get tier color classes
   */
  const getTierColorClass = (tier: string): string => {
    const colors: Record<string, string> = {
      barebones: 'text-amber-600 bg-amber-50 border-amber-200',
      comfortable: 'text-green-600 bg-green-50 border-green-200',
      deluxe: 'text-purple-600 bg-purple-50 border-purple-200',
    };
    return colors[tier] || 'text-neutral-600 bg-neutral-50 border-neutral-200';
  };

  /**
   * Get tier icon
   */
  const getTierIcon = (tier: string): string => {
    const icons: Record<string, string> = {
      barebones: '🥉',
      comfortable: '🥈',
      deluxe: '🥇',
    };
    return icons[tier] || '📊';
  };

  if (!hasBaseline) {
    return (
      <Alert variant="warning" className="border-l-4 border-warning-500">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="warning">
                ⚠️
              </span>
              <strong className="text-base">Enginn útgjaldagrunnur fundinn</strong>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Til að fá nákvæma niðurstöðu þarftu að búa til útgjaldagrunn þinn. Þetta
              hjálpar okkur að reikna út hversu mikið þú þarft að safna fyrir FIRE
              markmiðin þín.
            </p>
            <p className="mt-2 text-sm text-neutral-700">
              Við notum sjálfgefin gildi í bili, en mælum eindregið með því að þú búir til
              þinn eigin útgjaldagrunn.
            </p>
          </div>
          <Link href="/utgjaldareiknivel" passHref>
            <Button variant="primary" size="sm" className="whitespace-nowrap">
              Búa til útgjaldagrunn
            </Button>
          </Link>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="border-l-4 border-success-500 bg-gradient-to-r from-success-50 to-white">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Status Section */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="success">
                ✅
              </span>
              <strong className="text-base text-neutral-900">
                Útgjaldagrunnur tilbúinn
              </strong>
            </div>

            {/* Note: Selected tier display removed - not part of ExpenseBaseline data structure */}

            {/* All Tiers Summary */}
            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-700">
                Mánaðarleg útgjöld eftir þrepum:
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {tierTotals && (
                  <>
                    {/* Barebones */}
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="text-xs font-medium text-amber-900">
                        🥉 Lágmarks
                      </div>
                      <div className="mt-1 text-sm font-bold text-amber-700">
                        {tierTotals.barebones.toLocaleString('is-IS')} kr
                      </div>
                    </div>

                    {/* Comfortable */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="text-xs font-medium text-green-900">
                        🥈 Þægileg
                      </div>
                      <div className="mt-1 text-sm font-bold text-green-700">
                        {tierTotals.comfortable.toLocaleString('is-IS')} kr
                      </div>
                    </div>

                    {/* Deluxe */}
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                      <div className="text-xs font-medium text-purple-900">
                        🥇 Lúxus
                      </div>
                      <div className="mt-1 text-sm font-bold text-purple-700">
                        {tierTotals.deluxe.toLocaleString('is-IS')} kr
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-neutral-600">
              Þessi gildi eru notuð til að reikna út FIRE-markmiðin þín fyrir mismunandi
              lífsstíla.
            </p>
          </div>

          {/* Action Button */}
          <Link href="/utgjaldareiknivel" passHref>
            <Button variant="secondary" size="sm" className="whitespace-nowrap">
              Breyta útgjaldagrunni
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
