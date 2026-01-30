'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { calculateGoalProgress } from '@/lib/calculations/convenienceExpenses';
import type { ConvenienceGoal } from '@/types/calculator';

interface GoalProgressProps {
  goal: ConvenienceGoal | undefined;
  currentMonthly: number;
  actualHourlyWage: number;
  onSetGoal: (goal: ConvenienceGoal) => void;
  onDeleteGoal: () => void;
}

/**
 * Goal progress tracking and management
 */
export function GoalProgress({
  goal,
  currentMonthly,
  actualHourlyWage,
  onSetGoal,
  onDeleteGoal,
}: GoalProgressProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [targetAmount, setTargetAmount] = useState(goal?.monthlyTarget || 15000);

  // Calculate progress if goal exists
  const progressData = goal
    ? calculateGoalProgress(goal, currentMonthly, actualHourlyWage)
    : null;

  // Handle save goal
  const handleSaveGoal = () => {
    if (targetAmount > 0) {
      onSetGoal({
        monthlyTarget: targetAmount,
        startDate: new Date().toISOString(),
      });
      setIsEditing(false);
    }
  };

  // Handle delete goal
  const handleDeleteGoal = () => {
    if (window.confirm('Ertu viss um að þú viljir eyða markmiðinu?')) {
      onDeleteGoal();
      setIsEditing(false);
    }
  };

  // No goal set
  if (!goal && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Markmið</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Ekkert markmið sett
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Settu þér mánaðarlegt markmið til að draga úr þreytukostnaði
            </p>
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className="mt-4"
            >
              Setja markmið
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Editing mode
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            {goal ? 'Breyta markmiði' : 'Setja markmið'}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CurrencyInput
              label="Hámarks mánaðarkostnaður"
              value={targetAmount}
              onChange={setTargetAmount}
              helpText="Hversu mikið viltu hámark eyða á mánuði?"
              required
            />

            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleSaveGoal}
                disabled={targetAmount <= 0}
                className="flex-1"
              >
                Vista
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setTargetAmount(goal?.monthlyTarget || 15000);
                }}
              >
                Hætta við
              </Button>
            </div>

            {goal && (
              <Button
                variant="ghost"
                onClick={handleDeleteGoal}
                className="w-full text-red-600 hover:text-red-700"
              >
                Eyða markmiði
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display progress
  if (!progressData || !goal) return null;

  const { progress, isOnTrack, savings, savingsLifeEnergy, annualSavings } =
    progressData;

  const progressPercent = Math.min(progress, 100);
  const isExceeded = progress > 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Markmið</h3>
            <p className="text-sm text-gray-600 mt-1">
              Hámark:{' '}
              {goal.monthlyTarget.toLocaleString('is-IS', {
                maximumFractionDigits: 0,
              })}{' '}
              kr/mán
            </p>
          </div>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Framvinda
              </span>
              <span
                className={`text-lg font-bold ${
                  isOnTrack ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  isOnTrack
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
              <span>
                {currentMonthly.toLocaleString('is-IS', {
                  maximumFractionDigits: 0,
                })}{' '}
                kr
              </span>
              <span>
                {goal.monthlyTarget.toLocaleString('is-IS', {
                  maximumFractionDigits: 0,
                })}{' '}
                kr
              </span>
            </div>
          </div>

          {/* Status message */}
          {isOnTrack ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-2">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Frábært! Þú ert á réttri leið
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Sparnaður</span>
                      <span className="text-sm font-semibold text-green-900">
                        {savings.toLocaleString('is-IS', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        kr
                      </span>
                    </div>
                    {actualHourlyWage > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">
                          Lífsorka sparað
                        </span>
                        <span className="text-sm font-semibold text-green-900">
                          {savingsLifeEnergy.toFixed(1)} klst
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-green-200">
                      <span className="text-sm font-medium text-green-700">
                        Ársparnaður
                      </span>
                      <span className="text-base font-bold text-green-900">
                        {annualSavings.toLocaleString('is-IS', {
                          maximumFractionDigits: 0,
                        })}{' '}
                        kr
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {isExceeded ? 'Markmiði náð' : 'Að nálgast markmið'}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {isExceeded
                      ? `Þú ert ${Math.abs(savings).toLocaleString('is-IS', {
                          maximumFractionDigits: 0,
                        })} kr yfir markmiðinu þessum mánuði.`
                      : 'Haltu áfram að vinna að því að draga úr þreytuskattinum.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
