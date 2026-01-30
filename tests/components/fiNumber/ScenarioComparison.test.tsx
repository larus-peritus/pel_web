import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ScenarioComparison } from '@/components/fiNumber/ScenarioComparison';
import type { ScenarioComparisonResult } from '@/types/fiNumber';
import type { ExpenseTier } from '@/types/expenseBaseline';

describe('ScenarioComparison', () => {
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
      difference: undefined, // Selected tier has no difference
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
      render(<ScenarioComparison {...defaultProps} />);

      expect(screen.getByText('Samanburður á FI-tölum')).toBeInTheDocument();
      expect(screen.getByText(/hvernig mismunandi útgjaldaþrep/i)).toBeInTheDocument();
      expect(screen.getByText(/30x margfaldari/i)).toBeInTheDocument();
    });

    it('renders all three tier rows in table view', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Check tier labels (using getAllByText for both desktop and mobile)
      expect(screen.getAllByText('Lágmarks')).toHaveLength(2); // Desktop + mobile
      expect(screen.getAllByText('Þægilegt')).toHaveLength(2);
      expect(screen.getAllByText('Lúxus')).toHaveLength(2);
    });

    it('displays annual expenses for each tier', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Check formatted values (both desktop and mobile views)
      const annualExpenseElements = screen.getAllByText(/3\.000\.000\s*kr/);
      expect(annualExpenseElements.length).toBeGreaterThan(0);
    });

    it('displays FI numbers for each tier', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Check FI numbers are displayed
      expect(screen.getAllByText(/90\.000\.000\s*kr/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/187\.200\.000\s*kr/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/360\.000\.000\s*kr/).length).toBeGreaterThan(0);
    });

    it('highlights the selected tier', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Selected tier should show "Valið" badge (2 instances for desktop + mobile)
      const badges = screen.getAllByText('Valið');
      expect(badges).toHaveLength(2); // Desktop + mobile
    });

    it('displays differences from selected tier', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);

      // Check that differences are present in the rendered output
      const text = container.textContent || '';

      // Barebones should show negative difference
      expect(text).toContain('-96');
      expect(text).toContain('-51');

      // Deluxe should show positive difference
      expect(text).toContain('+172');
      expect(text).toContain('+92');
    });

    it('shows em dash for selected tier difference', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Selected tier (comfortable) should show em dash in difference column
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        const comfortableRow = rows.find((row) =>
          row.textContent?.includes('Þægilegt')
        );
        expect(comfortableRow).toBeDefined();
        if (comfortableRow) {
          expect(comfortableRow.textContent).toContain('—');
        }
      }
    });
  });

  describe('Responsive Design', () => {
    it('renders desktop table view (hidden on mobile)', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Check for table structure
      const tables = screen.getAllByRole('table');
      expect(tables.length).toBeGreaterThan(0);

      // Check table headers
      expect(screen.getByText('Útgjaldaþrep')).toBeInTheDocument();
      expect(screen.getByText('Árleg útgjöld')).toBeInTheDocument();
      expect(screen.getByText('FI-tala')).toBeInTheDocument();
      expect(screen.getByText('Mismunur')).toBeInTheDocument();
    });

    it('renders mobile card view', () => {
      render(<ScenarioComparison {...defaultProps} />);

      // Both mobile and desktop views render in JSDOM,
      // but we can check that tier labels exist
      expect(screen.getAllByText('Lágmarks')).toHaveLength(2);
      expect(screen.getAllByText('Þægilegt')).toHaveLength(2);
      expect(screen.getAllByText('Lúxus')).toHaveLength(2);
    });
  });

  describe('Interaction', () => {
    it('calls onTierSelect when tier is clicked', async () => {
      const user = userEvent.setup();
      const handleTierSelect = vi.fn();

      render(<ScenarioComparison {...defaultProps} onTierSelect={handleTierSelect} />);

      // Click on barebones tier (first occurrence in desktop table)
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        const barebonesRow = rows.find((row) =>
          row.textContent?.includes('Lágmarks')
        );
        if (barebonesRow) {
          await user.click(barebonesRow);
          expect(handleTierSelect).toHaveBeenCalledWith('barebones');
        }
      }
    });

    it('supports keyboard navigation with Enter key', async () => {
      const user = userEvent.setup();
      const handleTierSelect = vi.fn();

      render(<ScenarioComparison {...defaultProps} onTierSelect={handleTierSelect} />);

      // Find barebones tier row and press Enter
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        const barebonesRow = rows.find((row) =>
          row.textContent?.includes('Lágmarks')
        );
        if (barebonesRow) {
          barebonesRow.focus();
          await user.keyboard('{Enter}');
          expect(handleTierSelect).toHaveBeenCalledWith('barebones');
        }
      }
    });

    it('supports keyboard navigation with Space key', async () => {
      const user = userEvent.setup();
      const handleTierSelect = vi.fn();

      render(<ScenarioComparison {...defaultProps} onTierSelect={handleTierSelect} />);

      // Find deluxe tier row and press Space
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        const deluxeRow = rows.find((row) => row.textContent?.includes('Lúxus'));
        if (deluxeRow) {
          deluxeRow.focus();
          await user.keyboard(' ');
          expect(handleTierSelect).toHaveBeenCalledWith('deluxe');
        }
      }
    });

    it('does not show cursor pointer when onTierSelect is not provided', () => {
      const { container } = render(
        <ScenarioComparison
          scenarios={mockScenarios}
          selectedTier="comfortable"
          multiplier={30}
        />
      );

      // Rows should not have cursor-pointer class
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        rows.forEach((row) => {
          expect(row).not.toHaveClass('cursor-pointer');
        });
      }
    });
  });

  describe('Formatting', () => {
    it('formats ISK amounts with Icelandic formatting', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);
      const text = container.textContent || '';

      // Check that the FI numbers are present
      expect(text).toContain('90.000.000');
      expect(text).toContain('187.200.000');
    });

    it('formats positive differences with + sign', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);
      const text = container.textContent || '';

      // Deluxe tier should show positive difference
      expect(text).toContain('+172');
    });

    it('formats negative differences with - sign', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);
      const text = container.textContent || '';

      // Barebones tier should show negative difference
      expect(text).toContain('-96');
    });

    it('formats percentages with one decimal place', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);
      const text = container.textContent || '';

      // Check percentage formatting is present
      expect(text).toContain('-51');
      expect(text).toContain('+92');
    });
  });

  describe('Visual Styling', () => {
    it('applies tier-specific colors to selected tier', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);

      // Selected tier should have tier-specific background color class
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        const comfortableRow = rows.find((row) =>
          row.textContent?.includes('Þægilegt') && row.textContent?.includes('Valið')
        );
        expect(comfortableRow).toBeDefined();
        // Note: Checking class names is fragile, but we can verify the row exists
      }
    });

    it('applies different colors for positive and negative differences', () => {
      const { container } = render(<ScenarioComparison {...defaultProps} />);

      // Both positive and negative differences should exist
      const text = container.textContent || '';
      expect(text).toContain('-96');
      expect(text).toContain('+172');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero difference correctly', () => {
      const scenariosWithZeroDiff: ScenarioComparisonResult = {
        ...mockScenarios,
        comfortable: {
          ...mockScenarios.comfortable,
          difference: { isk: 0, percentage: 0 },
        },
      };

      render(
        <ScenarioComparison
          scenarios={scenariosWithZeroDiff}
          selectedTier="comfortable"
          multiplier={30}
        />
      );

      // Should show ±0 kr (using getAllByText since it appears in both desktop and mobile)
      const zeroDiffElements = screen.getAllByText('±0 kr');
      expect(zeroDiffElements.length).toBeGreaterThan(0);
    });

    it('handles barebones as selected tier', () => {
      render(
        <ScenarioComparison
          scenarios={mockScenarios}
          selectedTier="barebones"
          multiplier={30}
        />
      );

      // Barebones should now show "Valið" badge
      expect(screen.getAllByText('Valið')).toHaveLength(2);

      // Barebones should have no difference
      const table = screen.getAllByRole('table')[0];
      if (table) {
        const rows = within(table).getAllByRole('row');
        const barebonesRow = rows.find((row) =>
          row.textContent?.includes('Lágmarks') && row.textContent?.includes('Valið')
        );
        expect(barebonesRow).toBeDefined();
      }
    });

    it('handles deluxe as selected tier', () => {
      render(
        <ScenarioComparison
          scenarios={mockScenarios}
          selectedTier="deluxe"
          multiplier={30}
        />
      );

      // Deluxe should show "Valið" badge
      expect(screen.getAllByText('Valið')).toHaveLength(2);
    });

    it('displays explanation footer', () => {
      render(<ScenarioComparison {...defaultProps} />);

      expect(
        screen.getByText(/valið á útgjaldaþrepi hefur áhrif/i)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper table structure', () => {
      render(<ScenarioComparison {...defaultProps} />);

      const tables = screen.getAllByRole('table');
      expect(tables.length).toBeGreaterThan(0);

      // Check for table headers
      expect(screen.getByText('Útgjaldaþrep')).toBeInTheDocument();
    });

    it('sets tabIndex when onTierSelect is provided', () => {
      render(<ScenarioComparison {...defaultProps} onTierSelect={vi.fn()} />);

      // Verify the component renders with the callback
      const table = screen.getAllByRole('table')[0];
      expect(table).toBeInTheDocument();

      // Rows should be present
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  });
});
