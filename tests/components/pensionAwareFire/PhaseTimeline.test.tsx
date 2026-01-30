/**
 * Tests for PhaseTimeline component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { PhaseTimeline } from '@/components/pensionAwareFire/PhaseTimeline';
import type { RetirementPhase } from '@/types/pensionAwareFire';

// Mock the formatters module
vi.mock('@/lib/utils/formatters', () => ({
  formatCurrency: (amount: number) => `${Math.round(amount).toLocaleString('en-US').replace(/,/g, '.')} kr`,
}));

// Mock the cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

/**
 * Helper to create a retirement phase for testing
 */
function createPhase(
  id: 'gap' | 'sereign-bridge' | 'full-pension',
  startAge: number,
  endAge: number,
  requiredAtStart: number
): RetirementPhase {
  return {
    id,
    nameIs: id === 'gap' ? 'Biðtími' : id === 'sereign-bridge' ? 'Séreign brú' : 'Fullur lífeyrir',
    nameEn: id === 'gap' ? 'Gap Period' : id === 'sereign-bridge' ? 'Séreign Bridge' : 'Full Pension',
    startAge,
    endAge,
    durationYears: endAge - startAge,
    incomeSources: {
      savingsWithdrawal: 0,
      investmentReturns: 0,
      sereign: 0,
      lifeyrissjodur: 0,
      tr: 0,
      total: 0,
    },
    monthlyExpenses: 300_000,
    requiredAtStart,
    remainingAtEnd: 0,
    isSelfFunded: id === 'gap',
    hasSurplus: false,
    surplusAmount: 0,
  };
}

