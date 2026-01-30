/**
 * Tests for WhatIsFIRE Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WhatIsFIRE } from '@/components/fireTypes/WhatIsFIRE';

describe('WhatIsFIRE', () => {
  const STORAGE_KEY = 'fireExplorer_whatIsFIRE_dismissed';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Basic Rendering', () => {
    it('renders component with title', () => {
      render(<WhatIsFIRE />);

      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      render(<WhatIsFIRE />);

      expect(screen.getByText('Financial Independence, Retire Early')).toBeInTheDocument();
    });

    it('renders icon', () => {
      const { container } = render(<WhatIsFIRE />);

      // Check for Flame icon (lucide-react)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Expansion State', () => {
    it('starts expanded when defaultExpanded=true', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText(/FIRE \(Financial Independence, Retire Early\)/)).toBeInTheDocument();
    });

    it('starts collapsed when defaultExpanded=false', () => {
      render(<WhatIsFIRE defaultExpanded={false} />);

      expect(
        screen.queryByText(/FIRE \(Financial Independence, Retire Early\)/)
      ).not.toBeInTheDocument();
    });

    it('shows ChevronDown when collapsed', () => {
      render(<WhatIsFIRE defaultExpanded={false} />);

      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
      // Content should not be visible
      expect(
        screen.queryByText(/Af hverju að kanna mismunandi FIRE tegundir/)
      ).not.toBeInTheDocument();
    });

    it('toggles expansion when header clicked', () => {
      render(<WhatIsFIRE defaultExpanded={false} />);

      // Should be collapsed
      expect(
        screen.queryByText(/Af hverju að kanna mismunandi FIRE tegundir/)
      ).not.toBeInTheDocument();

      // Click to expand
      const header = screen.getByText('Hvað er FIRE?');
      fireEvent.click(header);

      // Should be expanded
      expect(screen.getByText(/Af hverju að kanna mismunandi FIRE tegundir/)).toBeInTheDocument();
    });

    it('collapses when header clicked again', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      // Should be expanded
      expect(screen.getByText(/Af hverju að kanna mismunandi FIRE tegundir/)).toBeInTheDocument();

      // Click to collapse
      const header = screen.getByText('Hvað er FIRE?');
      fireEvent.click(header);

      // Should be collapsed
      expect(
        screen.queryByText(/Af hverju að kanna mismunandi FIRE tegundir/)
      ).not.toBeInTheDocument();
    });
  });

  describe('Content Sections', () => {
    it('renders introduction when expanded', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText(/FIRE \(Financial Independence, Retire Early\)/)).toBeInTheDocument();
      expect(screen.getByText(/frelsi til að velja/)).toBeInTheDocument();
    });

    it('renders "Why explore FIRE types" section', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText('Af hverju að kanna mismunandi FIRE tegundir?')).toBeInTheDocument();
      expect(screen.getByText(/Það er engin ein rétt leið/)).toBeInTheDocument();
    });

    it('renders "How to use this tool" section', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText('Hvernig á að nota þetta tól?')).toBeInTheDocument();
      expect(screen.getByText(/Skoðaðu tegundir hér að neðan/)).toBeInTheDocument();
    });

    it('renders numbered steps (1-4)', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText(/Skoðaðu tegundir hér að neðan/)).toBeInTheDocument();
      expect(screen.getByText(/Sláðu inn þínar tölur/)).toBeInTheDocument();
      expect(screen.getByText(/Berðu saman valkosti/)).toBeInTheDocument();
      expect(screen.getByText(/Veldu þína leið/)).toBeInTheDocument();
    });

    it('renders key principle alert', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText('Grunnreglan')).toBeInTheDocument();
      expect(screen.getByText(/25-30x af árlegum útgjöldum/)).toBeInTheDocument();
    });

    it('renders CTA button', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      expect(screen.getByText('Ég skil, sýndu mér tegundirnar')).toBeInTheDocument();
    });
  });

  describe('Dismiss Functionality', () => {
    it('hides component when close button clicked', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      // Main content should be hidden
      expect(screen.queryByText('Hvað er FIRE?')).not.toBeInTheDocument();
    });

    it('saves dismiss preference to localStorage', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
    });

    it('calls onDismiss callback when dismissed', () => {
      const onDismiss = vi.fn();
      render(<WhatIsFIRE onDismiss={onDismiss} />);

      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('shows "Show info again" button when dismissed', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      expect(screen.getByText('Sýna upplýsingar um FIRE aftur')).toBeInTheDocument();
    });

    it('restores component when "Show info again" clicked', () => {
      render(<WhatIsFIRE />);

      // Dismiss
      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      // Show again
      const showAgainButton = screen.getByText('Sýna upplýsingar um FIRE aftur');
      fireEvent.click(showAgainButton);

      // Main content should be visible
      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });

    it('removes dismiss preference from localStorage when shown again', () => {
      render(<WhatIsFIRE />);

      // Dismiss
      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('true');

      // Show again
      const showAgainButton = screen.getByText('Sýna upplýsingar um FIRE aftur');
      fireEvent.click(showAgainButton);

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('expands component when shown again', () => {
      render(<WhatIsFIRE />);

      // Dismiss
      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      // Show again
      const showAgainButton = screen.getByText('Sýna upplýsingar um FIRE aftur');
      fireEvent.click(showAgainButton);

      // Should be expanded
      expect(screen.getByText(/Af hverju að kanna mismunandi FIRE tegundir/)).toBeInTheDocument();
    });
  });

  describe('localStorage Persistence', () => {
    it('loads dismissed state from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'true');

      render(<WhatIsFIRE />);

      // Should show "Show info again" button
      expect(screen.getByText('Sýna upplýsingar um FIRE aftur')).toBeInTheDocument();
      expect(screen.queryByText('Hvað er FIRE?')).not.toBeInTheDocument();
    });

    it('shows component when localStorage has no dismiss preference', () => {
      render(<WhatIsFIRE />);

      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });

    it('shows component when localStorage value is not "true"', () => {
      localStorage.setItem(STORAGE_KEY, 'false');

      render(<WhatIsFIRE />);

      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });
  });

  describe('CTA Button', () => {
    it('collapses content when CTA clicked', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      const ctaButton = screen.getByText('Ég skil, sýndu mér tegundirnar');
      fireEvent.click(ctaButton);

      // Content should be collapsed
      expect(
        screen.queryByText(/Af hverju að kanna mismunandi FIRE tegundir/)
      ).not.toBeInTheDocument();
    });

    it('keeps header visible after CTA clicked', () => {
      render(<WhatIsFIRE defaultExpanded={true} />);

      const ctaButton = screen.getByText('Ég skil, sýndu mér tegundirnar');
      fireEvent.click(ctaButton);

      // Header should still be visible
      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('has gradient background', () => {
      const { container } = render(<WhatIsFIRE />);

      const wrapper = container.querySelector('.bg-gradient-to-br');
      expect(wrapper).toBeInTheDocument();
    });

    it('has border styling', () => {
      const { container } = render(<WhatIsFIRE />);

      const wrapper = container.querySelector('.border-2');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies orange color scheme', () => {
      const { container } = render(<WhatIsFIRE />);

      expect(container.querySelector('.from-orange-50')).toBeInTheDocument();
      expect(container.querySelector('.border-orange-200')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible close button', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      expect(closeButton).toHaveAttribute('aria-label', 'Loka');
    });

    it('uses button elements for interactive elements', () => {
      const { container } = render(<WhatIsFIRE />);

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('maintains keyboard accessibility', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      expect(closeButton.tagName).toBe('BUTTON');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onDismiss callback', () => {
      render(<WhatIsFIRE />);

      const closeButton = screen.getByLabelText('Loka');
      expect(() => fireEvent.click(closeButton)).not.toThrow();
    });

    it('handles rapid toggle clicks', () => {
      render(<WhatIsFIRE defaultExpanded={false} />);

      const header = screen.getByText('Hvað er FIRE?');

      // Click multiple times rapidly (even number to end up collapsed)
      fireEvent.click(header); // Expand
      fireEvent.click(header); // Collapse
      fireEvent.click(header); // Expand
      fireEvent.click(header); // Collapse

      // Should handle gracefully and end up collapsed
      expect(screen.queryByText(/Af hverju að kanna mismunandi FIRE tegundir/)).not.toBeInTheDocument();
    });

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage error');
      });

      expect(() => render(<WhatIsFIRE />)).not.toThrow();

      // Restore
      localStorage.getItem = originalGetItem;
    });
  });
});
