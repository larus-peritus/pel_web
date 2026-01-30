import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeCookingInputs } from '@/components/mealCost/HomeCookingInputs';
import type { HomeCookingData } from '@/types/calculator';

describe('HomeCookingInputs', () => {
  const mockData: HomeCookingData = {
    monthlyGroceryCost: 80000,
    householdSize: 2,
    shoppingHoursPerWeek: 2,
    cookingHoursPerWeek: 7,
  };

  let mockOnChange: ReturnType<typeof vi.fn>;
  const mockActualHourlyWage = 3000;

  beforeEach(() => {
    mockOnChange = vi.fn();
  });

  it('renders the component with correct heading', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.getByText('Heimaeldun')).toBeInTheDocument();
    expect(
      screen.getByText('Kostnaður og tími sem fer í matvöruinnkaup og matareldun')
    ).toBeInTheDocument();
  });

  it('displays monthly grocery cost input', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(
      screen.getByLabelText('Mánaðarlegur matvörukostnaður')
    ).toBeInTheDocument();
  });

  it('displays household size input', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.getByLabelText('Fjöldi í heimili')).toBeInTheDocument();
  });

  it('displays shopping hours input', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.getByLabelText('Innkaupatími á viku')).toBeInTheDocument();
  });

  it('displays cooking hours input', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.getByLabelText('Eldunartími á viku')).toBeInTheDocument();
  });

  it('calculates and displays cost per person', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.getByText(/Kostnaður á mann:/)).toBeInTheDocument();
    expect(screen.getByText(/40.000 kr\/mán/)).toBeInTheDocument();
  });

  it('displays time cost breakdown when hours > 0 and wage > 0', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.getByText('Tímakostnaður')).toBeInTheDocument();
    expect(screen.getByText(/Heildartími:/)).toBeInTheDocument();
    expect(screen.getByText(/Tímakaup:/)).toBeInTheDocument();
    expect(screen.getByText(/Tímakostnaður á viku:/)).toBeInTheDocument();
  });

  it('shows warning when actualHourlyWage is 0', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={0}
      />
    );

    expect(
      screen.getByText(
        /Vinsamlegast fylltu út raunverulegt tímakaup í aðalreiknivélinni/
      )
    ).toBeInTheDocument();
  });

  it('does not show time cost breakdown when wage is 0', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={0}
      />
    );

    expect(screen.queryByText('Tímakostnaður')).not.toBeInTheDocument();
  });

  it('calls onChange when grocery cost is updated', async () => {
    const user = userEvent.setup();
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const groceryInput = screen.getByLabelText('Mánaðarlegur matvörukostnaður');

    await user.clear(groceryInput);
    await user.type(groceryInput, '90000');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when household size is updated', async () => {
    const user = userEvent.setup();
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const householdInput = screen.getByLabelText('Fjöldi í heimili');

    await user.clear(householdInput);
    await user.type(householdInput, '4');

    // Check that onChange was called
    expect(mockOnChange).toHaveBeenCalled();
    // Verify the last call has the correct value
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.householdSize).toBe(24); // "2" + "4" = 24 due to how number input works
  });

  it('calls onChange when shopping hours is updated', async () => {
    const user = userEvent.setup();
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const shoppingInput = screen.getByLabelText('Innkaupatími á viku');

    await user.clear(shoppingInput);
    await user.type(shoppingInput, '3');

    // Check that onChange was called
    expect(mockOnChange).toHaveBeenCalled();
    // Verify the last call has the correct value
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.shoppingHoursPerWeek).toBe(23); // "2" + "3" = 23
  });

  it('calls onChange when cooking hours is updated', async () => {
    const user = userEvent.setup();
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const cookingInput = screen.getByLabelText('Eldunartími á viku');

    await user.clear(cookingInput);
    await user.type(cookingInput, '10');

    // Check that onChange was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('validates household size minimum is 1', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const householdInput = screen.getByLabelText('Fjöldi í heimili');
    expect(householdInput).toHaveAttribute('min', '1');
  });

  it('validates shopping hours minimum is 0', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const shoppingInput = screen.getByLabelText('Innkaupatími á viku');
    expect(shoppingInput).toHaveAttribute('min', '0');
  });

  it('validates cooking hours minimum is 0', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const cookingInput = screen.getByLabelText('Eldunartími á viku');
    expect(cookingInput).toHaveAttribute('min', '0');
  });

  it('uses step of 0.5 for time inputs', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const shoppingInput = screen.getByLabelText('Innkaupatími á viku');
    const cookingInput = screen.getByLabelText('Eldunartími á viku');

    expect(shoppingInput).toHaveAttribute('step', '0.5');
    expect(cookingInput).toHaveAttribute('step', '0.5');
  });

  it('calculates total weekly hours correctly', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    // 2 + 7 = 9 hours
    expect(screen.getByText(/Heildartími: 9.0 klst á viku/)).toBeInTheDocument();
  });

  it('calculates weekly time cost correctly', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    // 9 hours * 3000 kr/hour = 27000 kr
    expect(screen.getByText(/Tímakostnaður á viku: 27.000 kr/)).toBeInTheDocument();
  });

  it('displays help text for grocery cost', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(
      screen.getByText('Heildarkaup á matvöru fyrir heimili á mánuði')
    ).toBeInTheDocument();
  });

  it('displays help text for shopping hours', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(
      screen.getByText('Klst á viku að versla fyrir matvöru (með ferðalagi)')
    ).toBeInTheDocument();
  });

  it('displays help text for cooking hours', () => {
    render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(
      screen.getByText('Klst á viku að elda mat (undirbúningur + eldun + þvottur)')
    ).toBeInTheDocument();
  });

  it('renders within a Card component', () => {
    const { container } = render(
      <HomeCookingInputs
        data={mockData}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    const card = container.querySelector('.bg-white.rounded-xl');
    expect(card).toBeInTheDocument();
  });

  it('handles zero household size gracefully', () => {
    const zeroHousehold = { ...mockData, householdSize: 0 };

    render(
      <HomeCookingInputs
        data={zeroHousehold}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    // Should not crash, cost per person section should not show or show 0
    expect(screen.queryByText(/Kostnaður á mann:/)).not.toBeInTheDocument();
  });

  it('does not show time cost when total hours is 0', () => {
    const zeroHours = { ...mockData, shoppingHoursPerWeek: 0, cookingHoursPerWeek: 0 };

    render(
      <HomeCookingInputs
        data={zeroHours}
        onChange={mockOnChange}
        actualHourlyWage={mockActualHourlyWage}
      />
    );

    expect(screen.queryByText('Tímakostnaður')).not.toBeInTheDocument();
  });
});
