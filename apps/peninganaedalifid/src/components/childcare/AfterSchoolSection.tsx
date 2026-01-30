'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Button } from '@/components/ui/Button';
import { useCalculator } from '@/context/CalculatorContext';
import type { ChildcareItem } from '@/types/childcare';

/**
 * AfterSchoolSection - Frístund inputs component
 *
 * Allows users to add afterschool care expenses with:
 * - Monthly cost input
 * - Months per year (9-12)
 * - Number of children
 */
export function AfterSchoolSection() {
  const { childcareItems, addChildcareItem, updateChildcareItem, deleteChildcareItem } = useCalculator();

  // Form state
  const [monthlyCost, setMonthlyCost] = useState(25000);
  const [monthsPerYear, setMonthsPerYear] = useState(9);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get existing afterschool items
  const afterSchoolItems = childcareItems.filter(item => item.category === 'afterschool');

  // Handle add/update
  const handleSave = () => {
    const summerMonthsActive = monthsPerYear === 12;
    const item: Omit<ChildcareItem, 'id'> = {
      category: 'afterschool',
      name: summerMonthsActive ? 'Frístund (heilt ár)' : 'Frístund (vetur)',
      monthlyCost,
      monthsPerYear,
      numberOfChildren,
      details: { summerMonthsActive },
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
    setMonthlyCost(item.monthlyCost);
    setMonthsPerYear(item.monthsPerYear);
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
    setMonthlyCost(25000);
    setMonthsPerYear(9);
    setNumberOfChildren(1);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Frístund</h3>
        <p className="text-sm text-neutral-600">Bættu við frístundakostnaði</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
          <NumberInput
            label="Mánaðarlegur kostnaður"
            value={monthlyCost}
            onChange={setMonthlyCost}
            min={0}
            step={1000}
            suffix="kr"
          />

          <NumberInput
            label="Mánuðir á ári"
            value={monthsPerYear}
            onChange={setMonthsPerYear}
            min={9}
            max={12}
            step={1}
            helpText="9 mánuðir fyrir vetrartímabil, 12 fyrir allt árið"
          />

          <NumberInput
            label="Fjöldi barna"
            value={numberOfChildren}
            onChange={setNumberOfChildren}
            min={1}
            max={10}
            step={1}
            helpText="Hversu mörg börn eru í frístund"
          />

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
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
        {afterSchoolItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Núverandi frístundir</h4>
            {afterSchoolItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3"
              >
                <div>
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-600">
                    {item.monthlyCost.toLocaleString('is-IS')} kr/mán × {item.monthsPerYear} mán ×{' '}
                    {item.numberOfChildren} {item.numberOfChildren === 1 ? 'barn' : 'börn'}
                  </p>
                  <p className="text-sm font-medium text-primary-600">
                    Alls: {(item.monthlyCost * item.monthsPerYear * item.numberOfChildren).toLocaleString('is-IS')} kr/ár
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
