/**
 * Snowball Calculator Page
 * Route page for Interest Savings Snowball Calculator
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider, useCalculator } from '@/context/CalculatorContext';
import { SnowballCalculatorPage } from '@/components/snowball';

/**
 * Inner component that has access to CalculatorContext
 */
function SnowballCalculatorContent() {
  const { results } = useCalculator();
  const actualHourlyWage = results?.actualHourlyWage || 0;

  return <SnowballCalculatorPage actualHourlyWage={actualHourlyWage} />;
}

/**
 * Loading fallback for Suspense
 */
function LoadingFallback() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/**
 * Main page component with metadata
 * Wrapped in Suspense to handle useSearchParams in child components
 */
export default function SnowballCalculatorRoute() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        <SnowballCalculatorContent />
      </Suspense>
    </CalculatorProvider>
  );
}

// Note: Metadata is not exported in client components
// For SEO, consider creating a separate layout.tsx or using generateMetadata
