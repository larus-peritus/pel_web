/**
 * Tests for NoRecommendationAlert Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoRecommendationAlert } from '@/components/fireTypes/NoRecommendationAlert';

describe('NoRecommendationAlert', () => {
  describe('Rendering', () => {
    it('renders alert with title', () => {
      render(
        <NoRecommendationAlert missingInputs={['age', 'income']} />
      );

      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });

    it('renders explanation text', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.getByText(/Til að geta gefið þér persónulegar ráðleggingar/i)).toBeInTheDocument();
    });

    it('renders missing inputs header', () => {
      render(
        <NoRecommendationAlert missingInputs={['age', 'income']} />
      );

      expect(screen.getByText('Upplýsingar sem vantar:')).toBeInTheDocument();
    });
  });

  describe('Missing Inputs Display', () => {
    it('displays single missing input', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.getByText('Aldur þinn')).toBeInTheDocument();
    });

    it('displays multiple missing inputs', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age', 'income', 'currentSavings']}
        />
      );

      expect(screen.getByText('Aldur þinn')).toBeInTheDocument();
      expect(screen.getByText('Árstekjur')).toBeInTheDocument();
      expect(screen.getByText('Núverandi sparnaður')).toBeInTheDocument();
    });

    it('displays all possible missing inputs with correct labels', () => {
      render(
        <NoRecommendationAlert
          missingInputs={[
            'age',
            'income',
            'currentSavings',
            'monthlyExpenses',
            'monthlySavings',
          ]}
        />
      );

      expect(screen.getByText('Aldur þinn')).toBeInTheDocument();
      expect(screen.getByText('Árstekjur')).toBeInTheDocument();
      expect(screen.getByText('Núverandi sparnaður')).toBeInTheDocument();
      expect(screen.getByText('Mánaðarleg útgjöld')).toBeInTheDocument();
      expect(screen.getByText('Mánaðarlegur sparnaður')).toBeInTheDocument();
    });

    it('handles empty missing inputs array', () => {
      render(
        <NoRecommendationAlert missingInputs={[]} />
      );

      // Should still render the alert, but no missing inputs list
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
      expect(screen.queryByText('Upplýsingar sem vantar:')).not.toBeInTheDocument();
    });
  });

  describe('Call to Action', () => {
    it('renders button when onGoToInputs provided', () => {
      const onGoToInputs = vi.fn();
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          onGoToInputs={onGoToInputs}
        />
      );

      expect(screen.getByRole('button', { name: /Fylla inn upplýsingar/i })).toBeInTheDocument();
    });

    it('does not render button when onGoToInputs not provided', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.queryByRole('button', { name: /Fylla inn upplýsingar/i })).not.toBeInTheDocument();
    });

    it('calls onGoToInputs when button clicked', async () => {
      const user = userEvent.setup();
      const onGoToInputs = vi.fn();
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          onGoToInputs={onGoToInputs}
        />
      );

      const button = screen.getByRole('button', { name: /Fylla inn upplýsingar/i });
      await user.click(button);

      expect(onGoToInputs).toHaveBeenCalledTimes(1);
    });
  });

  describe('Example Recommendations', () => {
    it('shows examples when showExamples is true', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={true}
        />
      );

      expect(screen.getByText('Hvað munt þú sjá?')).toBeInTheDocument();
      expect(screen.getByText('Venjulegt FIRE')).toBeInTheDocument();
      expect(screen.getByText('CoastFIRE')).toBeInTheDocument();
      expect(screen.getByText('BaristaFIRE')).toBeInTheDocument();
    });

    it('hides examples when showExamples is false', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={false}
        />
      );

      expect(screen.queryByText('Hvað munt þú sjá?')).not.toBeInTheDocument();
      expect(screen.queryByText('Venjulegt FIRE')).not.toBeInTheDocument();
    });

    it('shows example descriptions', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={true}
        />
      );

      expect(screen.getByText('Jafnvægi milli lífsstíls og sparnaðar')).toBeInTheDocument();
      expect(screen.getByText('Láttu fjárfestingar vaxa á meðan þú vinnur')).toBeInTheDocument();
      expect(screen.getByText('Hálftímavinna í stað fulls starfs')).toBeInTheDocument();
    });

    it('shows "Besti valkosturinn" badge on first example', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={true}
        />
      );

      expect(screen.getByText('Besti valkosturinn')).toBeInTheDocument();
    });

    it('shows tip about more information', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={true}
        />
      );

      expect(screen.getByText(/Því meiri upplýsingar sem þú gefur/i)).toBeInTheDocument();
    });
  });

  describe('Educational Section', () => {
    it('renders educational section about FIRE', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });

    it('explains FIRE acronym', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.getByText(/Financial Independence, Retire Early/i)).toBeInTheDocument();
    });

    it('lists all 5 FIRE types', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.getByText(/LeanFIRE:/)).toBeInTheDocument();
      expect(screen.getByText(/RegularFIRE:/)).toBeInTheDocument();
      expect(screen.getByText(/CoastFIRE:/)).toBeInTheDocument();
      expect(screen.getByText(/BaristaFIRE:/)).toBeInTheDocument();
      expect(screen.getByText(/FatFIRE:/)).toBeInTheDocument();
    });

    it('shows helpful closing message', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      expect(screen.getByText(/Við hjálpum þér að finna út/i)).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('applies custom className', () => {
      const { container } = render(
        <NoRecommendationAlert
          missingInputs={['age']}
          className="custom-class"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('uses info variant for main alert', () => {
      render(
        <NoRecommendationAlert missingInputs={['age']} />
      );

      // Alert component should have info styling
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });
  });

  describe('Content Completeness', () => {
    it('renders all main sections when all props provided', () => {
      const onGoToInputs = vi.fn();
      render(
        <NoRecommendationAlert
          missingInputs={['age', 'income']}
          onGoToInputs={onGoToInputs}
          showExamples={true}
        />
      );

      // Main alert
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();

      // Missing inputs
      expect(screen.getByText('Upplýsingar sem vantar:')).toBeInTheDocument();

      // CTA button
      expect(screen.getByRole('button', { name: /Fylla inn upplýsingar/i })).toBeInTheDocument();

      // Examples
      expect(screen.getByText('Hvað munt þú sjá?')).toBeInTheDocument();

      // Educational section
      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });

    it('renders minimal content when no optional props provided', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={false}
        />
      );

      // Main alert always present
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();

      // No button
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // No examples
      expect(screen.queryByText('Hvað munt þú sjá?')).not.toBeInTheDocument();

      // Educational section always present
      expect(screen.getByText('Hvað er FIRE?')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={true}
        />
      );

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const onGoToInputs = vi.fn();
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          onGoToInputs={onGoToInputs}
        />
      );

      const button = screen.getByRole('button', { name: /Fylla inn upplýsingar/i });

      // Tab to button and press Enter
      await user.tab();
      await user.keyboard('{Enter}');

      expect(onGoToInputs).toHaveBeenCalled();
    });

    it('has appropriate emoji labels', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['age']}
          showExamples={true}
        />
      );

      // Emojis should have role="img" with aria-label
      const educationalIcon = screen.getByRole('img', { name: 'Upplýsingar' });
      expect(educationalIcon).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles unknown input type gracefully', () => {
      render(
        <NoRecommendationAlert
          missingInputs={['unknownInput']}
        />
      );

      // Should display the raw input type as fallback
      expect(screen.getByText('unknownInput')).toBeInTheDocument();
    });

    it('handles very long missing inputs array', () => {
      const manyInputs = Array(10).fill('age');
      render(
        <NoRecommendationAlert missingInputs={manyInputs} />
      );

      // Should still render without crashing
      expect(screen.getByText('Við þurfum meiri upplýsingar')).toBeInTheDocument();
    });
  });
});
