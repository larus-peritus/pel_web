'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import type { Period, SpendingData } from '@/types/calculator';
import { getEmptySpending } from '@/lib/utils/periodHelpers';
import { SPENDING_CATEGORIES, getCategoryLabel, getCategoryDescription } from '@/lib/constants/spendingCategories';

interface PeriodFormProps {
  period?: Period; // If provided, we're editing
  onSave: (data: Omit<Period, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

/**
 * Form for adding or editing a spending period
 * Includes period name, income, and all spending categories
 */
export function PeriodForm({ period, onSave, onCancel }: PeriodFormProps) {
  const [name, setName] = useState(period?.name || '');
  const [income, setIncome] = useState(period?.income || 0);
  const [spending, setSpending] = useState<SpendingData>(period?.spending || getEmptySpending());
  const [month, setMonth] = useState<number | undefined>(period?.month || undefined);
  const [year, setYear] = useState(period?.year || new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate start and end dates
    const startDate = month
      ? new Date(year, month - 1, 1).toISOString()
      : new Date(year, 0, 1).toISOString();

    const endDate = month
      ? new Date(year, month, 0).toISOString() // Last day of month
      : new Date(year, 11, 31).toISOString(); // Dec 31

    onSave({
      name,
      month,
      year,
      startDate,
      endDate,
      income,
      spending,
    });
  };

  const updateSpending = (category: keyof SpendingData, value: number) => {
    setSpending((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const isEditing = !!period;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Breyta tímabili' : 'Bæta við tímabili'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Skráðu mánaðarlegar tekjur og útgjöld fyrir tímabilið
            </p>
          </div>

          {/* Period name */}
          <div>
            <label htmlFor="period-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nafn tímabils
            </label>
            <input
              id="period-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.d. Janúar 2024"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Dæmi: "Janúar 2024", "Fyrri hluti 2024"
            </p>
          </div>

          {/* Month and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="period-month" className="block text-sm font-medium text-gray-700 mb-1">
                Mánuður (valfrjálst)
              </label>
              <select
                id="period-month"
                value={month || ''}
                onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Árið (ekki mánuður)</option>
                <option value="1">Janúar</option>
                <option value="2">Febrúar</option>
                <option value="3">Mars</option>
                <option value="4">Apríl</option>
                <option value="5">Maí</option>
                <option value="6">Júní</option>
                <option value="7">Júlí</option>
                <option value="8">Ágúst</option>
                <option value="9">September</option>
                <option value="10">Október</option>
                <option value="11">Nóvember</option>
                <option value="12">Desember</option>
              </select>
            </div>

            <div>
              <label htmlFor="period-year" className="block text-sm font-medium text-gray-700 mb-1">
                Ár
              </label>
              <input
                id="period-year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min="2020"
                max="2030"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Income */}
          <CurrencyInput
            label="Mánaðarlegar tekjur"
            value={income}
            onChange={setIncome}
            suffix="kr"
            required
          />

          {/* Spending Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Mánaðarleg útgjöld eftir flokkum
            </h4>
            <div className="space-y-3">
              {SPENDING_CATEGORIES.map((category) => (
                <CurrencyInput
                  key={category}
                  label={getCategoryLabel(category)}
                  value={spending[category] || 0}
                  onChange={(value) => updateSpending(category, value)}
                  suffix="kr"
                  helpText={getCategoryDescription(category)}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" variant="primary" className="flex-1">
              {isEditing ? 'Vista breytingar' : 'Bæta við tímabili'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Hætta við
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
