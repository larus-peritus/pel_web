/**
 * Coast FIRE Calculator Page (Vaxtar FIRE / Ró FIRE)
 * Route: /ro-fire
 *
 * Calculate when you can stop saving and let compound growth carry you to FI.
 * Coast FIRE is the point where your current investments will grow to your
 * FI number by retirement age without additional contributions.
 *
 * Features:
 * - Integration with Expense Baseline Tool for automatic FI number
 * - Manual FI number input option
 * - Growth projection visualization
 * - Life energy calculations (hours saved)
 * - Scenario comparisons
 * - Action suggestions to reach Coast FIRE faster
 *
 * EPIC 8, Task 8.1
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { CoastFIRECalculator } from '@/components/coastFire';
import { Container } from '@/components/layout/Container';

/**
 * Loading fallback for Suspense boundary
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-neutral-50">
      <div className="bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 text-center">
            {/* Badge skeleton */}
            <div className="mx-auto h-10 w-40 rounded-full bg-blue-200" />
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
          <div className="h-48 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100" />
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
 * - Title: Vaxtar FIRE Reiknivél (Coast FIRE) | Peningana Eða Lífið
 * - Description: Reiknaðu hvenær þú getur hætt að spara og látið vaxtavexti vinna fyrir þig
 */
export default function RoFirePage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component - includes its own hero section and layout */}
        <CoastFIRECalculator />
      </Suspense>
    </CalculatorProvider>
  );
}
