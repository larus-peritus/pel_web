/**
 * LifeEnergyDisplay Component
 *
 * Display Coast FIRE results in life energy terms (work hours and years).
 * Converts financial metrics into time equivalents based on actual hourly wage.
 *
 * Features:
 * - Current investments in work hours/years
 * - Gap to Coast FIRE in work hours/years
 * - Passive hours earned from compound growth
 * - Work hours saved by coasting vs continuing to save
 * - Formatted with "klst" and year conversions
 * - Alert if AWH not available (link to AWH calculator)
 * - Icelandic labels and formatting
 *
 * Epic 5, Task 5.2
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';
import type { CoastFIRELifeEnergy } from '@/types/coastFire';

export interface LifeEnergyDisplayProps {
  lifeEnergy: CoastFIRELifeEnergy | null;
  actualHourlyWage: number | null;
  className?: string;
}

/**
 * Format hours with Icelandic abbreviation
 */
const formatHours = (hours: number): string => {
  return `${formatNumber(hours, 0)} klst`;
};

/**
 * Format years with decimal precision
 */
const formatYears = (years: number): string => {
  return `${formatNumber(years, 1)} ár`;
};

/**
 * AWH Not Available Alert
 */
function AWHNotAvailableAlert() {
  return (
    <Card className="border-2 border-amber-300 bg-amber-50">
      <CardHeader>
        <h2 className="text-xl font-semibold text-amber-900">
          Lífsorka ekki tiltæk
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-amber-800">
            Til að sjá Sjálfvirkt FIRE markmið þín í lífsorku (vinnustundum og árum),
            þarftu fyrst að reikna út <strong>Raunverulegan tímalaun</strong> (RTL).
          </p>

          <div className="rounded-lg bg-white p-4 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">
              Hvað er lífsorka?
            </h3>
            <p className="text-sm text-neutral-700">
              Lífsorka er hugtak úr bókinni "Your Money or Your Life" sem
              setur peninga í samhengi við lífstímann þinn. Í stað þess að
              hugsa um peninga sem tölur, hugsar þú um þá sem vinnustundir
              eða vinnuár sem þú hefur lagt í að afla þeirra.
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">
              Hvernig reikna ég RTL?
            </h3>
            <p className="text-sm text-neutral-700 mb-3">
              RTL tekur tillit til allra launatengdra kostnaðar (samgöngur,
              fatnað, máltíðir o.s.frv.) og allra vinnustunda (yfirvinnu,
              undirbúning o.s.frv.). Það gefur þér raunhæfa mynd af því hvað
              þú raunverulega færð greitt á klukkustund.
            </p>
            <a
              href="/calculators/actual-hourly-wage"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
            >
              <span>→</span>
              <span>Reikna RTL núna</span>
            </a>
          </div>

          <p className="text-xs text-amber-700">
            Þegar þú hefur reiknað RTL, mun það sjálfkrafa birtast hér og þú
            getur séð Sjálfvirkt FIRE markmið þín í lífsorku.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function LifeEnergyDisplay({
  lifeEnergy,
  actualHourlyWage,
  className,
}: LifeEnergyDisplayProps) {
  // Show alert if AWH not available
  if (!actualHourlyWage || !lifeEnergy) {
    return <AWHNotAvailableAlert />;
  }

  const {
    investmentsInHours,
    investmentsInYears,
    gapInHours,
    gapInYears,
    passiveHoursEarned,
    passiveYearsEarned,
    hoursSavedByCoasting,
    yearsSavedByCoasting,
  } = lifeEnergy;

  return (
    <Card className={className}>
      <CardHeader>
        <h2 className="text-xl font-semibold text-neutral-900">
          Lífsorka
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Sjálfvirkt FIRE markmið þín í vinnustundum og árum
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Current Investments in Life Energy */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-5">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">
              Núverandi fjárfestingar í lífsorku
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-blue-700 mb-1">Vinnustundir</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatHours(investmentsInHours)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Vinnuár</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatYears(investmentsInYears)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-blue-700">
              Þú hefur lagt {formatYears(investmentsInYears)} af lífstíma þínum
              í að byggja upp núverandi fjárfestingar.
            </p>
          </div>

          {/* Gap to Coast FIRE in Life Energy */}
          {gapInHours !== null && gapInHours > 0 && gapInYears !== null && (
            <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-5">
              <h3 className="text-sm font-semibold text-amber-900 mb-3">
                Bil til Sjálfvirkt FIRE í lífsorku
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-amber-700 mb-1">Vinnustundir</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {formatHours(gapInHours)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-amber-700 mb-1">Vinnuár</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {formatYears(gapInYears)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-amber-700">
                Þú þarft að leggja til {formatYears(gapInYears)} til viðbótar
                af lífsorkunni þinni til að ná Sjálfvirkt FIRE.
              </p>
            </div>
          )}

          {/* Passive Hours Earned from Compound Growth */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-5">
            <h3 className="text-sm font-semibold text-green-900 mb-3">
              Óvirkar vinnustundir frá vaxtavexti
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-green-700 mb-1">Vinnustundir</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatHours(passiveHoursEarned)}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 mb-1">Vinnuár</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatYears(passiveYearsEarned)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-green-700">
              Vaxtavöxtur mun "vinna" fyrir þig sem jafngildir {formatYears(passiveYearsEarned)}
              án þess að þú þurfir að leggja á þig vinnu.
            </p>
          </div>

          {/* Hours Saved by Coasting */}
          {hoursSavedByCoasting !== null && yearsSavedByCoasting !== null && (
            <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-5">
              <h3 className="text-sm font-semibold text-purple-900 mb-3">
                Vinnustundir sparaðar með því að "coasta"
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-purple-700 mb-1">Vinnustundir</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatHours(hoursSavedByCoasting)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-700 mb-1">Vinnuár</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatYears(yearsSavedByCoasting)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-purple-700">
                Með því að róa í stað þess að halda áfram að spara, sparar þú
                u.þ.b. {formatYears(yearsSavedByCoasting)} af lífsorku (áætlað).
              </p>
            </div>
          )}

          {/* Explanation Box */}
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Hvað þýðir lífsorka?
            </h3>
            <p className="text-sm text-neutral-700">
              Lífsorka breytir peningum í tíma, og sýnir þér hversu mörgum
              vinnustundum eða árum af lífinu þínu fjárhagsleg markmið þín
              svara til. Þetta hjálpar þér að sjá fjárhagslegar ákvarðanir í
              samhengi við takmarkaðan tíma þinn á jörðinni.
            </p>
            <p className="mt-2 text-xs text-neutral-600">
              RTL notað: {formatNumber(actualHourlyWage, 0)} kr/klst
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
