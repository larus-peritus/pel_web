/**
 * Modal form for creating/editing savings goals
 */

'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { validateSavingsGoalInput } from '@/lib/savingsGoal/validation';
import type { SavingsGoal, SavingsGoalInput, ValidationResult } from '@/types/savingsGoal';

interface SavingsGoalFormModalProps {
  goal: SavingsGoal | null;
  onSave: (input: SavingsGoalInput) => void;
  onCancel: () => void;
}

export function SavingsGoalFormModal({ goal, onSave, onCancel }: SavingsGoalFormModalProps) {
  const [formData, setFormData] = useState<SavingsGoalInput>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    monthlyContribution: 0,
  });

  const [errors, setErrors] = useState<ValidationResult['errors']>({});

  // Initialize form data from goal prop
  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
      });
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSavingsGoalInput(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSave(formData);
  };

  const handleFieldChange = (field: keyof SavingsGoalInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {goal ? 'Breyta markmiði' : 'Bæta við markmiði'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Loka"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <Input
            label="Nafn markmiðs"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={errors.name}
            placeholder="t.d. Útborgun á húsnæði"
            maxLength={100}
            required
          />

          {/* Target Amount */}
          <CurrencyInput
            label="Markkrónutala"
            value={formData.targetAmount}
            onChange={(value: number) => handleFieldChange('targetAmount', value)}
            error={errors.targetAmount}
            required
          />

          {/* Current Amount */}
          <CurrencyInput
            label="Núverandi sparnaður"
            value={formData.currentAmount}
            onChange={(value: number) => handleFieldChange('currentAmount', value)}
            error={errors.currentAmount}
          />

          {/* Monthly Contribution */}
          <CurrencyInput
            label="Mánaðarlegt framlag"
            value={formData.monthlyContribution}
            onChange={(value: number) => handleFieldChange('monthlyContribution', value)}
            error={errors.monthlyContribution}
            helpText="Hvað mikið er lagt til hliðar mánaðarlega"
          />

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {goal ? 'Vista breytingar' : 'Búa til markmið'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Hætta við
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
