import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ScenarioManager } from '@/components/calculator/ScenarioManager';
import { useCalculator } from '@/context/CalculatorContext';
import type { CalculationResults, Scenario } from '@/types/calculator';

// Mock the calculator context
vi.mock('@/context/CalculatorContext');

const mockUseCalculator = useCalculator as ReturnType<typeof vi.fn>;

describe('ScenarioManager', () => {
  const mockResults: CalculationResults = {
    nominalHourlyWage: 25,
    actualHourlyWage: 20,
    percentageReduction: 20,
    totalMoneyExpenses: 5000,
    totalExtraHours: 5,
    totalWeeklyHours: 45,
    annualNetIncome: 45000,
    expenseBreakdown: [],
    timeBreakdown: [],
  };

  const mockScenario1: Scenario = {
    id: 'scenario-1',
    name: 'Current Job',
    inputs: {} as any,
    results: {
      ...mockResults,
      actualHourlyWage: 20,
    },
    createdAt: '2026-01-19T00:00:00Z',
    updatedAt: '2026-01-19T00:00:00Z',
  };

  const mockScenario2: Scenario = {
    id: 'scenario-2',
    name: 'New Job Offer',
    inputs: {} as any,
    results: {
      ...mockResults,
      actualHourlyWage: 22,
    },
    createdAt: '2026-01-19T01:00:00Z',
    updatedAt: '2026-01-19T01:00:00Z',
  };

  const mockSaveCurrentAsScenario = vi.fn();
  const mockLoadScenario = vi.fn();
  const mockDeleteScenario = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with header', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('Saved Scenarios')).toBeInTheDocument();
    expect(screen.getByText('Compare up to 3 different scenarios')).toBeInTheDocument();
    expect(screen.getByText('0/3')).toBeInTheDocument();
  });

  it('shows "Save Current as Scenario" button when results exist and under max', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('Save Current as Scenario')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save current as scenario/i })).toBeEnabled();
  });

  it('shows disabled button with message when no results', () => {
    mockUseCalculator.mockReturnValue({
      results: null,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('Enter income to save scenario')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter income to save scenario/i })).toBeDisabled();
  });

  it('shows disabled button when max scenarios reached', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [mockScenario1, mockScenario2, { ...mockScenario1, id: 'scenario-3', name: 'Third' }],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('Maximum scenarios reached')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /maximum scenarios reached/i })).toBeDisabled();
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('shows input form when save button clicked', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    const saveButton = screen.getByRole('button', { name: /save current as scenario/i });
    fireEvent.click(saveButton);

    expect(screen.getByPlaceholderText('Scenario name (e.g., Current Job)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('saves scenario when name entered and save clicked', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    // Click to start naming
    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));

    // Enter name
    const input = screen.getByPlaceholderText('Scenario name (e.g., Current Job)');
    fireEvent.change(input, { target: { value: 'My Scenario' } });

    // Click save
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockSaveCurrentAsScenario).toHaveBeenCalledWith('My Scenario');
  });

  it('trims whitespace when saving scenario name', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));
    const input = screen.getByPlaceholderText('Scenario name (e.g., Current Job)');
    fireEvent.change(input, { target: { value: '  My Scenario  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockSaveCurrentAsScenario).toHaveBeenCalledWith('My Scenario');
  });

  it('disables save button when name is empty or whitespace', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Scenario name (e.g., Current Job)');
    fireEvent.change(input, { target: { value: '   ' } });
    expect(saveButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Valid Name' } });
    expect(saveButton).toBeEnabled();
  });

  it('saves scenario on Enter key', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));
    const input = screen.getByPlaceholderText('Scenario name (e.g., Current Job)');
    fireEvent.change(input, { target: { value: 'Quick Save' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSaveCurrentAsScenario).toHaveBeenCalledWith('Quick Save');
  });

  it('cancels naming on Escape key', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));
    const input = screen.getByPlaceholderText('Scenario name (e.g., Current Job)');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByPlaceholderText('Scenario name (e.g., Current Job)')).not.toBeInTheDocument();
    expect(screen.getByText('Save Current as Scenario')).toBeInTheDocument();
  });

  it('cancels naming when cancel button clicked', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText('Scenario name (e.g., Current Job)')).not.toBeInTheDocument();
    expect(screen.getByText('Save Current as Scenario')).toBeInTheDocument();
  });

  it('displays empty state when no scenarios', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('No saved scenarios yet. Save your current calculation to compare later.')).toBeInTheDocument();
  });

  it('displays list of saved scenarios', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [mockScenario1, mockScenario2],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('Current Job')).toBeInTheDocument();
    expect(screen.getByText('Actual: $20.00/hr')).toBeInTheDocument();
    expect(screen.getByText('New Job Offer')).toBeInTheDocument();
    expect(screen.getByText('Actual: $22.00/hr')).toBeInTheDocument();
  });

  it('shows scenario count badge correctly', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [mockScenario1, mockScenario2],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('loads scenario when Load button clicked', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [mockScenario1],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    const loadButton = screen.getByRole('button', { name: 'Load' });
    fireEvent.click(loadButton);

    expect(mockLoadScenario).toHaveBeenCalledWith('scenario-1');
  });

  it('deletes scenario when Delete button clicked', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [mockScenario1],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(mockDeleteScenario).toHaveBeenCalledWith('scenario-1');
  });

  it('formats currency correctly for scenario wages', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [{
        ...mockScenario1,
        results: {
          ...mockResults,
          actualHourlyWage: 25.5,
        },
      }],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    expect(screen.getByText('Actual: $25.50/hr')).toBeInTheDocument();
  });

  it('resets input after successful save', () => {
    mockUseCalculator.mockReturnValue({
      results: mockResults,
      scenarios: [],
      saveCurrentAsScenario: mockSaveCurrentAsScenario,
      loadScenario: mockLoadScenario,
      deleteScenario: mockDeleteScenario,
    });

    render(<ScenarioManager />);

    fireEvent.click(screen.getByRole('button', { name: /save current as scenario/i }));
    const input = screen.getByPlaceholderText('Scenario name (e.g., Current Job)');
    fireEvent.change(input, { target: { value: 'Test Scenario' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    // Should return to initial state
    expect(screen.queryByPlaceholderText('Scenario name (e.g., Current Job)')).not.toBeInTheDocument();
    expect(screen.getByText('Save Current as Scenario')).toBeInTheDocument();
  });
});
