/**
 * FI Number Builder Calculator Page
 * Route: /fi-tala
 *
 * Calculate your Financial Independence (FI) target nest egg based on
 * annual expenses and withdrawal rate multiplier. Integrates with the
 * Expense Baseline Tool and Actual Hourly Wage Calculator.
 *
 * Based on "Your Money or Your Life" and Trinity Study principles,
 * adapted for Icelandic context and pension system.
 *
 * EPIC 9, Task 9.1
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { FINumberBuilderCalculator } from '@/components/fiNumber/FINumberBuilderCalculator';
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
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/**
 * Main page component with CalculatorProvider wrapper
 *
 * SEO Metadata:
 * - Title: FI-tala reiknivél | Peningana Edal Ifið
 * - Description: Reiknaðu þína FI-tölu (fjárhagslegt sjálfstæði) byggt á útgjöldum og margfaldara
 */
export default function FITalaPage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Main Calculator Component - includes its own hero section */}
        <FINumberBuilderCalculator />

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
