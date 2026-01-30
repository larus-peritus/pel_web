import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EducationalPanel } from '@/components/fiNumber/EducationalPanel';

describe('EducationalPanel', () => {
  describe('Rendering', () => {
    it('renders the educational panel with header', () => {
      render(<EducationalPanel />);

      expect(screen.getByText('Fræðsluefni um FI')).toBeInTheDocument();
      expect(screen.getByText(/Lærðu um fjárhagslegt frelsi/)).toBeInTheDocument();
    });

    it('renders all four main sections collapsed by default except first', () => {
      render(<EducationalPanel />);

      // First section should be expanded by default - check for the formula which is unique
      expect(screen.getByText('FI-tala = Árleg útgjöld × Margfaldari')).toBeInTheDocument();

      // Section headers should be visible
      expect(screen.getByText('Hvað er FI-tala?')).toBeInTheDocument();
      expect(screen.getByText('Hvað er úttektarhlutfall?')).toBeInTheDocument();
      expect(screen.getByText('Af hverju þarf íhaldssamara hlutfall á Íslandi?')).toBeInTheDocument();
      expect(screen.getByText('Algengar spurningar')).toBeInTheDocument();
    });
  });

  describe('Collapsible Sections', () => {
    it('expands section when clicked', () => {
      render(<EducationalPanel />);

      const section2Button = screen.getByText('Hvað er úttektarhlutfall?');

      // Should not show content initially (section 2 is collapsed by default)
      expect(screen.queryByText('Úttektarhlutfallið', { exact: false })).not.toBeInTheDocument();

      // Click to expand
      fireEvent.click(section2Button);

      // Should now show content
      expect(screen.getByText('Úttektarhlutfallið', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('hundraðshluti', { exact: false })).toBeInTheDocument();
    });

    it('collapses expanded section when clicked again', () => {
      render(<EducationalPanel />);

      const section1Button = screen.getByText('Hvað er FI-tala?');

      // Section 1 is expanded by default
      expect(screen.getByText('Financial Independence Number', { exact: false })).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(section1Button);

      // Should hide content
      expect(screen.queryByText('Financial Independence Number', { exact: false })).not.toBeInTheDocument();
    });

    it('can expand multiple sections at once', () => {
      render(<EducationalPanel />);

      // Expand section 2
      fireEvent.click(screen.getByText('Hvað er úttektarhlutfall?'));

      // Expand section 3
      fireEvent.click(screen.getByText('Af hverju þarf íhaldssamara hlutfall á Íslandi?'));

      // Both should be visible
      expect(screen.getByText('Úttektarhlutfallið', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('hundraðshluti', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Ísland er ekki Bandaríkin', { exact: false })).toBeInTheDocument();
    });
  });

  describe('Content - Section 1: What is FI Number', () => {
    it('shows FI number formula', () => {
      render(<EducationalPanel />);

      expect(screen.getByText('FI-tala = Árleg útgjöld × Margfaldari')).toBeInTheDocument();
    });

    it('shows example calculation', () => {
      render(<EducationalPanel />);

      expect(screen.getByText(/500.000 kr á mánuði/)).toBeInTheDocument();
      expect(screen.getByText('180.000.000 kr')).toBeInTheDocument();
    });
  });

  describe('Content - Section 2: Withdrawal Rate', () => {
    it('shows withdrawal rate explanations when expanded', () => {
      render(<EducationalPanel />);

      fireEvent.click(screen.getByText('Hvað er úttektarhlutfall?'));

      expect(screen.getByText(/4,0%:/)).toBeInTheDocument();
      expect(screen.getByText(/3,33%:/)).toBeInTheDocument();
      expect(screen.getByText(/3,0%:/)).toBeInTheDocument();
    });

    it('highlights recommended multiplier for Iceland', () => {
      render(<EducationalPanel />);

      fireEvent.click(screen.getByText('Hvað er úttektarhlutfall?'));

      const recommended = screen.getByText(/Mælt með fyrir Ísland/);
      expect(recommended).toBeInTheDocument();
      // Should be bold
      expect(recommended.tagName).toBe('STRONG');
    });
  });

  describe('Content - Section 3: Icelandic Context', () => {
    it('shows Icelandic considerations when expanded', () => {
      render(<EducationalPanel />);

      fireEvent.click(screen.getByText('Af hverju þarf íhaldssamara hlutfall á Íslandi?'));

      expect(screen.getByText(/1\. Hærri verðbólga/)).toBeInTheDocument();
      expect(screen.getByText(/2\. Gjaldeyrisáhætta/)).toBeInTheDocument();
      expect(screen.getByText(/3\. Minni markaður/)).toBeInTheDocument();
      expect(screen.getByText(/4\. Lífeyrissjóðskerfið/)).toBeInTheDocument();
    });

    it('shows recommendation for 30x-33x multiplier', () => {
      render(<EducationalPanel />);

      fireEvent.click(screen.getByText('Af hverju þarf íhaldssamara hlutfall á Íslandi?'));

      expect(screen.getByText(/Notaðu 30x eða 33x margfaldara/)).toBeInTheDocument();
    });
  });

  describe('Content - Section 4: FAQ', () => {
    it('shows FAQ questions and answers when expanded', () => {
      render(<EducationalPanel />);

      fireEvent.click(screen.getByText('Algengar spurningar'));

      expect(screen.getByText(/Þarf ég að ná FI-tölunni áður en/)).toBeInTheDocument();
      expect(screen.getByText(/Hvað ef ég vil fara á eftirlaun fyrir 67/)).toBeInTheDocument();
      expect(screen.getByText(/Get ég notað 25x margfaldarann/)).toBeInTheDocument();
      expect(screen.getByText(/Hvar get ég lært meira/)).toBeInTheDocument();
    });

    it('shows external resource links', () => {
      render(<EducationalPanel />);

      fireEvent.click(screen.getByText('Algengar spurningar'));

      const mrMMLink = screen.getByRole('link', { name: /Mr. Money Mustache/ });
      expect(mrMMLink).toHaveAttribute('href', 'https://www.mrmoneymustache.com/');
      expect(mrMMLink).toHaveAttribute('target', '_blank');
      expect(mrMMLink).toHaveAttribute('rel', 'noopener noreferrer');

      const redditLink = screen.getByRole('link', { name: /r\/financialindependence/ });
      expect(redditLink).toHaveAttribute('href', 'https://www.reddit.com/r/financialindependence/');

      const bogleheadsLink = screen.getByRole('link', { name: /Bogleheads/ });
      expect(bogleheadsLink).toHaveAttribute('href', 'https://www.bogleheads.org/');
    });
  });

  describe('Accessibility', () => {
    it('uses proper aria attributes for collapsible sections', () => {
      render(<EducationalPanel />);

      const section1Button = screen.getByRole('button', { name: /Hvað er FI-tala/ });
      expect(section1Button).toHaveAttribute('aria-expanded', 'true');

      const section2Button = screen.getByRole('button', { name: /Hvað er úttektarhlutfall/ });
      expect(section2Button).toHaveAttribute('aria-expanded', 'false');

      // After clicking
      fireEvent.click(section2Button);
      expect(section2Button).toHaveAttribute('aria-expanded', 'true');
    });

    it('has proper semantic structure', () => {
      render(<EducationalPanel />);

      // Main heading
      expect(screen.getByRole('heading', { level: 2, name: 'Fræðsluefni um FI' })).toBeInTheDocument();

      // Section buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(4); // At least 4 section buttons
    });

    it('icons have aria-hidden attribute', () => {
      const { container } = render(<EducationalPanel />);

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<EducationalPanel className="custom-class" />);

      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });

    it('shows chevron icon rotation for expanded sections', () => {
      const { container } = render(<EducationalPanel />);

      // Section 1 is expanded by default - chevron should be rotated
      const section1Button = screen.getByRole('button', { name: /Hvað er FI-tala/ });
      const section1Icon = section1Button.querySelector('svg');
      expect(section1Icon).toHaveClass('rotate-180');

      // Section 2 is collapsed - chevron should not be rotated
      const section2Button = screen.getByRole('button', { name: /Hvað er úttektarhlutfall/ });
      const section2Icon = section2Button.querySelector('svg');
      expect(section2Icon).not.toHaveClass('rotate-180');
    });
  });
});
