'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { DetailedExplanation } from './DetailedExplanation';
import { GlossarySection } from './GlossarySection';
import { FAQSection } from './FAQSection';
import type { FIRETypeId } from '@/types/fireTypes';

export interface EducationalContentSectionProps {
  selectedFireType?: FIRETypeId | null;
  className?: string;
}

/**
 * EducationalContentSection - Container for all FIRE educational content
 *
 * Features:
 * - Collapsible main section ("Fræðsluefni")
 * - Contains DetailedExplanation for selected/focused FIRE type
 * - Contains GlossarySection for FIRE terminology
 * - Contains FAQSection for common questions
 * - Print-friendly option
 * - Logical organization with clear hierarchy
 * - Accessible navigation between sections
 *
 * Requirements: Epic 8, Task 8.4
 */
export function EducationalContentSection({
  selectedFireType,
  className,
}: EducationalContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'glossary' | 'faq'>(
    selectedFireType ? 'details' : 'faq'
  );

  // Handle print
  const handlePrint = () => {
    // Set all sections to expanded for printing
    const printContent = document.getElementById('educational-content-print');
    if (printContent) {
      window.print();
    }
  };

  const tabs = [
    {
      id: 'details' as const,
      label: 'Ítarlegar upplýsingar',
      icon: '📖',
      disabled: !selectedFireType,
      description: selectedFireType ? 'Um valda FIRE tegund' : 'Veldu FIRE tegund fyrst',
    },
    {
      id: 'faq' as const,
      label: 'Algengar spurningar',
      icon: '❓',
      disabled: false,
      description: 'Svör við algengum spurningum',
    },
    {
      id: 'glossary' as const,
      label: 'Orðalisti',
      icon: '📚',
      disabled: false,
      description: 'FIRE hugtök útskýrð',
    },
  ];

  return (
    <Card
      className={cn('overflow-hidden print:shadow-none', className)}
      title="Fræðsluefni um FIRE"
    >
      {/* Header with toggle */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 print:bg-white">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-center justify-between text-left print:cursor-default"
            aria-expanded={isExpanded}
            aria-controls="educational-content"
          >
            <div>
              <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                <span className="text-3xl" aria-hidden="true">
                  🎓
                </span>
                Fræðsluefni um FIRE
              </h2>
              <p className="text-sm text-indigo-700 mt-1">
                Ítarlegar upplýsingar, orðalisti og algengar spurningar
              </p>
            </div>
            <svg
              className={cn(
                'w-6 h-6 text-indigo-600 transition-transform duration-200 print:hidden',
                isExpanded && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div id="educational-content" className="print:block">
          {/* Action bar */}
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between print:hidden">
            <p className="text-sm text-neutral-600">
              Veldu flipa hér að neðan til að skoða mismunandi fræðsluefni
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Prenta
            </Button>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-neutral-200 print:hidden">
            <nav className="flex px-6" aria-label="Fræðsluefni flipar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={cn(
                    'px-4 py-3 font-medium text-sm border-b-2 transition-colors relative group',
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : tab.disabled
                      ? 'border-transparent text-neutral-700 cursor-not-allowed'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                  )}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  aria-disabled={tab.disabled}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{tab.icon}</span>
                    {tab.label}
                  </span>
                  {/* Tooltip for disabled state */}
                  {tab.disabled && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {tab.description}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div id="educational-content-print" className="p-6">
            {/* Details tab */}
            {activeTab === 'details' && selectedFireType && (
              <div
                role="tabpanel"
                aria-labelledby="tab-details"
                className="animate-fadeIn"
              >
                <DetailedExplanation fireTypeId={selectedFireType} />
              </div>
            )}

            {/* FAQ tab */}
            {activeTab === 'faq' && (
              <div
                role="tabpanel"
                aria-labelledby="tab-faq"
                className="animate-fadeIn print:block"
              >
                <FAQSection />
              </div>
            )}

            {/* Glossary tab */}
            {activeTab === 'glossary' && (
              <div
                role="tabpanel"
                aria-labelledby="tab-glossary"
                className="animate-fadeIn print:block print:mt-8"
              >
                <GlossarySection />
              </div>
            )}

            {/* Print-only content - show all sections */}
            <div className="hidden print:block">
              {selectedFireType && (
                <>
                  <div className="mb-8">
                    <DetailedExplanation fireTypeId={selectedFireType} />
                  </div>
                  <div className="page-break-before mb-8">
                    <FAQSection />
                  </div>
                  <div className="page-break-before">
                    <GlossarySection />
                  </div>
                </>
              )}
              {!selectedFireType && (
                <>
                  <div className="mb-8">
                    <FAQSection />
                  </div>
                  <div className="page-break-before">
                    <GlossarySection />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer with quick links */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 print:hidden">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-2xl" aria-hidden="true">
                💡
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Viltu læra meira?
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <a
                    href="https://www.reddit.com/r/FIREyFI/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                  >
                    r/FIREyFI - Íslenskt FIRE samfélag
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://www.mrmoneymustache.com/2013/02/22/getting-rich-from-zero-to-hero-in-one-blog-post/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                  >
                    Mr. Money Mustache - Getting Started
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://www.reddit.com/r/financialindependence/wiki/faq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                  >
                    r/FI FAQ - Comprehensive Guide
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://www.madfientist.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                  >
                    Mad Fientist - Advanced Strategies
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .page-break-before {
            page-break-before: always;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Card>
  );
}
