import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubscriptionBurnMeter } from '@/components/subscriptions/SubscriptionBurnMeter';
import { CalculatorProvider } from '@/context/CalculatorContext';

/**
 * Test suite for SubscriptionBurnMeter component
 */
describe('SubscriptionBurnMeter', () => {
  /**
   * Render component within CalculatorProvider for testing
   */
  const renderComponent = () => {
    return render(
      <CalculatorProvider>
        <SubscriptionBurnMeter />
      </CalculatorProvider>
    );
  };

  describe('Initial render', () => {
    it('renders main heading', () => {
      renderComponent();
      expect(screen.getByText('Áskriftarkostnaðarmælir')).toBeInTheDocument();
    });

    it('renders description text', () => {
      renderComponent();
      expect(
        screen.getByText(/Fylgstu með áskriftum og sjáðu áhrif þeirra á lífsorku þína/i)
      ).toBeInTheDocument();
    });

    it('renders "Add subscription" button', () => {
      renderComponent();
      const addButton = screen.getByRole('button', { name: /Bæta við áskrift/i });
      expect(addButton).toBeInTheDocument();
    });

    it('shows empty state when no subscriptions', () => {
      renderComponent();
      expect(screen.getByText(/Byrjaðu að fylgjast með áskriftum/i)).toBeInTheDocument();
      expect(screen.getByText(/Bæta við fyrstu áskriftinni/i)).toBeInTheDocument();
    });
  });

  describe('Form behavior', () => {
    it('opens form when "Add subscription" button is clicked', () => {
      renderComponent();

      const addButton = screen.getByRole('button', { name: /Bæta við áskrift/i });
      fireEvent.click(addButton);

      // Form should be visible with "add" mode
      expect(screen.getByText(/Bæta við áskrift/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nafn áskriftar/i)).toBeInTheDocument();
    });

    it('hides add button when form is open', () => {
      renderComponent();

      const addButton = screen.getByRole('button', { name: /\+ Bæta við áskrift/i });
      fireEvent.click(addButton);

      // The main add button with "+" should be hidden
      const addButtons = screen.queryAllByRole('button', { name: /\+ Bæta við áskrift/i });
      expect(addButtons.length).toBe(0);
    });

    it('closes form when cancel is clicked', () => {
      renderComponent();

      // Open form
      const addButton = screen.getByRole('button', { name: /Bæta við áskrift/i });
      fireEvent.click(addButton);

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Hætta við/i });
      fireEvent.click(cancelButton);

      // Form should be closed, add button visible again
      expect(screen.queryByLabelText(/Nafn áskriftar/i)).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders 2-column grid layout', () => {
      const { container } = renderComponent();

      // Check for grid layout classes
      const gridContainer = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    it('renders SubscriptionList component', () => {
      renderComponent();

      // SubscriptionList shows "Engar áskriftir skráðar" in empty state
      expect(screen.getByText(/Engar áskriftir skráðar/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      renderComponent();

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Áskriftarkostnaðarmælir');
    });

    it('has accessible button labels', () => {
      renderComponent();

      const addButton = screen.getByRole('button', { name: /Bæta við áskrift/i });
      expect(addButton).toBeInTheDocument();
    });
  });
});
