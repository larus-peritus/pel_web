import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import type { Subscription } from '@/types/calculator';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SubscriptionForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const mockSubscription: Subscription = {
    id: 'sub-123',
    name: 'Netflix',
    monthlyCost: 2290,
    category: 'streaming',
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Add Mode', () => {
    it('should render form in add mode with correct title', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Bæta við áskrift')).toBeInTheDocument();
    });

    it('should show quick preset selector in add mode', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText('Flýtival')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/Nafn áskriftar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mánaðarkostnaður/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Flokkur/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /Vista/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Hætta við/i })
      ).toBeInTheDocument();
    });

    it('should populate fields when quick preset is selected', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const quickSelect = screen.getByLabelText('Flýtival');

      // Select Netflix preset (index 0)
      fireEvent.change(quickSelect, { target: { value: '0' } });

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i) as HTMLInputElement;
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i) as HTMLInputElement;

      expect(nameInput.value).toBe('Netflix');
      expect(costInput.value).toBe('2290');
    });

    it('should update form fields when user types', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i) as HTMLInputElement;
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i) as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: 'Custom Service' } });
      fireEvent.change(costInput, { target: { value: '1500' } });

      expect(nameInput.value).toBe('Custom Service');
      expect(costInput.value).toBe('1500');
    });

    it('should validate required name field', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i) as HTMLInputElement;
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);

      // Set cost to valid value
      fireEvent.change(costInput, { target: { value: '1000' } });

      // Set name to empty (after having a value) to trigger validation
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(nameInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      // HTML5 validation should prevent submission with empty required field
      // Our validation would show an error if it ran
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should validate name max length (100 chars)', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      const longName = 'a'.repeat(101);
      fireEvent.change(nameInput, { target: { value: longName } });

      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      fireEvent.change(costInput, { target: { value: '1000' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Nafn má ekki vera lengra en 100 stafir')
        ).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should validate required cost field', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      fireEvent.change(nameInput, { target: { value: 'Test Service' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      // HTML5 validation should prevent submission with empty required field
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should validate cost must be greater than 0', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      fireEvent.change(nameInput, { target: { value: 'Test Service' } });

      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      fireEvent.change(costInput, { target: { value: '0' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Kostnaður verður að vera hærri en 0 kr')
        ).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should call onSave with correct data on valid submission', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      fireEvent.change(nameInput, { target: { value: 'Test Service' } });

      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      fireEvent.change(costInput, { target: { value: '1500' } });

      const categorySelect = screen.getByLabelText(/Flokkur/i);
      fireEvent.change(categorySelect, { target: { value: 'software' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          name: 'Test Service',
          monthlyCost: 1500,
          category: 'software',
          isActive: true,
        });
      });
    });

    it('should call onCancel when cancel button is clicked', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Hætta við/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should trim whitespace from name on submission', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      fireEvent.change(nameInput, { target: { value: '  Test Service  ' } });

      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      fireEvent.change(costInput, { target: { value: '1500' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Service',
          })
        );
      });
    });
  });

  describe('Edit Mode', () => {
    it('should render form in edit mode with correct title', () => {
      render(
        <SubscriptionForm
          mode="edit"
          subscription={mockSubscription}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Breyta áskrift')).toBeInTheDocument();
    });

    it('should not show quick preset selector in edit mode', () => {
      render(
        <SubscriptionForm
          mode="edit"
          subscription={mockSubscription}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByLabelText('Flýtival')).not.toBeInTheDocument();
    });

    it('should populate fields with existing subscription data', () => {
      render(
        <SubscriptionForm
          mode="edit"
          subscription={mockSubscription}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i) as HTMLInputElement;
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i) as HTMLInputElement;
      const categorySelect = screen.getByLabelText(/Flokkur/i) as HTMLSelectElement;

      expect(nameInput.value).toBe('Netflix');
      expect(costInput.value).toBe('2290');
      expect(categorySelect.value).toBe('streaming');
    });

    it('should call onSave with updated data and preserve isActive', async () => {
      render(
        <SubscriptionForm
          mode="edit"
          subscription={mockSubscription}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      fireEvent.change(nameInput, { target: { value: 'Netflix Premium' } });

      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      fireEvent.change(costInput, { target: { value: '2990' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          name: 'Netflix Premium',
          monthlyCost: 2990,
          category: 'streaming',
          isActive: true, // Should preserve from original
        });
      });
    });

    it('should preserve isActive when editing inactive subscription', async () => {
      const inactiveSubscription: Subscription = {
        ...mockSubscription,
        isActive: false,
      };

      render(
        <SubscriptionForm
          mode="edit"
          subscription={inactiveSubscription}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            isActive: false,
          })
        );
      });
    });
  });

  describe('Category Selection', () => {
    it('should render all category options', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const categorySelect = screen.getByLabelText(/Flokkur/i);
      const options = categorySelect.querySelectorAll('option');

      // Should have all 6 categories
      expect(options.length).toBe(6);

      // Check for Icelandic labels
      const optionTexts = Array.from(options).map((opt) => opt.textContent);
      expect(optionTexts).toContain('Streymi');
      expect(optionTexts).toContain('Hugbúnaður');
      expect(optionTexts).toContain('Líkamsrækt');
      expect(optionTexts).toContain('Fréttir og tímarit');
      expect(optionTexts).toContain('Tölvuleikir');
      expect(optionTexts).toContain('Annað');
    });

    it('should update category when selection changes', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const categorySelect = screen.getByLabelText(/Flokkur/i) as HTMLSelectElement;

      fireEvent.change(categorySelect, { target: { value: 'fitness' } });
      expect(categorySelect.value).toBe('fitness');

      fireEvent.change(categorySelect, { target: { value: 'gaming' } });
      expect(categorySelect.value).toBe('gaming');
    });

    it('should default to "other" category in add mode', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const categorySelect = screen.getByLabelText(/Flokkur/i) as HTMLSelectElement;
      expect(categorySelect.value).toBe('other');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      const categorySelect = screen.getByLabelText(/Flokkur/i);

      expect(nameInput).toHaveAttribute('aria-invalid');
      expect(costInput).toHaveAttribute('aria-invalid');
      expect(categorySelect).toBeInTheDocument();
    });

    it('should mark required fields', () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);
      const categorySelect = screen.getByLabelText(/Flokkur/i);

      expect(nameInput).toBeRequired();
      expect(costInput).toBeRequired();
      expect(categorySelect).toBeRequired();
    });

    it('should display error messages with role="alert" when validation fails', async () => {
      render(
        <SubscriptionForm
          mode="add"
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nafn áskriftar/i);
      const costInput = screen.getByLabelText(/Mánaðarkostnaður/i);

      // Set a very long name to trigger max length validation
      const longName = 'a'.repeat(101);
      fireEvent.change(nameInput, { target: { value: longName } });
      fireEvent.change(costInput, { target: { value: '1000' } });

      const submitButton = screen.getByRole('button', { name: /Vista/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });
  });
});
