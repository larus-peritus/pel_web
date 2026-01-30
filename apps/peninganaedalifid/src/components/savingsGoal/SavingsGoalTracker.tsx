/**
 * Savings Goal Tracker Component
 * Embeddable component for managing savings goals
 */

'use client';

import { useState } from 'react';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { useToast } from '@/context/ToastContext';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { MissingWageDataPrompt } from './MissingWageDataPrompt';
import { SavingsGoalHeader } from './SavingsGoalHeader';
import { SavingsSummaryCard } from './SavingsSummaryCard';
import { SortControls } from './SortControls';
import { SavingsGoalList } from './SavingsGoalList';
import { SavingsGoalFormModal } from './SavingsGoalFormModal';
import type { SavingsGoal, SavingsGoalInput } from '@/types/savingsGoal';

export function SavingsGoalTracker() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    markAsCompleted,
    getCalculations,
    getSummary,
    actualHourlyWage,
    sortBy,
    setSortBy,
    canAddMore,
  } = useSavingsGoals();

  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const summary = getSummary();

  // Check if wage calculator data exists
  if (actualHourlyWage === null) {
    return <MissingWageDataPrompt />;
  }

  const handleAddClick = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditClick = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleSaveGoal = (input: SavingsGoalInput) => {
    try {
      if (editingGoal) {
        updateGoal(editingGoal.id, input);
        addToast({ variant: 'success', message: 'Markmið uppfært!' });
      } else {
        addGoal(input);
        addToast({ variant: 'success', message: 'Markmið búið til!' });
      }
      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      addToast({ variant: 'error', message: error instanceof Error ? error.message : 'Villa kom upp' });
    }
  };

  const handleDeleteClick = (goalId: string) => {
    setShowDeleteConfirm(goalId);
  };

  const handleConfirmDelete = () => {
    if (showDeleteConfirm) {
      deleteGoal(showDeleteConfirm);
      setShowDeleteConfirm(null);
      addToast({ variant: 'success', message: 'Markmið eytt' });
    }
  };

  const handleMarkComplete = (goalId: string) => {
    markAsCompleted(goalId);
    addToast({ variant: 'success', message: '🎉 Markmið náð!' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  return (
    <Section>
      <Container>
        {/* Header */}
        <SavingsGoalHeader
          canAddMore={canAddMore}
          onAddClick={handleAddClick}
        />

        {/* Summary Card */}
        {goals.length > 0 && <SavingsSummaryCard summary={summary} />}

        {/* Sort Controls */}
        {goals.length > 0 && <SortControls sortBy={sortBy} onChange={setSortBy} />}

        {/* Goals List */}
        <SavingsGoalList
          goals={goals}
          getCalculations={getCalculations}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onMarkComplete={handleMarkComplete}
          showDeleteConfirm={showDeleteConfirm}
          onConfirmDelete={handleConfirmDelete}
          onCancelDelete={() => setShowDeleteConfirm(null)}
        />

        {/* Goal Form Modal */}
        {showForm && (
          <SavingsGoalFormModal
            goal={editingGoal}
            onSave={handleSaveGoal}
            onCancel={handleCancel}
          />
        )}
      </Container>
    </Section>
  );
}
