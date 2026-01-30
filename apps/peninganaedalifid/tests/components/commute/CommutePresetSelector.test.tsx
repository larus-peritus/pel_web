import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommutePresetSelector } from '@/components/commute/CommutePresetSelector';
import { COMMUTE_PRESETS } from '@/lib/calculations/commute';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CommutePresetSelector', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the preset selector with label', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    expect(screen.getByLabelText('Flýtival forstillinga')).toBeInTheDocument();
  });

  it('should display help text', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    expect(
      screen.getByText('Veldu algeng leið til að fylla út form sjálfkrafa')
    ).toBeInTheDocument();
  });

  it('should have default placeholder option', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const select = screen.getByLabelText('Flýtival forstillinga') as HTMLSelectElement;
    expect(select.value).toBe('');

    // Check that the placeholder exists
    const placeholderOption = screen.getByText('-- Veldu forstillingu --');
    expect(placeholderOption).toBeInTheDocument();
  });

  it('should display category headers', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    // These are disabled options serving as headers
    expect(screen.getByText('🚗 Bíll')).toBeInTheDocument();
    expect(screen.getByText('🚌 Strætó')).toBeInTheDocument();
    expect(screen.getByText('🚴 Hjól/Ganga')).toBeInTheDocument();
    expect(screen.getByText('🏠 Fjarvinnu')).toBeInTheDocument();
  });

  it('should display all car presets', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const carPresets = COMMUTE_PRESETS.filter((p) => p.category === 'car');
    // Check that all car preset labels are in the document (the select component might normalize whitespace)
    carPresets.forEach((preset) => {
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'OPTION' && content.includes(preset.label);
      })).toBeInTheDocument();
    });
  });

  it('should display all transit presets', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const transitPresets = COMMUTE_PRESETS.filter((p) => p.category === 'transit');
    transitPresets.forEach((preset) => {
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'OPTION' && content.includes(preset.label);
      })).toBeInTheDocument();
    });
  });

  it('should display all active presets', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const activePresets = COMMUTE_PRESETS.filter((p) => p.category === 'active');
    activePresets.forEach((preset) => {
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'OPTION' && content.includes(preset.label);
      })).toBeInTheDocument();
    });
  });

  it('should display all remote presets', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const remotePresets = COMMUTE_PRESETS.filter((p) => p.category === 'remote');
    remotePresets.forEach((preset) => {
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'OPTION' && content.includes(preset.label);
      })).toBeInTheDocument();
    });
  });

  it('should call onSelect when a preset is selected', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const select = screen.getByLabelText('Flýtival forstillinga') as HTMLSelectElement;
    const testPreset = COMMUTE_PRESETS[0];

    fireEvent.change(select, { target: { value: testPreset.id } });

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(testPreset);
  });

  it('should not call onSelect when placeholder is selected', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const select = screen.getByLabelText('Flýtival forstillinga') as HTMLSelectElement;

    // Change to a preset first
    fireEvent.change(select, { target: { value: COMMUTE_PRESETS[0].id } });
    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    // Change back to placeholder
    fireEvent.change(select, { target: { value: '' } });
    expect(mockOnSelect).toHaveBeenCalledTimes(1); // Should not increase
  });

  it('should not call onSelect when a category header is selected', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const select = screen.getByLabelText('Flýtival forstillinga') as HTMLSelectElement;

    // Try to select a header (these should be disabled, but test defensively)
    fireEvent.change(select, { target: { value: 'header-car' } });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should apply custom className if provided', () => {
    const { container } = render(
      <CommutePresetSelector onSelect={mockOnSelect} className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });

  it('should handle selection of different preset types correctly', () => {
    render(<CommutePresetSelector onSelect={mockOnSelect} />);

    const select = screen.getByLabelText('Flýtival forstillinga') as HTMLSelectElement;

    // Test car preset
    const carPreset = COMMUTE_PRESETS.find((p) => p.category === 'car')!;
    fireEvent.change(select, { target: { value: carPreset.id } });
    expect(mockOnSelect).toHaveBeenCalledWith(carPreset);

    // Test transit preset
    const transitPreset = COMMUTE_PRESETS.find((p) => p.category === 'transit')!;
    fireEvent.change(select, { target: { value: transitPreset.id } });
    expect(mockOnSelect).toHaveBeenCalledWith(transitPreset);

    // Test active preset
    const activePreset = COMMUTE_PRESETS.find((p) => p.category === 'active')!;
    fireEvent.change(select, { target: { value: activePreset.id } });
    expect(mockOnSelect).toHaveBeenCalledWith(activePreset);

    // Test remote preset
    const remotePreset = COMMUTE_PRESETS.find((p) => p.category === 'remote')!;
    fireEvent.change(select, { target: { value: remotePreset.id } });
    expect(mockOnSelect).toHaveBeenCalledWith(remotePreset);
  });
});
