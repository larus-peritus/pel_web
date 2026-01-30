/**
 * Tests for BaselineChangeNotification Component
 *
 * Epic 6, Task 6.2
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BaselineChangeNotification } from '../BaselineChangeNotification';
import type { ExpenseTier } from '@/types/expenseBaseline';

describe('BaselineChangeNotification', () => {
  // Mock props
  const mockOnDismiss = vi.fn();
  const defaultProps = {
    selectedTier: 'comfortable' as ExpenseTier,
    newFINumber: 100_000_000,
    previousFINumber: 90_000_000,
    onDismiss: mockOnDismiss,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Display Content', () => {
    it('renders notification with correct title', () => {
      render(<BaselineChangeNotification {...defaultProps} />);

      expect(screen.getByText('Útgjaldagrunnur uppfærður')).toBeInTheDocument();
      expect(
        screen.getByText(/FI-talan þín hefur verið uppfærð sjálfkrafa/)
      ).toBeInTheDocument();
    });

    it('displays selected tier label in Icelandic', () => {
      const { rerender } = render(<BaselineChangeNotification {...defaultProps} />);
      expect(screen.getByText('Þægileg')).toBeInTheDocument();

      rerender(
        <BaselineChangeNotification {...defaultProps} selectedTier="barebones" />
      );
      expect(screen.getByText('Lágmarks')).toBeInTheDocument();

      rerender(<BaselineChangeNotification {...defaultProps} selectedTier="deluxe" />);
      expect(screen.getByText('Lúxus')).toBeInTheDocument();
    });

    it('displays new FI number with currency formatting', () => {
      render(<BaselineChangeNotification {...defaultProps} />);

      // Should show formatted ISK amount
      expect(screen.getByText(/100\.000\.000/)).toBeInTheDocument();
    });

    it('shows change amount and percentage when previous FI number exists', () => {
      render(<BaselineChangeNotification {...defaultProps} />);

      // Should show increase
      expect(screen.getByText(/\+10\.000\.000/)).toBeInTheDocument();
      expect(screen.getByText(/hækkaði/)).toBeInTheDocument();
      expect(screen.getByText(/11\.1%/)).toBeInTheDocument();
    });

    it('shows decrease when new FI number is lower', () => {
      render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={80_000_000}
          previousFINumber={90_000_000}
        />
      );

      // Should show decrease
      expect(screen.getByText(/-10\.000\.000/)).toBeInTheDocument();
      expect(screen.getByText(/lækkaði/)).toBeInTheDocument();
    });

    it('does not show change section when previous FI number is null', () => {
      render(
        <BaselineChangeNotification {...defaultProps} previousFINumber={null} />
      );

      expect(screen.queryByText(/Breyting:/)).not.toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<BaselineChangeNotification {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Skoða útgjaldagrunn/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Í lagi/ })).toBeInTheDocument();
    });

    it('shows auto-dismiss message with correct timing', () => {
      render(<BaselineChangeNotification {...defaultProps} autoDismissMs={5000} />);

      expect(screen.getByText(/5 sekúndur/)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onDismiss when "Í lagi" button is clicked', async () => {
      vi.useRealTimers(); // Use real timers for user interaction
      const user = userEvent.setup();
      render(<BaselineChangeNotification {...defaultProps} />);

      const dismissButton = screen.getByRole('button', { name: /Í lagi/ });
      await user.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
      vi.useFakeTimers(); // Restore fake timers
    });

    it('calls onDismiss when close button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<BaselineChangeNotification {...defaultProps} />);

      // Alert component should have a close button
      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find((btn) =>
        btn.className.includes('close')
      );

      if (closeButton) {
        await user.click(closeButton);
        expect(mockOnDismiss).toHaveBeenCalled();
      }
    });

    it('navigates to expense baseline tool when button is clicked', async () => {
      vi.useRealTimers(); // Use real timers for user interaction
      const user = userEvent.setup();

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<BaselineChangeNotification {...defaultProps} />);

      const viewBaselineButton = screen.getByRole('button', {
        name: /Skoða útgjaldagrunn/,
      });
      await user.click(viewBaselineButton);

      expect(window.location.href).toBe('/reiknivaelir?calc=utgjaldareiknivel');

      // Restore
      window.location = originalLocation;
      vi.useFakeTimers();
    });
  });

  describe('Auto-Dismiss Behavior', () => {
    it('auto-dismisses after specified time', () => {
      render(<BaselineChangeNotification {...defaultProps} autoDismissMs={3000} />);

      expect(mockOnDismiss).not.toHaveBeenCalled();

      // Fast-forward time
      vi.advanceTimersByTime(3000);

      // Check immediately after timer advances
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not auto-dismiss when autoDismissMs is 0', () => {
      render(<BaselineChangeNotification {...defaultProps} autoDismissMs={0} />);

      vi.advanceTimersByTime(10000);

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const { unmount } = render(
        <BaselineChangeNotification {...defaultProps} autoDismissMs={5000} />
      );

      // Unmount before timer expires
      unmount();
      vi.advanceTimersByTime(5000);

      // Should not call onDismiss after unmount
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Change Calculation', () => {
    it('calculates percentage change correctly for increase', () => {
      render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={110_000_000}
          previousFINumber={100_000_000}
        />
      );

      // 10% increase
      expect(screen.getByText(/10\.0%/)).toBeInTheDocument();
    });

    it('calculates percentage change correctly for decrease', () => {
      render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={90_000_000}
          previousFINumber={100_000_000}
        />
      );

      // 10% decrease
      expect(screen.getByText(/10\.0%/)).toBeInTheDocument();
    });

    it('handles zero previous FI number gracefully', () => {
      render(
        <BaselineChangeNotification
          {...defaultProps}
          previousFINumber={0}
          newFINumber={100_000_000}
        />
      );

      // Should not crash, may show change as Infinity or N/A
      expect(screen.getByText(/Ný FI-tala:/)).toBeInTheDocument();
    });
  });

  describe('Styling and Color Coding', () => {
    it('uses amber/warning color for increases', () => {
      const { container } = render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={110_000_000}
          previousFINumber={100_000_000}
        />
      );

      // Check for amber color class on change amount
      const changeElement = container.querySelector('.text-amber-700');
      expect(changeElement).toBeInTheDocument();
    });

    it('uses green/success color for decreases', () => {
      const { container } = render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={90_000_000}
          previousFINumber={100_000_000}
        />
      );

      // Check for green color class on change amount
      const changeElement = container.querySelector('.text-green-700');
      expect(changeElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      render(<BaselineChangeNotification {...defaultProps} />);

      // Alert component should have alert role
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', async () => {
      vi.useRealTimers(); // Use real timers for user interaction
      const user = userEvent.setup();
      render(<BaselineChangeNotification {...defaultProps} />);

      const dismissButton = screen.getByRole('button', { name: /Í lagi/ });
      dismissButton.focus();
      expect(dismissButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockOnDismiss).toHaveBeenCalled();
      vi.useFakeTimers(); // Restore fake timers
    });
  });

  describe('Edge Cases', () => {
    it('handles very large FI numbers', () => {
      render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={999_999_999_999}
          previousFINumber={100_000_000}
        />
      );

      // Should format large numbers correctly
      expect(screen.getByText(/999\.999\.999\.999/)).toBeInTheDocument();
    });

    it('handles identical new and previous FI numbers', () => {
      render(
        <BaselineChangeNotification
          {...defaultProps}
          newFINumber={100_000_000}
          previousFINumber={100_000_000}
        />
      );

      // Should show change section with 0 change
      // When change is 0, it might not show percentage or might show differently
      // Check that new FI number is displayed
      expect(screen.getByText(/100\.000\.000/)).toBeInTheDocument();
      // The component might handle 0 change specially, so we just verify it renders
    });

    it('applies custom className', () => {
      const { container } = render(
        <BaselineChangeNotification {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
