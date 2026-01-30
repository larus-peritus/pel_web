'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { InflationAlert } from '@/types/calculator';

interface AlertsListProps {
  alerts: InflationAlert[];
  onDismiss?: (alertId: string) => void;
}

/**
 * Display alerts and suggestions for lifestyle inflation
 * Shows warnings and actionable suggestions per category
 */
export function AlertsList({ alerts, onDismiss }: AlertsListProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlerts.has(alert.id) && !alert.dismissed
  );

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  if (visibleAlerts.length === 0) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-3">✓</div>
          <p className="text-lg font-semibold text-green-700 mb-2">
            Engar viðvaranir
          </p>
          <p className="text-sm text-gray-600">
            Útgjöldin þín eru í góðu jafnvægi. Haltu áfram!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get icon based on alert type
  const getAlertIcon = (type: InflationAlert['type']) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'critical':
        return '🚨';
    }
  };

  // Get color based on alert type
  const getAlertColor = (type: InflationAlert['type']) => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          heading: 'text-blue-900',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          heading: 'text-yellow-900',
        };
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          heading: 'text-red-900',
        };
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Viðvaranir og tillögur
      </h3>

      {visibleAlerts.map((alert) => {
        const colors = getAlertColor(alert.type);

        return (
          <Card key={alert.id} className={`${colors.bg} ${colors.border} border-2`}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">
                  {getAlertIcon(alert.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <h4 className={`font-semibold ${colors.heading} mb-1`}>
                    {alert.message}
                  </h4>

                  {/* Detail */}
                  <p className={`text-sm ${colors.text} mb-2`}>
                    {alert.detail}
                  </p>

                  {/* FI Impact */}
                  <p className={`text-sm font-medium ${colors.text} mb-3`}>
                    {alert.fiImpact}
                  </p>

                  {/* Suggestions */}
                  {alert.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className={`text-xs font-medium ${colors.heading} mb-2`}>
                        Tillögur til úrbóta:
                      </p>
                      <ul className="space-y-1">
                        {alert.suggestions.map((suggestion, index) => (
                          <li key={index} className={`text-sm ${colors.text} flex gap-2`}>
                            <span className="flex-shrink-0">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dismiss button */}
                  {alert.canDismiss && (
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                        className="text-xs"
                      >
                        Loka viðvörun
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
