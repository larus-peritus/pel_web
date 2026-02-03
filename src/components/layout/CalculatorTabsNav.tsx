'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

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
 *
 * Mobile: Vertical stack showing all tabs with values
 * Desktop: Horizontal tabs with values
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
      {/* Mobile: Vertical stack of all tabs as buttons */}
      <div className="md:hidden pb-4">
        <nav
          className="flex flex-col gap-2"
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
                id={`tab-mobile-${tab.id}`}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleTabClick(tab.id)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl',
                  'border-2 transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'active:scale-[0.98]', // Press effect
                  isActive
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : isDisabled
                      ? 'text-neutral-400 cursor-not-allowed bg-neutral-100 border-neutral-200'
                      : 'text-neutral-700 bg-white border-neutral-300 shadow-sm hover:border-primary-400 hover:shadow-md'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Active indicator dot */}
                  <span
                    className={cn(
                      'w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors',
                      isActive
                        ? 'bg-white'
                        : tab.value && tab.value !== '----'
                          ? 'bg-primary-500'
                          : 'bg-neutral-300'
                    )}
                  />
                  <span className="text-sm font-semibold">{tab.shortLabel || tab.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {tab.value && (
                    <span
                      className={cn(
                        'text-sm font-bold',
                        isActive
                          ? 'text-white/90'
                          : tab.value === '----'
                            ? 'text-neutral-400'
                            : 'text-primary-600'
                      )}
                    >
                      {tab.value}
                    </span>
                  )}
                  {tab.comingSoon && (
                    <span className="text-[10px] font-medium bg-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded">
                      Væntanlegt
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform',
                      isActive ? 'text-white/70' : 'text-neutral-400',
                      !isActive && 'group-hover:translate-x-0.5'
                    )}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop: Horizontal tabs */}
      <div className="hidden md:flex justify-start">
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
                <span className="flex flex-col items-center whitespace-nowrap">
                  <span>{tab.label}</span>
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
