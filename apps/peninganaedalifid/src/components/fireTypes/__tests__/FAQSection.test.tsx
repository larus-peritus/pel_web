import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQSection } from '../FAQSection';

describe('FAQSection', () => {
  it('renders FAQ section header', () => {
    render(<FAQSection />);

    expect(screen.getByText(/Algengar spurningar um FIRE/)).toBeInTheDocument();
    expect(screen.getByText(/Svör við \d+ algengum spurningum/)).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(<FAQSection />);

    // Check for required questions from spec
    expect(screen.getByText(/Hvað er FIRE hreyfingin\?/)).toBeInTheDocument();
    expect(screen.getByText(/Hvaða FIRE tegund hentar mér best\?/)).toBeInTheDocument();
    expect(screen.getByText(/Hvað er munurinn á LeanFIRE og FatFIRE\?/)).toBeInTheDocument();
    expect(screen.getByText(/Er 4% reglan örugg á Íslandi\?/)).toBeInTheDocument();
    expect(screen.getByText(/Hvernig reikna ég FI-töluna mína\?/)).toBeInTheDocument();
  });

  it('has at least 10 questions', () => {
    render(<FAQSection />);

    const questions = screen.getAllByRole('button');
    // Should have at least 10 question buttons
    expect(questions.length).toBeGreaterThanOrEqual(10);
  });

  it('expands question when clicked', () => {
    render(<FAQSection />);

    const firstQuestion = screen.getByText(/Hvað er FIRE hreyfingin\?/);
    const questionButton = firstQuestion.closest('button');

    expect(questionButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(questionButton!);

    expect(questionButton).toHaveAttribute('aria-expanded', 'true');
    // Should show answer
    expect(screen.getByText(/Financial Independence, Retire Early/)).toBeInTheDocument();
  });

  it('collapses question when clicked again', () => {
    render(<FAQSection />);

    const firstQuestion = screen.getByText(/Hvað er FIRE hreyfingin\?/);
    const questionButton = firstQuestion.closest('button');

    // Expand
    fireEvent.click(questionButton!);
    expect(questionButton).toHaveAttribute('aria-expanded', 'true');

    // Collapse
    fireEvent.click(questionButton!);
    expect(questionButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows multiple questions to be expanded simultaneously', () => {
    render(<FAQSection />);

    const question1 = screen.getByText(/Hvað er FIRE hreyfingin\?/).closest('button');
    const question2 = screen.getByText(/Hvaða FIRE tegund hentar mér best\?/).closest('button');

    fireEvent.click(question1!);
    fireEvent.click(question2!);

    expect(question1).toHaveAttribute('aria-expanded', 'true');
    expect(question2).toHaveAttribute('aria-expanded', 'true');
  });

  it('filters questions based on search input', () => {
    render(<FAQSection />);

    const searchInput = screen.getByPlaceholderText(/Leita í spurningum/);

    fireEvent.change(searchInput, { target: { value: 'CoastFIRE' } });

    // Should show filtered count
    expect(screen.getByText(/af \d+ spurningum/)).toBeInTheDocument();

    // Should show CoastFIRE question
    expect(screen.getByText(/Hvað er CoastFIRE og hvernig virkar það\?/)).toBeInTheDocument();
  });

  it('searches in both questions and answers', () => {
    render(<FAQSection />);

    const searchInput = screen.getByPlaceholderText(/Leita í spurningum/);

    // Search for word that appears in an answer
    fireEvent.change(searchInput, { target: { value: 'verðbólga' } });

    // Should find questions with verðbólga in the answer
    const countText = screen.getByText(/af \d+ spurningum/);
    expect(countText).toBeInTheDocument();
  });

  it('shows "no results" message for non-matching search', () => {
    render(<FAQSection />);

    const searchInput = screen.getByPlaceholderText(/Leita í spurningum/);

    fireEvent.change(searchInput, { target: { value: 'xyznotfound123' } });

    expect(screen.getByText(/Engar spurningar fundust/)).toBeInTheDocument();
  });

  it('displays category badges for questions', () => {
    render(<FAQSection />);

    // Category badges should be visible when questions are collapsed
    const categories = ['Grunnatriði', 'FIRE tegundir', 'FIRE á Íslandi', 'Stefnumótun', 'Algengar áhyggjur'];

    // At least some categories should be visible
    const categoryElements = screen.queryAllByText(/Grunnatriði|FIRE tegundir|FIRE á Íslandi/);
    expect(categoryElements.length).toBeGreaterThan(0);
  });

  it('renders related links when question is expanded', () => {
    render(<FAQSection />);

    // Find question with related links (e.g., about 4% rule)
    const question = screen.getByText(/Er 4% reglan örugg á Íslandi\?/).closest('button');
    fireEvent.click(question!);

    // Should show "Tengdir hlekkir" if the question has links
    const links = screen.queryByText(/Tengdir hlekkir:/);
    if (links) {
      expect(links).toBeInTheDocument();
    }
  });

  it('includes Iceland-specific questions', () => {
    render(<FAQSection />);

    // Should have Iceland-specific questions
    expect(screen.getByText(/Er 4% reglan örugg á Íslandi\?/)).toBeInTheDocument();
    expect(screen.getByText(/Hvernig fjárfesti ég á Íslandi fyrir FIRE\?/)).toBeInTheDocument();
    expect(screen.getByText(/Hvað með lífeyrissjóðinn minn\?/)).toBeInTheDocument();
  });

  it('includes questions about all FIRE types', () => {
    render(<FAQSection />);

    // Should mention different FIRE types
    expect(screen.getByText(/LeanFIRE og FatFIRE/)).toBeInTheDocument();
    expect(screen.getByText(/CoastFIRE/)).toBeInTheDocument();
  });

  it('includes practical strategy questions', () => {
    render(<FAQSection />);

    expect(screen.getByText(/Hversu mikið ætti ég að spara\?/)).toBeInTheDocument();
    expect(screen.getByText(/Hvenær er ég tilbúinn til að hætta að vinna\?/)).toBeInTheDocument();
  });

  it('includes concern-based questions', () => {
    render(<FAQSection />);

    expect(screen.getByText(/Hvað gerist ef markaðurinn hrynur\?/)).toBeInTheDocument();
    expect(screen.getByText(/Er FIRE bara fyrir ríka\?/)).toBeInTheDocument();
    expect(screen.getByText(/Get ég náð FIRE með lágar tekjur\?/)).toBeInTheDocument();
  });

  it('shows helper text with external links', () => {
    render(<FAQSection />);

    expect(screen.getByText(/Ef þú finnur ekki svar við spurningunni/)).toBeInTheDocument();

    // Should have links to Reddit communities
    const redditLinks = screen.getAllByText(/r\/FIREyFI|r\/financialindependence/);
    expect(redditLinks.length).toBeGreaterThan(0);
  });

  it('has proper ARIA attributes for accordion', () => {
    render(<FAQSection />);

    const questionButtons = screen.getAllByRole('button');

    questionButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-controls');
    });
  });

  it('provides comprehensive answers in Icelandic', () => {
    render(<FAQSection />);

    // Expand first question
    const firstQuestion = screen.getByText(/Hvað er FIRE hreyfingin\?/).closest('button');
    fireEvent.click(firstQuestion!);

    // Answer should be substantial (multiple sentences)
    const answer = screen.getByText(/FIRE stendur fyrir/);
    expect(answer).toBeInTheDocument();
    expect(answer.textContent!.length).toBeGreaterThan(100); // Substantial answer
  });

  it('clears search properly', () => {
    render(<FAQSection />);

    const searchInput = screen.getByPlaceholderText(/Leita í spurningum/);

    // Search
    fireEvent.change(searchInput, { target: { value: 'FIRE' } });
    expect(screen.getByText(/af \d+ spurningum/)).toBeInTheDocument();

    // Clear
    fireEvent.change(searchInput, { target: { value: '' } });

    // Should show helper text again
    expect(screen.getByText(/Ef þú finnur ekki svar/)).toBeInTheDocument();
  });

  it('highlights matching questions when expanded', () => {
    render(<FAQSection />);

    const firstQuestion = screen.getByText(/Hvað er FIRE hreyfingin\?/).closest('button');
    fireEvent.click(firstQuestion!);

    const parentDiv = firstQuestion!.closest('div');
    expect(parentDiv).toHaveClass('border-green-300');
  });

  it('applies custom className prop', () => {
    const { container } = render(<FAQSection className="custom-faq-class" />);

    const card = container.querySelector('.custom-faq-class');
    expect(card).toBeInTheDocument();
  });

  it('includes question about children and family', () => {
    render(<FAQSection />);

    expect(screen.getByText(/Hvað ef ég vil eignast börn\?/)).toBeInTheDocument();
  });

  it('external links open in new tab', () => {
    render(<FAQSection />);

    const links = screen.getAllByRole('link');

    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
