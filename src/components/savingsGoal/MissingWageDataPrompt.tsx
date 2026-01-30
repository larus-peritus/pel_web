/**
 * Prompt shown when actual hourly wage data is missing
 */

'use client';

import Link from 'next/link';
import { Alert } from '@/components/ui/Alert';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export function MissingWageDataPrompt() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Section>
        <Container>
          <div className="max-w-2xl mx-auto pt-12">
            <Alert variant="info" title="Raunverulegt tímakaup vantar">
              <p className="mb-4">
                Til að nota sparnaðarmarkmið mælirinn þarftu fyrst að reikna út þitt raunverulega
                tímakaup.
              </p>
              <p className="mb-4">
                Þetta er nauðsynlegt til að breyta krónum í lífsorku (vinnustundir) og sjá hversu
                mikið af þínu lífi þú hefur lagt til hliðar.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fara í Tímakaups reiknivélina
              </Link>
            </Alert>
          </div>
        </Container>
      </Section>
    </div>
  );
}
