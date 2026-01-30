/**
 * FatFIRE Calculator Page
 * Route: /fatfire
 *
 * Comprehensive calculator for planning a luxurious Financial Independence
 * lifestyle. Helps users plan for FI with premium expenses, wish list items,
 * and annual splurge budget.
 *
 * Features:
 * - Deluxe tier expenses as base
 * - Wish list builder for lifestyle desires
 * - Annual splurge budget
 * - Milestone tracking
 * - Timeline projection
 * - Premium gold/amber theme
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { FatFIRECalculator } from '@/components/fatFire';
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
          <div className="h-6 w-40 bg-amber-200 rounded-full mx-auto" />
          <div className="h-12 w-96 bg-gray-200 rounded mx-auto" />
          <div className="h-6 w-[600px] bg-gray-200 rounded mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="h-48 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl" />
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
 * - Title: Lúxus FIRE Áætlun | Peningana Edal Ifið
 * - Description: Skipuleggðu eftirlaunaár með lúxus lífsstíl - engir málamiðlanir
 */
export default function FatFirePage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component */}
        <FatFIRECalculator />
      </Suspense>
    </CalculatorProvider>
  );
}
