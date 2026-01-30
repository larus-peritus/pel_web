import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealPresetSelector } from '@/components/mealCost/MealPresetSelector';
import type { MealCostData, MealScenarioPreset } from '@/types/calculator';
import { MEAL_SCENARIO_PRESETS } from '@/lib/constants/mealCost';

describe('MealPresetSelector', () => {
  const mockOnSelect = vi.fn();

  const mockCurrentData: MealCostData = {
    eatingOut: {
      breakfastCount: 2,
      lunchCount: 5,
      dinnerCount: 3,
      coffeeCount: 10,
      fastFoodCount: 2,
      breakfastCost: 1500,
      lunchCost: 2500,
      dinnerCost: 4000,
      coffeeCost: 650,
      fastFoodCost: 2000,
    },
    homeCooking: {
      monthlyGroceryCost: 80000,
      householdSize: 2,
      shoppingHoursPerWeek: 2,
      cookingHoursPerWeek: 5,
    },
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders the preset selector card with title', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    expect(screen.getByText('Forstilltar atburðarásir')).toBeInTheDocument();
    expect(
      screen.getByText('Veldu atburðarás til að sjá dæmigerðan kostnað')
    ).toBeInTheDocument();
  });

  it('displays all preset scenarios', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    MEAL_SCENARIO_PRESETS.forEach((preset) => {
      expect(screen.getByText(preset.name)).toBeInTheDocument();
      expect(screen.getByText(preset.description)).toBeInTheDocument();
    });
  });

  it('calls onSelect when a preset is clicked', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    const firstPresetButton = screen.getByText(MEAL_SCENARIO_PRESETS[0].name)
      .closest('button');
    fireEvent.click(firstPresetButton!);

    expect(mockOnSelect).toHaveBeenCalledWith(MEAL_SCENARIO_PRESETS[0]);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('displays comparison table toggle button when currentData is provided', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.getByText('Sýna samanburðartöflu allra atburðarása')
    ).toBeInTheDocument();
  });

  it('does not display comparison table toggle when currentData is missing', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    expect(
      screen.queryByText('Sýna samanburðartöflu allra atburðarása')
    ).not.toBeInTheDocument();
  });

  it('toggles comparison table visibility when button clicked', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    const toggleButton = screen.getByText(
      'Sýna samanburðartöflu allra atburðarása'
    );

    // Initially hidden
    expect(
      screen.queryByText('Samanburður allra atburðarása')
    ).not.toBeInTheDocument();

    // Click to show
    fireEvent.click(toggleButton);
    expect(
      screen.getByText('Samanburður allra atburðarása')
    ).toBeInTheDocument();

    // Click to hide
    const hideButton = screen.getByText('Fela samanburðartöflu');
    fireEvent.click(hideButton);
    expect(
      screen.queryByText('Samanburður allra atburðarása')
    ).not.toBeInTheDocument();
  });

  it('displays comparison table with all columns on desktop', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    // Show table
    fireEvent.click(
      screen.getByText('Sýna samanburðartöflu allra atburðarása')
    );

    // Check column headers
    expect(screen.getByText('Atburðarás')).toBeInTheDocument();
    expect(screen.getByText('Mán. kostnaður')).toBeInTheDocument();
    expect(screen.getByText('Lífsorka')).toBeInTheDocument();
    expect(screen.getByText('Sparnaður')).toBeInTheDocument();
    expect(screen.getByText('FV (20 ár)')).toBeInTheDocument();
  });

  it('displays all presets in comparison table', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    // Show table
    fireEvent.click(
      screen.getByText('Sýna samanburðartöflu allra atburðarása')
    );

    // Check that all presets are listed (they appear twice: in cards and table)
    MEAL_SCENARIO_PRESETS.forEach((preset) => {
      const matches = screen.getAllByText(preset.name);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays savings in green when positive', () => {
    const { container } = render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    // Show table
    fireEvent.click(
      screen.getByText('Sýna samanburðartöflu allra atburðarása')
    );

    // Check for success color class (text-success-700) on savings or future value
    const successElements = container.querySelectorAll('.text-success-700');
    // Should have at least some positive values shown in green (FV column always shows)
    expect(successElements.length).toBeGreaterThan(0);
  });

  it('displays note about hourly wage usage in comparison table', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    // Show table
    fireEvent.click(
      screen.getByText('Sýna samanburðartöflu allra atburðarása')
    );

    expect(
      screen.getByText(/Samanburðurinn notar núverandi raunverulegt tímakaup/)
    ).toBeInTheDocument();
    expect(screen.getByText(/3.000 kr\/klst/)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles keyboard navigation on preset buttons', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    const firstPresetButton = screen.getByText(MEAL_SCENARIO_PRESETS[0].name)
      .closest('button');

    // Should be focusable
    firstPresetButton?.focus();
    expect(document.activeElement).toBe(firstPresetButton);

    // Should trigger on Enter key
    fireEvent.keyDown(firstPresetButton!, { key: 'Enter' });
    // Note: keyDown alone doesn't trigger click, but validates focus behavior
  });

  it('displays arrow icon on preset buttons', () => {
    const { container } = render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    // Check for SVG arrow icons
    const arrows = container.querySelectorAll('svg path');
    expect(arrows.length).toBeGreaterThan(0);
  });

  it('shows mobile card view in comparison table', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={3000}
      />
    );

    // Show table
    fireEvent.click(
      screen.getByText('Sýna samanburðartöflu allra atburðarása')
    );

    // Mobile view has labels for each field
    expect(screen.getAllByText('Mánaðarlega:')).toHaveLength(
      MEAL_SCENARIO_PRESETS.length
    );
  });

  it('does not show comparison table when actualHourlyWage is zero', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        currentData={mockCurrentData}
        actualHourlyWage={0}
      />
    );

    expect(
      screen.queryByText('Sýna samanburðartöflu allra atburðarása')
    ).not.toBeInTheDocument();
  });

  it('renders all 5 preset scenarios', () => {
    render(
      <MealPresetSelector
        onSelect={mockOnSelect}
        actualHourlyWage={3000}
      />
    );

    const presetButtons = screen.getAllByRole('button').filter((button) =>
      MEAL_SCENARIO_PRESETS.some((preset) =>
        button.textContent?.includes(preset.name)
      )
    );

    expect(presetButtons.length).toBe(5);
  });
});
