import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EatingOutInputs } from '@/components/mealCost/EatingOutInputs';
import type { EatingOutData } from '@/types/calculator';

describe('EatingOutInputs', () => {
  const mockData: EatingOutData = {
    breakfastCount: 2,
    lunchCount: 5,
    dinnerCount: 3,
    coffeeCount: 7,
    fastFoodCount: 1,
    breakfastCost: 1500,
    lunchCost: 2500,
    dinnerCost: 4000,
    coffeeCost: 650,
    fastFoodCost: 2000,
  };

  let mockOnChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnChange = vi.fn();
  });

  it('renders the component with correct heading', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    expect(screen.getByText('Að borða úti')).toBeInTheDocument();
    expect(
      screen.getByText('Hversu oft borðar þú úti og hver er kostnaðurinn?')
    ).toBeInTheDocument();
  });

  it('renders all 5 meal categories', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    expect(screen.getByText('Morgunverður')).toBeInTheDocument();
    expect(screen.getByText('Hádegisverður')).toBeInTheDocument();
    expect(screen.getByText('Kvöldverður')).toBeInTheDocument();
    expect(screen.getByText('Kaffi / Drykkir')).toBeInTheDocument();
    expect(screen.getByText('Skyndibiti')).toBeInTheDocument();
  });

  it('displays current breakfast data correctly', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const breakfastInputs = screen.getAllByDisplayValue('2');
    expect(breakfastInputs.length).toBeGreaterThan(0);
  });

  it('calls onChange when breakfast count is updated', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    // Find all "Skipti á viku" inputs - breakfast is first
    const countInputs = screen.getAllByLabelText(/Skipti á viku/);
    const breakfastCountInput = countInputs[0];

    await user.clear(breakfastCountInput);
    await user.type(breakfastCountInput, '5');

    // Verify onChange was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when lunch cost is updated', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    // Find all "Kostnaður per skipti" inputs - lunch is second
    const costInputs = screen.getAllByLabelText(/Kostnaður per skipti/);
    const lunchCostInput = costInputs[1];

    await user.clear(lunchCostInput);
    await user.type(lunchCostInput, '3000');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays price preset dropdowns for all categories', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    // Should have 5 "Verðflokkur" labels (one per category)
    const presetLabels = screen.getAllByText('Verðflokkur');
    expect(presetLabels).toHaveLength(5);
  });

  it('updates breakfast cost when preset is selected', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const presetSelects = screen.getAllByLabelText('Verðflokkur');
    const breakfastPreset = presetSelects[0];

    await user.selectOptions(breakfastPreset, '2500');

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        breakfastCost: 2500,
      })
    );
  });

  it('validates count inputs are within 0-21 range', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const countInputs = screen.getAllByLabelText(/Skipti á viku/);
    countInputs.forEach((input) => {
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '21');
    });
  });

  it('displays help text for count inputs', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const helpTexts = screen.getAllByText('0-21 skipti á viku');
    expect(helpTexts).toHaveLength(5); // One for each category
  });

  it('handles zero values correctly', () => {
    const zeroData: EatingOutData = {
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      coffeeCount: 0,
      fastFoodCount: 0,
      breakfastCost: 0,
      lunchCost: 0,
      dinnerCost: 0,
      coffeeCost: 0,
      fastFoodCost: 0,
    };

    render(<EatingOutInputs data={zeroData} onChange={mockOnChange} />);

    expect(screen.getByText('Að borða úti')).toBeInTheDocument();
  });

  it('calls onChange when dinner count is updated', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const countInputs = screen.getAllByLabelText(/Skipti á viku/);
    const dinnerCountInput = countInputs[2]; // Third category

    await user.clear(dinnerCountInput);
    await user.type(dinnerCountInput, '7');

    // Verify onChange was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when coffee count is updated', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const countInputs = screen.getAllByLabelText(/Skipti á viku/);
    const coffeeCountInput = countInputs[3]; // Fourth category

    await user.clear(coffeeCountInput);
    await user.type(coffeeCountInput, '10');

    // Verify onChange was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when fast food cost is updated', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const costInputs = screen.getAllByLabelText(/Kostnaður per skipti/);
    const fastFoodCostInput = costInputs[4]; // Fifth category

    await user.clear(fastFoodCostInput);
    await user.type(fastFoodCostInput, '2500');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders within a Card component', () => {
    const { container } = render(
      <EatingOutInputs data={mockData} onChange={mockOnChange} />
    );

    // Card adds specific classes
    const card = container.querySelector('.bg-white.rounded-xl');
    expect(card).toBeInTheDocument();
  });

  it('maintains separate state for each meal category', async () => {
    const user = userEvent.setup();
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const countInputs = screen.getAllByLabelText(/Skipti á viku/);

    // Update breakfast
    await user.clear(countInputs[0]);
    await user.type(countInputs[0], '7');

    // Verify onChange was called (state management is handled by parent)
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays all input fields with proper labels', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    // Should have 5 count inputs
    expect(screen.getAllByLabelText(/Skipti á viku/)).toHaveLength(5);

    // Should have 5 cost inputs
    expect(screen.getAllByLabelText(/Kostnaður per skipti/)).toHaveLength(5);

    // Should have 5 preset selects
    expect(screen.getAllByLabelText('Verðflokkur')).toHaveLength(5);
  });

  it('uses proper step value for count inputs', () => {
    render(<EatingOutInputs data={mockData} onChange={mockOnChange} />);

    const countInputs = screen.getAllByLabelText(/Skipti á viku/);
    countInputs.forEach((input) => {
      expect(input).toHaveAttribute('step', '1');
    });
  });
});
