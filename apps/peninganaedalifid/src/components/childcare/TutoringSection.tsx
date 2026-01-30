'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCalculator } from '@/context/CalculatorContext';
import type { ChildcareItem } from '@/types/childcare';

/**
 * TutoringSection - Einkakennsla inputs component
 *
 * Allows users to add tutoring expenses with:
 * - Subject/name
 * - Hourly rate
 * - Hours per month
 * - Number of children (default 1)
 */
export function TutoringSection() {
  const { childcareItems, addChildcareItem, updateChildcareItem, deleteChildcareItem } = useCalculator();

  // Form state
  const [subject, setSubject] = useState('');
  const [hourlyRate, setHourlyRate] = useState(8000);
  const [hoursPerMonth, setHoursPerMonth] = useState(4);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get existing tutoring items
  const tutoringItems = childcareItems.filter(item => item.category === 'tutoring');

  // Calculate monthly cost based on hourly rate and hours
  const monthlyCost = hourlyRate * hoursPerMonth;

  // Handle add/update
  const handleSave = () => {
    if (!subject.trim()) {
      return;
    }

    const item: Omit<ChildcareItem, 'id'> = {
      category: 'tutoring',
      name: `Einkakennsla (${subject})`,
      monthlyCost,
      monthsPerYear: 12, // Default to full year for tutoring
      numberOfChildren,
      details: {
        hourlyRate,
        hoursPerMonth,
      },
    };

    if (editingId) {
      updateChildcareItem(editingId, item);
      setEditingId(null);
    } else {
      addChildcareItem(item);
    }

    // Reset form to defaults
    resetForm();
  };

  // Handle edit
  const handleEdit = (item: ChildcareItem) => {
    setEditingId(item.id);
    // Extract subject from name (remove "Einkakennsla (" and ")")
    const subjectMatch = item.name.match(/Einkakennsla \((.*)\)/);
    setSubject(subjectMatch ? subjectMatch[1] : item.name);
    setHourlyRate(item.details?.hourlyRate || 8000);
    setHoursPerMonth(item.details?.hoursPerMonth || 4);
    setNumberOfChildren(item.numberOfChildren);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteChildcareItem(id);
    if (editingId === id) {
      setEditingId(null);
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setSubject('');
    setHourlyRate(8000);
    setHoursPerMonth(4);
    setNumberOfChildren(1);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Einkakennsla</h3>
        <p className="text-sm text-neutral-600">Bættu við kostnaði fyrir einkakennslutíma</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
          <Input
            label="Fag / Svið"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="t.d. Stærðfræði, Enska, Forritun"
            required
          />

          <NumberInput
            label="Verð á klukkustund"
            value={hourlyRate}
            onChange={setHourlyRate}
            min={0}
            step={500}
            suffix="kr/klst"
          />

          <NumberInput
            label="Klukkustundir á mánuði"
            value={hoursPerMonth}
            onChange={setHoursPerMonth}
            min={0}
            max={100}
            step={1}
            helpText="Hversu margar klukkustundir á mánuði"
          />

          <NumberInput
            label="Fjöldi barna"
            value={numberOfChildren}
            onChange={setNumberOfChildren}
            min={1}
            max={10}
            step={1}
            helpText="Hversu mörg börn fá einkakennslutíma"
          />

          {/* Calculated monthly cost display */}
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
            <p className="text-sm text-neutral-600">Mánaðarlegur kostnaður</p>
            <p className="text-2xl font-bold text-primary-600">
              {monthlyCost.toLocaleString('is-IS')} kr/mán
            </p>
            <p className="text-xs text-neutral-600">
              {hourlyRate.toLocaleString('is-IS')} kr/klst × {hoursPerMonth} klst
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave} disabled={!subject.trim()}>
              {editingId ? 'Uppfæra' : 'Bæta við'}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={resetForm}>
                Hætta við
              </Button>
            )}
          </div>
        </div>

        {/* List of existing items */}
        {tutoringItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Núverandi einkakennslutímar</h4>
            {tutoringItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3"
              >
                <div>
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-600">
                    {item.details?.hourlyRate?.toLocaleString('is-IS')} kr/klst ×{' '}
                    {item.details?.hoursPerMonth} klst/mán ×{' '}
                    {item.numberOfChildren} {item.numberOfChildren === 1 ? 'barn' : 'börn'}
                  </p>
                  <p className="text-sm font-medium text-primary-600">
                    Alls: {(item.monthlyCost * 12 * item.numberOfChildren).toLocaleString('is-IS')} kr/ár
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                    Breyta
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                    Eyða
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
