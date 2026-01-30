import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IcelandicContextAlert } from '@/components/fiNumber/IcelandicContextAlert';
import { MULTIPLIER_WARNING_THRESHOLD } from '@/lib/constants/fiNumber';

describe('IcelandicContextAlert', () => {
  describe('Conditional Rendering', () => {
    it('renders when multiplier is below threshold', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      expect(screen.getByText(/Varúð: Lágt úttektarhlutfall/)).toBeInTheDocument();
    });

    it('does not render when multiplier is at threshold', () => {
      render(<IcelandicContextAlert multiplier={MULTIPLIER_WARNING_THRESHOLD} />);

      expect(screen.queryByText(/Varúð: Lágt úttektarhlutfall/)).not.toBeInTheDocument();
    });

    it('does not render when multiplier is above threshold', () => {
      render(<IcelandicContextAlert multiplier={30} />);

      expect(screen.queryByText(/Varúð: Lágt úttektarhlutfall/)).not.toBeInTheDocument();
    });

    it('renders for multiplier = 27 (just below threshold of 28)', () => {
      render(<IcelandicContextAlert multiplier={27} />);

      expect(screen.getByText(/Varúð: Lágt úttektarhlutfall/)).toBeInTheDocument();
    });

    it('does not render after being dismissed', () => {
      render(<IcelandicContextAlert multiplier={25} dismissible={true} />);

      expect(screen.getByText(/Varúð: Lágt úttektarhlutfall/)).toBeInTheDocument();

      // Find and click dismiss button
      const dismissButton = screen.getByLabelText('Dismiss alert');
      fireEvent.click(dismissButton);

      // Should no longer be visible
      expect(screen.queryByText(/Varúð: Lágt úttektarhlutfall/)).not.toBeInTheDocument();
    });

    it('cannot be dismissed when dismissible is false', () => {
      render(<IcelandicContextAlert multiplier={25} dismissible={false} />);

      expect(screen.getByText(/Varúð: Lágt úttektarhlutfall/)).toBeInTheDocument();

      // Dismiss button should not exist
      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('displays the selected multiplier and withdrawal rate', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      expect(screen.getByText(/25x margfaldara/)).toBeInTheDocument();
      expect(screen.getByText(/4,00% úttektarhlutfall/)).toBeInTheDocument();
    });

    it('calculates withdrawal rate correctly for different multipliers', () => {
      const { rerender } = render(<IcelandicContextAlert multiplier={20} />);
      expect(screen.getByText(/5,00% úttektarhlutfall/)).toBeInTheDocument();

      rerender(<IcelandicContextAlert multiplier={27} />);
      expect(screen.getByText(/3,70% úttektarhlutfall/)).toBeInTheDocument();
    });

    it('shows reasons why low multiplier is risky for Iceland', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      expect(screen.getByText(/Hærri verðbólga:/)).toBeInTheDocument();
      expect(screen.getByText(/Gjaldeyrisáhætta:/)).toBeInTheDocument();
      expect(screen.getByText(/Minni markaður:/)).toBeInTheDocument();
    });

    it('shows recommendation for 30x-33x multiplier', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      expect(screen.getByText(/30x til 33x margfaldara/)).toBeInTheDocument();
      expect(screen.getByText(/3,0-3,33% úttekt/)).toBeInTheDocument();
    });

    it('explains Icelandic context (inflation, currency, market)', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      expect(screen.getByText(/Ísland hefur söguleg hærri verðbólgu/)).toBeInTheDocument();
      expect(screen.getByText(/3-4%/)).toBeInTheDocument(); // Iceland inflation
      expect(screen.getByText(/2-3%/)).toBeInTheDocument(); // US inflation
    });
  });

  describe('Learn More Action', () => {
    it('shows learn more button when onLearnMore is provided', () => {
      const onLearnMore = vi.fn();
      render(<IcelandicContextAlert multiplier={25} onLearnMore={onLearnMore} />);

      const learnMoreButton = screen.getByRole('button', {
        name: /Læra meira um FI í íslensku samhengi/,
      });
      expect(learnMoreButton).toBeInTheDocument();
    });

    it('does not show learn more button when onLearnMore is not provided', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      expect(
        screen.queryByRole('button', { name: /Læra meira/ })
      ).not.toBeInTheDocument();
    });

    it('calls onLearnMore when button is clicked', () => {
      const onLearnMore = vi.fn();
      render(<IcelandicContextAlert multiplier={25} onLearnMore={onLearnMore} />);

      const learnMoreButton = screen.getByRole('button', {
        name: /Læra meira um FI í íslensku samhengi/,
      });
      fireEvent.click(learnMoreButton);

      expect(onLearnMore).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" attribute', () => {
      const { container } = render(<IcelandicContextAlert multiplier={25} />);

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it('dismiss button has accessible label', () => {
      render(<IcelandicContextAlert multiplier={25} dismissible={true} />);

      const dismissButton = screen.getByLabelText('Dismiss alert');
      expect(dismissButton).toBeInTheDocument();
    });

    it('icons have aria-hidden attribute', () => {
      const { container } = render(<IcelandicContextAlert multiplier={25} />);

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('has proper semantic structure', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      // Title should be a heading
      const title = screen.getByText(/Varúð: Lágt úttektarhlutfall/);
      expect(title.tagName).toBe('H3');
    });
  });

  describe('Visual States', () => {
    it('applies custom className', () => {
      const { container } = render(
        <IcelandicContextAlert multiplier={25} className="custom-class" />
      );

      const alert = container.querySelector('.custom-class');
      expect(alert).toBeInTheDocument();
    });

    it('renders with warning variant styling', () => {
      const { container } = render(<IcelandicContextAlert multiplier={25} />);

      // Alert should have warning classes
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-warning-50');
    });
  });

  describe('Edge Cases', () => {
    it('handles multiplier of exactly 28 (threshold)', () => {
      render(<IcelandicContextAlert multiplier={28} />);

      // Should not render at threshold
      expect(screen.queryByText(/Varúð: Lágt úttektarhlutfall/)).not.toBeInTheDocument();
    });

    it('handles very low multiplier (e.g., 20)', () => {
      render(<IcelandicContextAlert multiplier={20} />);

      expect(screen.getByText(/20x margfaldara/)).toBeInTheDocument();
      expect(screen.getByText(/5,00% úttektarhlutfall/)).toBeInTheDocument();
    });

    it('handles fractional multiplier correctly', () => {
      render(<IcelandicContextAlert multiplier={25.5} />);

      expect(screen.getByText(/25\.5x margfaldara/)).toBeInTheDocument();
    });

    it('formats withdrawal rate with Icelandic decimal separator', () => {
      render(<IcelandicContextAlert multiplier={25} />);

      // Should use comma for decimal separator (Icelandic format)
      expect(screen.getByText(/4,00% úttektarhlutfall/)).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('can be used with MULTIPLIER_WARNING_THRESHOLD constant', () => {
      // Below threshold - should render
      const { rerender } = render(
        <IcelandicContextAlert multiplier={MULTIPLIER_WARNING_THRESHOLD - 1} />
      );
      expect(screen.getByText(/Varúð: Lágt úttektarhlutfall/)).toBeInTheDocument();

      // At threshold - should not render
      rerender(<IcelandicContextAlert multiplier={MULTIPLIER_WARNING_THRESHOLD} />);
      expect(screen.queryByText(/Varúð: Lágt úttektarhlutfall/)).not.toBeInTheDocument();
    });

    it('works correctly when multiplier changes from high to low', () => {
      const { rerender } = render(<IcelandicContextAlert multiplier={30} />);

      // Should not render at 30
      expect(screen.queryByText(/Varúð: Lágt úttektarhlutfall/)).not.toBeInTheDocument();

      // Change to 25
      rerender(<IcelandicContextAlert multiplier={25} />);

      // Should now render
      expect(screen.getByText(/Varúð: Lágt úttektarhlutfall/)).toBeInTheDocument();
    });
  });
});
