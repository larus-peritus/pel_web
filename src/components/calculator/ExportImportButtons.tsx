'use client';

import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

/**
 * ResetButton Component
 *
 * Provides UI for resetting all calculator data.
 * Export/import functionality is available in the header.
 */
export function ExportImportButtons() {
  const { resetAll } = useCalculator();

  return (
    <Card variant="outlined">
      <CardContent className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={resetAll}
          className="text-danger-600 hover:bg-danger-50"
        >
          Endurstilla allt
        </Button>
      </CardContent>
    </Card>
  );
}
