/**
 * FIRE Leiðarvísir (FIRE Type Explorer) Page
 * Route: /fire-leidarvisir
 *
 * Comprehensive calculator for exploring and comparing different FIRE types.
 * Helps users find the Financial Independence path that best fits their
 * lifestyle, income, and goals.
 *
 * Features:
 * - Compare 5 FIRE types (Lean, Regular, Coast, Barista, Fat)
 * - Personalized recommendations based on user inputs
 * - Timeline visualization showing when each type is achievable
 * - Comprehensive educational content in Icelandic
 * - Integration with Expense Baseline Tool
 *
 * EPIC 9, Task 9.2
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { FIRETypeExplorer } from '@/components/fireTypes/FIRETypeExplorer';
import { Container } from '@/components/layout/Container';

/**
 * Loading fallback for Suspense boundary
 */
function LoadingFallback() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="text-center space-y-4">
          <div className="h-6 w-40 bg-orange-200 rounded-full mx-auto" />
          <div className="h-12 w-96 bg-gray-200 rounded mx-auto" />
          <div className="h-6 w-[600px] bg-gray-200 rounded mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-80 bg-gray-100 rounded-xl" />
            <div className="h-80 bg-gray-100 rounded-xl" />
            <div className="h-80 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main page component with CalculatorProvider wrapper
 *
 * SEO Metadata:
 * - Title: FIRE Leiðarvísir | Peningana Edal Ifið
 * - Description: Kynntu þér fimm FIRE-aðferðir og finndu þá sem hentar þér best
 */
export default function FIRELeidarvisirPage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component */}
        <FIRETypeExplorer />
      </Suspense>
    </CalculatorProvider>
  );
}
