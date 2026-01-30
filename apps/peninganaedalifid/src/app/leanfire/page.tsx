/**
 * LeanFIRE Calculator Page
 * Route: /leanfire
 *
 * Calculate minimum FI number based on barebones expenses.
 * Compare geographic locations, model expense reduction scenarios,
 * and get personalized frugality tips for reaching FI faster.
 *
 * Features:
 * - Integration with Expense Baseline Tool (barebones tier)
 * - Geographic comparison (Reykjavík vs Landsbyggð)
 * - Expense reduction scenarios
 * - Personalized frugality tips
 * - Life energy calculations
 * - Cost comparison visualization
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { LeanFIRECalculator } from '@/components/leanFire';
import { Container } from '@/components/layout/Container';

/**
 * Loading fallback for Suspense boundary
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-neutral-50">
      <div className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 text-center">
            {/* Badge skeleton */}
            <div className="mx-auto h-10 w-40 rounded-full bg-green-200" />
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
          <div className="h-48 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100" />
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
 * - Title: Lágmarks FIRE Reiknivél | Peningana Eða Lífið
 * - Description: Reiknaðu lágmarks FI-tölu þína með barebones útgjöldum og fáðu ábendingar um sparnaðarleiðir
 */
export default function LeanFirePage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component - includes its own hero section and layout */}
        <LeanFIRECalculator />
      </Suspense>
    </CalculatorProvider>
  );
}
