'use client';

import { useRef } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

/**
 * ExportImportButtons Component
 *
 * Provides UI for exporting calculator data to JSON file,
 * importing data from JSON file, and resetting all data.
 */
export function ExportImportButtons() {
  const { exportData, importData, resetAll } = useCalculator();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
      } catch (error) {
        alert('Mistókst að flytja inn skrá. Vinsamlegast athugaðu skráarsniðið.');
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card variant="outlined">
      <CardContent className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={exportData}>
          Flytja út gögn
        </Button>
        <Button variant="secondary" size="sm" onClick={handleImportClick}>
          Flytja inn gögn
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={resetAll}
          className="text-danger-600 hover:bg-danger-50"
        >
          Endurstilla allt
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
