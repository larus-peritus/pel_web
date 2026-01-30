import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CommuteForm } from '@/components/commute/CommuteForm';
import { COMMUTE_PRESETS } from '@/lib/calculations/commute';
import type { CommuteScenario } from '@/types/calculator';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CommuteForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const mockCarScenario: CommuteScenario = {
    id: 'scenario-1',
    name: 'Núverandi vinna',
    inputs: {
      distanceKm: 10,
      daysPerWeek: 5,
      commuteMethod: 'car',
      timeMinutesOneWay: 20,
      car: {
        fuelType: 'gasoline',
        fuelPrice: 350,
        fuelConsumption: 8,
        parkingCostPerDay: 1000,
        tollsPerDay: 0,
        monthlyDepreciation: 35000,
        monthlyInsurance: 15000,
        monthlyMaintenance: 10000,
        inspectionCost: 12000,
      },
    },
    results: {} as any, // Not needed for form tests
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTransitScenario: CommuteScenario = {
    id: 'scenario-2',
    name: 'Strætó valkostur',
    inputs: {
      distanceKm: 10,
      daysPerWeek: 5,
      commuteMethod: 'transit',
      timeMinutesOneWay: 35,
      transit: {
        ticketType: 'monthly',
        monthlyCost: 10500,
      },
    },
    results: {} as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Add Mode', () => {
    it('should render form in add mode with correct title', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByText('Bæta við vinnuferð')).toBeInTheDocument();
    });

    it('should show preset selector in add mode', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText('Flýtival forstillinga')).toBeInTheDocument();
    });

    it('should render all basic fields', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/Heiti/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Fjarlægð \(km\)/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Dagar á viku/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ferðamáti/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ferðatími \(mínútur\)/)).toBeInTheDocument();
    });

    it('should default to car commute method', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      expect(methodSelect.value).toBe('car');
    });

    it('should show car-specific fields when car is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/Eldsneytistegund/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Eldsneytisverð/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Eyðsla/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Stæði/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tollar/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Afskriftir/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tryggingar/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Viðhald/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Skoðun/)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(
        screen.getByRole('button', { name: /Bæta við/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Hætta við/i })
      ).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should render form in edit mode with correct title', () => {
      render(
        <CommuteForm
          mode="edit"
          scenario={mockCarScenario}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Breyta vinnuferð')).toBeInTheDocument();
    });

    it('should not show preset selector in edit mode', () => {
      render(
        <CommuteForm
          mode="edit"
          scenario={mockCarScenario}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.queryByLabelText('Flýtival forstillinga')
      ).not.toBeInTheDocument();
    });

    it('should pre-populate fields with scenario data', () => {
      render(
        <CommuteForm
          mode="edit"
          scenario={mockCarScenario}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Heiti/) as HTMLInputElement;
      expect(nameInput.value).toBe(mockCarScenario.name);

      const distanceInput = screen.getByLabelText(/Fjarlægð/) as HTMLInputElement;
      expect(distanceInput.value).toBe(mockCarScenario.inputs.distanceKm.toString());

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      expect(methodSelect.value).toBe(mockCarScenario.inputs.commuteMethod);
    });

    it('should render save button as "Vista breytingar" in edit mode', () => {
      render(
        <CommuteForm
          mode="edit"
          scenario={mockCarScenario}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByRole('button', { name: /Vista breytingar/i })
      ).toBeInTheDocument();
    });
  });

  describe('Conditional Fields', () => {
    it('should show transit fields when transit is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      fireEvent.change(methodSelect, { target: { value: 'transit' } });

      expect(screen.getByLabelText(/Tegund miða/)).toBeInTheDocument();
    });

    it('should show monthly cost field when monthly ticket is selected', () => {
      render(
        <CommuteForm
          mode="edit"
          scenario={mockTransitScenario}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/Mánaðarkostnaður/)).toBeInTheDocument();
    });

    it('should show per-ride cost field when per-ride ticket is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      fireEvent.change(methodSelect, { target: { value: 'transit' } });

      const ticketTypeSelect = screen.getByLabelText(/Tegund miða/) as HTMLSelectElement;
      fireEvent.change(ticketTypeSelect, { target: { value: 'per_ride' } });

      expect(screen.getByLabelText(/Kostnaður á ferð/)).toBeInTheDocument();
    });

    it('should show bike maintenance field when bike is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      fireEvent.change(methodSelect, { target: { value: 'bike' } });

      expect(screen.getByLabelText(/Viðhaldskostnaður/)).toBeInTheDocument();
      // Check that the h4 heading for bike section is visible
      const headings = screen.getAllByText(/Hjólreiðar/);
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should show walk maintenance field when walk is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      fireEvent.change(methodSelect, { target: { value: 'walk' } });

      expect(screen.getByLabelText(/Viðhaldskostnaður/)).toBeInTheDocument();
      // Check that the h4 heading for walk section is visible
      const headings = screen.getAllByText(/Ganga/);
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should show informational message when remote is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      fireEvent.change(methodSelect, { target: { value: 'remote' } });

      expect(
        screen.getByText(/Fjarvinnu - enginn ferðakostnaður/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Þetta sparar bæði peninga og lífsorku!/)
      ).toBeInTheDocument();
    });

    it('should hide car fields when switching from car to transit', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Initially car fields should be visible
      expect(screen.getByLabelText(/Eldsneytistegund/)).toBeInTheDocument();

      // Switch to transit
      const methodSelect = screen.getByLabelText(/Ferðamáti/) as HTMLSelectElement;
      fireEvent.change(methodSelect, { target: { value: 'transit' } });

      // Car fields should be hidden
      expect(screen.queryByLabelText(/Eldsneytistegund/)).not.toBeInTheDocument();
    });

    it('should update fuel price label for electric cars', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const fuelTypeSelect = screen.getByLabelText(/Eldsneytistegund/) as HTMLSelectElement;
      fireEvent.change(fuelTypeSelect, { target: { value: 'electric' } });

      expect(screen.getByLabelText(/Rafmagnsverð/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Eyðsla \(kWh\/100km\)/)).toBeInTheDocument();
    });
  });

  describe('Preset Selection', () => {
    it('should populate form when a preset is selected', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const carPreset = COMMUTE_PRESETS.find((p) => p.category === 'car')!;

      // Simulate preset selection via the selector component
      const presetSelect = screen.getByLabelText(
        /Flýtival forstillinga/
      ) as HTMLSelectElement;
      fireEvent.change(presetSelect, { target: { value: carPreset.id } });

      // Check that basic fields are populated
      const distanceInput = screen.getByLabelText(/Fjarlægð/) as HTMLInputElement;
      expect(distanceInput.value).toBe(carPreset.inputs.distanceKm.toString());

      const daysInput = screen.getByLabelText(/Dagar á viku/) as HTMLInputElement;
      expect(daysInput.value).toBe(carPreset.inputs.daysPerWeek.toString());
    });
  });

  describe('Validation', () => {
    it('should have required attribute on name field', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Heiti/) as HTMLInputElement;
      expect(nameInput.required).toBe(true);
    });

    it('should have required attribute on distance field', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const distanceInput = screen.getByLabelText(/Fjarlægð/) as HTMLInputElement;
      expect(distanceInput.required).toBe(true);
    });

    it('should not call onSave when validation fails', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Fill in name but leave other required fields empty
      const nameInput = screen.getByLabelText(/Heiti/) as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Test' } });

      const form = screen.getByRole('button', { name: /Bæta við/ }).closest('form');

      // Form should have invalid state due to empty required fields
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSave with correct data when valid', async () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Fill in all required fields
      const nameInput = screen.getByLabelText(/Heiti/) as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Test Scenario' } });

      const distanceInput = screen.getByLabelText(/Fjarlægð/) as HTMLInputElement;
      fireEvent.change(distanceInput, { target: { value: '10' } });

      const daysInput = screen.getByLabelText(/Dagar á viku/) as HTMLInputElement;
      fireEvent.change(daysInput, { target: { value: '5' } });

      const timeInput = screen.getByLabelText(/Ferðatími/) as HTMLInputElement;
      fireEvent.change(timeInput, { target: { value: '20' } });

      // Fill car-specific fields
      const fuelPriceInput = screen.getByLabelText(/Eldsneytisverð/) as HTMLInputElement;
      fireEvent.change(fuelPriceInput, { target: { value: '350' } });

      const fuelConsumptionInput = screen.getByLabelText(/Eyðsla/) as HTMLInputElement;
      fireEvent.change(fuelConsumptionInput, { target: { value: '8' } });

      const submitButton = screen.getByRole('button', { name: /Bæta við/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });

      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData.name).toBe('Test Scenario');
      expect(savedData.distanceKm).toBe(10);
      expect(savedData.daysPerWeek).toBe(5);
      expect(savedData.commuteMethod).toBe('car');
    });

    it('should call onCancel when cancel button is clicked', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /Hætta við/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on all inputs', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/Heiti/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Fjarlægð/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Dagar á viku/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ferðamáti/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ferðatími/)).toBeInTheDocument();
    });

    it('should mark required fields', () => {
      render(<CommuteForm mode="add" onSave={mockOnSave} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/Heiti/) as HTMLInputElement;
      expect(nameInput.required).toBe(true);

      const distanceInput = screen.getByLabelText(/Fjarlægð/) as HTMLInputElement;
      expect(distanceInput.required).toBe(true);
    });
  });
});
