import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PensionEducationalIntro } from '@/components/pensionAwareFire/PensionEducationalIntro';

describe('PensionEducationalIntro', () => {
  const defaultProps = {
    collapsed: false,
    onToggle: vi.fn(),
    onDismiss: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders with header when collapsed', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={true} />);

      expect(
        screen.getByText(/Hvers vegna er hefðbundin FIRE-tala of há fyrir Íslendinga?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Lærðu um íslenska lífeyriskerfið og hvernig það sparar þér milljónir/i)
      ).toBeInTheDocument();
    });

    it('renders with content when expanded', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      expect(screen.getByText(/Opna alla hluta/i)).toBeInTheDocument();
      expect(screen.getByText(/Loka öllum hlutum/i)).toBeInTheDocument();
      expect(screen.getByText(/Fela þetta ávallt/i)).toBeInTheDocument();
    });

    it('renders all four section headers', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      expect(screen.getByRole('button', { name: /Af hverju hefðbundin FIRE-tala er of há/i })).toBeInTheDocument();
      // Use getAllByText since "Íslenska lífeyriskerfið" appears in both the header subtitle and section title
      expect(screen.getAllByText(/Íslenska lífeyriskerfið/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /Þrjú stig eftirlaunaáætlunar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Dæmi: Hvernig þetta sparar milljónir/i })).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <PensionEducationalIntro {...defaultProps} className="custom-class" />
      );

      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Collapsible Behavior', () => {
    it('does not show content sections when collapsed', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={true} />);

      expect(screen.queryByText(/Opna alla hluta/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Loka öllum hlutum/i)).not.toBeInTheDocument();
    });

    it('shows content sections when expanded', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      expect(screen.getByText(/Opna alla hluta/i)).toBeInTheDocument();
      expect(screen.getByText(/Loka öllum hlutum/i)).toBeInTheDocument();
    });

    it('calls onToggle when header is clicked', async () => {
      const user = userEvent.setup();
      const mockOnToggle = vi.fn();

      render(<PensionEducationalIntro {...defaultProps} onToggle={mockOnToggle} />);

      const header = screen.getByRole('button', { name: /Loka fræðsluhluta/i });
      await user.click(header);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('displays correct aria-expanded attribute', () => {
      const { rerender } = render(<PensionEducationalIntro {...defaultProps} collapsed={true} />);

      const headerCollapsed = screen.getByRole('button', { name: /Opna fræðsluhluta/i });
      expect(headerCollapsed).toHaveAttribute('aria-expanded', 'false');

      rerender(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      const headerExpanded = screen.getByRole('button', { name: /Loka fræðsluhluta/i });
      expect(headerExpanded).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Section Expansion', () => {
    it('starts with all sections collapsed by default', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      // Check that section content is not visible (sections are collapsed)
      expect(screen.queryByText(/Hefðbundin FIRE aðferðafræði/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Séreign \(60\+ ára\)/i)).not.toBeInTheDocument();
    });

    it('expands a section when clicked', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      const sectionButton = screen.getByRole('button', { name: /Af hverju hefðbundin FIRE-tala er of há/i });
      await user.click(sectionButton);

      // Content should now be visible
      expect(screen.getByText(/Hefðbundin FIRE aðferðafræði/i)).toBeInTheDocument();
      expect(screen.getByText(/25-30x árleg útgjöld/i)).toBeInTheDocument();
    });

    it('collapses a section when clicked again', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      const sectionButton = screen.getByRole('button', { name: /Af hverju hefðbundin FIRE-tala er of há/i });

      // Expand
      await user.click(sectionButton);
      expect(screen.getByText(/Hefðbundin FIRE aðferðafræði/i)).toBeInTheDocument();

      // Collapse
      await user.click(sectionButton);
      expect(screen.queryByText(/Hefðbundin FIRE aðferðafræði/i)).not.toBeInTheDocument();
    });

    it('expands all sections when "Opna alla hluta" is clicked', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      const expandAllButton = screen.getByRole('button', { name: /Opna alla hluta/i });
      await user.click(expandAllButton);

      // All section content should be visible
      expect(screen.getByText(/Hefðbundin FIRE aðferðafræði/i)).toBeInTheDocument();
      expect(screen.getByText(/Séreign \(60\+ ára\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Stig 1: Gap tímabil/i)).toBeInTheDocument();
      expect(screen.getByText(/Dæmi: Jón, 35 ára/i)).toBeInTheDocument();
    });

    it('collapses all sections when "Loka öllum hlutum" is clicked', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      // First expand all
      const expandAllButton = screen.getByRole('button', { name: /Opna alla hluta/i });
      await user.click(expandAllButton);

      // Then collapse all
      const collapseAllButton = screen.getByRole('button', { name: /Loka öllum hlutum/i });
      await user.click(collapseAllButton);

      // No section content should be visible
      expect(screen.queryByText(/Hefðbundin FIRE aðferðafræði/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Séreign \(60\+ ára\)/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Stig 1: Gap tímabil/i)).not.toBeInTheDocument();
    });
  });

  describe('Dismiss Functionality', () => {
    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnDismiss = vi.fn();

      render(<PensionEducationalIntro {...defaultProps} onDismiss={mockOnDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /Fela þetta ávallt/i });
      await user.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content Accuracy', () => {
    it('displays correct pension system information', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      // Expand pension system section - use getAllByRole and find the section button (not the main header)
      const sectionButtons = screen.getAllByRole('button');
      const pensionSectionButton = sectionButtons.find(btn =>
        btn.textContent?.includes('Íslenska lífeyriskerfið') &&
        btn.getAttribute('aria-controls') === 'section-pension-system'
      );
      if (pensionSectionButton) {
        await user.click(pensionSectionButton);
      }

      // Check for séreign info
      expect(screen.getByText(/Séreign \(60\+ ára\)/i)).toBeInTheDocument();
      expect(screen.getByText(/EKKI tekjutengdur/i)).toBeInTheDocument();

      // Check for lífeyrissjóður info
      expect(screen.getByText(/Lífeyrissjóður \(62-67\+ ára\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Iðgjaldatengdur lífeyrir/i)).toBeInTheDocument();

      // Check for TR info
      expect(screen.getByText(/TR Ellilífeyrir \(67\+ ára\)/i)).toBeInTheDocument();
      // "Tekjutengdur" appears twice (EKKI tekjutengdur for séreign, and Tekjutengdur for TR)
      expect(screen.getAllByText(/Tekjutengdur/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/45% af tekjum yfir 36.500 kr\/mán/i)).toBeInTheDocument();
    });

    it('displays three retirement phases', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      // Expand three phases section
      const phasesSectionButton = screen.getByRole('button', { name: /Þrjú stig eftirlaunaáætlunar/i });
      await user.click(phasesSectionButton);

      // Check for all three phases
      expect(screen.getByText(/Stig 1: Gap tímabil/i)).toBeInTheDocument();
      expect(screen.getByText(/Stig 2: Séreign brú/i)).toBeInTheDocument();
      expect(screen.getByText(/Stig 3: Fullur lífeyrir/i)).toBeInTheDocument();
    });

    it('displays example with correct savings calculation', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      // Expand example section
      const exampleSectionButton = screen.getByRole('button', { name: /Dæmi: Hvernig þetta sparar milljónir/i });
      await user.click(exampleSectionButton);

      // Check for example content
      expect(screen.getByText(/Jón, 35 ára/i)).toBeInTheDocument();
      expect(screen.getByText(/144\.000\.000 kr/i)).toBeInTheDocument(); // Traditional FI
      expect(screen.getByText(/38\.000\.000 kr/i)).toBeInTheDocument(); // Pension-adjusted FI
      expect(screen.getByText(/106\.000\.000 kr/i)).toBeInTheDocument(); // Savings
      expect(screen.getByText(/73% minna!/i)).toBeInTheDocument(); // Percentage
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for main toggle', () => {
      const { rerender } = render(<PensionEducationalIntro {...defaultProps} collapsed={true} />);

      const toggleCollapsed = screen.getByRole('button', { name: /Opna fræðsluhluta/i });
      expect(toggleCollapsed).toHaveAttribute('aria-label', 'Opna fræðsluhluta');

      rerender(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      const toggleExpanded = screen.getByRole('button', { name: /Loka fræðsluhluta/i });
      expect(toggleExpanded).toHaveAttribute('aria-label', 'Loka fræðsluhluta');
    });

    it('has proper aria-controls for sections', async () => {
      const user = userEvent.setup();
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      const sectionButton = screen.getByRole('button', { name: /Af hverju hefðbundin FIRE-tala er of há/i });
      expect(sectionButton).toHaveAttribute('aria-controls', 'section-why-high');

      // Expand to verify the controlled element exists
      await user.click(sectionButton);
      const sectionContent = document.getElementById('section-why-high');
      expect(sectionContent).toBeInTheDocument();
      expect(sectionContent).toHaveTextContent(/Hefðbundin FIRE aðferðafræði/i);
    });
  });

  describe('Footer Note', () => {
    it('displays disclaimer when expanded', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={false} />);

      expect(screen.getByText(/Þessi reiknivél notar einfölduð líkön/i)).toBeInTheDocument();
      expect(screen.getByText(/leitaðu til fjármálaráðgjafa fyrir persónulega ráðgjöf/i)).toBeInTheDocument();
    });

    it('does not display disclaimer when collapsed', () => {
      render(<PensionEducationalIntro {...defaultProps} collapsed={true} />);

      expect(screen.queryByText(/Þessi reiknivél notar einfölduð líkön/i)).not.toBeInTheDocument();
    });
  });
});
