import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeInputs } from '@/components/calculator/TimeInputs';
import { CalculatorProvider } from '@/context/CalculatorContext';
import type { TimeExpenses } from '@/types/calculator';

// Helper to render with context
function renderWithContext(ui: React.ReactElement) {
  return render(<CalculatorProvider>{ui}</CalculatorProvider>);
}

describe('TimeInputs', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render the card with header and title', () => {
      renderWithContext(<TimeInputs />);

      expect(
        screen.getByRole('heading', { name: /extra time/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/weekly hours beyond your paid work time/i)
      ).toBeInTheDocument();
    });

    it('should render all four time input fields', () => {
      renderWithContext(<TimeInputs />);

      expect(screen.getByLabelText(/commute time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/getting ready/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/decompression time/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/work-related illness/i)
      ).toBeInTheDocument();
    });

    it('should display all field descriptions', () => {
      renderWithContext(<TimeInputs />);

      expect(
        screen.getByText(/total round-trip time per week/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/extra preparation time for work beyond normal/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/time needed to recover from work each week/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/average weekly hours lost to work stress\/illness/i)
      ).toBeInTheDocument();
    });

    it('should display hrs/week suffix for all inputs', () => {
      renderWithContext(<TimeInputs />);

      const suffixes = screen.getAllByText(/hrs\/week/i);
      // 4 input suffixes + 1 in the total display
      expect(suffixes.length).toBeGreaterThanOrEqual(4);
    });

    it('should display total extra hours as 0.0 initially', () => {
      renderWithContext(<TimeInputs />);

      expect(screen.getByText(/0\.0 hrs\/week/i)).toBeInTheDocument();
      expect(screen.getByText(/total extra/i)).toBeInTheDocument();
    });
  });

  describe('Input Functionality', () => {
    it('should start with all values at 0', () => {
      renderWithContext(<TimeInputs />);

      const commuteInput = screen.getByLabelText(
        /commute time/i
      ) as HTMLInputElement;
      const readyInput = screen.getByLabelText(
        /getting ready/i
      ) as HTMLInputElement;
      const decompressionInput = screen.getByLabelText(
        /decompression time/i
      ) as HTMLInputElement;
      const illnessInput = screen.getByLabelText(
        /work-related illness/i
      ) as HTMLInputElement;

      expect(commuteInput.value).toBe('0');
      expect(readyInput.value).toBe('0');
      expect(decompressionInput.value).toBe('0');
      expect(illnessInput.value).toBe('0');
    });

    it('should update commute time when user types', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      const input = screen.getByLabelText(
        /commute time/i
      ) as HTMLInputElement;

      await user.clear(input);
      await user.type(input, '5');

      expect(input.value).toBe('5');
    });

    it('should update getting ready time when user types', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      const input = screen.getByLabelText(/getting ready/i) as HTMLInputElement;

      await user.clear(input);
      await user.type(input, '2.5');

      expect(input.value).toBe('2.5');
    });

    it('should update decompression time when user types', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      const input = screen.getByLabelText(
        /decompression time/i
      ) as HTMLInputElement;

      await user.clear(input);
      await user.type(input, '3');

      expect(input.value).toBe('3');
    });

    it('should update work illness time when user types', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      const input = screen.getByLabelText(
        /work-related illness/i
      ) as HTMLInputElement;

      await user.clear(input);
      await user.type(input, '1');

      expect(input.value).toBe('1');
    });

    it('should accept decimal values with step 0.5', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      const input = screen.getByLabelText(
        /commute time/i
      ) as HTMLInputElement;

      await user.clear(input);
      await user.type(input, '7.5');

      expect(input.value).toBe('7.5');
    });
  });

  describe('Total Calculation', () => {
    it('should calculate total extra hours correctly', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      // Set commute time
      const commuteInput = screen.getByLabelText(/commute time/i);
      await user.clear(commuteInput);
      await user.type(commuteInput, '5');

      // Set getting ready time
      const readyInput = screen.getByLabelText(/getting ready/i);
      await user.clear(readyInput);
      await user.type(readyInput, '2.5');

      // Set decompression time
      const decompressionInput = screen.getByLabelText(/decompression time/i);
      await user.clear(decompressionInput);
      await user.type(decompressionInput, '3');

      // Set illness time
      const illnessInput = screen.getByLabelText(/work-related illness/i);
      await user.clear(illnessInput);
      await user.type(illnessInput, '1');

      // Check total: 5 + 2.5 + 3 + 1 = 11.5
      expect(screen.getByText(/11\.5 hrs\/week/i)).toBeInTheDocument();
    });

    it('should update total when any field changes', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      // Initially 0
      expect(screen.getByText(/0\.0 hrs\/week/i)).toBeInTheDocument();

      // Add commute time
      const commuteInput = screen.getByLabelText(/commute time/i);
      await user.clear(commuteInput);
      await user.type(commuteInput, '10');

      // Total should be 10
      expect(screen.getByText(/10\.0 hrs\/week/i)).toBeInTheDocument();

      // Add getting ready time
      const readyInput = screen.getByLabelText(/getting ready/i);
      await user.clear(readyInput);
      await user.type(readyInput, '5');

      // Total should be 15
      expect(screen.getByText(/15\.0 hrs\/week/i)).toBeInTheDocument();
    });
  });

  describe('Input Constraints', () => {
    it('should have min value of 0', () => {
      renderWithContext(<TimeInputs />);

      const inputs = [
        screen.getByLabelText(/commute time/i),
        screen.getByLabelText(/getting ready/i),
        screen.getByLabelText(/decompression time/i),
        screen.getByLabelText(/work-related illness/i),
      ];

      inputs.forEach((input) => {
        expect(input).toHaveAttribute('min', '0');
      });
    });

    it('should have max value of 40', () => {
      renderWithContext(<TimeInputs />);

      const inputs = [
        screen.getByLabelText(/commute time/i),
        screen.getByLabelText(/getting ready/i),
        screen.getByLabelText(/decompression time/i),
        screen.getByLabelText(/work-related illness/i),
      ];

      inputs.forEach((input) => {
        expect(input).toHaveAttribute('max', '40');
      });
    });

    it('should have step value of 0.5', () => {
      renderWithContext(<TimeInputs />);

      const inputs = [
        screen.getByLabelText(/commute time/i),
        screen.getByLabelText(/getting ready/i),
        screen.getByLabelText(/decompression time/i),
        screen.getByLabelText(/work-related illness/i),
      ];

      inputs.forEach((input) => {
        expect(input).toHaveAttribute('step', '0.5');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      renderWithContext(<TimeInputs />);

      const commuteInput = screen.getByLabelText(/commute time/i);
      expect(commuteInput).toHaveAccessibleName('Commute Time');

      const readyInput = screen.getByLabelText(/getting ready/i);
      expect(readyInput).toHaveAccessibleName('Getting Ready');

      const decompressionInput = screen.getByLabelText(/decompression time/i);
      expect(decompressionInput).toHaveAccessibleName('Decompression Time');

      const illnessInput = screen.getByLabelText(/work-related illness/i);
      expect(illnessInput).toHaveAccessibleName('Work-Related Illness');
    });

    it('should have unique IDs for all inputs', () => {
      renderWithContext(<TimeInputs />);

      const commuteInput = screen.getByLabelText(/commute time/i);
      const readyInput = screen.getByLabelText(/getting ready/i);
      const decompressionInput = screen.getByLabelText(/decompression time/i);
      const illnessInput = screen.getByLabelText(/work-related illness/i);

      expect(commuteInput.id).toBe('time-commute');
      expect(readyInput.id).toBe('time-gettingReady');
      expect(decompressionInput.id).toBe('time-decompression');
      expect(illnessInput.id).toBe('time-workIllness');
    });

    it('should have description paragraphs with proper IDs', () => {
      const { container } = renderWithContext(<TimeInputs />);

      expect(container.querySelector('#time-commute-desc')).toBeInTheDocument();
      expect(
        container.querySelector('#time-gettingReady-desc')
      ).toBeInTheDocument();
      expect(
        container.querySelector('#time-decompression-desc')
      ).toBeInTheDocument();
      expect(
        container.querySelector('#time-workIllness-desc')
      ).toBeInTheDocument();
    });

    it('should have type="number" for all inputs', () => {
      renderWithContext(<TimeInputs />);

      const inputs = [
        screen.getByLabelText(/commute time/i),
        screen.getByLabelText(/getting ready/i),
        screen.getByLabelText(/decompression time/i),
        screen.getByLabelText(/work-related illness/i),
      ];

      inputs.forEach((input) => {
        expect(input).toHaveAttribute('type', 'number');
      });
    });
  });

  describe('Context Integration', () => {
    it('should persist values to calculator context', async () => {
      const user = userEvent.setup();
      renderWithContext(<TimeInputs />);

      // Update commute time
      const input = screen.getByLabelText(/commute time/i);
      await user.clear(input);
      await user.type(input, '8');

      // Re-render the component (simulates context update)
      const { rerender } = render(
        <CalculatorProvider>
          <TimeInputs />
        </CalculatorProvider>
      );

      // Value should persist
      const updatedInput = screen.getByLabelText(
        /commute time/i
      ) as HTMLInputElement;
      expect(updatedInput.value).toBe('8');
    });
  });
});
