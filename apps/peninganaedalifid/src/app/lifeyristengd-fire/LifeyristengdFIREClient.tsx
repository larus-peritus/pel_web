'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { PensionAwareFIRECalculator } from '@/components/pensionAwareFire';
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
          <div className="h-6 w-40 bg-blue-200 rounded-full mx-auto" />
          <div className="h-12 w-96 bg-gray-200 rounded mx-auto" />
          <div className="h-6 w-[600px] bg-gray-200 rounded mx-auto" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl" />
          <div className="h-64 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-100 rounded-xl" />
            <div className="h-80 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Client component with CalculatorProvider wrapper
 */
export function LifeyristengdFIREClient() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component - includes its own hero section */}
        <PensionAwareFIRECalculator />

        {/* Privacy Notice */}
        <section className="bg-neutral-100 py-6">
          <Container size="lg">
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                <strong>Persónuvernd:</strong> Allir útreikningar fara fram í
                vafranum þínum. Fjárhagsgögn þín eru geymd á þínu tæki og
                aldrei send á neinn netþjón.
              </p>
            </div>
          </Container>
        </section>
      </Suspense>
    </CalculatorProvider>
  );
}
