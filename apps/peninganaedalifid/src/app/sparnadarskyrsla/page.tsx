import { Metadata } from 'next';
import { Suspense } from 'react';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { SavingsReportCalculator } from '@/components/savingsReport';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

/**
 * Metadata for Savings Report page
 */
export const metadata: Metadata = {
  title: 'Sparnaðarskýrsla | Peningana eða lífið',
  description: 'Fylgstu með sparnaðinum þínum og reiknaðu sparnaðarhlutfall. Sjáðu sparnaðinn þinn í lífsorku og vinnutímum.',
};

/**
 * Savings Report Page
 *
 * Route: /sparnadarskyrsla
 *
 * This page provides a comprehensive savings tracking interface where users can:
 * - Track savings across multiple categories (emergency fund, short-term, long-term, investments, etc.)
 * - See savings in life energy (work hours) when AWH is calculated
 * - Calculate savings rate based on income
 * - Set targets and track progress
 * - View dashboard with visual breakdowns
 */
export default function SavingsReportPage() {
  return (
    <CalculatorProvider>
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-success-50 to-neutral-50 py-12">
          <Container size="lg">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
                Sparnaðarskýrsla
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
                Fylgstu með sparnaðinum þínum í mismunandi flokkum og reiknaðu sparnaðarhlutfall
              </p>
              <p className="text-sm text-neutral-500 italic">
                Sjáðu sparnaðinn þinn í lífsorku og vinnutímum
              </p>
            </div>
          </Container>
        </section>

        {/* Main Calculator Section */}
        <Section>
          <Container size="xl">
            <Suspense fallback={<LoadingFallback />}>
              <SavingsReportCalculator />
            </Suspense>
          </Container>
        </Section>

        {/* Privacy Notice */}
        <Section className="bg-neutral-100">
          <Container size="lg">
            <div className="text-center py-4">
              <p className="text-sm text-neutral-600">
                <strong>Persónuvernd:</strong> Öll sparnaðargögn þín eru geymd eingöngu í vafranum þínum.
                Engin gögn eru send á netþjón. Þú getur flutt út og inn gögn þegar þú vilt.
              </p>
            </div>
          </Container>
        </Section>
      </div>
    </CalculatorProvider>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-neutral-600">Hleður sparnaðarskýrslu...</p>
      </div>
    </div>
  );
}
