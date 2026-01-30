'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCalculator } from '@/context/CalculatorContext';
import type { ChildcareItem } from '@/types/childcare';
import { calculateUniversitySavings } from '@/lib/calculations/childcare';

/**
 * UniversitySavingsSection - Háskólasparnaður component
 *
 * Allows users to plan for university savings with:
 * - Monthly savings amount
 * - Years until university
 * - Return rate selector (3%, 5%, 7%)
 * - Future value projection display
 */
export function UniversitySavingsSection() {
  const { childcareItems, addChildcareItem, updateChildcareItem, deleteChildcareItem } = useCalculator();

  // Form state
  const [currentAge, setCurrentAge] = useState(5);
  const [collegeAge, setCollegeAge] = useState(18);
  const [costPerYear, setCostPerYear] = useState(300000);
  const [yearsInCollege, setYearsInCollege] = useState(4);
  const [expectedReturn, setExpectedReturn] = useState(0.05);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get existing university savings items
  const universityItems = childcareItems.filter(item => item.category === 'university');

  // Return rate options
  const returnRateOptions: SelectOption[] = [
    { value: '0.03', label: '3% - Íhaldssamt (sparnaðarreikningur)' },
    { value: '0.05', label: '5% - Meðaltal (blandaður sparnaður)' },
    { value: '0.07', label: '7% - Vaxandi (hlutabréfamarkaður)' },
  ];

  // Calculate savings projection
  const savingsProjection = currentAge < collegeAge
    ? calculateUniversitySavings({
        currentAge,
        collegeAge,
        costPerYear,
        yearsInCollege,
        expectedReturn,
      })
    : null;

  // Handle add/update
  const handleSave = () => {
    if (!savingsProjection) {
      return;
    }

    const item: Omit<ChildcareItem, 'id'> = {
      category: 'university',
      name: 'Háskólasparnaður',
      monthlyCost: savingsProjection.monthlyPaymentNeeded,
      monthsPerYear: 12,
      numberOfChildren: 1,
      details: {
        currentAge,
        collegeAge,
        costPerYear,
        yearsInCollege,
        expectedReturn,
      },
    };

    if (editingId) {
      updateChildcareItem(editingId, item);
      setEditingId(null);
    } else {
      addChildcareItem(item);
    }

    // Don't reset form after saving so user can see the projection
  };

  // Handle edit
  const handleEdit = (item: ChildcareItem) => {
    setEditingId(item.id);
    setCurrentAge(item.details?.currentAge || 5);
    setCollegeAge(item.details?.collegeAge || 18);
    setCostPerYear(item.details?.costPerYear || 300000);
    setYearsInCollege(item.details?.yearsInCollege || 4);
    setExpectedReturn(item.details?.expectedReturn || 0.05);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteChildcareItem(id);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Háskólasparnaður</h3>
        <p className="text-sm text-neutral-600">Skipulegðu sparnaðaráætlun fyrir háskólakostnað</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="space-y-4 rounded-lg bg-neutral-50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="Núverandi aldur barns"
              value={currentAge}
              onChange={setCurrentAge}
              min={0}
              max={25}
              step={1}
              suffix="ára"
            />

            <NumberInput
              label="Aldur við upphaf háskóla"
              value={collegeAge}
              onChange={setCollegeAge}
              min={16}
              max={30}
              step={1}
              suffix="ára"
            />
          </div>

          <NumberInput
            label="Áætlaður háskólakostnaður á ári"
            value={costPerYear}
            onChange={setCostPerYear}
            min={0}
            step={50000}
            suffix="kr/ár"
            helpText="Skólagjöld, bækur og búseta"
          />

          <NumberInput
            label="Áætlaður fjöldi ára í háskóla"
            value={yearsInCollege}
            onChange={setYearsInCollege}
            min={1}
            max={10}
            step={1}
            suffix="ár"
          />

          <Select
            label="Áætluð ávöxtun"
            options={returnRateOptions}
            value={expectedReturn.toString()}
            onChange={(value) => setExpectedReturn(parseFloat(value))}
          />

          {/* Savings projection display */}
          {savingsProjection && savingsProjection.monthsUntilCollege > 0 && (
            <div className="space-y-3 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <div>
                <p className="text-sm text-neutral-600">Heildarkostnaður háskóla</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {savingsProjection.totalCost.toLocaleString('is-IS')} kr
                </p>
                <p className="text-xs text-neutral-600">
                  {costPerYear.toLocaleString('is-IS')} kr/ár × {yearsInCollege} ár
                </p>
              </div>

              <div className="border-t border-primary-200 pt-3">
                <p className="text-sm text-neutral-600">Þarf að spara á mánuði</p>
                <p className="text-3xl font-bold text-primary-600">
                  {Math.round(savingsProjection.monthlyPaymentNeeded).toLocaleString('is-IS')} kr/mán
                </p>
                <p className="text-xs text-neutral-600">
                  Til {collegeAge} ára aldurs ({savingsProjection.monthsUntilCollege} mánuðir)
                </p>
              </div>

              <div className="border-t border-primary-200 pt-3">
                <p className="text-xs text-neutral-600">
                  Með {(expectedReturn * 100).toFixed(1)}% ávöxtun sparar þú{' '}
                  {Math.round(
                    savingsProjection.totalCost -
                      savingsProjection.monthlyPaymentNeeded * savingsProjection.monthsUntilCollege
                  ).toLocaleString('is-IS')}{' '}
                  kr samanborið við sparnaðarreikning án vaxta
                </p>
              </div>
            </div>
          )}

          {savingsProjection && savingsProjection.monthsUntilCollege === 0 && (
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
              <p className="text-sm text-warning-700">
                Barnið er nú þegar komið í háskólaaldur. Þú getur ekki áætlað framtíðarsparnaður.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!savingsProjection || savingsProjection.monthsUntilCollege === 0}
            >
              {editingId ? 'Uppfæra' : 'Bæta við'}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={() => setEditingId(null)}>
                Hætta við
              </Button>
            )}
          </div>
        </div>

        {/* List of existing items */}
        {universityItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Núverandi háskólasparnaðaráætlanir</h4>
            {universityItems.map((item) => {
              const projection = item.details?.currentAge !== undefined &&
                item.details?.collegeAge !== undefined &&
                item.details?.costPerYear !== undefined &&
                item.details?.yearsInCollege !== undefined &&
                item.details?.expectedReturn !== undefined
                ? calculateUniversitySavings({
                    currentAge: item.details.currentAge,
                    collegeAge: item.details.collegeAge,
                    costPerYear: item.details.costPerYear,
                    yearsInCollege: item.details.yearsInCollege,
                    expectedReturn: item.details.expectedReturn,
                  })
                : null;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3"
                >
                  <div>
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-600">
                      {item.monthlyCost.toLocaleString('is-IS')} kr/mán með{' '}
                      {((item.details?.expectedReturn || 0) * 100).toFixed(1)}% ávöxtun
                    </p>
                    {projection && (
                      <>
                        <p className="text-sm text-neutral-600">
                          Til {item.details?.collegeAge} ára aldurs ({projection.monthsUntilCollege} mán)
                        </p>
                        <p className="text-sm font-medium text-primary-600">
                          Heildarkostnaður: {projection.totalCost.toLocaleString('is-IS')} kr
                        </p>
                      </>
                    )}
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
