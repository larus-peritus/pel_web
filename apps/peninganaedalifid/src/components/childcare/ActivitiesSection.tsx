'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCalculator } from '@/context/CalculatorContext';
import type { ChildcareItem } from '@/types/childcare';

/**
 * ActivitiesSection - Tónlistarskóli/íþróttir inputs component
 *
 * Allows users to add activity expenses with:
 * - Activity name
 * - Monthly cost
 * - Months per year
 * - Number of children
 * - Activity type (for categorization)
 */
export function ActivitiesSection() {
  const { childcareItems, addChildcareItem, updateChildcareItem, deleteChildcareItem } = useCalculator();

  // Form state
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [monthlyCost, setMonthlyCost] = useState(10000);
  const [monthsPerYear, setMonthsPerYear] = useState(9);
  const [numberOfChildren, setNumberOfChildren] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get existing activity items
  const activityItems = childcareItems.filter(item => item.category === 'activities');

  // Common activity presets
  const presets = [
    { name: 'Tónlistarskóli', type: 'Tónlist', cost: 15000, months: 9 },
    { name: 'Knattspyrna', type: 'Íþróttir', cost: 10000, months: 10 },
    { name: 'Handbolti', type: 'Íþróttir', cost: 10000, months: 10 },
    { name: 'Sund', type: 'Sund', cost: 8000, months: 12 },
    { name: 'Dans', type: 'Dans', cost: 12000, months: 9 },
  ];

  // Handle preset click
  const handlePresetClick = (preset: typeof presets[0]) => {
    setActivityName(preset.name);
    setActivityType(preset.type);
    setMonthlyCost(preset.cost);
    setMonthsPerYear(preset.months);
  };

  // Handle add/update
  const handleSave = () => {
    if (!activityName.trim()) {
      return;
    }

    const item: Omit<ChildcareItem, 'id'> = {
      category: 'activities',
      name: activityName,
      monthlyCost,
      monthsPerYear,
      numberOfChildren,
      details: { activityType: activityType || undefined },
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
    setActivityName(item.name);
    setActivityType(item.details?.activityType || '');
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
    setActivityName('');
    setActivityType('');
    setMonthlyCost(10000);
    setMonthsPerYear(9);
    setNumberOfChildren(1);
    setEditingId(null);
  };

  // Get badge variant based on activity type
  const getBadgeVariant = (type?: string): 'success' | 'warning' | 'info' | 'neutral' => {
    if (!type) return 'neutral';
    if (type.toLowerCase().includes('íþrótt')) return 'success';
    if (type.toLowerCase().includes('tónlist')) return 'info';
    if (type.toLowerCase().includes('dans')) return 'warning';
    return 'neutral';
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Tónlistarskóli og tímar</h3>
        <p className="text-sm text-neutral-600">Bættu við kostnaði fyrir íþróttir, tónlist og aðra tíma</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Presets */}
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">Vinsælt</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetClick(preset)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition-colors hover:border-primary-500 hover:bg-primary-50"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
          <Input
            label="Nafn á tíma"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="t.d. Píanó, Fótbolti, Karate"
            required
          />

          <Input
            label="Tegund (valfrjálst)"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            placeholder="t.d. Tónlist, Íþróttir, Dans"
            helpText="Notað til að flokka tímana"
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
            min={1}
            max={12}
            step={1}
            helpText="Hversu marga mánuði á ári er tíminn virkur"
          />

          <NumberInput
            label="Fjöldi barna"
            value={numberOfChildren}
            onChange={setNumberOfChildren}
            min={1}
            max={10}
            step={1}
            helpText="Hversu mörg börn fara í þennan tíma"
          />

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave} disabled={!activityName.trim()}>
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
        {activityItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Núverandi tímar</h4>
            {activityItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    {item.details?.activityType && (
                      <Badge variant={getBadgeVariant(item.details.activityType)} size="sm">
                        {item.details.activityType}
                      </Badge>
                    )}
                  </div>
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
