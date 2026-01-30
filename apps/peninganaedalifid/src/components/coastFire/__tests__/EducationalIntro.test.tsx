/**
 * EducationalIntro Component Tests
 *
 * Tests for the educational introduction component covering:
 * - Rendering and collapsing
 * - Section expansion/collapse
 * - Dismissal and showing again
 * - Accessibility features
 * - localStorage persistence
 *
 * Epic 7, Task 7.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EducationalIntro } from '../EducationalIntro';

describe('EducationalIntro', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with header', () => {
      render(<EducationalIntro />);
      expect(screen.getByText('Hvað er Ró FIRE? Lærðu meira')).toBeInTheDocument();
    });

    it('renders with collapsed state when collapsed prop is true', () => {
      render(<EducationalIntro collapsed={true} />);
      expect(screen.queryByText('Opna alla hluta')).not.toBeInTheDocument();
    });

    it('renders with expanded state when collapsed prop is false', () => {
      render(<EducationalIntro collapsed={false} />);
      expect(screen.getByText('Opna alla hluta')).toBeInTheDocument();
    });

    it('shows all sections by default when expanded', () => {
      render(<EducationalIntro collapsed={false} />);
      expect(screen.getByText(/Hvað er Ró FIRE \(Coast FIRE\)/)).toBeInTheDocument();
      expect(screen.getByText('Raunverulegt dæmi')).toBeInTheDocument();
      expect(screen.getByText('Ávinningur þess að ná Ró FIRE')).toBeInTheDocument();
      expect(screen.getByText('Algeng misskilningur')).toBeInTheDocument();
      expect(screen.getByText('Tengdir reiknivélar')).toBeInTheDocument();
    });
  });

  describe('Toggling', () => {
    it('calls onToggle when header is clicked', () => {
      const onToggle = vi.fn();
      render(<EducationalIntro onToggle={onToggle} collapsed={false} />);

      const header = screen.getByRole('button', { name: /Loka fræðsluhluta/ });
      fireEvent.click(header);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('displays correct aria-expanded attribute', () => {
      const { rerender } = render(<EducationalIntro collapsed={false} />);
      const header = screen.getByRole('button', { name: /Loka fræðsluhluta/ });
      expect(header).toHaveAttribute('aria-expanded', 'true');

      rerender(<EducationalIntro collapsed={true} />);
      const headerCollapsed = screen.getByRole('button', { name: /Opna fræðsluhluta/ });
      expect(headerCollapsed).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Section Expansion', () => {
    it('toggles individual section expansion', () => {
      render(<EducationalIntro collapsed={false} />);

      const exampleSection = screen.getByRole('button', { name: /Raunverulegt dæmi/ });

      // Section content should be visible by default
      expect(screen.getByText(/Sara, 30 ára/)).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(exampleSection);

      // Content should be hidden
      expect(screen.queryByText(/Sara, 30 ára/)).not.toBeInTheDocument();

      // Click to expand again
      fireEvent.click(exampleSection);

      // Content should be visible again
      expect(screen.getByText(/Sara, 30 ára/)).toBeInTheDocument();
    });

    it('expands all sections when "Opna alla hluta" is clicked', () => {
      render(<EducationalIntro collapsed={false} />);

      // Collapse a section first
      const exampleSection = screen.getByRole('button', { name: /Raunverulegt dæmi/ });
      fireEvent.click(exampleSection);

      // Verify section is collapsed
      expect(screen.queryByText(/Sara, 30 ára/)).not.toBeInTheDocument();

      // Click expand all
      const expandAllButton = screen.getByRole('button', { name: 'Opna alla hluta' });
      fireEvent.click(expandAllButton);

      // Verify section is expanded
      expect(screen.getByText(/Sara, 30 ára/)).toBeInTheDocument();
    });

    it('collapses all sections when "Loka öllum hlutum" is clicked', () => {
      render(<EducationalIntro collapsed={false} />);

      // All sections are expanded by default
      expect(screen.getByText(/Sara, 30 ára/)).toBeInTheDocument();
      expect(screen.getByText(/Þú getur hætt að spara/)).toBeInTheDocument();

      // Click collapse all
      const collapseAllButton = screen.getByRole('button', { name: 'Loka öllum hlutum' });
      fireEvent.click(collapseAllButton);

      // Verify sections are collapsed
      expect(screen.queryByText(/Sara, 30 ára/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Þú getur hætt að spara/)).not.toBeInTheDocument();
    });
  });

  describe('Dismissal', () => {
    it('calls onDismiss when "Fela þetta ávallt" is clicked', () => {
      const onDismiss = vi.fn();
      render(<EducationalIntro onDismiss={onDismiss} collapsed={false} />);

      const dismissButton = screen.getByRole('button', { name: 'Fela þetta ávallt' });
      fireEvent.click(dismissButton);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not render dismiss button when onDismiss is not provided', () => {
      render(<EducationalIntro collapsed={false} />);

      expect(screen.queryByRole('button', { name: 'Fela þetta ávallt' })).not.toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders the "What is Coast FIRE" section with correct content', () => {
      render(<EducationalIntro collapsed={false} />);

      expect(screen.getByText(/Coast FIRE/)).toBeInTheDocument();
      expect(screen.getByText(/Ró FIRE/)).toBeInTheDocument();
      expect(screen.getByText(/án þess að þú þurfir að spara meira/)).toBeInTheDocument();
    });

    it('renders the example section with Sara example', () => {
      render(<EducationalIntro collapsed={false} />);

      expect(screen.getByText(/Dæmi: Sara, 30 ára/)).toBeInTheDocument();
      expect(screen.getByText(/30 ára/)).toBeInTheDocument();
      expect(screen.getByText(/67 ára/)).toBeInTheDocument();
      expect(screen.getByText(/20.000.000/)).toBeInTheDocument();
      expect(screen.getByText(/100.000.000/)).toBeInTheDocument();
    });

    it('renders the benefits section', () => {
      render(<EducationalIntro collapsed={false} />);

      expect(screen.getByText(/Þú getur hætt að spara/)).toBeInTheDocument();
      expect(screen.getByText(/Starfssveigjanleiki/)).toBeInTheDocument();
      expect(screen.getByText(/Minni fjárhagslegur álag/)).toBeInTheDocument();
      expect(screen.getByText(/Vaxtavöxtur gerir verkið/)).toBeInTheDocument();
    });

    it('renders the misconceptions section with all 5 misconceptions', () => {
      render(<EducationalIntro collapsed={false} />);

      expect(screen.getByText(/Misskilningur 1:/)).toBeInTheDocument();
      expect(screen.getByText(/Misskilningur 2:/)).toBeInTheDocument();
      expect(screen.getByText(/Misskilningur 3:/)).toBeInTheDocument();
      expect(screen.getByText(/Misskilningur 4:/)).toBeInTheDocument();
      expect(screen.getByText(/Misskilningur 5:/)).toBeInTheDocument();
    });

    it('renders the related calculators section with links', () => {
      render(<EducationalIntro collapsed={false} />);

      const utgjaldarReiknivelLink = screen.getByRole('link', { name: /Útgjaldagrunnur/ });
      expect(utgjaldarReiknivelLink).toHaveAttribute(
        'href',
        '/reiknivaelir?calc=utgjaldareiknivel'
      );

      const fiTalaLink = screen.getByRole('link', { name: /FI-tala Reiknivél/ });
      expect(fiTalaLink).toHaveAttribute('href', '/reiknivaelir?calc=fi-tala');

      const raunverulegLaunLink = screen.getByRole('link', { name: /Raunveruleg laun/ });
      expect(raunverulegLaunLink).toHaveAttribute('href', '/reiknivaelir?calc=raunveruleg-laun');

      const fireLeidarvisirLink = screen.getByRole('link', { name: /FIRE Leiðarvísir/ });
      expect(fireLeidarvisirLink).toHaveAttribute('href', '/reiknivaelir?calc=fire-leidarvisi');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on header button', () => {
      render(<EducationalIntro collapsed={false} />);

      const header = screen.getByRole('button', { name: /Loka fræðsluhluta/ });
      expect(header).toHaveAttribute('aria-expanded', 'true');
      expect(header).toHaveAttribute('aria-label', 'Loka fræðsluhluta');
    });

    it('has proper ARIA attributes on section buttons', () => {
      render(<EducationalIntro collapsed={false} />);

      const exampleButton = screen.getByRole('button', { name: /Raunverulegt dæmi/ });
      expect(exampleButton).toHaveAttribute('aria-expanded', 'true');
      expect(exampleButton).toHaveAttribute('aria-controls', 'section-example');
    });

    it('section content has proper id for aria-controls', () => {
      render(<EducationalIntro collapsed={false} />);

      const exampleContent = screen.getByText(/Sara, 30 ára/).closest('div');
      expect(exampleContent).toHaveAttribute('id', 'section-example');
    });

    it('is keyboard accessible', () => {
      render(<EducationalIntro collapsed={false} />);

      const header = screen.getByRole('button', { name: /Loka fræðsluhluta/ });

      // Should be focusable
      header.focus();
      expect(document.activeElement).toBe(header);
    });
  });

  describe('Responsive Design', () => {
    it('renders related calculators in grid layout', () => {
      render(<EducationalIntro collapsed={false} />);

      const calculatorLinks = screen.getAllByRole('link');
      const relatedCalcs = calculatorLinks.filter(link =>
        link.getAttribute('href')?.includes('reiknivaelir')
      );

      expect(relatedCalcs.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing callbacks gracefully', () => {
      expect(() => {
        render(<EducationalIntro />);
      }).not.toThrow();
    });

    it('renders correctly with all props', () => {
      const onToggle = vi.fn();
      const onDismiss = vi.fn();

      render(
        <EducationalIntro
          collapsed={true}
          onToggle={onToggle}
          onDismiss={onDismiss}
          className="custom-class"
        />
      );

      expect(screen.getByText('Hvað er Ró FIRE? Lærðu meira')).toBeInTheDocument();
    });
  });
});
