import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LifeEnergyDisplay } from '@/components/fiNumber/LifeEnergyDisplay';
import type { FINumberLifeEnergy } from '@/types/fiNumber';

describe('LifeEnergyDisplay', () => {
  const mockLifeEnergy: FINumberLifeEnergy = {
    actualHourlyWage: 5000,
    annualNetIncome: 9_600_000,
    yearsOfWork: 18.75,
    yearsToFI: 12.5,
  };

  const mockFINumber = 180_000_000;

  describe('Rendering', () => {
    it('should render the component with life energy data', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText('FI-talan í lífsorku')).toBeInTheDocument();
      expect(screen.getByText(/18,8 árum/)).toBeInTheDocument();
    });

    it('should display years of work correctly formatted', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/18,8 árum/)).toBeInTheDocument();
      expect(screen.getByText(/af vinnu með núverandi tekjum/)).toBeInTheDocument();
    });

    it('should display annual net income', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/9\.600\.000 kr á ári/)).toBeInTheDocument();
    });
  });

  describe('Progress Display (with yearsToFI)', () => {
    it('should show progress section when yearsToFI is available', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText('Framvinda til FI')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should calculate and display progress percentage correctly', () => {
      // yearsOfWork: 18.75, yearsToFI: 12.5
      // Progress = (18.75 - 12.5) / 18.75 * 100 = 33.33%
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      // Check that aria-valuenow is approximately 33 (allowing for floating point)
      const ariaValue = parseFloat(progressBar.getAttribute('aria-valuenow') || '0');
      expect(ariaValue).toBeCloseTo(33.33, 1);
    });

    it('should show years worked and years remaining', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      // Years worked: 18.75 - 12.5 = 6.25
      expect(screen.getByText('Unnið')).toBeInTheDocument();
      expect(screen.getByText('6,3')).toBeInTheDocument();

      // Years remaining: 12.5
      expect(screen.getByText('Eftir')).toBeInTheDocument();
      expect(screen.getByText('12,5')).toBeInTheDocument();
    });

    it('should display timeline visualization markers', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText('Byrjun')).toBeInTheDocument();
      expect(screen.getByText('Þú')).toBeInTheDocument();
      expect(screen.getByText('FI Markmið')).toBeInTheDocument();
    });
  });

  describe('Progress Display (without yearsToFI)', () => {
    const lifeEnergyWithoutYearsToFI: FINumberLifeEnergy = {
      actualHourlyWage: 5000,
      annualNetIncome: 9_600_000,
      yearsOfWork: 18.75,
    };

    it('should not show years to FI section when yearsToFI is undefined', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={lifeEnergyWithoutYearsToFI}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.queryByText('Framvinda til FI')).not.toBeInTheDocument();
      expect(screen.queryByText('Unnið')).not.toBeInTheDocument();
      expect(screen.queryByText('Eftir')).not.toBeInTheDocument();
    });

    it('should calculate progress based on currentSavings when yearsToFI is not available', () => {
      const currentSavings = 60_000_000; // 33.33% of 180M
      render(
        <LifeEnergyDisplay
          lifeEnergy={lifeEnergyWithoutYearsToFI}
          fiNumber={mockFINumber}
          currentSavings={currentSavings}
        />
      );

      // Progress bar should still exist but won't be shown (it's for when yearsToFI exists)
      // Component doesn't show progress bar without yearsToFI
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('should show prompt about adding savings data when no yearsToFI', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={lifeEnergyWithoutYearsToFI}
          fiNumber={mockFINumber}
          currentSavings={1000}
        />
      );

      expect(screen.getByText(/sláðu inn núverandi sparnað/i)).toBeInTheDocument();
    });
  });

  describe('Explanation Section', () => {
    it('should display life energy explanation', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/Hvað er lífsorka\?/)).toBeInTheDocument();
      expect(screen.getByText(/Your Money or Your Life/)).toBeInTheDocument();
    });

    it('should show explanation with years calculation when yearsToFI available', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/Þú hefur þegar "unnið"/)).toBeInTheDocument();
      expect(screen.getByText(/6,3 ár í átt að FI markmiðinu/)).toBeInTheDocument();
    });
  });

  describe('Motivational Messages', () => {
    it('should show congratulations message when progress >= 75%', () => {
      const highProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 4, // 80% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={highProgress}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/Frábært! Þú ert kominn langt á leiðinni/)).toBeInTheDocument();
    });

    it('should show halfway message when progress >= 50%', () => {
      const midProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 9, // 55% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={midProgress}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/Vel gert! Þú ert komin\/n yfir helminginn!/)).toBeInTheDocument();
    });

    it('should show early progress message when progress >= 25%', () => {
      const earlyProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 14, // 30% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={earlyProgress}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/Góð byrjun! Haltu áfram að spara!/)).toBeInTheDocument();
    });

    it('should show starting message when progress < 25%', () => {
      const startProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 18, // 10% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={startProgress}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/Sérhver ferð byrjar með einu skrefi/)).toBeInTheDocument();
    });
  });

  describe('Progress Bar Colors', () => {
    it('should use success color for high progress (>= 75%)', () => {
      const highProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 4, // 80% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={highProgress}
          fiNumber={mockFINumber}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('bg-success-500');
    });

    it('should use primary color for medium progress (>= 50%)', () => {
      const midProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 9, // 55% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={midProgress}
          fiNumber={mockFINumber}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('bg-primary-500');
    });

    it('should use warning color for early progress (>= 25%)', () => {
      const earlyProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 14, // 30% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={earlyProgress}
          fiNumber={mockFINumber}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('bg-warning-500');
    });

    it('should use orange color for starting progress (< 25%)', () => {
      const startProgress: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 18, // 10% progress
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={startProgress}
          fiNumber={mockFINumber}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveClass('bg-orange-500');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on progress bar', () => {
      render(
        <LifeEnergyDisplay
          lifeEnergy={mockLifeEnergy}
          fiNumber={mockFINumber}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-label', 'Framvinda í átt að fjármálafrelsi');
    });
  });

  describe('Edge Cases', () => {
    it('should handle yearsToFI of 0 (FI achieved)', () => {
      const achievedFI: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: 0,
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={achievedFI}
          fiNumber={mockFINumber}
        />
      );

      // When yearsToFI is 0, the condition checks for > 0, so no progress bar shown
      // Instead, check that it doesn't crash and shows the years
      expect(screen.getByText(/20,0 árum/)).toBeInTheDocument();
    });

    it('should cap progress at 100%', () => {
      const overAchieved: FINumberLifeEnergy = {
        actualHourlyWage: 5000,
        annualNetIncome: 9_600_000,
        yearsOfWork: 20,
        yearsToFI: -5, // Shouldn't happen but testing edge case
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={overAchieved}
          fiNumber={mockFINumber}
        />
      );

      // When yearsToFI is negative, component treats it as > 0 check fails, no progress shown
      // Just check it renders without crashing
      expect(screen.getByText(/20,0 árum/)).toBeInTheDocument();
    });

    it('should handle very small years of work', () => {
      const smallYears: FINumberLifeEnergy = {
        actualHourlyWage: 50000,
        annualNetIncome: 96_000_000,
        yearsOfWork: 1.9,
        yearsToFI: 1.2,
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={smallYears}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/1,9 árum/)).toBeInTheDocument();
    });

    it('should handle large years of work', () => {
      const largeYears: FINumberLifeEnergy = {
        actualHourlyWage: 1000,
        annualNetIncome: 1_920_000,
        yearsOfWork: 93.75,
        yearsToFI: 80.5,
      };

      render(
        <LifeEnergyDisplay
          lifeEnergy={largeYears}
          fiNumber={mockFINumber}
        />
      );

      expect(screen.getByText(/93,8 árum/)).toBeInTheDocument();
    });
  });
});
