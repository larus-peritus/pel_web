/**
 * Expense Baseline Calculator Page
 * Route: /utgjaldareiknivel
 *
 * Three-tier expense baseline calculator for FIRE planning.
 * Defines monthly expenses at Barebones, Comfortable, and Deluxe levels.
 *
 * EPIC 8, Task 8.2
 */

'use client';

import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { ExpenseBaselineCalculator } from '@/components/expenseBaseline/ExpenseBaselineCalculator';
import { Container } from '@/components/layout/Container';

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
 * Main page component with CalculatorProvider wrapper
 */
export default function UtgjaldareiknivelPage() {
  return (
    <CalculatorProvider>
      <Suspense fallback={<LoadingFallback />}>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-neutral-50">
          <Container size="lg">
            <div className="text-center space-y-4 pt-8 md:pt-12 pb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
                Útgjaldagrunnur
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Skilgreindu mánaðarleg útgjöld þín á þremur stigum - Lágmarks,
                Þægilegt, og Lúxus
              </p>
              <p className="text-sm text-neutral-500 italic">
                Grunnurinn að öllum FIRE-útreikningum þínum
              </p>
            </div>
          </Container>
        </section>

        {/* Main Calculator Content */}
        <section className="bg-white py-8">
          <Container size="xl">
            <ExpenseBaselineCalculator />
          </Container>
        </section>

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