describe('PhaseTimeline', () => {
  describe('Basic Rendering', () => {
    it('renders timeline with header and description', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getByText('Tímalína eftirlaunaáætlunar')).toBeInTheDocument();
      expect(screen.getByText(/Sjónræn framsetning/)).toBeInTheDocument();
    });

    it('displays all provided phases', () => {
      const phases = [
        createPhase('gap', 55, 60, 23_000_000),
        createPhase('sereign-bridge', 60, 67, 10_500_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      // Check for phase labels (visible in both desktop and mobile views)
      expect(screen.getAllByText(/Biðtími/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Séreign brú/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fullur lífeyrir/i).length).toBeGreaterThan(0);
    });

    it('shows working years segment', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getAllByText(/Vinna/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/20 ár/i).length).toBeGreaterThan(0);
    });
  });

  describe('Age Markers', () => {
    it('displays current age marker', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getByText('35')).toBeInTheDocument();
    });

    it('displays retirement age marker', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getByText('55')).toBeInTheDocument();
    });

    it('displays key pension ages (60, 67)', () => {
      const phases = [
        createPhase('gap', 55, 60, 23_000_000),
        createPhase('sereign-bridge', 60, 67, 10_500_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('67')).toBeInTheDocument();
    });

    it('displays age 90 marker', () => {
      const phases = [createPhase('full-pension', 67, 90, 0)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={67} />);

      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  describe('Phase Details', () => {
    it('displays phase duration in years', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getAllByText(/5 ár/i).length).toBeGreaterThan(0);
    });

    it('displays age range for each phase', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getAllByText(/55-60 ára/i).length).toBeGreaterThan(0);
    });

    it('displays required funding at start', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getAllByText(/Þarf við upphaf/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/23\.000\.000 kr/i).length).toBeGreaterThan(0);
    });

    it('shows "Afgangur!" when no funding required', () => {
      const phases = [createPhase('full-pension', 67, 90, 0)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={67} />);

      expect(screen.getAllByText(/Afgangur!/i).length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles retirement at 60 (no gap phase)', () => {
      const phases = [
        createPhase('sereign-bridge', 60, 67, 5_000_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={60} />);

      // Should not have gap phase
      expect(screen.queryByText(/Biðtími/i)).toBeNull();
      // Should have séreign bridge and full pension
      expect(screen.getAllByText(/Séreign brú/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fullur lífeyrir/i).length).toBeGreaterThan(0);
    });

    it('handles retirement at 67 (only full pension phase)', () => {
      const phases = [createPhase('full-pension', 67, 90, 15_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={67} />);

      // Should only have full pension phase
      expect(screen.queryByText(/Biðtími/i)).toBeNull();
      expect(screen.queryByText(/Séreign brú/i)).toBeNull();
      expect(screen.getAllByText(/Fullur lífeyrir/i).length).toBeGreaterThan(0);
    });

    it('handles retirement after 67', () => {
      const phases = [createPhase('full-pension', 70, 90, 10_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={70} />);

      expect(screen.getByText('70')).toBeInTheDocument();
      expect(screen.getAllByText(/Fullur lífeyrir/i).length).toBeGreaterThan(0);
    });

    it('handles very early retirement (before 60)', () => {
      const phases = [
        createPhase('gap', 45, 60, 50_000_000),
        createPhase('sereign-bridge', 60, 67, 10_000_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      render(<PhaseTimeline phases={phases} currentAge={25} targetRetirementAge={45} />);

      expect(screen.getByText('45')).toBeInTheDocument();
      expect(screen.getAllByText(/15 ár/i).length).toBeGreaterThan(0); // Gap duration
    });

    it('handles single year duration', () => {
      const phases = [createPhase('gap', 59, 60, 5_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={50} targetRetirementAge={59} />);

      expect(screen.getAllByText(/1 ár/i).length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('renders desktop view (timeline bar)', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      const { container } = render(
        <PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />
      );

      // Desktop view should have hidden md:block class
      const desktopView = container.querySelector('.hidden.md\\:block');
      expect(desktopView).toBeInTheDocument();
    });

    it('renders mobile view (stacked cards)', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      const { container } = render(
        <PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />
      );

      // Mobile view should have md:hidden class
      const mobileView = container.querySelector('.md\\:hidden');
      expect(mobileView).toBeInTheDocument();
    });
  });

  describe('Interactivity', () => {
    it('allows clicking on phase segments (desktop)', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      const { container } = render(
        <PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />
      );

      // Find clickable phase segment
      const phaseSegments = container.querySelectorAll('[role="button"]');
      expect(phaseSegments.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      const { container } = render(
        <PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />
      );

      const phaseSegments = container.querySelectorAll('[role="button"]');
      const firstSegment = phaseSegments[0] as HTMLElement;

      // Should be keyboard focusable
      expect(firstSegment.getAttribute('tabIndex')).toBe('0');

      // Simulate keyboard interaction
      fireEvent.keyDown(firstSegment, { key: 'Enter' });
      // Component should handle the event (no error thrown)
    });

    it('has proper ARIA labels for accessibility', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      const { container } = render(
        <PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />
      );

      const phaseSegments = container.querySelectorAll('[role="button"]');
      const firstSegment = phaseSegments[0] as HTMLElement;

      expect(firstSegment.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('Multiple Phases', () => {
    it('renders three-phase timeline correctly', () => {
      const phases = [
        createPhase('gap', 52, 60, 23_000_000),
        createPhase('sereign-bridge', 60, 67, 10_500_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={52} />);

      // All three phases should be visible
      expect(screen.getAllByText(/Biðtími/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Séreign brú/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fullur lífeyrir/i).length).toBeGreaterThan(0);

      // Verify phase durations
      expect(screen.getAllByText(/8 ár/i).length).toBeGreaterThan(0); // Gap: 52-60
      expect(screen.getAllByText(/7 ár/i).length).toBeGreaterThan(0); // Bridge: 60-67
      expect(screen.getAllByText(/23 ár/i).length).toBeGreaterThan(0); // Full: 67-90
    });

    it('renders two-phase timeline correctly', () => {
      const phases = [
        createPhase('sereign-bridge', 60, 67, 10_500_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={60} />);

      // Only two phases should be visible
      expect(screen.queryByText(/Biðtími/i)).toBeNull();
      expect(screen.getAllByText(/Séreign brú/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fullur lífeyrir/i).length).toBeGreaterThan(0);
    });
  });

  describe('Legend and Documentation', () => {
    it('displays legend with explanation', () => {
      const phases = [createPhase('gap', 55, 60, 23_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getByText(/Athugasemd:/i)).toBeInTheDocument();
      expect(screen.getByText(/séreign við 60/i)).toBeInTheDocument();
    });
  });

  describe('Color Coding', () => {
    it('applies correct color scheme to phases', () => {
      const phases = [
        createPhase('gap', 55, 60, 23_000_000),
        createPhase('sereign-bridge', 60, 67, 10_500_000),
        createPhase('full-pension', 67, 90, 0),
      ];
      const { container } = render(
        <PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />
      );

      // Check for phase color classes (simplified check)
      const html = container.innerHTML;
      expect(html).toContain('bg-red'); // Gap phase
      expect(html).toContain('bg-amber'); // Séreign bridge
      expect(html).toContain('bg-green'); // Full pension
      expect(html).toContain('bg-blue'); // Working years
    });
  });

  describe('Formatting', () => {
    it('formats large amounts correctly', () => {
      const phases = [createPhase('gap', 55, 60, 45_000_000)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={55} />);

      expect(screen.getAllByText(/45\.000\.000 kr/i).length).toBeGreaterThan(0);
    });

    it('formats zero amounts as "Afgangur!"', () => {
      const phases = [createPhase('full-pension', 67, 90, 0)];
      render(<PhaseTimeline phases={phases} currentAge={35} targetRetirementAge={67} />);

      expect(screen.getAllByText(/Afgangur!/i).length).toBeGreaterThan(0);
    });
  });
});
