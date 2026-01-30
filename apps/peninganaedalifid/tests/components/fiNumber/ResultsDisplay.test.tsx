import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResultsDisplay } from '@/components/fiNumber/ResultsDisplay';

describe('ResultsDisplay Component', () => {
  const defaultProps = {
    fiNumber: 180000000,
    monthlyExpenses: 500000,
    annualExpenses: 6000000,
    multiplier: 30,
    withdrawalRate: 3.33,
  };

  describe('Display States', () => {
    it('renders loading state correctly', () => {
      render(<ResultsDisplay {...defaultProps} fiNumber={null} isLoading={true} />);

      // Should show skeleton loaders
      const skeletons = screen.getAllByRole('generic').filter((el) =>
        el.className.includes('animate-pulse')
      );
      expect(skeletons.length).toBeGreaterThan(0);

      // Should not show actual content
      expect(screen.queryByText(/Þín FI-tala/i)).not.toBeInTheDocument();
    });

    it('renders no results state when fiNumber is null', () => {
      render(<ResultsDisplay {...defaultProps} fiNumber={null} />);

      expect(
        screen.getByText(/Sláðu inn mánaðarleg útgjöld til að reikna út FI-tölu/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Veldu útgjaldatier eða sláðu inn sérsniðna upphæð/i)
      ).toBeInTheDocument();
    });

    it('renders no results state when fiNumber is 0', () => {
      render(<ResultsDisplay {...defaultProps} fiNumber={0} />);

      expect(
        screen.getByText(/Sláðu inn mánaðarleg útgjöld til að reikna út FI-tölu/i)
      ).toBeInTheDocument();
    });

    it('renders full results when fiNumber is provided', () => {
      render(<ResultsDisplay {...defaultProps} />);

      // Hero section
      expect(screen.getByText(/Þín FI-tala/i)).toBeInTheDocument();
      expect(screen.getAllByText(/180\.000\.000 kr/i).length).toBeGreaterThan(0);

      // Breakdown section
      expect(screen.getByText(/Sundurliðun/i)).toBeInTheDocument();
    });
  });

  describe('FI Number Display', () => {
    it('displays FI number in large, prominent format', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      // Find the hero display specifically
      const heroSection = container.querySelector('.bg-gradient-to-br');
      expect(heroSection).toBeInTheDocument();
      const fiNumberElement = heroSection?.querySelector('.text-4xl');
      expect(fiNumberElement).toBeInTheDocument();
      expect(fiNumberElement?.textContent).toContain('180.000.000 kr');
      expect(fiNumberElement?.className).toContain('font-bold');
    });

    it('formats FI number with Icelandic thousands separator (period)', () => {
      render(<ResultsDisplay {...defaultProps} fiNumber={180000000} />);

      // Should use period as thousands separator (Icelandic format)
      expect(screen.getAllByText(/180\.000\.000 kr/i).length).toBeGreaterThan(0);
    });

    it('displays correct FI number for different values', () => {
      const { rerender } = render(<ResultsDisplay {...defaultProps} fiNumber={50000000} />);
      expect(screen.getAllByText(/50\.000\.000 kr/i).length).toBeGreaterThan(0);

      rerender(<ResultsDisplay {...defaultProps} fiNumber={250000000} />);
      expect(screen.getAllByText(/250\.000\.000 kr/i).length).toBeGreaterThan(0);
    });

    it('includes descriptive text about FI number', () => {
      render(<ResultsDisplay {...defaultProps} />);

      expect(
        screen.getByText(/Þetta er heildareignin sem þú þarft til að ná fjármálafrelsi/i)
      ).toBeInTheDocument();
    });
  });

  describe('Expense Breakdown', () => {
    it('displays monthly expenses correctly', () => {
      render(<ResultsDisplay {...defaultProps} />);

      expect(screen.getByText(/Mánaðarleg útgjöld/i)).toBeInTheDocument();
      expect(screen.getByText(/Áætluð útgjöld á mánuði/i)).toBeInTheDocument();
      expect(screen.getByText(/500\.000 kr/i)).toBeInTheDocument();
    });

    it('displays annual expenses correctly', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      expect(screen.getByText(/Árleg útgjöld/i)).toBeInTheDocument();
      expect(screen.getByText(/Mánaðarleg × 12/i)).toBeInTheDocument();
      expect(container.textContent).toContain('6.000.000 kr');
    });

    it('displays multiplier correctly', () => {
      render(<ResultsDisplay {...defaultProps} />);

      expect(screen.getByText(/Margfaldari/i)).toBeInTheDocument();
      expect(screen.getByText(/30x/i)).toBeInTheDocument();
    });

    it('displays withdrawal rate correctly', () => {
      render(<ResultsDisplay {...defaultProps} />);

      expect(screen.getByText(/Úttektarhlutfall/i)).toBeInTheDocument();
      expect(screen.getByText(/3\.33%/i)).toBeInTheDocument();
    });

    it('formats withdrawal rate to 2 decimal places', () => {
      render(<ResultsDisplay {...defaultProps} withdrawalRate={3.3333333} />);

      expect(screen.getByText(/3\.33%/i)).toBeInTheDocument();
    });
  });

  describe('Calculation Formula', () => {
    it('displays calculation formula', () => {
      render(<ResultsDisplay {...defaultProps} />);

      expect(screen.getByText(/Formúla:/i)).toBeInTheDocument();
      // Formula: 6.000.000 kr × 30 = 180.000.000 kr
      expect(screen.getByText(/6\.000\.000 kr × 30 = 180\.000\.000 kr/i)).toBeInTheDocument();
    });

    it('updates formula when values change', () => {
      const { rerender } = render(
        <ResultsDisplay
          fiNumber={165000000}
          monthlyExpenses={500000}
          annualExpenses={6000000}
          multiplier={27.5}
          withdrawalRate={3.64}
        />
      );

      expect(screen.getByText(/6\.000\.000 kr × 28 = 165\.000\.000 kr/i)).toBeInTheDocument();

      rerender(
        <ResultsDisplay
          fiNumber={198000000}
          monthlyExpenses={600000}
          annualExpenses={7200000}
          multiplier={27.5}
          withdrawalRate={3.64}
        />
      );

      expect(screen.getByText(/7\.200\.000 kr × 28 = 198\.000\.000 kr/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('has responsive text size classes for FI number', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      // Find the hero display specifically
      const heroSection = container.querySelector('.bg-gradient-to-br');
      const fiNumberElement = heroSection?.querySelector('.text-4xl');
      // Should have responsive classes (text-4xl md:text-5xl lg:text-6xl)
      expect(fiNumberElement?.className).toMatch(/text-4xl.*md:text-5xl.*lg:text-6xl/);
    });

    it('has responsive layout classes for breakdown items', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      // Breakdown items should have flex classes for mobile/desktop
      const breakdownItems = container.querySelectorAll('.flex');
      expect(breakdownItems.length).toBeGreaterThan(0);
    });
  });

  describe('Icelandic Formatting', () => {
    it('uses Icelandic number formatting for all currency values', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      // All amounts should use period as thousands separator
      expect(container.textContent).toContain('180.000.000 kr');
      expect(container.textContent).toContain('500.000 kr');
      expect(container.textContent).toContain('6.000.000 kr');
    });

    it('displays all text in Icelandic', () => {
      render(<ResultsDisplay {...defaultProps} />);

      // Check for Icelandic labels
      expect(screen.getByText(/Þín FI-tala/i)).toBeInTheDocument();
      expect(screen.getByText(/Sundurliðun/i)).toBeInTheDocument();
      expect(screen.getByText(/Mánaðarleg útgjöld/i)).toBeInTheDocument();
      expect(screen.getByText(/Árleg útgjöld/i)).toBeInTheDocument();
      expect(screen.getByText(/Margfaldari/i)).toBeInTheDocument();
      expect(screen.getByText(/Úttektarhlutfall/i)).toBeInTheDocument();
      expect(screen.getByText(/Formúla:/i)).toBeInTheDocument();
    });
  });

  describe('Visual Hierarchy', () => {
    it('hero section has gradient background', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      const heroSection = container.querySelector('.bg-gradient-to-br');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection?.className).toContain('from-primary-50');
    });

    it('breakdown card uses Card component', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      // Card should have rounded corners and shadow
      const card = container.querySelector('.rounded-xl');
      expect(card).toBeInTheDocument();
    });

    it('breakdown items have visual separation', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} />);

      // Items should have border-b classes for separation
      const separators = container.querySelectorAll('.border-b');
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles very large FI numbers', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} fiNumber={999999999} />);

      expect(container.textContent).toContain('999.999.999 kr');
    });

    it('handles small FI numbers', () => {
      const { container } = render(<ResultsDisplay {...defaultProps} fiNumber={5000000} />);

      expect(container.textContent).toContain('5.000.000 kr');
    });

    it('handles decimal multipliers correctly', () => {
      render(<ResultsDisplay {...defaultProps} multiplier={27.5} />);

      // Multiplier should be rounded to 0 decimals in display
      expect(screen.getByText(/28x/i)).toBeInTheDocument();
    });

    it('handles high withdrawal rates', () => {
      render(<ResultsDisplay {...defaultProps} withdrawalRate={5.0} />);

      expect(screen.getByText(/5\.00%/i)).toBeInTheDocument();
    });

    it('handles low withdrawal rates', () => {
      render(<ResultsDisplay {...defaultProps} withdrawalRate={2.5} />);

      expect(screen.getByText(/2\.50%/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<ResultsDisplay {...defaultProps} />);

      const heading = screen.getByText(/Sundurliðun/i);
      expect(heading.tagName).toBe('H3');
    });

    it('provides descriptive labels for all values', () => {
      render(<ResultsDisplay {...defaultProps} />);

      // Each value should have a descriptive label above it
      expect(screen.getByText(/Mánaðarleg útgjöld/i)).toBeInTheDocument();
      expect(screen.getByText(/Árleg útgjöld/i)).toBeInTheDocument();
      expect(screen.getByText(/Margfaldari/i)).toBeInTheDocument();
      expect(screen.getByText(/Úttektarhlutfall/i)).toBeInTheDocument();
    });

    it('includes helper text for clarity', () => {
      render(<ResultsDisplay {...defaultProps} />);

      expect(screen.getByText(/Áætluð útgjöld á mánuði/i)).toBeInTheDocument();
      expect(screen.getByText(/Mánaðarleg × 12/i)).toBeInTheDocument();
      expect(screen.getByText(/Hlutfall sem þú getur tekið út árlega/i)).toBeInTheDocument();
    });
  });
});
