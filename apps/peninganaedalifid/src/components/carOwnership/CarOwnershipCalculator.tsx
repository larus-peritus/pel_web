'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import {
  CarOwnershipForm,
  CarOwnershipSummary,
  CarOwnershipComparison,
} from '@/components/carOwnership';
import type { CarOwnershipScenario, CarOwnershipInputs } from '@/types/car-ownership';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';

/**
 * Props for CarOwnershipCalculator component
 */
export interface CarOwnershipCalculatorProps {
  className?: string;
}

type ViewMode = 'scenarios' | 'comparison';

/**
 * CarOwnershipCalculator - Main car ownership cost tracking component
 *
 * Combines all car ownership subcomponents into a unified interface:
 * - "Bæta við bíl" button to add new scenarios (disabled at 4 scenarios)
 * - Accordion list of scenarios, showing CarOwnershipSummary when collapsed
 * - CarOwnershipForm shown when editing a scenario
 * - Delete scenario with confirmation
 * - Duplicate scenario action
 * - Toggle between "Bílar" and "Samanburður" views
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
 * - See total impact on life energy and future value
 *
 * @example
 * ```tsx
 * <CarOwnershipCalculator />
 * ```
 */
export function CarOwnershipCalculator({ className }: CarOwnershipCalculatorProps) {
  const {
    carOwnershipScenarios,
    addCarOwnershipScenario,
    updateCarOwnershipScenario,
    deleteCarOwnershipScenario,
    duplicateCarOwnershipScenario,
    results,
  } = useCalculator();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('scenarios');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] =
    useState<CarOwnershipScenario | null>(null);

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
  const canAddScenario = carOwnershipScenarios.length < 4;
  const canCompare = carOwnershipScenarios.length >= 2;

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
  const handleEditClick = (scenario: CarOwnershipScenario) => {
    setEditingScenario(scenario);
    setIsFormOpen(true);
    // Collapse all scenarios when editing
    setExpandedScenarios(new Set());
  };

  /**
   * Save scenario (add or update)
   */
  const handleSave = (formData: CarOwnershipInputs & { name: string }) => {
    try {
      const { name, ...inputs } = formData;
      const now = new Date().toISOString();

      const scenarioData: Omit<CarOwnershipScenario, 'id' | 'results'> = {
        name,
        inputs: inputs as CarOwnershipInputs,
        createdAt: editingScenario?.createdAt ?? now,
        updatedAt: now,
      };

      if (editingScenario) {
        updateCarOwnershipScenario(editingScenario.id, scenarioData);
      } else {
        addCarOwnershipScenario(scenarioData);
      }

      // Close form
      setIsFormOpen(false);
      setEditingScenario(null);
    } catch (error) {
      console.error('Error saving car ownership scenario:', error);
    }
  };

  /**
   * Cancel form editing
   */
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingScenario(null);
  };

  /**
   * Delete scenario
   */
  const handleDelete = (id: string) => {
    deleteCarOwnershipScenario(id);
    setDeletingScenarioId(null);
  };

  /**
   * Duplicate scenario
   */
  const handleDuplicate = (scenario: CarOwnershipScenario) => {
    if (carOwnershipScenarios.length >= 4) {
      alert('Hámark 4 bílar. Eyðið einum til að búa til nýjan.');
      return;
    }
    duplicateCarOwnershipScenario(scenario.id);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Add button */}
      {!isFormOpen && (
        <div className="flex justify-end">
          <Button
            onClick={handleAddClick}
            disabled={!canAddScenario}
            variant="primary"
          >
            Bæta við bíl
          </Button>
        </div>
      )}

      {/* Warning if no wage set */}
      {!hasWage && (
        <Alert variant="warning">
          <p>
            <strong>Athugið:</strong> Settu inn raunverulegt tímakaup í aðal
            reiknivélinni til að sjá lífsorku kostnað og heildaráhrif.
          </p>
        </Alert>
      )}

      {/* View Mode Tabs */}
      {!isFormOpen && carOwnershipScenarios.length > 0 && (
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setViewMode('scenarios')}
            className={cn(
              'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
              viewMode === 'scenarios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            Bílar ({carOwnershipScenarios.length})
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            disabled={!canCompare}
            className={cn(
              'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
              viewMode === 'comparison'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900',
              !canCompare && 'opacity-50 cursor-not-allowed'
            )}
          >
            Samanburður
          </button>
        </div>
      )}

      {/* Form View */}
      {isFormOpen && (
        <CarOwnershipForm
          mode={editingScenario ? 'edit' : 'add'}
          scenario={editingScenario || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Scenarios View */}
      {!isFormOpen && viewMode === 'scenarios' && (
        <div className="space-y-4">
          {carOwnershipScenarios.length === 0 && (
            <Card>
              <div className="p-8 text-center">
                <p className="text-gray-600">
                  Engar bílasviðsmyndir ennþá. Smelltu á &quot;Bæta við bíl&quot; til að byrja.
                </p>
              </div>
            </Card>
          )}

          {carOwnershipScenarios.map((scenario) => {
            const isExpanded = expandedScenarios.has(scenario.id);
            const isDeleting = deletingScenarioId === scenario.id;

            return (
              <Card key={scenario.id}>
                {/* Scenario Header */}
                <div className="p-4 flex items-center justify-between">
                  <button
                    onClick={() => toggleScenario(scenario.id)}
                    className="flex-1 flex items-center gap-3 text-left group"
                  >
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                        {scenario.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(scenario.results.totalMonthlyCost)}/mán •{' '}
                        {formatCurrency(scenario.results.totalYearlyCost)}/ár
                      </p>
                    </div>
                  </button>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(scenario)}
                      title="Breyta"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(scenario)}
                      disabled={!canAddScenario}
                      title="Afrita"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingScenarioId(scenario.id)}
                      title="Eyða"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {isDeleting && (
                  <div className="px-4 pb-4">
                    <Alert variant="warning">
                      <p className="text-sm mb-3">
                        Ertu viss um að þú viljir eyða &quot;{scenario.name}&quot;?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setDeletingScenarioId(null)}
                        >
                          Hætta við
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDelete(scenario.id)}
                        >
                          Já, eyða
                        </Button>
                      </div>
                    </Alert>
                  </div>
                )}

                {/* Expanded Summary */}
                {isExpanded && !isDeleting && (
                  <div className="border-t border-gray-200 p-4">
                    <CarOwnershipSummary
                      scenario={scenario}
                      actualHourlyWage={actualHourlyWage}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Comparison View */}
      {!isFormOpen && viewMode === 'comparison' && (
        <CarOwnershipComparison
          scenarios={carOwnershipScenarios}
          actualHourlyWage={actualHourlyWage}
        />
      )}
    </div>
  );
}
