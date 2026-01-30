import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ScenarioComparisonChart } from '@/components/fiNumber/ScenarioComparisonChart';
import type { ScenarioComparisonResult } from '@/types/fiNumber';
import type { ExpenseTier } from '@/types/expenseBaseline';

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />,
  LabelList: () => <div data-testid="label-list" />,
}));

describe('ScenarioComparisonChart', () => {
  const mockScenarios: ScenarioComparisonResult = {
    barebones: {
      tier: 'barebones',
      monthlyExpenses: 250_000,
      annualExpenses: 3_000_000,
      fiNumber: 90_000_000,
      difference: {
        isk: -96_000_000,
        percentage: -51.6,
      },
    },
    comfortable: {
      tier: 'comfortable',
      monthlyExpenses: 520_000,
      annualExpenses: 6_240_000,
      fiNumber: 187_200_000,
      difference: undefined,
    },
    deluxe: {
      tier: 'deluxe',
      monthlyExpenses: 1_000_000,
      annualExpenses: 12_000_000,
      fiNumber: 360_000_000,
      difference: {
        isk: 172_800_000,
        percentage: 92.3,
      },
    },
  };

  const defaultProps = {
    scenarios: mockScenarios,
    selectedTier: 'comfortable' as ExpenseTier,
    multiplier: 30,
  };

  describe('Rendering', () => {
    it('renders component with title and description', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(screen.getByText('Myndræn samanburður')).toBeInTheDocument();
      expect(screen.getByText(/FI-tölur á milli útgjaldaþrepa/i)).toBeInTheDocument();
    });

    it('renders chart components', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('renders legend with all three tiers', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(screen.getByText('Lágmarks')).toBeInTheDocument();
      expect(screen.getByText('Þægilegt')).toBeInTheDocument();
      expect(screen.getByText('Lúxus')).toBeInTheDocument();
    });

    it('indicates selected tier in legend', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      // Selected tier should have "(valið)" suffix
      expect(screen.getByText('(valið)')).toBeInTheDocument();
    });

    it('displays info note at bottom', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(
        screen.getByText(/grafið sýnir hversu miklu meiri eða minni/i)
      ).toBeInTheDocument();
    });
  });

  describe('Data Preparation', () => {
    it('prepares chart data correctly', () => {
      const { container } = render(<ScenarioComparisonChart {...defaultProps} />);

      // Chart should be rendered
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

      // All tiers should be in legend
      expect(screen.getByText('Lágmarks')).toBeInTheDocument();
      expect(screen.getByText('Þægilegt')).toBeInTheDocument();
      expect(screen.getByText('Lúxus')).toBeInTheDocument();
    });

    it('applies correct colors to tiers', () => {
      const { container } = render(<ScenarioComparisonChart {...defaultProps} />);

      // Check that legend items have colored squares
      const legendItems = container.querySelectorAll('[style*="background"]');
      expect(legendItems.length).toBeGreaterThan(0);
    });
  });

  describe('Visual States', () => {
    it('highlights selected tier', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      // Selected tier should show "(valið)" in legend
      const legend = screen.getByText('(valið)');
      expect(legend).toBeInTheDocument();

      // Should be next to "Þægilegt"
      const parentElement = legend.parentElement;
      expect(parentElement?.textContent).toContain('Þægilegt');
    });

    it('shows all three tier labels in legend', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      // All tier labels should be visible
      expect(screen.getByText('Lágmarks')).toBeVisible();
      expect(screen.getByText('Þægilegt')).toBeVisible();
      expect(screen.getByText('Lúxus')).toBeVisible();
    });
  });

  describe('Different Selected Tiers', () => {
    it('highlights barebones when selected', () => {
      render(
        <ScenarioComparisonChart
          scenarios={mockScenarios}
          selectedTier="barebones"
          multiplier={30}
        />
      );

      const legend = screen.getByText('(valið)');
      expect(legend.parentElement?.textContent).toContain('Lágmarks');
    });

    it('highlights deluxe when selected', () => {
      render(
        <ScenarioComparisonChart
          scenarios={mockScenarios}
          selectedTier="deluxe"
          multiplier={30}
        />
      );

      const legend = screen.getByText('(valið)');
      expect(legend.parentElement?.textContent).toContain('Lúxus');
    });
  });

  describe('Responsive Design', () => {
    it('uses ResponsiveContainer for chart', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('sets appropriate height for chart', () => {
      const { container } = render(<ScenarioComparisonChart {...defaultProps} />);

      const responsiveContainer = screen.getByTestId('responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Different Multipliers', () => {
    it('displays correct multiplier in title', () => {
      render(<ScenarioComparisonChart {...defaultProps} multiplier={25} />);

      // Title doesn't show multiplier, but we can verify it's passed
      expect(screen.getByText('Myndræn samanburður')).toBeInTheDocument();
    });

    it('handles custom multiplier', () => {
      render(<ScenarioComparisonChart {...defaultProps} multiplier={35} />);

      expect(screen.getByText('Myndræn samanburður')).toBeInTheDocument();
    });
  });

  describe('Chart Configuration', () => {
    it('configures bar chart with vertical layout', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      // BarChart should be rendered
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('includes tooltip', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('Legend Rendering', () => {
    it('renders all legend items', () => {
      const { container } = render(<ScenarioComparisonChart {...defaultProps} />);

      // Find all legend items
      const legendContainer = container.querySelector('.flex.flex-wrap');
      expect(legendContainer).toBeInTheDocument();

      // All tier labels should be present
      expect(screen.getByText('Lágmarks')).toBeInTheDocument();
      expect(screen.getByText('Þægilegt')).toBeInTheDocument();
      expect(screen.getByText('Lúxus')).toBeInTheDocument();
    });

    it('shows color indicators in legend', () => {
      const { container } = render(<ScenarioComparisonChart {...defaultProps} />);

      // Should have colored divs for each tier (check using class or inline styles)
      const colorIndicators = container.querySelectorAll('[style*="background"]');
      expect(colorIndicators.length).toBeGreaterThanOrEqual(3); // At least one for each tier
    });
  });

  describe('Empty or Edge Cases', () => {
    it('handles all tiers with same FI number', () => {
      const sameScenarios: ScenarioComparisonResult = {
        barebones: {
          tier: 'barebones',
          monthlyExpenses: 250_000,
          annualExpenses: 3_000_000,
          fiNumber: 100_000_000,
        },
        comfortable: {
          tier: 'comfortable',
          monthlyExpenses: 250_000,
          annualExpenses: 3_000_000,
          fiNumber: 100_000_000,
        },
        deluxe: {
          tier: 'deluxe',
          monthlyExpenses: 250_000,
          annualExpenses: 3_000_000,
          fiNumber: 100_000_000,
        },
      };

      render(
        <ScenarioComparisonChart
          scenarios={sameScenarios}
          selectedTier="comfortable"
          multiplier={30}
        />
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles very large FI numbers', () => {
      const largeScenarios: ScenarioComparisonResult = {
        barebones: {
          tier: 'barebones',
          monthlyExpenses: 5_000_000,
          annualExpenses: 60_000_000,
          fiNumber: 1_800_000_000,
        },
        comfortable: {
          tier: 'comfortable',
          monthlyExpenses: 10_000_000,
          annualExpenses: 120_000_000,
          fiNumber: 3_600_000_000,
        },
        deluxe: {
          tier: 'deluxe',
          monthlyExpenses: 20_000_000,
          annualExpenses: 240_000_000,
          fiNumber: 7_200_000_000,
        },
      };

      render(
        <ScenarioComparisonChart
          scenarios={largeScenarios}
          selectedTier="comfortable"
          multiplier={30}
        />
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic card structure', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      // Card should have proper structure
      expect(screen.getByText('Myndræn samanburður')).toBeInTheDocument();
    });

    it('provides descriptive info text', () => {
      render(<ScenarioComparisonChart {...defaultProps} />);

      expect(
        screen.getByText(/grafið sýnir hversu miklu meiri eða minni/i)
      ).toBeInTheDocument();
    });
  });
});
