'use client';

/**
 * RaiseCalculator Component
 * Feature ID: 2.3.2
 *
 * Main container for the Raise/Bonus Reality Check calculator.
 * Manages scenarios and provides comparison view.
 *
 * References:
 * - Section 2: System Architecture - Component Hierarchy
 * - US-5: Compare multiple scenarios
 */

import { useState } from 'react';
import type { RaiseInputs, RaiseResults, RaiseScenario } from '@/types/raise';
import { RaiseForm } from './RaiseForm';
import { RaiseSummary } from './RaiseSummary';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface RaiseCalculatorProps {
  className?: string;
  actualHourlyWage?: number;
  // For importing from main calculator
  grossAnnualIncome?: number;
  workHoursPerWeek?: number;
}

export function RaiseCalculator({
  className = '',
  actualHourlyWage = 0,
  grossAnnualIncome,
  workHoursPerWeek,
}: RaiseCalculatorProps) {
  const [scenarios, setScenarios] = useState<RaiseScenario[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<RaiseScenario | null>(null);
  const [viewMode, setViewMode] = useState<'scenarios' | 'comparison'>('scenarios');

  // Add new scenario
  const handleAddScenario = (inputs: RaiseInputs, results: RaiseResults) => {
    const newScenario: RaiseScenario = {
      id: crypto.randomUUID(),
      name: `Atburðarás ${scenarios.length + 1}`,
      inputs,
      results,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScenarios([...scenarios, newScenario]);
    setIsFormOpen(false);
    setEditingScenario(null);
  };

  // Update existing scenario
  const handleUpdateScenario = (inputs: RaiseInputs, results: RaiseResults) => {
    if (!editingScenario) return;

    setScenarios(
      scenarios.map((s) =>
        s.id === editingScenario.id
          ? {
              ...s,
              inputs,
              results,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
    setIsFormOpen(false);
    setEditingScenario(null);
  };

  // Delete scenario
  const handleDeleteScenario = (id: string) => {
    if (confirm('Ertu viss um að þú viljir eyða þessari atburðarás?')) {
      setScenarios(scenarios.filter((s) => s.id !== id));
    }
  };

  // Edit scenario
  const handleEditScenario = (scenario: RaiseScenario) => {
    setEditingScenario(scenario);
    setIsFormOpen(true);
  };

  // Show wage alert if actualHourlyWage is 0
  if (actualHourlyWage === 0) {
    return (
      <Card className={className}>
        <Alert variant="warning">
          <div className="space-y-2">
            <div className="font-semibold">
              Vinsamlegast reiknaðu þitt raunverulega tímakaup fyrst
            </div>
            <div className="text-sm">
              Til að nota launahækkunarreiknivélina þarftu fyrst að reikna út þitt
              raunverulega tímakaup í aðalreiknivélinni.
            </div>
          </div>
        </Alert>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card className="p-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setViewMode('scenarios')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              viewMode === 'scenarios'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Atburðarásir
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              viewMode === 'comparison'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            disabled={scenarios.length < 2}
          >
            Samanburður
            {scenarios.length < 2 && (
              <span className="text-xs ml-1 text-gray-400">(þarf 2+)</span>
            )}
          </button>
        </div>

        {/* Scenarios View */}
        {viewMode === 'scenarios' && (
          <div className="space-y-6">
            {/* Add Scenario Button */}
            {!isFormOpen && (
              <Button
                onClick={() => {
                  setEditingScenario(null);
                  setIsFormOpen(true);
                }}
                disabled={scenarios.length >= 4}
                className="w-full"
              >
                {scenarios.length === 0
                  ? 'Reikna launahækkun'
                  : `Bæta við atburðarás (${scenarios.length}/4)`}
              </Button>
            )}

            {/* Form */}
            {isFormOpen && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {editingScenario ? 'Breyta atburðarás' : 'Ný atburðarás'}
                </h3>
                <RaiseForm
                  initialInputs={editingScenario?.inputs}
                  onSubmit={editingScenario ? handleUpdateScenario : handleAddScenario}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingScenario(null);
                  }}
                  actualHourlyWage={actualHourlyWage}
                  grossAnnualIncome={grossAnnualIncome}
                  workHoursPerWeek={workHoursPerWeek}
                />
              </div>
            )}

            {/* Scenario List */}
            {scenarios.length > 0 && !isFormOpen && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mínar atburðarásir</h3>
                {scenarios.map((scenario) => (
                  <Card key={scenario.id} className="border-2">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold">{scenario.name}</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditScenario(scenario)}
                          variant="secondary"
                          size="sm"
                        >
                          Breyta
                        </Button>
                        <Button
                          onClick={() => handleDeleteScenario(scenario.id)}
                          variant="secondary"
                          size="sm"
                        >
                          Eyða
                        </Button>
                      </div>
                    </div>
                    <RaiseSummary scenario={scenario} />
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {scenarios.length === 0 && !isFormOpen && (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">
                  Engar atburðarásir enn. Byrjaðu með að reikna launahækkun!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Comparison View */}
        {viewMode === 'comparison' && (
          <div>
            {scenarios.length < 2 ? (
              <Alert variant="info">
                <div className="text-sm">
                  Bættu við að minnsta kosti 2 atburðarásum til að bera saman.
                </div>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Mæligildi</th>
                      {scenarios.map((s) => (
                        <th key={s.id} className="text-left py-2 px-4">
                          {s.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">Heildarlaun (brúttó)</td>
                      {scenarios.map((s) => (
                        <td key={s.id} className="py-2 px-4">
                          <div>
                            {Math.round(s.inputs.proposedGrossAnnual / 12)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            kr/mán
                          </div>
                          <div className="text-xs text-gray-500">
                            ({Math.round(s.inputs.proposedGrossAnnual)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            kr/ár)
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">Nettó laun</td>
                      {scenarios.map((s) => (
                        <td key={s.id} className="py-2 px-4">
                          <div>
                            {Math.round(s.results.proposedTax.netMonthly)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            kr/mán
                          </div>
                          <div className="text-xs text-gray-500">
                            ({Math.round(s.results.proposedTax.netAnnual)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            kr/ár)
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">Aukning eftir skatta</td>
                      {scenarios.map((s) => (
                        <td key={s.id} className="py-2 px-4">
                          <div>
                            {s.results.netIncreaseMonthly >= 0 ? '+' : ''}
                            {Math.round(s.results.netIncreaseMonthly)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            kr/mán
                          </div>
                          <div className="text-xs text-gray-500">
                            ({s.results.netIncreaseMonthly * 12 >= 0 ? '+' : ''}
                            {Math.round(s.results.netIncreaseMonthly * 12)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            kr/ár)
                          </div>
                        </td>
                      ))}
                    </tr>
                    {scenarios.some((s) => s.results.fiImpact) && (
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">FI hraðun</td>
                        {scenarios.map((s) => (
                          <td key={s.id} className="py-2 px-4">
                            {s.results.fiImpact
                              ? `${s.results.fiImpact.accelerationMonths > 0 ? '+' : ''}${s.results.fiImpact.accelerationMonths} mánuðir`
                              : 'N/A'}
                          </td>
                        ))}
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">Tímakaup</td>
                      {scenarios.map((s) => (
                        <td key={s.id} className="py-2 px-4">
                          {Math.round(s.results.lifeEnergy.proposedTrueHourlyWage)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                          kr/klst
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-medium">Vinnustundir/viku</td>
                      {scenarios.map((s) => (
                        <td key={s.id} className="py-2 px-4">
                          {s.inputs.proposedWorkHoursWeek ?? s.inputs.currentWorkHoursWeek}{' '}
                          klst
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
