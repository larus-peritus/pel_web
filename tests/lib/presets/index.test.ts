import {
  COMMUTE_PRESETS,
  CLOTHING_PRESETS,
  MEAL_PRESETS,
  getPresetsByCategory,
  getAllPresets,
  detectPreset,
  getPresetById,
} from '@/lib/presets';

describe('Presets Configuration', () => {
  describe('COMMUTE_PRESETS', () => {
    it('should have 5 commute presets', () => {
      expect(COMMUTE_PRESETS).toHaveLength(5);
    });

    it('should have correct structure', () => {
      COMMUTE_PRESETS.forEach((preset) => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('category', 'commute');
        expect(preset).toHaveProperty('label');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('values');
        expect(preset.values).toHaveProperty('commute');
      });
    });

    it('should have presets in order from none to very long', () => {
      expect(COMMUTE_PRESETS[0].id).toBe('commute-none');
      expect(COMMUTE_PRESETS[1].id).toBe('commute-short');
      expect(COMMUTE_PRESETS[2].id).toBe('commute-medium');
      expect(COMMUTE_PRESETS[3].id).toBe('commute-long');
      expect(COMMUTE_PRESETS[4].id).toBe('commute-very-long');
    });
  });

  describe('CLOTHING_PRESETS', () => {
    it('should have 4 clothing presets', () => {
      expect(CLOTHING_PRESETS).toHaveLength(4);
    });

    it('should have correct structure', () => {
      CLOTHING_PRESETS.forEach((preset) => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('category', 'clothing');
        expect(preset).toHaveProperty('label');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('values');
        expect(preset.values).toHaveProperty('clothing');
      });
    });
  });

  describe('MEAL_PRESETS', () => {
    it('should have 4 meal presets', () => {
      expect(MEAL_PRESETS).toHaveLength(4);
    });

    it('should have correct structure', () => {
      MEAL_PRESETS.forEach((preset) => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('category', 'meals');
        expect(preset).toHaveProperty('label');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('values');
        expect(preset.values).toHaveProperty('meals');
      });
    });
  });

  describe('getPresetsByCategory', () => {
    it('should return commute presets for commute category', () => {
      const presets = getPresetsByCategory('commute');
      expect(presets).toEqual(COMMUTE_PRESETS);
    });

    it('should return clothing presets for clothing category', () => {
      const presets = getPresetsByCategory('clothing');
      expect(presets).toEqual(CLOTHING_PRESETS);
    });

    it('should return meal presets for meals category', () => {
      const presets = getPresetsByCategory('meals');
      expect(presets).toEqual(MEAL_PRESETS);
    });
  });

  describe('getAllPresets', () => {
    it('should return all presets from all categories', () => {
      const allPresets = getAllPresets();
      expect(allPresets).toHaveLength(13); // 5 commute + 4 clothing + 4 meals
    });

    it('should include presets from all categories', () => {
      const allPresets = getAllPresets();
      const categories = new Set(allPresets.map((p) => p.category));
      expect(categories).toEqual(new Set(['commute', 'clothing', 'meals']));
    });
  });

  describe('detectPreset', () => {
    it('should detect commute preset when value matches', () => {
      const result = detectPreset('commute', { commute: 3000 });
      expect(result).not.toBeNull();
      expect(result?.id).toBe('commute-medium');
    });

    it('should detect clothing preset when value matches', () => {
      const result = detectPreset('clothing', { clothing: 800 });
      expect(result).not.toBeNull();
      expect(result?.id).toBe('clothing-business-casual');
    });

    it('should detect meal preset when value matches', () => {
      const result = detectPreset('meals', { meals: 0 });
      expect(result).not.toBeNull();
      expect(result?.id).toBe('meals-provided');
    });

    it('should return null when no preset matches', () => {
      const result = detectPreset('commute', { commute: 999 });
      expect(result).toBeNull();
    });

    it('should return null when value is undefined', () => {
      const result = detectPreset('commute', {});
      expect(result).toBeNull();
    });
  });

  describe('getPresetById', () => {
    it('should find preset by ID', () => {
      const preset = getPresetById('commute-long');
      expect(preset).not.toBeNull();
      expect(preset?.id).toBe('commute-long');
      expect(preset?.category).toBe('commute');
    });

    it('should find clothing preset by ID', () => {
      const preset = getPresetById('clothing-professional');
      expect(preset).not.toBeNull();
      expect(preset?.id).toBe('clothing-professional');
    });

    it('should find meal preset by ID', () => {
      const preset = getPresetById('meals-daily');
      expect(preset).not.toBeNull();
      expect(preset?.id).toBe('meals-daily');
    });

    it('should return null for non-existent ID', () => {
      const preset = getPresetById('non-existent');
      expect(preset).toBeNull();
    });
  });
});
