import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SavingsProgressList } from '@/components/savingsReport/SavingsProgressList';
import { useCalculator } from '@/context/CalculatorContext';
import type { SavingsCategory } from '@/types/savingsReport';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  useCalculator: vi.fn(),
}));

describe('SavingsProgressList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCategoryWithTarget: SavingsCategory = {
    id: 'neydarsjodur',
    name: 'Neyðarsjóður',
    icon: '🛡️',
    description: 'Emergency fund',
    order: 1,
    data: {
      balance: 500000,
      monthlyContribution: 50000,
      targetAmount: 1000000,
    },
    isHidden: false,
  };

  const mockCategoryWithoutTarget: SavingsCategory = {
    id: 'fjarfestingar',
    name: 'Fjárfestingar',
    icon: '📈',
    description: 'Investments',
    order: 2,
    data: {
      balance: 2000000,
      monthlyContribution: 100000,
    },
    isHidden: false,
  };

  const mockCategoryCompleted: SavingsCategory = {
    id: 'skammtima',
    name: 'Skammtímasparnaður',
    icon: '📅',
    description: 'Short-term',
    order: 3,
    data: {
      balance: 1000000,
      monthlyContribution: 0,
      targetAmount: 1000000,
    },
    isHidden: false,
  };

  describe('Empty State', () => {
    it('should render empty state when no categories have targets', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithoutTarget]} />);

      expect(screen.getByText('Framvinda markmiða')).toBeTruthy();
      expect(screen.getByText('Engin markmið sett')).toBeTruthy();
    });

    it('should render empty state when categories array is empty', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[]} />);

      expect(screen.getByText('Engin markmið sett')).toBeTruthy();
    });
  });

  describe('Categories with Targets', () => {
    it('should render category with target', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithTarget]} />);

      expect(screen.getByText('🛡️')).toBeTruthy();
      expect(screen.getByText('Neyðarsjóður')).toBeTruthy();
    });

    it('should display current vs target amounts', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithTarget]} />);

      expect(screen.getByText(/500.000 kr \/ 1.000.000 kr/)).toBeTruthy();
    });

    it('should calculate and display percentage correctly', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithTarget]} />);

      expect(screen.getByText('50%')).toBeTruthy();
    });

    it('should not display categories without targets', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(
        <SavingsProgressList
          categories={[mockCategoryWithTarget, mockCategoryWithoutTarget]}
        />
      );

      expect(screen.getByText('Neyðarsjóður')).toBeTruthy();
      expect(screen.queryByText('Fjárfestingar')).toBeNull();
    });

    it('should not display hidden categories', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      const hiddenCategory = { ...mockCategoryWithTarget, isHidden: true };

      render(<SavingsProgressList categories={[hiddenCategory]} />);

      expect(screen.getByText('Engin markmið sett')).toBeTruthy();
    });
  });

  describe('Progress Display', () => {
    it('should show remaining amount when not completed', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithTarget]} />);

      expect(screen.getByText(/500.000 kr eftir/)).toBeTruthy();
    });

    it('should show life energy hours when AWH available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithTarget]} />);

      // 500000 remaining / 2500 AWH = 200 hours
      expect(screen.getByText(/200 klst/)).toBeTruthy();
    });

    it('should not show life energy when AWH not available', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: null,
      } as any);

      render(<SavingsProgressList categories={[mockCategoryWithTarget]} />);

      expect(screen.queryByText(/klst/)).toBeNull();
    });

    it('should show completion message when target reached', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      render(<SavingsProgressList categories={[mockCategoryCompleted]} />);

      expect(screen.getByText('✓ Náð markmiði!')).toBeTruthy();
    });

    it('should cap percentage at 100% when over target', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      const overTarget: SavingsCategory = {
        ...mockCategoryWithTarget,
        data: {
          balance: 1500000,
          monthlyContribution: 50000,
          targetAmount: 1000000,
        },
      };

      render(<SavingsProgressList categories={[overTarget]} />);

      expect(screen.getByText('100%')).toBeTruthy();
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar with correct width', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      const { container } = render(
        <SavingsProgressList categories={[mockCategoryWithTarget]} />
      );

      const progressBar = container.querySelector('.bg-gradient-to-r');
      expect(progressBar?.getAttribute('style')).toContain('width: 50%');
    });

    it('should have visual gradient on progress bar', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      const { container } = render(
        <SavingsProgressList categories={[mockCategoryWithTarget]} />
      );

      const progressBar = container.querySelector('.bg-gradient-to-r');
      expect(progressBar?.classList.contains('from-primary-500')).toBe(true);
      expect(progressBar?.classList.contains('to-primary-600')).toBe(true);
    });
  });

  describe('Sorting', () => {
    it('should sort categories by order', () => {
      vi.mocked(useCalculator).mockReturnValue({
        results: { actualHourlyWage: 2500 },
      } as any);

      const category1 = { ...mockCategoryWithTarget, order: 2 };
      const category2 = { ...mockCategoryCompleted, order: 1 };

      render(<SavingsProgressList categories={[category1, category2]} />);

      const categoryNames = screen.getAllByText(/Neyðarsjóður|Skammtímasparnaður/);
      // First should be Skammtímasparnaður (order 1), second Neyðarsjóður (order 2)
      expect(categoryNames[0].textContent).toBe('Skammtímasparnaður');
    });
  });
});
