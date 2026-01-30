'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import {
  CommuteForm,
  CommuteSummary,
  CommuteComparison,
} from '@/components/commute';
import type { CommuteScenario, CommuteInputs } from '@/types/calculator';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';

/**
 * Props for CommuteCalculator component
 */
export interface CommuteCalculatorProps {
  className?: string;
}

type ViewMode = 'scenarios' | 'comparison';

/**
 * CommuteCalculator - Main commute cost tracking component
 *
 * Combines all commute subcomponents into a unified interface:
 * - "Bæta við atburðarás" button to add new scenarios (disabled at 4 scenarios)
 * - Accordion list of scenarios, showing CommuteSummary when collapsed
 * - CommuteForm shown when editing a scenario
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
 * <CommuteCalculator />
 * ```
 */
export function CommuteCalculator({ className }: CommuteCalculatorProps) {
  const {
    commuteScenarios,
    addCommuteScenario,
    updateCommuteScenario,
    deleteCommuteScenario,
    duplicateCommuteScenario,
    results,
  } = useCalculator();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('scenarios');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScenario, setEditingScenario] =
    useState<CommuteScenario | null>(null);

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
  const canAddScenario = commuteScenarios.length < 4;
  const canCompare = commuteScenarios.length >= 2;

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
  const handleEditClick = (scenario: CommuteScenario) => {
    setEditingScenario(scenario);
    setIsFormOpen(true);
    // Collapse all scenarios when editing
    setExpandedScenarios(new Set());
  };

  /**
   * Save scenario (add or update)
   * CommuteForm provides flat data (CommuteInputs & { name }), we need to transform it
   */
  const handleSave = (formData: CommuteInputs & { name: string }) => {
    try {
      const { name, ...inputs } = formData;
      const now = new Date().toISOString();

      const scenarioData: Omit<CommuteScenario, 'id' | 'results'> = {
        name,
        inputs: inputs as CommuteInputs,
        createdAt: editingScenario?.createdAt ?? now,
        updatedAt: now,
      };

      if (editingScenario) {
        updateCommuteScenario(editingScenario.id, scenarioData);
      } else {
        addCommuteScenario(scenarioData);
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
      deleteCommuteScenario(deletingScenarioId);
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
      duplicateCommuteScenario(id);
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
    <div className={cn('w-full space-y-6', className)}>
      {/* Add button */}
      {!isFormOpen && viewMode === 'scenarios' && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleAddClick}
            size="md"
            disabled={!canAddScenario}
            title={
              !canAddScenario
                ? 'Hámark 4 atburðarásir - eyddu einni til að búa til nýja'
                : undefined
            }
          >
            + Bæta við atburðarás
          </Button>
        </div>
      )}

      {/* Warning if actualHourlyWage is missing */}
      {!hasWage && (
        <Alert variant="warning">
          <p className="font-medium">Raunverulegt tímakaup vantar</p>
          <p className="text-sm">
            Til að sjá lífsorku kostnað vinnuferðar þarftu fyrst að fylla út{' '}
            <a
              href="#timakaup"
              className="font-medium underline hover:text-warning-800"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to top where the calculator tabs are
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Raunverulegt Tímakaup
            </a>{' '}
            í aðalreiknivélinni.
          </p>
        </Alert>
      )}

      {/* Max scenarios warning */}
      {!canAddScenario && !isFormOpen && (
        <Alert variant="info">
          <p className="text-sm">
            Þú hefur náð hámarki (4 atburðarásir). Eyddu einni til að búa til
            nýja.
          </p>
        </Alert>
      )}

      {/* View mode tabs */}
      {!isFormOpen && commuteScenarios.length > 0 && (
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setViewMode('scenarios')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'scenarios'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Atburðarásir ({commuteScenarios.length})
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            disabled={!canCompare}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              viewMode === 'comparison'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-600 hover:text-neutral-900',
              !canCompare && 'cursor-not-allowed opacity-50'
            )}
            title={
              !canCompare
                ? 'Þú þarft að minnsta kosti 2 atburðarásir til að bera saman'
                : undefined
            }
          >
            Samanburður
          </button>
        </div>
      )}

      {/* Form (shown inline when open) */}
      {isFormOpen && (
        <div className="animate-fadeIn">
          <CommuteForm
            mode={editingScenario ? 'edit' : 'add'}
            scenario={editingScenario || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Content based on view mode */}
      {!isFormOpen && viewMode === 'scenarios' && (
        <div className="space-y-4">
          {/* Scenario list (accordion) */}
          {commuteScenarios.map((scenario) => {
            const isExpanded = expandedScenarios.has(scenario.id);
            const isDeleting = deletingScenarioId === scenario.id;

            return (
              <Card key={scenario.id} className="overflow-hidden">
                {/* Scenario header (clickable to expand/collapse) */}
                <div
                  className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                  onClick={() => toggleScenario(scenario.id)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 truncate">
                        {scenario.name}
                        {scenario.isCurrent && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                            Núverandi
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {scenario.inputs.commuteMethod === 'car' && '🚗 Bíll'}
                        {scenario.inputs.commuteMethod === 'transit' &&
                          '🚌 Almenningssamgöngur'}
                        {scenario.inputs.commuteMethod === 'bike' &&
                          '🚴 Hjólreiðar'}
                        {scenario.inputs.commuteMethod === 'walk' && '🚶 Ganga'}
                        {scenario.inputs.commuteMethod === 'remote' &&
                          '🏠 Fjarvinnu'}
                        {' • '}
                        {scenario.inputs.distanceKm} km
                        {' • '}
                        {scenario.inputs.daysPerWeek} dagar/viku
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(scenario)}
                      title="Breyta"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateClick(scenario.id)}
                      disabled={!canAddScenario}
                      title={
                        canAddScenario
                          ? 'Afrita'
                          : 'Hámark 4 atburðarásir náð'
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(scenario.id)}
                      title="Eyða"
                      className="text-error-600 hover:text-error-700 hover:bg-error-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Delete confirmation (shown inline) */}
                {isDeleting && (
                  <div className="border-t border-neutral-200 bg-error-50 px-4 py-3">
                    <p className="text-sm font-medium text-error-900 mb-3">
                      Ertu viss um að þú viljir eyða þessari atburðarás?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={confirmDelete}
                      >
                        Eyða
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelDelete}>
                        Hætta við
                      </Button>
                    </div>
                  </div>
                )}

                {/* Expanded content (summary) */}
                {isExpanded && !isDeleting && (
                  <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                    <CommuteSummary
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

      {/* Comparison view */}
      {!isFormOpen && viewMode === 'comparison' && (
        <div>
          {canCompare ? (
            <CommuteComparison
              scenarios={commuteScenarios}
              actualHourlyWage={actualHourlyWage}
            />
          ) : (
            <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50">
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
                  📊
                </div>
                <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                  Bættu við fleiri atburðarásir
                </h2>
                <p className="mb-6 text-neutral-600">
                  Þú þarft að minnsta kosti 2 atburðarásir til að bera saman
                </p>
                <Button
                  variant="primary"
                  onClick={() => setViewMode('scenarios')}
                  size="lg"
                >
                  Fara í atburðarásir
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty state (only shown when no scenarios and form is not open) */}
      {commuteScenarios.length === 0 && !isFormOpen && (
        <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
              🚗
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900">
              Byrjaðu að greina vinnuferðir
            </h2>
            <p className="mb-6 text-neutral-600">
              Bættu við vinnuferðaratburðarás til að sjá raunverulegan kostnað í
              tíma og peningum
            </p>
            <Button variant="primary" onClick={handleAddClick} size="lg">
              + Bæta við fyrstu atburðarás
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
