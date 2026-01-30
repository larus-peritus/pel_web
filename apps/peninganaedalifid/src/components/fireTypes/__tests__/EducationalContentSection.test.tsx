import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EducationalContentSection } from '../EducationalContentSection';

// Mock window.print
const mockPrint = vi.fn();
Object.defineProperty(window, 'print', {
  writable: true,
  value: mockPrint,
});

describe('EducationalContentSection', () => {
  beforeEach(() => {
    mockPrint.mockClear();
  });

  it('renders collapsed by default', () => {
    render(<EducationalContentSection />);

    expect(screen.getByText(/Fræðsluefni um FIRE/)).toBeInTheDocument();

    // Should not show tabs when collapsed
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('expands when header is clicked', () => {
    render(<EducationalContentSection />);

    const header = screen.getByRole('button', { name: /Fræðsluefni um FIRE/i });
    fireEvent.click(header);

    // Should show tab navigation
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows FAQ tab by default when no FIRE type is selected', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should show FAQ by default
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    expect(screen.getAllByText(/Algengar spurningar um FIRE/).length).toBeGreaterThan(0);
  });

  it('shows details tab by default when FIRE type is selected', () => {
    render(<EducationalContentSection selectedFireType="regularfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should show details by default
    expect(screen.getAllByText(/Venjulegt FIRE/).length).toBeGreaterThan(0);
  });

  it('renders all three tabs in navigation', () => {
    render(<EducationalContentSection selectedFireType="leanfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should show all three tabs
    expect(screen.getAllByText(/Ítarlegar upplýsingar/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Algengar spurningar/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Orðalisti/).length).toBeGreaterThan(0);
  });

  it('switches between tabs when clicked', () => {
    render(<EducationalContentSection selectedFireType="coastfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Find tab buttons within navigation
    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );

    // Click FAQ tab
    const faqTab = tabButtons.find(btn => btn.textContent?.includes('Algengar spurningar'));
    fireEvent.click(faqTab!);

    // Should show FAQ content
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    expect(screen.getAllByText(/Svör við/).length).toBeGreaterThan(0);

    // Click Glossary tab
    const glossaryTab = tabButtons.find(btn => btn.textContent?.includes('Orðalisti'));
    fireEvent.click(glossaryTab!);

    // Should show Glossary content
    expect(screen.getAllByText(/hugtök í stafrófsröð/).length).toBeGreaterThan(0);
  });

  it('disables details tab when no FIRE type is selected', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    const detailsTab = tabButtons.find(btn => btn.textContent?.includes('Ítarlegar upplýsingar'));
    expect(detailsTab).toBeDisabled();
  });

  it('enables details tab when FIRE type is selected', () => {
    render(<EducationalContentSection selectedFireType="baristafire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    const detailsTab = tabButtons.find(btn => btn.textContent?.includes('Ítarlegar upplýsingar'));
    expect(detailsTab).not.toBeDisabled();
  });

  it('renders DetailedExplanation component when details tab is active', () => {
    render(<EducationalContentSection selectedFireType="fatfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should show FatFIRE details
    expect(screen.getAllByText(/Lúxus FIRE/).length).toBeGreaterThan(0);
  });

  it('renders GlossarySection component when glossary tab is active', () => {
    render(<EducationalContentSection selectedFireType="leanfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Click glossary tab
    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    const glossaryTab = tabButtons.find(btn => btn.textContent?.includes('Orðalisti'));
    fireEvent.click(glossaryTab!);

    // Should show glossary
    expect(screen.getAllByText(/Orðalisti FIRE hugtaka/).length).toBeGreaterThan(0);
  });

  it('renders FAQSection component when FAQ tab is active', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // FAQ should be active by default
    expect(screen.getAllByText(/Algengar spurningar um FIRE/).length).toBeGreaterThan(0);
  });

  it('shows print button when expanded', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    const printButton = screen.getByRole('button', { name: /Prenta/i });
    expect(printButton).toBeInTheDocument();
  });

  it('calls window.print when print button is clicked', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Click print button
    const printButton = screen.getByRole('button', { name: /Prenta/i });
    fireEvent.click(printButton);

    expect(mockPrint).toHaveBeenCalled();
  });

  it('shows helper text about selecting tabs', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    expect(screen.getByText(/Veldu flipa hér að neðan/)).toBeInTheDocument();
  });

  it('shows footer with quick links', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    expect(screen.getByText(/Viltu læra meira\?/)).toBeInTheDocument();
  });

  it('includes external resource links in footer', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should have multiple external links
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    // Check for specific resources
    expect(screen.getAllByText(/r\/FIREyFI/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mr. Money Mustache/).length).toBeGreaterThan(0);
  });

  it('external links open in new tab', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('has proper ARIA attributes for tabs', () => {
    render(<EducationalContentSection selectedFireType="regularfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );

    // At least one tab should have aria-current (the active one)
    const activeTab = tabButtons.find(tab => tab.getAttribute('aria-current') === 'page');
    expect(activeTab).toBeDefined();
  });

  it('shows tooltip for disabled details tab', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    const detailsTab = tabButtons.find(btn => btn.textContent?.includes('Ítarlegar upplýsingar'));

    // Hover over disabled tab (tooltip should exist in DOM)
    const tooltip = detailsTab?.querySelector('span');
    expect(tooltip).toBeInTheDocument();
  });

  it('applies custom className prop', () => {
    const { container } = render(<EducationalContentSection className="custom-edu-class" />);

    const card = container.querySelector('.custom-edu-class');
    expect(card).toBeInTheDocument();
  });

  it('updates when selectedFireType prop changes', () => {
    const { rerender } = render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Details tab should be disabled
    let tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    let detailsTab = tabButtons.find(btn => btn.textContent?.includes('Ítarlegar upplýsingar'));
    expect(detailsTab).toBeDisabled();

    // Rerender with selectedFireType
    rerender(<EducationalContentSection selectedFireType="coastfire" />);

    // Details tab should now be enabled
    tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    detailsTab = tabButtons.find(btn => btn.textContent?.includes('Ítarlegar upplýsingar'));
    expect(detailsTab).not.toBeDisabled();
  });

  it('shows tab icons', () => {
    render(<EducationalContentSection />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should show emoji icons for tabs
    expect(screen.getByText('📖')).toBeInTheDocument();
    expect(screen.getByText('❓')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('maintains tab state when toggling expansion', () => {
    render(<EducationalContentSection selectedFireType="leanfire" />);

    // Expand and switch to glossary
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));
    const tabButtons = screen.getAllByRole('button').filter(btn =>
      btn.closest('nav') !== null
    );
    const glossaryTab = tabButtons.find(btn => btn.textContent?.includes('Orðalisti'));
    fireEvent.click(glossaryTab!);

    // Collapse
    const header = screen.getByRole('button', { name: /Fræðsluefni/i });
    fireEvent.click(header);

    // Expand again
    fireEvent.click(header);

    // Should still be on glossary tab
    expect(screen.getAllByText(/hugtök í stafrófsröð/).length).toBeGreaterThan(0);
  });

  it('has proper heading hierarchy', () => {
    render(<EducationalContentSection selectedFireType="regularfire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Main heading should be h2
    const mainHeading = screen.getByText(/Fræðsluefni um FIRE/);
    expect(mainHeading.tagName).toBe('H2');
  });

  it('renders print-only content (hidden on screen)', () => {
    const { container } = render(<EducationalContentSection selectedFireType="baristafire" />);

    // Expand
    fireEvent.click(screen.getByRole('button', { name: /Fræðsluefni/i }));

    // Should have print-only div
    const printOnlyDiv = container.querySelector('.print\\:block');
    expect(printOnlyDiv).toBeInTheDocument();
  });
});
