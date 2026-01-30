import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailedExplanation } from '../DetailedExplanation';

describe('DetailedExplanation', () => {
  it('renders FIRE type name and tagline', () => {
    render(<DetailedExplanation fireTypeId="regularfire" />);

    expect(screen.getByText('Venjulegt FIRE')).toBeInTheDocument();
    expect(screen.getByText('Klassískt FIRE með þægilegum lífsstíl')).toBeInTheDocument();
  });

  it('renders description section expanded by default', () => {
    render(<DetailedExplanation fireTypeId="leanfire" />);

    // Description section should be visible
    const description = screen.getByText(/LeanFIRE byggir á mjög lágum útgjöldum/);
    expect(description).toBeInTheDocument();
  });

  it('renders how it works section expanded by default', () => {
    render(<DetailedExplanation fireTypeId="coastfire" />);

    // Should show at least one step from how it works
    expect(screen.getByText(/Reiknaðu út FI-tölu þína fyrir eftirlaunaaldur/)).toBeInTheDocument();
  });

  it('toggles collapsible sections on click', () => {
    render(<DetailedExplanation fireTypeId="baristafire" />);

    // Find "Best fyrir" button and click it
    const bestForButton = screen.getByRole('button', { name: /Hvenær á að velja þetta/i });
    fireEvent.click(bestForButton);

    // Should now show bestFor content
    expect(screen.getByText(/Fólk sem nýtur vinnunnar en vill minni álag/)).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(bestForButton);

    // Content should still be in document but section should be collapsed
    // (implementation keeps content in DOM but hides it)
  });

  it('renders real-world Icelandic examples', () => {
    render(<DetailedExplanation fireTypeId="fatfire" />);

    // Open examples section
    const examplesButton = screen.getByRole('button', { name: /Raunveruleg dæmi frá Íslandi/i });
    fireEvent.click(examplesButton);

    // Should show example titles
    expect(screen.getByText(/Hjón með háar tekjur í Reykjavík/)).toBeInTheDocument();
  });

  it('renders common pitfalls section', () => {
    render(<DetailedExplanation fireTypeId="leanfire" />);

    // Open pitfalls section
    const pitfallsButton = screen.getByRole('button', { name: /Algengar villur og hindranir/i });
    fireEvent.click(pitfallsButton);

    // Should show warning
    expect(screen.getByText(/Athugaðu þetta vel áður en þú byrjar/)).toBeInTheDocument();
  });

  it('renders external resources with links', () => {
    render(<DetailedExplanation fireTypeId="regularfire" />);

    // Open resources section
    const resourcesButton = screen.getByRole('button', { name: /Frekari upplýsingar og úrræði/i });
    fireEvent.click(resourcesButton);

    // Should show links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    // Check for common resource
    expect(screen.getByText(/r\/FIREyFI/)).toBeInTheDocument();
  });

  it('renders pros and cons section', () => {
    render(<DetailedExplanation fireTypeId="coastfire" />);

    // Open pros/cons section
    const prosConsButton = screen.getByRole('button', { name: /Kostir og gallar í hnotskurn/i });
    fireEvent.click(prosConsButton);

    // Should show pros and cons headers
    expect(screen.getAllByText(/Kostir/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Gallar/).length).toBeGreaterThan(0);
  });

  it('applies correct color scheme for FIRE type', () => {
    const { container } = render(<DetailedExplanation fireTypeId="leanfire" />);

    // LeanFIRE should use amber colors
    const header = container.querySelector('.bg-amber-50');
    expect(header).toBeInTheDocument();
  });

  it('renders all FIRE type icons correctly', () => {
    const fireTypes = ['leanfire', 'regularfire', 'coastfire', 'baristafire', 'fatfire'] as const;
    const expectedIcons = ['🔥', '🎯', '🏖️', '☕', '💎'];

    fireTypes.forEach((typeId, index) => {
      const { unmount } = render(<DetailedExplanation fireTypeId={typeId} />);
      expect(screen.getByText(expectedIcons[index])).toBeInTheDocument();
      unmount();
    });
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<DetailedExplanation fireTypeId="regularfire" />);

    // Check that buttons have proper aria-expanded
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  it('formats currency correctly in examples', () => {
    render(<DetailedExplanation fireTypeId="regularfire" />);

    // Open examples
    const examplesButton = screen.getByRole('button', { name: /Raunveruleg dæmi/i });
    fireEvent.click(examplesButton);

    // Should show formatted ISK amounts
    expect(screen.getByText(/520\.000/)).toBeInTheDocument(); // Monthly expenses
    expect(screen.getByText(/156\.000\.000/)).toBeInTheDocument(); // FI number
  });

  it('shows bestFor and notFor lists', () => {
    render(<DetailedExplanation fireTypeId="fatfire" />);

    // Open when to choose section
    const whenButton = screen.getByRole('button', { name: /Hvenær á að velja/i });
    fireEvent.click(whenButton);

    // Should show both lists
    expect(screen.getByText(/Best fyrir:/)).toBeInTheDocument();
    expect(screen.getByText(/Ekki fyrir:/)).toBeInTheDocument();
  });

  it('renders type-specific content for all FIRE types', () => {
    const fireTypes = ['leanfire', 'regularfire', 'coastfire', 'baristafire', 'fatfire'] as const;

    fireTypes.forEach((typeId) => {
      const { unmount, container } = render(<DetailedExplanation fireTypeId={typeId} />);

      // Should render without errors
      expect(container).toBeInTheDocument();

      // Should have at least the description visible
      const description = container.querySelector('p');
      expect(description).toBeInTheDocument();

      unmount();
    });
  });
});
