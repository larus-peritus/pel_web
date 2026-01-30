'use client';

import { useState } from 'react';
import { useCalculator } from '@/context/CalculatorContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const MAX_SCENARIOS = 3;

/**
 * Scenario management component
 * Allows saving, loading, and deleting comparison scenarios
 */
export function ScenarioManager() {
  const {
    results,
    scenarios,
    saveCurrentAsScenario,
    loadScenario,
    deleteScenario,
  } = useCalculator();

  const [newScenarioName, setNewScenarioName] = useState('');
  const [isNaming, setIsNaming] = useState(false);

  const canSave = results && scenarios.length < MAX_SCENARIOS;

  const handleSave = () => {
    if (!newScenarioName.trim()) return;
    saveCurrentAsScenario(newScenarioName.trim());
    setNewScenarioName('');
    setIsNaming(false);
  };

  const handleStartNaming = () => {
    setIsNaming(true);
  };

  const handleCancelNaming = () => {
    setNewScenarioName('');
    setIsNaming(false);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Vistuð útgáfa
            </h3>
            <p className="text-sm text-neutral-600">
              Berðu saman allt að {MAX_SCENARIOS} mismunandi útgáfur
            </p>
          </div>
          <Badge variant="neutral">
            {scenarios.length}/{MAX_SCENARIOS}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save new scenario */}
        {!isNaming ? (
          <Button
            variant="primary"
            onClick={handleStartNaming}
            disabled={!canSave}
            className="w-full"
          >
            {scenarios.length >= MAX_SCENARIOS
              ? 'Hámarksfjölda náð'
              : !results
                ? 'Sláðu inn tekjur til að vista útgáfu'
                : 'Vista núverandi sem útgáfu'}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              placeholder="Nafn útgáfur (t.d., Núverandi starf)"
              className="flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancelNaming();
              }}
            />
            <Button variant="primary" onClick={handleSave} disabled={!newScenarioName.trim()}>
              Vista
            </Button>
            <Button variant="secondary" onClick={handleCancelNaming}>
              Hætta við
            </Button>
          </div>
        )}

        {/* Scenario list */}
        {scenarios.length > 0 ? (
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    {scenario.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Raunveruleg: {formatCurrency(scenario.results.actualHourlyWage)}/klst
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadScenario(scenario.id)}
                  >
                    Hlaða
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => deleteScenario(scenario.id)}
                    className="text-danger-600 hover:bg-danger-50"
                  >
                    Eyða
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 text-center py-4">
            Engin vistuð útgáfa enn. Vistaðu núverandi útreikninga til að bera saman síðar.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
