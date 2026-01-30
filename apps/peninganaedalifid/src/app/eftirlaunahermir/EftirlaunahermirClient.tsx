'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { RetirementSimulatorCalculator } from '@/components/retirementSimulator';
import { Container } from '@/components/layout/Container';

/**
 * Loading fallback for Suspense boundary
 */
function LoadingFallback() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
        <div className="h-96 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/**
 * Client component with CalculatorProvider wrapper
 */
export function EftirlaunahermirClient() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component - includes its own hero section */}
        <RetirementSimulatorCalculator />

        {/* Privacy Notice */}
        <section className="bg-neutral-100 py-6">
          <Container size="lg">
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                <strong>Persónuvernd:</strong> Allir útreikningar fara fram í
                vafranum þínum. Fjárhagsgögn þín eru geymd á þínu tæki og
                aldrei send á neinn netþjón. Monte Carlo hermunin keyrir
                staðbundið í vafranum þínum.
              </p>
            </div>
          </Container>
        </section>
      </Suspense>
    </CalculatorProvider>
  );
}
