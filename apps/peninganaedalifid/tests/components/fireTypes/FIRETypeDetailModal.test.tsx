/**
 * Tests for FIRETypeDetailModal Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FIRETypeDetailModal } from '@/components/fireTypes/FIRETypeDetailModal';
import { FIRE_TYPE_DEFINITIONS } from '@/lib/constants/fireTypes';

describe('FIRETypeDetailModal', () => {
  const leanFireDef = FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'leanfire')!;
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = 'unset';
  });

  describe('Basic Rendering', () => {
    it('does not render when definition is null', () => {
      const { container } = render(<FIRETypeDetailModal definition={null} onClose={mockOnClose} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders modal when definition provided', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
    });

    it('renders icon', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText(leanFireDef.icon)).toBeInTheDocument();
    });

    it('renders English name', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('LeanFIRE')).toBeInTheDocument();
    });

    it('renders tagline as badge', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Lágmarksútgjöld, stysta leiðin til frelsis')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText(/LeanFIRE byggir á mjög lágum útgjöldum/)).toBeInTheDocument();
    });
  });

  describe('Pros and Cons', () => {
    it('renders "Kostir" section', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Kostir')).toBeInTheDocument();
    });

    it('renders all pros', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      leanFireDef.pros.forEach((pro) => {
        expect(screen.getByText(pro)).toBeInTheDocument();
      });
    });

    it('renders "Gallar" section', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Gallar')).toBeInTheDocument();
    });

    it('renders all cons', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      leanFireDef.cons.forEach((con) => {
        expect(screen.getByText(con)).toBeInTheDocument();
      });
    });
  });

  describe('Best For / Not For', () => {
    it('renders "Hentar best fyrir" section', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Hentar best fyrir')).toBeInTheDocument();
    });

    it('renders all "best for" items', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      leanFireDef.bestFor.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('renders "Hentar ekki fyrir" section', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Hentar ekki fyrir')).toBeInTheDocument();
    });

    it('renders all "not for" items', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      leanFireDef.notFor.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe('Real-world Examples', () => {
    it('renders examples section', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Dæmi úr raunveruleikanum')).toBeInTheDocument();
    });

    it('renders all examples', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      leanFireDef.examples.forEach((example) => {
        expect(screen.getByText(example.title)).toBeInTheDocument();
        expect(screen.getByText(example.description)).toBeInTheDocument();
      });
    });

    it('formats ISK amounts in examples', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      // Check for formatted numbers (Icelandic format uses . as thousands separator)
      expect(screen.getByText(/75\.000\.000/)).toBeInTheDocument();
    });
  });

  describe('Common Pitfalls', () => {
    it('renders pitfalls section for LeanFIRE', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Algengar gildrur')).toBeInTheDocument();
    });

    it('renders pitfalls list', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText(/Vanmeta kostnað við ófyrirséðar aðstæður/)).toBeInTheDocument();
    });

    it('renders pitfalls for different types', () => {
      const regularFireDef = FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'regularfire')!;
      render(<FIRETypeDetailModal definition={regularFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Algengar gildrur')).toBeInTheDocument();
      expect(screen.getByText(/Vanmeta tímann sem tekur að safna/)).toBeInTheDocument();
    });
  });

  describe('Learning Resources', () => {
    it('renders resources section', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText('Auðlindir til að læra meira')).toBeInTheDocument();
    });

    it('renders resource list', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(screen.getByText(/Mr. Money Mustache/)).toBeInTheDocument();
    });

    it('shows Icelandic context note', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(
        screen.getByText(/Flestar auðlindir eru á ensku en meginreglurnar eiga við/)
      ).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when X button clicked', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Loka');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when "Loka" button clicked', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      const closeButton = screen.getByText('Loka');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay clicked', () => {
      const { container } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      const overlay = container.firstChild as HTMLElement;
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when modal content clicked', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      const modalContent = screen.getByText('Sparsamt FIRE').closest('div');
      if (modalContent) {
        fireEvent.click(modalContent);
      }

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key pressed', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when other keys pressed', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Overflow Prevention', () => {
    it('sets body overflow to hidden when modal opens', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when modal closes', () => {
      const { unmount } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('unset');
    });

    it('resets body overflow when definition becomes null', () => {
      const { rerender } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<FIRETypeDetailModal definition={null} onClose={mockOnClose} />);

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Color Schemes', () => {
    it('applies amber color scheme for LeanFIRE', () => {
      const { container } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      expect(container.querySelector('.bg-amber-50')).toBeInTheDocument();
    });

    it('applies green color scheme for RegularFIRE', () => {
      const regularFireDef = FIRE_TYPE_DEFINITIONS.find((d) => d.id === 'regularfire')!;
      const { container } = render(
        <FIRETypeDetailModal definition={regularFireDef} onClose={mockOnClose} />
      );

      expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has close button with aria-label', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Loka');
      expect(closeButton).toBeInTheDocument();
    });

    it('renders modal with proper z-index', () => {
      const { container } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      const overlay = container.firstChild as HTMLElement;
      expect(overlay).toHaveClass('z-50');
    });

    it('prevents scrolling on modal content click', () => {
      render(<FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />);

      const modalContent = screen.getByText('Sparsamt FIRE').closest('div');
      if (modalContent) {
        fireEvent.click(modalContent);
      }

      // Modal should still be open
      expect(screen.getByText('Sparsamt FIRE')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('applies max-width and responsive padding', () => {
      const { container } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      const modalContent = container.querySelector('.max-w-4xl');
      expect(modalContent).toBeInTheDocument();
    });

    it('has scrollable content area', () => {
      const { container } = render(
        <FIRETypeDetailModal definition={leanFireDef} onClose={mockOnClose} />
      );

      const scrollArea = container.querySelector('.overflow-y-auto');
      expect(scrollArea).toBeInTheDocument();
    });
  });
});
