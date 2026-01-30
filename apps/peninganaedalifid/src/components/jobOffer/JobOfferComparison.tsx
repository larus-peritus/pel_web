'use client';

import { useState, useMemo } from 'react';
import type { JobOffer } from '@/types/jobOffer';
import {
  createEmptyOffer,
  createOfferFromCalculatorData,
  compareOffers,
} from '@/lib/calculations/jobOfferComparison';
import { useCalculator } from '@/context/CalculatorContext';
import JobOfferCard from './JobOfferCard';
import ComparisonResults from './ComparisonResults';
import { Card } from '@/components/ui/Card';

/**
 * Main Job Offer Comparison component
 * Compares current job (can import from main calculator) with a new offer
 */
export default function JobOfferComparison() {
  const { inputs, results } = useCalculator();

  // Current job - can be populated from main calculator
  const [currentJob, setCurrentJob] = useState<JobOffer>(() =>
    createEmptyOffer('current-job', 'Núverandi starf', true)
  );

  // New offer - always starts empty
  const [newOffer, setNewOffer] = useState<JobOffer>(() =>
    createEmptyOffer('new-offer', 'Nýtt tilboð', false)
  );

  // Import data from main calculator to current job
  const handleImportFromCalculator = () => {
    if (!inputs || !results) return;

    // Get monthly nettó income from the annual income stored in calculator
    // Note: grossAnnualIncome in the main calculator is actually nettó (after tax)
    const monthlyNetIncome = inputs.income.grossAnnualIncome / 12;

    // Get work hours and vacation days directly from calculator
    const weeklyWorkHours = inputs.income.workHoursPerWeek || 38;
    const vacationDays = inputs.income.vacationDays || 24;

    // Get expense data (stored as yearly, convert to monthly)
    const commuteTimeWeekly = inputs.timeExpenses.commute || 0;
    const commuteCostMonthly = (inputs.moneyExpenses.commute || 0) / 12;
    const clothingMonthly = (inputs.moneyExpenses.clothing || 0) / 12;
    const mealsMonthly = (inputs.moneyExpenses.meals || 0) / 12;

    // createOfferFromCalculatorData will reverse-calculate brúttó from nettó
    const importedOffer = createOfferFromCalculatorData(
      'current-job',
      'Núverandi starf',
      {
        monthlyNetIncome, // nettó from main calculator
        weeklyWorkHours,
        vacationDays,
        commuteTimeWeekly,
        commuteCostMonthly,
        clothingMonthly,
        mealsMonthly,
      }
    );

    setCurrentJob(importedOffer);
  };

  // Check if we can import from calculator
  const canImport = inputs && inputs.income.grossAnnualIncome > 0;

  // Check if we have enough data to show comparison
  const hasValidData = currentJob.grossMonthlySalary > 0 && newOffer.grossMonthlySalary > 0;

  // Calculate comparison results
  const comparison = useMemo(() => {
    if (!hasValidData) return null;
    try {
      return compareOffers([currentJob, newOffer]);
    } catch {
      return null;
    }
  }, [currentJob, newOffer, hasValidData]);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="bg-primary-50 border-primary-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Berðu saman núverandi starf og nýtt tilboð
          </h3>
          <p className="text-neutral-700">
            Notaðu þetta tól til að bera saman núverandi starf þitt við nýtt starfstilboð.
            Við reiknum raunverulegt tímakaup fyrir hvort starf með tilliti til launa,
            ferðatíma, ferðakostnaðar, vinnufatnaðar og fríðinda.
          </p>
          {canImport && (
            <p className="text-sm text-primary-700 mt-2">
              💡 Þú getur sótt gögn úr aðalreiknivélinni til að fylla inn núverandi starf.
            </p>
          )}
        </div>
      </Card>

      {/* Job Offer Input Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <JobOfferCard
          offer={currentJob}
          onUpdate={setCurrentJob}
          title="Núverandi starf"
          showImportButton={canImport}
          onImport={handleImportFromCalculator}
        />
        <JobOfferCard
          offer={newOffer}
          onUpdate={setNewOffer}
          title="Nýtt tilboð"
        />
      </div>

      {/* Comparison Results */}
      {comparison && <ComparisonResults comparison={comparison} />}

      {/* Placeholder when no data */}
      {!hasValidData && (
        <Card>
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              Fylltu út upplýsingar um bæði störfin
            </h3>
            <p className="text-neutral-600">
              Þegar þú hefur slegið inn mánaðarlaun fyrir bæði störf mun samanburðurinn birtast hér.
            </p>
          </div>
        </Card>
      )}

      {/* Assumptions */}
      <Card className="bg-neutral-50">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Forsendur útreiknings
          </h3>
          <ul className="text-sm text-neutral-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span>
                <strong>Vinnuvikur á ári:</strong> 52 vikur - (orlofsdagar ÷ 5)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span>
                <strong>Ferðatími:</strong> Daglegur ferðatími × 5 dagar × vinnuvikur
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span>
                <strong>Nettó tekjur:</strong> (Laun + fríðindi) - (ferðakostnaður + fatnaður + matur)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span>
                <strong>Raunverulegt tímakaup:</strong> Nettó tekjur ÷ (vinnustundir + ferðastundir)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">•</span>
              <span>
                Staðalgildi á Íslandi: 38 tíma vinnuvika, 24 orlofsdagar
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
