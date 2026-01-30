import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';
import { useCalculator } from '@/context/CalculatorContext';
import type { Subscription, SubscriptionSummary } from '@/types/calculator';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext');

const mockUseCalculator = vi.mocked(useCalculator);

describe('SubscriptionList', () => {
  const mockOnEdit = vi.fn();
  const mockToggleSubscription = vi.fn();
  const mockDeleteSubscription = vi.fn();

  const mockSubscriptions: Subscription[] = [
    {
      id: 'sub-1',
      name: 'Netflix',
      monthlyCost: 2290,
      category: 'streaming',
      isActive: true,
    },
    {
      id: 'sub-2',
      name: 'Spotify',
      monthlyCost: 1399,
      category: 'streaming',
      isActive: true,
    },
    {
      id: 'sub-3',
      name: 'World Class',
      monthlyCost: 9990,
      category: 'fitness',
      isActive: false,
    },
    {
      id: 'sub-4',
      name: 'Adobe Creative Cloud',
      monthlyCost: 7990,
      category: 'software',
      isActive: true,
    },
  ];

  const mockSummary: SubscriptionSummary = {
    totalMonthly: 11679, // Active only: Netflix + Spotify + Adobe
    totalYearly: 140148,
    lifeEnergyHoursPerMonth: 10,
    lifeEnergyHoursPerYear: 120,
    futureValueIn10Years: 200000,
    futureValueIn20Years: 500000,
    byCategory: [
      {
        category: 'software',
        label: 'Hugbúnaður',
        totalMonthly: 7990,
        count: 1,
      },
      {
        category: 'streaming',
        label: 'Streymi',
        totalMonthly: 3689,
        count: 2,
      },
      {
        category: 'fitness',
        label: 'Líkamsrækt',
        totalMonthly: 0, // Inactive
        count: 1,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCalculator.mockReturnValue({
      subscriptions: mockSubscriptions,
      subscriptionSummary: mockSummary,
      toggleSubscription: mockToggleSubscription,
      deleteSubscription: mockDeleteSubscription,
      // @ts-expect-error - Partial mock
      results: null,
      inputs: {} as any,
      setInputs: vi.fn(),
      updateIncome: vi.fn(),
      updateMoneyExpenses: vi.fn(),
      updateTimeExpenses: vi.fn(),
      scenarios: [],
      saveCurrentAsScenario: vi.fn(),
      deleteScenario: vi.fn(),
      loadScenario: vi.fn(),
      addSubscription: vi.fn(),
      updateSubscription: vi.fn(),
      saveToStorage: vi.fn(),
      loadFromStorage: vi.fn(),
      exportData: vi.fn(),
      importData: vi.fn(),
      resetAll: vi.fn(),
      applyPreset: vi.fn(),
      isHydrated: true,
    });
  });

  describe('Rendering', () => {
    it('should render subscription list with all subscriptions', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(screen.getByText('Mínar áskriftir')).toBeInTheDocument();
      expect(screen.getByText('Netflix')).toBeInTheDocument();
      expect(screen.getByText('Spotify')).toBeInTheDocument();
      expect(screen.getByText('World Class')).toBeInTheDocument();
      expect(screen.getByText('Adobe Creative Cloud')).toBeInTheDocument();
    });

    it('should render empty state when no subscriptions', () => {
      mockUseCalculator.mockReturnValue({
        ...mockUseCalculator(),
        subscriptions: [],
        subscriptionSummary: null,
      });

      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(screen.getByText('Engar áskriftir skráðar')).toBeInTheDocument();
      expect(
        screen.getByText('Bættu við fyrstu áskriftinni þinni hér að ofan')
      ).toBeInTheDocument();
    });

    it('should group subscriptions by category', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      // Category headers (text is in proper case, uppercase is via CSS)
      const categoryHeaders = screen.getAllByRole('heading', { level: 3 });
      const categoryNames = categoryHeaders.map((h) => h.textContent);

      expect(categoryNames).toContain('Hugbúnaður');
      expect(categoryNames).toContain('Streymi');
      expect(categoryNames).toContain('Líkamsrækt');
    });

    it('should display category totals for active subscriptions', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      // Software: 7.990 kr
      expect(screen.getByText('7.990 kr/mán')).toBeInTheDocument();
      // Streaming: 3.689 kr
      expect(screen.getByText('3.689 kr/mán')).toBeInTheDocument();
      // Fitness should not show total (inactive)
    });

    it('should display subscription costs in Icelandic format', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(screen.getByText('2.290 kr')).toBeInTheDocument(); // Netflix
      expect(screen.getByText('1.399 kr')).toBeInTheDocument(); // Spotify
      expect(screen.getByText('9.990 kr')).toBeInTheDocument(); // World Class
    });

    it('should show "Óvirk" badge for inactive subscriptions', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const badges = screen.getAllByText('Óvirk');
      expect(badges).toHaveLength(1);
    });

    it('should display inactive subscriptions with reduced opacity', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      // Find the parent div with the subscription item (has the opacity class)
      const worldClassElement = screen.getByText('World Class');
      const subscriptionItem = worldClassElement.closest('.flex.items-center.gap-3');
      expect(subscriptionItem).toHaveClass('opacity-50');
    });

    it('should display category labels in Icelandic', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      // Within each subscription item, check for category label
      const netflixElement = screen.getByText('Netflix');
      const netflixSubscriptionItem = netflixElement.closest('.flex.items-center.gap-3');
      expect(within(netflixSubscriptionItem!).getByText('Streymi')).toBeInTheDocument();

      const adobeElement = screen.getByText('Adobe Creative Cloud');
      const adobeSubscriptionItem = adobeElement.closest('.flex.items-center.gap-3');
      expect(within(adobeSubscriptionItem!).getByText('Hugbúnaður')).toBeInTheDocument();
    });
  });

  describe('Toggle Functionality', () => {
    it('should call toggleSubscription when toggle is clicked', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const netflixToggle = screen.getByRole('switch', {
        name: /afvirkja netflix/i,
      });
      fireEvent.click(netflixToggle);

      expect(mockToggleSubscription).toHaveBeenCalledWith('sub-1');
    });

    it('should show correct aria-label for active subscriptions', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(
        screen.getByRole('switch', { name: /afvirkja netflix/i })
      ).toBeInTheDocument();
    });

    it('should show correct aria-label for inactive subscriptions', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(
        screen.getByRole('switch', { name: /virkja world class/i })
      ).toBeInTheDocument();
    });

    it('should render toggle switch with correct checked state', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const activeToggle = screen.getByRole('switch', {
        name: /afvirkja netflix/i,
      });
      const inactiveToggle = screen.getByRole('switch', {
        name: /virkja world class/i,
      });

      expect(activeToggle).toHaveAttribute('aria-checked', 'true');
      expect(inactiveToggle).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Edit Functionality', () => {
    it('should call onEdit when edit button is clicked', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const editButton = screen.getByRole('button', {
        name: /breyta netflix/i,
      });
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockSubscriptions[0]);
    });

    it('should have edit buttons for all subscriptions', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(
        screen.getByRole('button', { name: /breyta netflix/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /breyta spotify/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /breyta world class/i })
      ).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    it('should show confirmation dialog when delete button is clicked', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const deleteButton = screen.getByRole('button', {
        name: /eyða netflix/i,
      });
      fireEvent.click(deleteButton);

      expect(screen.getByText('Eyða áskrift?')).toBeInTheDocument();
      expect(screen.getByText(/Ertu viss um að þú viljir eyða/)).toBeInTheDocument();
      // Check for the Netflix text in the confirmation dialog specifically
      const dialog = screen.getByText('Eyða áskrift?').closest('.max-w-md');
      expect(within(dialog!).getByText('Netflix')).toBeInTheDocument();
    });

    it('should close confirmation dialog when cancel is clicked', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const deleteButton = screen.getByRole('button', {
        name: /eyða netflix/i,
      });
      fireEvent.click(deleteButton);

      const cancelButton = screen.getByRole('button', { name: /hætta við/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Eyða áskrift?')).not.toBeInTheDocument();
    });

    it('should delete subscription when confirmed', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const deleteButton = screen.getByRole('button', {
        name: /eyða netflix/i,
      });
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByRole('button', { name: /^eyða$/i });
      fireEvent.click(confirmButton);

      expect(mockDeleteSubscription).toHaveBeenCalledWith('sub-1');
      expect(screen.queryByText('Eyða áskrift?')).not.toBeInTheDocument();
    });

    it('should close dialog when clicking outside', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const deleteButton = screen.getByRole('button', {
        name: /eyða netflix/i,
      });
      fireEvent.click(deleteButton);

      const backdrop = screen.getByText('Eyða áskrift?').closest('.fixed');
      fireEvent.click(backdrop!);

      expect(screen.queryByText('Eyða áskrift?')).not.toBeInTheDocument();
    });

    it('should not close dialog when clicking inside the card', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const deleteButton = screen.getByRole('button', {
        name: /eyða netflix/i,
      });
      fireEvent.click(deleteButton);

      const dialogCard = screen.getByText('Eyða áskrift?').closest('.max-w-md');
      fireEvent.click(dialogCard!);

      expect(screen.getByText('Eyða áskrift?')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort categories by total cost (highest first)', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const categoryHeaders = screen.getAllByRole('heading', { level: 3 });

      // Order should be: Software (7990), Streaming (3689), Fitness (0)
      expect(categoryHeaders[0]).toHaveTextContent('Hugbúnaður');
      expect(categoryHeaders[1]).toHaveTextContent('Streymi');
      expect(categoryHeaders[2]).toHaveTextContent('Líkamsrækt');
    });

    it('should sort subscriptions alphabetically within category', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const streamingHeader = screen.getAllByRole('heading', { level: 3 })[1]; // Second category header
      const streamingSection = streamingHeader.closest('.px-6');

      // Get all subscription name paragraphs in the streaming section
      const subscriptionElements = within(streamingSection!).getAllByText(/Netflix|Spotify/);

      // Filter to only get the subscription names (not the category labels)
      const subscriptionNames = subscriptionElements
        .filter(el => el.className.includes('font-medium'))
        .map(el => el.textContent);

      // Netflix should come before Spotify alphabetically
      expect(subscriptionNames[0]).toBe('Netflix');
      expect(subscriptionNames[1]).toBe('Spotify');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on toggle switches', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      const toggles = screen.getAllByRole('switch');
      expect(toggles.length).toBeGreaterThan(0);
      toggles.forEach((toggle) => {
        expect(toggle).toHaveAttribute('aria-label');
      });
    });

    it('should have proper ARIA labels on action buttons', () => {
      render(<SubscriptionList onEdit={mockOnEdit} />);

      expect(
        screen.getByRole('button', { name: /breyta netflix/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /eyða netflix/i })
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null subscriptionSummary gracefully', () => {
      mockUseCalculator.mockReturnValue({
        ...mockUseCalculator(),
        subscriptionSummary: null,
      });

      render(<SubscriptionList onEdit={mockOnEdit} />);

      // When subscriptionSummary is null, groupedSubscriptions returns empty array
      // So it just shows the header without any items
      expect(screen.getByText('Mínar áskriftir')).toBeInTheDocument();
    });

    it('should handle subscriptions without matching category in summary', () => {
      const summaryWithMissingCategory: SubscriptionSummary = {
        ...mockSummary,
        byCategory: [
          {
            category: 'streaming',
            label: 'Streymi',
            totalMonthly: 3689,
            count: 2,
          },
        ],
      };

      mockUseCalculator.mockReturnValue({
        ...mockUseCalculator(),
        subscriptionSummary: summaryWithMissingCategory,
      });

      render(<SubscriptionList onEdit={mockOnEdit} />);

      // Only categories in summary are shown, so only streaming subs appear
      expect(screen.getByText('Netflix')).toBeInTheDocument();
      expect(screen.getByText('Spotify')).toBeInTheDocument();
      // Software and Fitness categories not in summary, so their subs don't appear
      expect(screen.queryByText('Adobe Creative Cloud')).not.toBeInTheDocument();
    });
  });
});
