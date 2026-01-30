import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlossarySection } from '../GlossarySection';

describe('GlossarySection', () => {
  it('renders with collapsed state by default', () => {
    render(<GlossarySection />);

    expect(screen.getByText(/Orðalisti FIRE hugtaka/)).toBeInTheDocument();
    expect(screen.getByText(/hugtök í stafrófsröð/)).toBeInTheDocument();

    // Should not show search box when collapsed
    expect(screen.queryByPlaceholderText(/Leita að hugtaki/)).not.toBeInTheDocument();
  });

  it('expands when header is clicked', () => {
    render(<GlossarySection />);

    const header = screen.getByRole('button', { name: /Orðalisti FIRE hugtaka/i });
    fireEvent.click(header);

    // Should now show search box
    expect(screen.getByPlaceholderText(/Leita að hugtaki/)).toBeInTheDocument();
  });

  it('displays all glossary terms when expanded', () => {
    render(<GlossarySection />);

    // Expand
    const header = screen.getByRole('button');
    fireEvent.click(header);

    // Should show key terms (use getAllByText for terms that appear multiple times)
    expect(screen.getAllByText('FIRE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('FI-tala').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4% reglan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sparnaðarhlutfall').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CoastFIRE').length).toBeGreaterThan(0);
  });

  it('shows Icelandic and English terms', () => {
    render(<GlossarySection />);

    // Expand
    fireEvent.click(screen.getByRole('button'));

    // Should show both Icelandic and English
    expect(screen.getAllByText('FIRE').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Financial Independence, Retire Early/).length).toBeGreaterThan(0);
  });

  it('filters terms based on search input', () => {
    render(<GlossarySection />);

    // Expand
    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);

    // Search for "FIRE"
    fireEvent.change(searchInput, { target: { value: 'FIRE' } });

    // Should show FIRE-related terms
    expect(screen.getAllByText('FIRE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('LeanFIRE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CoastFIRE').length).toBeGreaterThan(0);

    // Should show filtered count
    const results = screen.queryByText(/af \d+ hugtökum/);
    expect(results).toBeInTheDocument();
  });

  it('searches in English terms', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);

    // Search for English term
    fireEvent.change(searchInput, { target: { value: 'Compound' } });

    // Should find "Samsettar vextir"
    expect(screen.getByText('Samsettar vextir')).toBeInTheDocument();
  });

  it('searches in definitions', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);

    // Search for word that appears in definitions
    fireEvent.change(searchInput, { target: { value: 'verðbólgu' } });

    // Should show results that mention verðbólga in definition
    const countText = screen.getByText(/af \d+ hugtökum/);
    expect(countText).toBeInTheDocument();
  });

  it('shows "no results" message when search has no matches', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'xyzabc123' } });

    expect(screen.getByText(/Engin hugtök fundust/)).toBeInTheDocument();
  });

  it('displays related terms for each glossary item', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    // Look for "4% reglan" which has related terms
    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);
    fireEvent.change(searchInput, { target: { value: '4%' } });

    // Should show related terms
    const relatedTermsLabels = screen.queryAllByText(/Tengd hugtök:/);
    expect(relatedTermsLabels.length).toBeGreaterThan(0);
  });

  it('has proper term definitions in Icelandic', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    // Check that definitions are comprehensive
    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);
    fireEvent.change(searchInput, { target: { value: 'FI-tala' } });

    // Should have definition
    expect(screen.getByText(/Upphæðin sem þú þarft að hafa sparað/)).toBeInTheDocument();
  });

  it('includes all required FIRE terms', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    // Required terms from spec
    const requiredTerms = [
      'FIRE',
      'FI-tala',
      'Úttektarhlutfall',
      '4% reglan',
      'Trinity-rannsóknin',
      'Sparnaðarhlutfall',
      'Samsettar vextir',
      'Hrein eign',
      'SWR',
    ];

    requiredTerms.forEach((term) => {
      expect(screen.getAllByText(term).length).toBeGreaterThan(0);
    });
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<GlossarySection />);

    const header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows helper text when not searching', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(/Þú getur notað leitargluggann/)).toBeInTheDocument();
  });

  it('clears search filter properly', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);

    // Search for something
    fireEvent.change(searchInput, { target: { value: 'FIRE' } });
    expect(screen.getByText(/af \d+ hugtökum/)).toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    // Should show all terms again (helper text appears)
    expect(screen.getByText(/Þú getur notað leitargluggann/)).toBeInTheDocument();
  });

  it('maintains alphabetical order', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    // Get all term headings (dt elements)
    const terms = screen.getAllByRole('term');

    // First term should be "4% reglan" (starts with number, comes first in Icelandic sort)
    expect(terms[0]).toHaveTextContent('4% reglan');
  });

  it('renders related terms as badges', () => {
    render(<GlossarySection />);

    fireEvent.click(screen.getByRole('button'));

    // Search for a term with related terms
    const searchInput = screen.getByPlaceholderText(/Leita að hugtaki/);
    fireEvent.change(searchInput, { target: { value: 'Trinity' } });

    // Should show related terms in badges
    const relatedTermsLabels = screen.queryAllByText(/Tengd hugtök:/);
    expect(relatedTermsLabels.length).toBeGreaterThan(0);
  });

  it('applies custom className prop', () => {
    const { container } = render(<GlossarySection className="custom-class" />);

    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });
});
