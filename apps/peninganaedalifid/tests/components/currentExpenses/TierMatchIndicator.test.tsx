import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TierMatchIndicator } from '@/components/currentExpenses/TierMatchIndicator';
import type { BaselineComparisonData } from '@/types/currentExpenses';

describe('TierMatchIndicator', () => {
  const createMockComparison = (
    closestTier: 'barebones' | 'comfortable' | 'deluxe',
    difference: number,
    currentTotal: number = 550000,
    tierTotal: number = 520000
  ): BaselineComparisonData => ({
    closestTier,
    currentTotal,
    tierTotal,
    difference,
    differencePercentage: (difference / tierTotal) * 100,
    categoryComparisons: [],
  });

  it('renders all three tier buttons', () => {
    const mockData = createMockComparison('comfortable', 30000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText('Lágmark')).toBeInTheDocument();
    expect(screen.getByText('Þægilegt')).toBeInTheDocument();
    expect(screen.getByText('Lúxus')).toBeInTheDocument();
  });

  it('highlights the barebones tier when it is closest', () => {
    const mockData = createMockComparison('barebones', 10000, 260000, 250000);
    const { container } = render(<TierMatchIndicator baselineComparison={mockData} />);

    const barebonesCard = container.querySelector('.scale-105');
    expect(barebonesCard).toBeTruthy();
    expect(barebonesCard?.textContent).toContain('Lágmark');
  });

  it('highlights the comfortable tier when it is closest', () => {
    const mockData = createMockComparison('comfortable', 30000);
    const { container } = render(<TierMatchIndicator baselineComparison={mockData} />);

    const comfortableCard = container.querySelector('.scale-105');
    expect(comfortableCard).toBeTruthy();
    expect(comfortableCard?.textContent).toContain('Þægilegt');
  });

  it('highlights the deluxe tier when it is closest', () => {
    const mockData = createMockComparison('deluxe', 50000, 1050000, 1000000);
    const { container } = render(<TierMatchIndicator baselineComparison={mockData} />);

    const deluxeCard = container.querySelector('.scale-105');
    expect(deluxeCard).toBeTruthy();
    expect(deluxeCard?.textContent).toContain('Lúxus');
  });

  it('displays current total and tier total', () => {
    const mockData = createMockComparison('comfortable', 30000, 550000, 520000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText(/núverandi útgjöld/i)).toBeInTheDocument();
    expect(screen.getByText('550.000 kr')).toBeInTheDocument();
    expect(screen.getByText('520.000 kr')).toBeInTheDocument();
  });

  it('shows overspending message when difference is positive', () => {
    const mockData = createMockComparison('comfortable', 30000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText(/yfir áætlun/i)).toBeInTheDocument();
    expect(screen.getByText(/\+30\.000 kr/i)).toBeInTheDocument();
  });

  it('shows underspending message when difference is negative', () => {
    const mockData = createMockComparison('comfortable', -30000, 490000, 520000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText(/undir áætlun/i)).toBeInTheDocument();
    expect(screen.getByText(/30\.000 kr/i)).toBeInTheDocument();
  });

  it('displays percentage difference', () => {
    const mockData = createMockComparison('comfortable', 30000, 550000, 520000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    // Should show (+5.8%) approximately
    expect(screen.getByText(/\+5\.8%/i)).toBeInTheDocument();
  });

  it('shows interpretation message for significant overspending (>10%)', () => {
    const mockData = createMockComparison('comfortable', 60000, 580000, 520000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText(/þú ert að eyða.*meira en áætlað/i)).toBeInTheDocument();
    expect(screen.getByText(/finna tækifæri til sparnaðar/i)).toBeInTheDocument();
  });

  it('shows interpretation message for significant underspending (>10%)', () => {
    const mockData = createMockComparison('comfortable', -60000, 460000, 520000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText(/frábært/i)).toBeInTheDocument();
    expect(screen.getByText(/minna en áætlað/i)).toBeInTheDocument();
  });

  it('does not show interpretation message for small differences (<10%)', () => {
    const mockData = createMockComparison('comfortable', 10000, 530000, 520000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.queryByText(/þú ert að eyða.*meira en áætlað/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/frábært/i)).not.toBeInTheDocument();
  });

  it('applies correct color scheme for barebones tier', () => {
    const mockData = createMockComparison('barebones', 10000, 260000, 250000);
    const { container } = render(<TierMatchIndicator baselineComparison={mockData} />);

    const activeCard = container.querySelector('.bg-amber-100');
    expect(activeCard).toBeTruthy();
  });

  it('applies correct color scheme for comfortable tier', () => {
    const mockData = createMockComparison('comfortable', 30000);
    const { container } = render(<TierMatchIndicator baselineComparison={mockData} />);

    const activeCard = container.querySelector('.bg-blue-100');
    expect(activeCard).toBeTruthy();
  });

  it('applies correct color scheme for deluxe tier', () => {
    const mockData = createMockComparison('deluxe', 50000, 1050000, 1000000);
    const { container } = render(<TierMatchIndicator baselineComparison={mockData} />);

    const activeCard = container.querySelector('.bg-purple-100');
    expect(activeCard).toBeTruthy();
  });

  it('shows tier icons correctly', () => {
    const mockData = createMockComparison('comfortable', 30000);
    render(<TierMatchIndicator baselineComparison={mockData} />);

    expect(screen.getByText('🥉')).toBeInTheDocument(); // Barebones
    expect(screen.getByText('🥈')).toBeInTheDocument(); // Comfortable
    expect(screen.getByText('🥇')).toBeInTheDocument(); // Deluxe
  });
});
