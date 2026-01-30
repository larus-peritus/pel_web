'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { EmergencyFundInputs } from './EmergencyFundInputs';
import { EmergencyFundResults } from './EmergencyFundResults';
import { TargetProgressTracker } from './TargetProgressTracker';

/**
 * Emergency Fund Freedom Meter
 *
 * Transforms emergency fund balance into meaningful metrics:
 * - Months of financial freedom
 * - Life energy hours protected (if AWH calculated)
 * - Risk assessment
 * - Progress toward 3/6/12 month targets
 */
export function EmergencyFundCalculator() {
  const { emergencyFundData, emergencyFundResults } = useCalculator();

  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-emerald-50 to-neutral-50">
        <Container size="lg">
          <div className="text-center space-y-4 py-8 md:py-12">
            <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-2">
              Áhrif sparnaðar
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">
              Neyðarsjóður Frelsissmælir
            </h1>
            <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
              Sjáðu hversu mikið neyðarsjóðurinn þinn er í mánaðum af frelsi og lífsorku sem vernduð er.
            </p>
          </div>
        </Container>
      </Section>

      {/* Main Calculator Section */}
      <Section>
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Section */}
            <div>
              <EmergencyFundInputs />
            </div>

            {/* Results Section */}
            <div>
              {emergencyFundData && emergencyFundResults ? (
                <EmergencyFundResults />
              ) : (
                <Card className="p-8">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🛡️</div>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      Byrjaðu að mæla frelsi þitt
                    </h3>
                    <p className="text-neutral-600">
                      Sláðu inn stöðu neyðarsjóðs og mánaðarleg útgjöld til að sjá hversu mikið frelsi þú hefur safnað.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Target Progress Section */}
      {emergencyFundData && emergencyFundResults && (
        <Section className="bg-neutral-50">
          <Container size="xl">
            <TargetProgressTracker />
          </Container>
        </Section>
      )}

      {/* Educational Content */}
      <Section>
        <Container size="lg">
          <Card className="p-6 md:p-8 bg-emerald-50 border-emerald-200">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Hvað er neyðarsjóður?
              </h3>
              <p className="text-neutral-700">
                Neyðarsjóður er sparnaður sem þú hefur til hliðar fyrir óvænt útgjöld eða tekjutap.
                Hann gefur þér <strong>frelsi</strong> til að takast á við neyðartilvik án þess að fara í skuldir.
              </p>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Hvers vegna er þetta mikilvægt?
                </h4>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Verndar þig gegn óvæntum útgjöldum (bílaviðgerðir, heilbrigðiskostnaður)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Veitir öryggi ef þú missir vinnuna</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Gefur þér frelsi til að segja nei við slæma vinnu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Minnkar fjárhagslega streitu og gefur hugarró</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Fyrsta skrefið í átt að fjárhagslegri sjálfstæði (FI)</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-emerald-200">
                <h4 className="font-semibold text-neutral-900 mb-2">
                  Hvers vegna 3/6/12 mánuðir?
                </h4>
                <p className="text-neutral-700">
                  <strong>3 mánuðir</strong> eru lágmarkið fyrir grunn öryggi.
                  <strong className="ml-1">6 mánuðir</strong> eru mælt með fyrir flesta.
                  <strong className="ml-1">12 mánuðir</strong> gefur sterkan grunn fyrir langtíma fjárhagsleg markmið og frelsi.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
