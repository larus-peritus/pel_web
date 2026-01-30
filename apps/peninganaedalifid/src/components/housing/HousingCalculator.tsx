'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import {
  HousingForm,
  HousingSummary,
  HousingComparison,
} from '@/components/housing';
import type { HousingScenario, HousingInputs } from '@/types/calculator';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';

/**
 * Props for HousingCalculator component
 */
export interface HousingCalculatorProps {
  className?: string;
}

type ViewMode = 'scenarios' | 'comparison';

/**
 * HousingCalculator - Main housing cost tracking component
 *
 * Combines all housing subcomponents into a unified interface:
 * - "Bæta við atburðarás" button to add new scenarios (disabled at 4 scenarios)
 * - Accordion list of scenarios, showing HousingSummary when collapsed
 * - HousingForm shown when editing a scenario
 * - Delete scenario with confirmation
 * - Duplicate scenario action
 * - Toggle between "Atburðarásir" and "Samanburður" views
 * - Alert if actualHourlyWage === 0 with link to main calculator
 *
 * Layout:
 * - Full-width layout with tabs to switch between scenarios and comparison
 * - Accordion pattern for scenario list
 * - Each scenario can be expanded/collapsed
 * - Form appears inline when editing
 *
 * Features:
 * - Add new scenarios (max 4)
 * - Edit existing scenarios
 * - Delete scenarios with confirmation
 * - Duplicate scenarios
 * - Compare all scenarios side-by-side
 * - See total impact on life energy
 *
 * @example
 * ```tsx
 * <HousingCalculator />
 * ```
 */
