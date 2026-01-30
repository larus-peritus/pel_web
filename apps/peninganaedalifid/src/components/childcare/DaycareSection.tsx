'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCalculator } from '@/context/CalculatorContext';
import type { ChildcareItem } from '@/types/childcare';
import { generateChildcareId } from '@/lib/calculations/childcare';

/**
 * DaycareSection - Leikskóli inputs component
 *
 * Allows users to add daycare expenses with:
 * - Municipal vs private toggle
 * - Monthly cost input
 * - Months per year (9-12)
 * - Number of children
 */
export function DaycareSection() {
  const { childcareItems, addChildcareItem, updateChildcareItem, deleteChildcareItem } = useCalculator();

  // Form state
  const [daycareType, setDaycareType] = useState<'municipal' | 'private'>('municipal');
  const [monthlyCost, setMonthlyCost] = useState(30000);
  const [monthsPerYear, setMonthsPerYear] = useState(12);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get existing daycare items
  const daycareItems = childcareItems.filter(item => item.category === 'daycare');

  // Daycare type options
  const daycareTypeOptions: SelectOption[] = [
    { value: 'municipal', label: 'Leikskóli sveitarfélags' },
    { value: 'private', label: 'Leikskóli einkarekinn' },
  ];

  // Handle add/update
  const handleSave = () => {
    const item: Omit<ChildcareItem, 'id'> = {
      category: 'daycare',
      name: daycareType === 'municipal' ? 'Leikskóli sveitarfélags' : 'Leikskóli einkarekinn',
      monthlyCost,
      monthsPerYear,
      numberOfChildren,
      details: { daycareType },
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
    // Only accept 'municipal' or 'private' - default to 'municipal' for other values
    const itemDaycareType = item.details?.daycareType;
    setDaycareType(itemDaycareType === 'municipal' || itemDaycareType === 'private' ? itemDaycareType : 'municipal');
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
    setDaycareType('municipal');
    setMonthlyCost(30000);
    setMonthsPerYear(12);
    setNumberOfChildren(1);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Leikskóli</h3>
        <p className="text-sm text-neutral-600">Bættu við leikskólakostnaði</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
          <Select
            label="Tegund leikskóla"
            options={daycareTypeOptions}
            value={daycareType}
            onChange={(value) => {
              setDaycareType(value as 'municipal' | 'private');
              // Update cost based on type
              if (value === 'municipal') {
                setMonthlyCost(30000);
              } else {
                setMonthlyCost(60000);
              }
            }}
          />

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
            helpText="Hversu marga mánuði á ári er barnið í leikskóla (9-12)"
          />

          <NumberInput
            label="Fjöldi barna"
            value={numberOfChildren}
            onChange={setNumberOfChildren}
            min={1}
            max={10}
            step={1}
            helpText="Hversu mörg börn eru í leikskóla"
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
        {daycareItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Núverandi leikskólar</h4>
            {daycareItems.map((item) => (
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
