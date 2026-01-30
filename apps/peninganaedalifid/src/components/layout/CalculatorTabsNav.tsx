'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CalculatorTab {
  id: string;
  label: string;
  shortLabel?: string; // For mobile
  value?: string; // Optional value to display (e.g., "2.500 kr/klst" or "----")
  disabled?: boolean;
  comingSoon?: boolean;
}

interface CalculatorTabsNavProps {
  tabs: CalculatorTab[];
  defaultTab: string;
  activeTab?: string; // Controlled mode
  onTabChange?: (tabId: string) => void; // Callback for tab changes
  className?: string;
}

/**
 * Calculator tab navigation component
 * Sits at the bottom of the intro section and flows into the active calculator content
 * Aligned to the left, active tab merges with the content section below
 *
 * Supports both controlled (activeTab + onTabChange) and uncontrolled (defaultTab) modes
 */
export function CalculatorTabsNav({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  className,
}: CalculatorTabsNavProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab);

  // Use controlled value if provided, otherwise use internal state
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Left-aligned tabs */}
      <div className="flex justify-start">
        <nav
          className="inline-flex gap-1"
          role="tablist"
          aria-label="Reiknivélar"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled || tab.comingSoon;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleTabClick(tab.id)}
                className={cn(
                  'relative px-6 py-3 text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  'rounded-t-xl border-t border-l border-r',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-sm'
                    : isDisabled
                      ? 'text-neutral-400 cursor-not-allowed bg-neutral-200 border-neutral-300'
                      : 'text-neutral-600 hover:text-neutral-900 bg-neutral-200 border-neutral-300 hover:bg-neutral-300/70'
                )}
              >
                <span className="flex flex-col items-center">
                  {/* Mobile label */}
                  <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
                  {/* Desktop label */}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {/* Value display (if provided) */}
                  {tab.value && (
                    <span
                      className={cn(
                        'text-xs font-semibold mt-0.5',
                        tab.value === '----' ? 'text-neutral-400' : 'text-primary-600'
                      )}
                    >
                      {tab.value}
                    </span>
                  )}
                </span>

                {/* Coming soon badge */}
                {tab.comingSoon && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-neutral-200 text-neutral-500 rounded">
                    Væntanlegt
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
