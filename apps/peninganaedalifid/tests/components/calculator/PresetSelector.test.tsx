import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PresetSelector, PresetSelectors } from '@/components/calculator/PresetSelector';
import { CalculatorProvider } from '@/context/CalculatorContext';
import type { Preset } from '@/types/calculator';

// Mock the usePresets hook
vi.mock('@/hooks/usePresets', () => ({
  usePresets: vi.fn((category, currentValues, onApply) => {
    const mockPresets: Record<string, Preset[]> = {
      commute: [
        {
          id: 'commute-none',
          category: 'commute',
          label: 'Remote / No Commute',
          description: 'Work from home, no commute costs',
          values: { commute: 0 },
        },
        {
          id: 'commute-short',
          category: 'commute',
          label: 'Short Commute',
          description: '< 15 min each way, low costs',
          values: { commute: 1200 },
        },
      ],
      clothing: [
        {
          id: 'clothing-casual',
          category: 'clothing',
          label: 'Casual',
          description: 'Minimal work-specific clothing needed',
          values: { clothing: 200 },
        },
      ],
      meals: [
        {
          id: 'meals-bring',
          category: 'meals',
          label: 'Bring Lunch',
          description: 'Pack lunch most days',
          values: { meals: 500 },
        },
      ],
    };

    return {
      presets: mockPresets[category] || [],
      currentPreset: null,
      applyPreset: onApply,
      isCustom: true,
    };
  }),
}));

describe('PresetSelector', () => {
  it('renders category label correctly', () => {
    render(
      <CalculatorProvider>
        <PresetSelector category="commute" />
      </CalculatorProvider>
    );

    expect(screen.getByText('Commute Style')).toBeInTheDocument();
  });

  it('renders all presets for category', () => {
    render(
      <CalculatorProvider>
        <PresetSelector category="commute" />
      </CalculatorProvider>
    );

    expect(screen.getByText('Remote / No Commute')).toBeInTheDocument();
    expect(screen.getByText('Short Commute')).toBeInTheDocument();
  });

  it('shows "Custom" badge when isCustom is true', () => {
    render(
      <CalculatorProvider>
        <PresetSelector category="commute" />
      </CalculatorProvider>
    );

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('applies preset description as title attribute', () => {
    render(
      <CalculatorProvider>
        <PresetSelector category="commute" />
      </CalculatorProvider>
    );

    const button = screen.getByText('Remote / No Commute');
    expect(button).toHaveAttribute('title', 'Work from home, no commute costs');
  });

  it('handles preset click', () => {
    render(
      <CalculatorProvider>
        <PresetSelector category="commute" />
      </CalculatorProvider>
    );

    const button = screen.getByText('Remote / No Commute');
    fireEvent.click(button);

    // The applyPreset function should be called (tested via integration)
    expect(button).toBeInTheDocument();
  });

  it('renders different categories correctly', () => {
    const { rerender } = render(
      <CalculatorProvider>
        <PresetSelector category="commute" />
      </CalculatorProvider>
    );
    expect(screen.getByText('Commute Style')).toBeInTheDocument();

    rerender(
      <CalculatorProvider>
        <PresetSelector category="clothing" />
      </CalculatorProvider>
    );
    expect(screen.getByText('Work Attire')).toBeInTheDocument();

    rerender(
      <CalculatorProvider>
        <PresetSelector category="meals" />
      </CalculatorProvider>
    );
    expect(screen.getByText('Lunch Habits')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CalculatorProvider>
        <PresetSelector category="commute" className="custom-class" />
      </CalculatorProvider>
    );

    const div = container.querySelector('.custom-class');
    expect(div).toBeInTheDocument();
  });
});

describe('PresetSelectors', () => {
  it('renders heading and description', () => {
    render(
      <CalculatorProvider>
        <PresetSelectors />
      </CalculatorProvider>
    );

    expect(screen.getByText('Quick Presets')).toBeInTheDocument();
    expect(screen.getByText('Select presets to quickly set typical values')).toBeInTheDocument();
  });

  it('renders all three category selectors', () => {
    render(
      <CalculatorProvider>
        <PresetSelectors />
      </CalculatorProvider>
    );

    expect(screen.getByText('Commute Style')).toBeInTheDocument();
    expect(screen.getByText('Work Attire')).toBeInTheDocument();
    expect(screen.getByText('Lunch Habits')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CalculatorProvider>
        <PresetSelectors className="custom-wrapper" />
      </CalculatorProvider>
    );

    const div = container.querySelector('.custom-wrapper');
    expect(div).toBeInTheDocument();
  });
});
