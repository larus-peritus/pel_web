'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCalculator } from '@/context/CalculatorContext';
import { DaycareSection } from './DaycareSection';
import { AfterSchoolSection } from './AfterSchoolSection';
import { ActivitiesSection } from './ActivitiesSection';
import { TutoringSection } from './TutoringSection';
import { CategoryBreakdown } from './CategoryBreakdown';
import { Alert } from '@/components/ui/Alert';
import { COMMON_CHILDCARE_ITEMS } from '@/lib/calculations/childcare';

type Section = 'daycare' | 'afterschool' | 'activities' | 'tutoring';

/**
 * ChildcareCalculator - Main container component
 *
 * Features:
 * - All sections in accordion layout
 * - Summary card at top
 * - Integration with CalculatorContext
 * - Presets for quick add
 */
export function ChildcareCalculator() {
  const { childcareItems, childcareSummary, addChildcareItem } = useCalculator();
  const [openSection, setOpenSection] = useState<Section | null>('daycare');

  // Toggle section open/close
  const toggleSection = (section: Section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Add preset item
  const handleAddPreset = (preset: typeof COMMON_CHILDCARE_ITEMS[0]) => {
    addChildcareItem(preset);
  };

  // Section configuration
  const sections: { id: Section; title: string; icon: string; component: React.ReactNode }[] = [
    {
      id: 'daycare',
      title: 'Leikskóli',
      icon: '🏫',
      component: <DaycareSection />,
    },
    {
      id: 'afterschool',
      title: 'Frístund',
      icon: '🎨',
      component: <AfterSchoolSection />,
    },
    {
      id: 'activities',
      title: 'Tónlistarskóli og tímar',
      icon: '⚽',
      component: <ActivitiesSection />,
    },
    {
      id: 'tutoring',
      title: 'Einkakennsla',
      icon: '📚',
      component: <TutoringSection />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with quick add presets */}
      <Card>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Barna- og menntakostnaður</h2>
            <p className="text-sm text-neutral-600">
              Reiknaðu út kostnað við að ala upp börn og sjáðu hversu mikla lífsorku það kostar
            </p>
          </div>

          {/* Quick add presets */}
          {childcareItems.length === 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-neutral-700">Byrjaðu með vinsælt dæmi</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_CHILDCARE_ITEMS.slice(0, 4).map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddPreset(preset)}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition-colors hover:border-primary-500 hover:bg-primary-50"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Summary stats */}
          {childcareSummary && childcareSummary.totalYearly > 0 && (
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-primary-50 p-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-neutral-600">Liðir</p>
                <p className="text-xl font-bold text-neutral-900">{childcareItems.length}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Mánuður</p>
                <p className="text-xl font-bold text-neutral-900">
                  {Math.round(childcareSummary.totalMonthlyAverage).toLocaleString('is-IS')} kr
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Ár</p>
                <p className="text-xl font-bold text-neutral-900">
                  {Math.round(childcareSummary.totalYearly).toLocaleString('is-IS')} kr
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Lífsorka</p>
                <p className="text-xl font-bold text-primary-600">
                  {Math.round(childcareSummary.lifeEnergyHoursPerMonth)} klst/mán
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer about activities */}
      <Alert variant="info" title="Íþróttir og tómstundir eru mikilvægar">
        Þó að þessi reiknivél hjálpi þér að sjá kostnað við uppeldi barna, þá er mikilvægt að muna að
        íþróttir, tónlist og aðrar tómstundir eru mjög mikilvægar fyrir þroska og velferð barna.
        Þetta er fjárfesting í framtíð þeirra, ekki bara kostnaður.
      </Alert>

      {/* Main content - 2 column layout on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Input sections (2/3 width) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Accordion sections */}
          {sections.map((section) => (
            <div key={section.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              {/* Section header (always visible) */}
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{section.title}</h3>
                    {/* Show item count if section is closed */}
                    {openSection !== section.id && (
                      <p className="text-sm text-neutral-600">
                        {childcareItems.filter((item) => item.category === section.id).length}{' '}
                        {childcareItems.filter((item) => item.category === section.id).length === 1
                          ? 'liður'
                          : 'liðir'}
                      </p>
                    )}
                  </div>
                </div>
                <svg
                  className={`h-5 w-5 text-neutral-500 transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Section content (collapsible) */}
              {openSection === section.id && <div className="border-t border-neutral-200">{section.component}</div>}
            </div>
          ))}
        </div>

        {/* Right column - Summary (1/3 width, sticky on desktop) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CategoryBreakdown />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {childcareItems.length === 0 && (
        <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
              👶
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900">
              Byrjaðu að fylgjast með barna- og menntakostnaði
            </h2>
            <p className="mb-6 text-neutral-600">
              Bættu við leikskóla, frístund, tímum eða öðrum kostnaði til að sjá hversu mikla lífsorku það kostar
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {COMMON_CHILDCARE_ITEMS.slice(0, 3).map((preset, index) => (
                <Button key={index} variant="secondary" onClick={() => handleAddPreset(preset)}>
                  + {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
