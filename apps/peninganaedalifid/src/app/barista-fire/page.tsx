/**
 * Barista FIRE Calculator Page
 * Route: /barista-fire
 *
 * Calculate how long it takes to reach FI while working part-time
 * to cover expenses. Part-time income covers living costs while
 * existing savings grow to full FI without additional contributions.
 *
 * Features:
 * - Integration with Expense Baseline Tool for automatic expenses
 * - Multiple part-time income scenarios
 * - Timeline visualization
 * - Life energy calculations
 * - Comparison to Coast FIRE baseline
 * - Icelandic pension integration (16% mandatory contribution)
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { BaristaFIRECalculator } from '@/components/baristaFire';
import { Container } from '@/components/layout/Container';

/**
 * Loading fallback for Suspense boundary
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-neutral-50">
      <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 text-center">
            {/* Badge skeleton */}
            <div className="mx-auto h-10 w-40 rounded-full bg-amber-200" />
            {/* Title skeleton */}
            <div className="mx-auto h-12 w-96 rounded bg-gray-200" />
            {/* Description skeleton */}
            <div className="mx-auto h-6 w-[500px] rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100" />
          <div className="h-64 rounded-xl bg-gray-100" />
          <div className="h-96 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

/**
 * Main page component with CalculatorProvider wrapper
 *
 * SEO Metadata:
 * - Title: Barista FIRE Reiknivél | Peningana Eða Lífið
 * - Description: Reiknaðu hvenær þú getur unnið hlutastarf og látið fjárfestingar vaxa að full FI
 */
export default function BaristaFirePage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component - includes its own hero section and layout */}
        <BaristaFIRECalculator />
      </Suspense>
    </CalculatorProvider>
  );
}