export function HousingCalculator({ className }: HousingCalculatorProps) {
  const {
    housingScenarios,
    addHousingScenario,
    updateHousingScenario,
    deleteHousingScenario,
    duplicateHousingScenario,
    results,
  } = useCalculator();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('scenarios');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] =
    useState<HousingScenario | null>(null);

  // Accordion state - track which scenarios are expanded
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(
    new Set()
  );

  // Delete confirmation state
  const [deletingScenarioId, setDeletingScenarioId] = useState<string | null>(
    null
  );

  const actualHourlyWage = results?.actualHourlyWage ?? 0;
  const hasWage = actualHourlyWage > 0;
  const canAddScenario = housingScenarios.length < 4;
  const canCompare = housingScenarios.length >= 2;

  /**
   * Toggle accordion for a scenario
   */
  const toggleScenario = (id: string) => {
    setExpandedScenarios((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  /**
   * Open form in "add" mode
   */
  const handleAddClick = () => {
    setEditingScenario(null);
    setIsFormOpen(true);
    setViewMode('scenarios'); // Switch to scenarios view when adding
  };

  /**
   * Open form in "edit" mode
   */
  const handleEditClick = (scenario: HousingScenario) => {
    setEditingScenario(scenario);
    setIsFormOpen(true);
    // Collapse all scenarios when editing
    setExpandedScenarios(new Set());
  };

  /**
   * Save scenario (add or update)
   */
  const handleSave = (formData: HousingInputs & { name: string }) => {
    try {
      const { name, ...inputs } = formData;
      const now = new Date().toISOString();

      const scenarioData: Omit<HousingScenario, 'id' | 'results'> = {
        name,
        inputs: inputs as HousingInputs,
        createdAt: editingScenario?.createdAt ?? now,
        updatedAt: now,
      };

      if (editingScenario) {
        updateHousingScenario(editingScenario.id, scenarioData);
      } else {
        addHousingScenario(scenarioData);
      }
      setIsFormOpen(false);
      setEditingScenario(null);
    } catch (error) {
      // Error is already thrown by context, just log it
      console.error('Failed to save scenario:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Ekki tókst að vista atburðarás'
      );
    }
  };

  /**
   * Cancel form (close without saving)
   */
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingScenario(null);
  };

  /**
   * Delete scenario with confirmation
   */
  const handleDeleteClick = (id: string) => {
    setDeletingScenarioId(id);
  };

  const confirmDelete = () => {
    if (deletingScenarioId) {
      deleteHousingScenario(deletingScenarioId);
      setDeletingScenarioId(null);
      // Collapse if expanded
      setExpandedScenarios((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deletingScenarioId);
        return newSet;
      });
    }
  };

  const cancelDelete = () => {
    setDeletingScenarioId(null);
  };

  /**
   * Duplicate scenario
   */
  const handleDuplicateClick = (id: string) => {
    try {
      duplicateHousingScenario(id);
    } catch (error) {
      console.error('Failed to duplicate scenario:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Ekki tókst að afrita atburðarás'
      );
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Alert if no wage calculated */}
      {!hasWage && (
        <Alert variant="warning">
          <p className="font-medium">Raunverulegt tímakaup ekki reiknað</p>
          <p className="text-sm mt-1">
            Þú þarft að reikna raunverulegt tímakaup þitt fyrst til að sjá lífsorku og
            framtíðarverðmæti. Farðu í{' '}
            <a href="/" className="underline hover:no-underline">
              Raunverulegt Tímakaup
            </a>{' '}
            flipann.
          </p>
        </Alert>
      )}

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'scenarios' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('scenarios')}
          >
            Atburðarásir ({housingScenarios.length})
          </Button>
          <Button
            variant={viewMode === 'comparison' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('comparison')}
            disabled={!canCompare}
          >
            Samanburður
          </Button>
        </div>

        {viewMode === 'scenarios' && !isFormOpen && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddClick}
            disabled={!canAddScenario}
          >
            + Bæta við atburðarás
          </Button>
        )}
      </div>

      {/* Scenarios View */}
      {viewMode === 'scenarios' && (
        <div className="space-y-4">
          {/* Form (Add/Edit) */}
          {isFormOpen && (
            <HousingForm
              mode={editingScenario ? 'edit' : 'add'}
              scenario={editingScenario ?? undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {/* Scenario List */}
          {!isFormOpen && housingScenarios.length === 0 && (
            <Card>
              <div className="p-8 text-center text-neutral-500">
                <p className="mb-4">Engar húsnæðisatburðarásir enn</p>
                <Button variant="primary" size="sm" onClick={handleAddClick}>
                  Bæta við fyrstu atburðarás
                </Button>
              </div>
            </Card>
          )}

          {!isFormOpen &&
            housingScenarios.map((scenario) => {
              const isExpanded = expandedScenarios.has(scenario.id);
              const isDeleting = deletingScenarioId === scenario.id;

              return (
                <Card key={scenario.id} className="overflow-hidden">
                  {/* Scenario Header (Clickable) */}
                  <button
                    onClick={() => toggleScenario(scenario.id)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900">{scenario.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-neutral-600">
                          {formatCurrency(scenario.results.totalMonthlyCost)}/mán
                        </span>
                        {hasWage && (
                          <span className="text-sm text-primary-600">
                            {formatNumber(scenario.results.lifeEnergyYearlyWorkWeeks, 1)}{' '}
                            vinnuvikur/ár
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Actions (visible when collapsed) */}
                      {!isExpanded && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(scenario);
                            }}
                            aria-label="Breyta"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateClick(scenario.id);
                            }}
                            aria-label="Afrita"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(scenario.id);
                            }}
                            aria-label="Eyða"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}

                      {/* Expand/Collapse Icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && !isDeleting && (
                    <div className="px-6 pb-6 border-t border-neutral-200">
                      <div className="pt-4 space-y-4">
                        <HousingSummary scenario={scenario} />

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(scenario)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Breyta
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateClick(scenario.id)}
                            disabled={!canAddScenario}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Afrita
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(scenario.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eyða
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {isDeleting && (
                    <div className="px-6 pb-6 border-t border-neutral-200">
                      <div className="pt-4">
                        <Alert variant="warning">
                          <p className="font-medium">Ertu viss um að þú viljir eyða þessari atburðarás?</p>
                          <p className="text-sm mt-1">Þessa aðgerð er ekki hægt að afturkalla.</p>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={confirmDelete}
                            >
                              Já, eyða
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelDelete}
                            >
                              Hætta við
                            </Button>
                          </div>
                        </Alert>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}

          {/* Limit Warning */}
          {!isFormOpen && housingScenarios.length >= 4 && (
            <Alert variant="info">
              <p className="text-sm">
                Þú hefur náð hámarki af 4 atburðarásum. Eyðu einni til að bæta við fleiri.
              </p>
            </Alert>
          )}
        </div>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <HousingComparison scenarios={housingScenarios} />
      )}
    </div>
  );
}

// Helper functions (moved from imports for clarity)
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('is-IS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' kr';
}

function formatNumber(value: number, decimals: number): string {
  return new Intl.NumberFormat('is-IS', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
