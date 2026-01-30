/**
 * CoastFIREResults Component
 *
 * Display Coast FIRE calculation results with key metrics.
 *
 * Features:
 * - Coast FI Number display
 * - Years to coast (or "Already coasting!")
 * - Required savings to reach coast
 * - Gap to coast
 * - Projected balance at retirement
 * - Status indicator
 * - Life energy display (if AWH available)
 * - Icelandic formatting and labels
 *
 * Epic 3, Task 3.3
 * Epic 6, Task 6.3: AWH integration for life energy
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CoastFIREStatus } from './CoastFIREStatus';
import { GrowthProjectionChart } from './GrowthProjectionChart';
import { LifeEnergyDisplay } from './LifeEnergyDisplay';
import { formatCurrency } from '@/lib/utils';
import type { CoastFIREResult } from '@/types/coastFire';
import { cn } from '@/lib/utils';

export interface CoastFIREResultsProps {
  result: CoastFIREResult;
  currentAge: number;
  currentInvestments: number;
  targetRetirementAge: number;
  fiNumber: number;
  expectedReturn: number;
  actualHourlyWage?: number | null; // For life energy display (Task 6.3)
  className?: string;
}

export function CoastFIREResults({
  result,
  currentAge,
  currentInvestments,
  targetRetirementAge,
  fiNumber,
  expectedReturn,
  actualHourlyWage,
  className,
}: CoastFIREResultsProps) {
  const {
    status,
    coastFireAge,
    coastFireDate,
    yearsToCoast,
    gapToCoast,
    projectedBalance,
    excessOverFI,
    lifeEnergy,
  } = result;

  // Announce results to screen readers when they change (Task 7.3)
  const [resultsAnnouncement, setResultsAnnouncement] = React.useState('');

  React.useEffect(() => {
    // Create announcement message based on status
    let message = '';
    if (status === 'coasting') {
      message = `Niðurstöður uppfærðar: Þú ert í Sjálfvirkt FIRE. Fjárfestingar þínar munu vaxa í ${formatCurrency(projectedBalance)} við starfslok.`;
    } else if (status === 'future' && coastFireAge) {
      message = `Niðurstöður uppfærðar: Þú munt ná Sjálfvirkt FIRE við ${Math.round(coastFireAge)} ára aldur. Tími til Sjálfvirkt FIRE: ${formatYears(yearsToCoast)}.`;
    } else if (status === 'impossible') {
      message = `Niðurstöður uppfærðar: Sjálfvirkt FIRE ekki mögulegt með núverandi forsendum. Bil: ${formatCurrency(gapToCoast ?? 0)}.`;
    }
    setResultsAnnouncement(message);
  }, [status, coastFireAge, yearsToCoast, gapToCoast, projectedBalance]);

  /**
   * Format date in Icelandic
   */
  const formatDate = (date: Date | null): string => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('is-IS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  /**
   * Format years with precision
   */
  const formatYears = (years: number | null): string => {
    if (years === null) return '—';
    if (years === 0) return 'Núna!';

    const wholeYears = Math.floor(years);
    const months = Math.round((years - wholeYears) * 12);

    if (wholeYears === 0) {
      return `${months} mánuði`;
    } else if (months === 0) {
      return `${wholeYears} ár`;
    } else {
      return `${wholeYears} ár og ${months} mánuði`;
    }
  };

  return (
    <div className={cn('space-y-6', className)} role="region" aria-label="Niðurstöður Sjálfvirkt FIRE reiknivélar">
      {/* Screen reader announcement (Task 7.3) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {resultsAnnouncement}
      </div>

      {/* Status Card */}
      <CoastFIREStatus status={status} coastFireAge={coastFireAge} />

      {/* Growth Projection Chart */}
      <Card>
        <CardContent className="pt-6">
          <GrowthProjectionChart
            result={result}
            currentAge={currentAge}
            targetRetirementAge={targetRetirementAge}
            currentInvestments={currentInvestments}
            fiNumber={fiNumber}
            expectedReturn={expectedReturn}
          />
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-900">
            Niðurstöður
          </h2>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Coast FIRE Age & Date */}
            {status !== 'impossible' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-primary-50 p-4">
                  <p className="text-sm font-medium text-primary-900">
                    Sjálfvirkt FIRE aldur
                  </p>
                  <p className="mt-1 text-2xl font-bold text-primary-700">
                    {coastFireAge ? `${Math.round(coastFireAge)} ára` : '—'}
                  </p>
                  {coastFireDate && (
                    <p className="mt-1 text-xs text-primary-700">
                      {formatDate(coastFireDate)}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Tími til Sjálfvirkt FIRE
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    {formatYears(yearsToCoast)}
                  </p>
                  {status === 'coasting' && (
                    <p className="mt-1 text-xs text-blue-700">
                      Þú ert þegar komin/n!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Gap to Coast (if not coasting) */}
            {status === 'future' && gapToCoast !== null && gapToCoast > 0 && (
              <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Vantar til Sjálfvirkt FIRE
                    </p>
                    <p className="mt-1 text-xs text-amber-700">
                      Þú þarft að spara þessa upphæð til viðbótar núna til að ná Sjálfvirkt FIRE
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-amber-700">
                    {formatCurrency(gapToCoast)}
                  </p>
                </div>
              </div>
            )}

            {/* Gap to Coast (impossible scenario) */}
            {status === 'impossible' && gapToCoast !== null && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Vantar til Sjálfvirkt FIRE
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                      Þú þarft mun meiri fjárfestingu núna, eða breyta forsendum
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-red-700">
                    {formatCurrency(gapToCoast)}
                  </p>
                </div>
              </div>
            )}

            {/* Projected Balance at Retirement */}
            <div className="rounded-lg bg-neutral-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Áætluð staða við starfslok
                  </p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Heildarstaða fjárfestinga við eftirlaunaaldur
                  </p>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatCurrency(projectedBalance)}
                </p>
              </div>
            </div>

            {/* Excess over FI Number */}
            <div
              className={cn(
                'rounded-lg p-4',
                excessOverFI >= 0
                  ? 'bg-success-50 border-2 border-success-200'
                  : 'bg-danger-50 border-2 border-danger-200'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      excessOverFI >= 0 ? 'text-success-900' : 'text-danger-900'
                    )}
                  >
                    {excessOverFI >= 0 ? 'Umframmagn yfir FI-tölu' : 'Skortur á FI-tölu'}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-xs',
                      excessOverFI >= 0 ? 'text-success-700' : 'text-danger-700'
                    )}
                  >
                    {excessOverFI >= 0
                      ? 'Þú ert með þennan aukabúning yfir FI-töluna þína'
                      : 'Það sem vantar upp á til að ná FI-tölunni þinni'}
                  </p>
                </div>
                <p
                  className={cn(
                    'text-2xl font-bold',
                    excessOverFI >= 0 ? 'text-success-700' : 'text-danger-700'
                  )}
                >
                  {excessOverFI >= 0 ? '+' : ''}
                  {formatCurrency(excessOverFI)}
                </p>
              </div>
            </div>

            {/* Plain Language Summary */}
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-neutral-900">
                Hvað þýðir þetta?
              </h3>
              <p className="mt-2 text-sm text-neutral-700">
                {status === 'coasting' && (
                  <>
                    Til hamingju! Þú hefur náð <strong>Sjálfvirku FIRE</strong>. Fjárfestingar þínar munu
                    vaxa í FI-töluna þína án þess að þú þurfir að spara meira. Þú getur hætt að
                    spara núna og látið vaxtavöxt gera verkið.
                  </>
                )}
                {status === 'future' && coastFireAge && (
                  <>
                    Þú munt ná <strong>Sjálfvirku FIRE við {Math.round(coastFireAge)} ára aldur</strong> ef
                    fjárfestingar þínar halda áfram að vaxa. Eftir það getur þú hætt að spara og
                    látið vaxtavöxt gera restina.
                  </>
                )}
                {status === 'impossible' && (
                  <>
                    Með núverandi forsendum munu fjárfestingar þínar ekki ná FI-tölunni þinni fyrir
                    starfslok. Þú getur breytt forsendum (seinka starfslokum, lækka FI-tölu,
                    auka ávöxtun) eða halda áfram að spara.
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Energy Display (Task 6.3) */}
      <LifeEnergyDisplay
        lifeEnergy={lifeEnergy}
        actualHourlyWage={actualHourlyWage ?? null}
      />
    </div>
  );
}
