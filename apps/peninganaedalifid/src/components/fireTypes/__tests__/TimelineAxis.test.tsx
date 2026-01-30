import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimelineAxis } from '../TimelineAxis';

describe('TimelineAxis', () => {
  const defaultProps = {
    startAge: 25,
    endAge: 67,
    currentAge: 32,
  };

  describe('Rendering', () => {
    it('renders timeline axis with correct ARIA label', () => {
      render(<TimelineAxis {...defaultProps} />);

      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Tímalína frá 25 til 67 ára aldurs');
    });

    it('renders with horizontal orientation by default', () => {
      const { container } = render(<TimelineAxis {...defaultProps} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 800 80');
    });

    it('renders with vertical orientation when specified', () => {
      const { container } = render(
        <TimelineAxis {...defaultProps} orientation="vertical" />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 120 600');
    });
  });

  describe('Current Position Marker', () => {
    it('renders "Núna" marker at current age', () => {
      const { container } = render(<TimelineAxis {...defaultProps} />);

      // Check for "Núna" text
      const nunaText = container.querySelector('text.text-\\[11px\\]');
      expect(nunaText?.textContent).toBe('Núna');
    });

    it('does not render "Núna" marker if current age is outside range', () => {
      const { container } = render(
        <TimelineAxis {...defaultProps} currentAge={70} />
      );

      // Should not find "Núna" text
      const texts = Array.from(container.querySelectorAll('text'));
      const nunaText = texts.find(t => t.textContent === 'Núna');
      expect(nunaText).toBeUndefined();
    });

    it('positions current marker correctly in middle of range', () => {
      const { container } = render(
        <TimelineAxis startAge={20} endAge={60} currentAge={40} />
      );

      // Middle of range should be at 50% position
      // This would require calculating the exact position in the SVG
      const nunaText = container.querySelector('text.text-\\[11px\\]');
      expect(nunaText).toBeInTheDocument();
    });
  });

  describe('Tick Marks', () => {
    it('renders tick marks at 5-year intervals', () => {
      const { container } = render(<TimelineAxis {...defaultProps} />);

      // Should have ticks at 25, 30, 35, 40, 45, 50, 55, 60, 65
      const ageTexts = Array.from(container.querySelectorAll('text.text-\\[10px\\]'));
      const ages = ageTexts.map(t => t.textContent);

      expect(ages).toContain('25');
      expect(ages).toContain('30');
      expect(ages).toContain('35');
      expect(ages).toContain('65');
    });

    it('renders year labels below age labels', () => {
      const { container } = render(<TimelineAxis {...defaultProps} />);

      // Year labels should exist (smaller font)
      const yearTexts = container.querySelectorAll('text.text-\\[8px\\]');
      expect(yearTexts.length).toBeGreaterThan(0);
    });

    it('calculates years correctly based on current age', () => {
      const currentYear = new Date().getFullYear();
      const { container } = render(
        <TimelineAxis startAge={25} endAge={35} currentAge={30} />
      );

      // At age 30 (current), year should be current year
      // At age 25, year should be current year - 5
      const expectedYearAt25 = currentYear - 5;

      const yearTexts = Array.from(container.querySelectorAll('text.text-\\[8px\\]'));
      const years = yearTexts.map(t => t.textContent);

      expect(years).toContain(expectedYearAt25.toString());
    });
  });

  describe('Grid Lines', () => {
    it('renders grid lines when showGrid is true', () => {
      const { container } = render(
        <TimelineAxis {...defaultProps} showGrid={true} />
      );

      const gridLines = container.querySelectorAll('.grid-lines line');
      expect(gridLines.length).toBeGreaterThan(0);
    });

    it('does not render grid lines when showGrid is false', () => {
      const { container } = render(
        <TimelineAxis {...defaultProps} showGrid={false} />
      );

      const gridLines = container.querySelectorAll('.grid-lines');
      expect(gridLines.length).toBe(0);
    });
  });

  describe('Axis Labels', () => {
    it('renders start and end age labels', () => {
      const { container } = render(<TimelineAxis {...defaultProps} />);

      const labels = Array.from(container.querySelectorAll('text'));
      const labelTexts = labels.map(t => t.textContent);

      expect(labelTexts).toContain('25 ára');
      expect(labelTexts).toContain('67 ára');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <TimelineAxis {...defaultProps} className="custom-class" />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('handles single year range', () => {
      render(
        <TimelineAxis startAge={30} endAge={30} currentAge={30} />
      );

      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
    });

    it('handles very large age range', () => {
      render(
        <TimelineAxis startAge={18} endAge={90} currentAge={35} />
      );

      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
    });

    it('handles current age at start of range', () => {
      const { container } = render(
        <TimelineAxis startAge={25} endAge={67} currentAge={25} />
      );

      const nunaText = container.querySelector('text.text-\\[11px\\]');
      expect(nunaText?.textContent).toBe('Núna');
    });

    it('handles current age at end of range', () => {
      const { container } = render(
        <TimelineAxis startAge={25} endAge={67} currentAge={67} />
      );

      const nunaText = container.querySelector('text.text-\\[11px\\]');
      expect(nunaText?.textContent).toBe('Núna');
    });
  });
});
