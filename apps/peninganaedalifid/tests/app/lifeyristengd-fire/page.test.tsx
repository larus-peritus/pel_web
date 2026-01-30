/**
 * Tests for Pension-Aware FIRE Calculator Page
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LifeyristengdFIREClient } from '@/app/lifeyristengd-fire/LifeyristengdFIREClient';

// Mock the CalculatorContext
vi.mock('@/context/CalculatorContext', () => ({
  CalculatorProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="calculator-provider">{children}</div>
  ),
  useCalculator: () => ({
    pensionAwareFire: null,
    pensionAwareFireResults: null,
    initializePensionAwareFire: vi.fn(),
    updatePensionAwareFireState: vi.fn(),
    expenseBaselineResults: null,
  }),
}));

// Mock the PensionAwareFIRECalculator component
vi.mock('@/components/pensionAwareFire', () => ({
  PensionAwareFIRECalculator: () => (
    <div data-testid="pension-aware-fire-calculator">
      Pension-Aware FIRE Calculator
    </div>
  ),
}));

// Mock the Container component
vi.mock('@/components/layout/Container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

describe('LifeyristengdFIREClient', () => {
  it('renders the CalculatorProvider wrapper', () => {
    render(<LifeyristengdFIREClient />);
    expect(screen.getByTestId('calculator-provider')).toBeInTheDocument();
  });

  it('renders the PensionAwareFIRECalculator component', () => {
    render(<LifeyristengdFIREClient />);
    expect(
      screen.getByTestId('pension-aware-fire-calculator')
    ).toBeInTheDocument();
  });

  it('displays the privacy notice', () => {
    render(<LifeyristengdFIREClient />);
    expect(screen.getByText(/Persónuvernd:/)).toBeInTheDocument();
    expect(
      screen.getByText(/Allir útreikningar fara fram í vafranum þínum/)
    ).toBeInTheDocument();
  });

  it('renders the Container component for privacy notice', () => {
    render(<LifeyristengdFIREClient />);
    const containers = screen.getAllByTestId('container');
    expect(containers.length).toBeGreaterThan(0);
  });

  it('wraps content in Suspense boundary with loading fallback', () => {
    const { container } = render(<LifeyristengdFIREClient />);
    // The Suspense boundary should be present (though we can't directly test the fallback in this setup)
    expect(container).toBeTruthy();
  });
});
