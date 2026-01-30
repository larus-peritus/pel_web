/**
 * Tests for environment configuration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Environment Configuration', () => {
  // Store original env values
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
  });

  describe('env.ga', () => {
    it('should have id property', async () => {
      const { env } = await import('../env');
      expect(env.ga).toHaveProperty('id');
    });

    it('should have isEnabled property', async () => {
      const { env } = await import('../env');
      expect(env.ga).toHaveProperty('isEnabled');
      expect(typeof env.ga.isEnabled).toBe('boolean');
    });

    it('should set isEnabled to false when GA_ID is not set', async () => {
      delete process.env.NEXT_PUBLIC_GA_ID;
      const { env } = await import('../env');
      expect(env.ga.isEnabled).toBe(false);
    });

    it('should set isEnabled to true when GA_ID is set', async () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
      const { env } = await import('../env');
      expect(env.ga.isEnabled).toBe(true);
      expect(env.ga.id).toBe('G-TEST123');
    });
  });

  describe('env.adsense', () => {
    it('should have id property', async () => {
      const { env } = await import('../env');
      expect(env.adsense).toHaveProperty('id');
    });

    it('should have isEnabled property', async () => {
      const { env } = await import('../env');
      expect(env.adsense).toHaveProperty('isEnabled');
      expect(typeof env.adsense.isEnabled).toBe('boolean');
    });

    it('should set isEnabled to false when ADSENSE_ID is not set', async () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_ID;
      const { env } = await import('../env');
      expect(env.adsense.isEnabled).toBe(false);
    });

    it('should set isEnabled to true when ADSENSE_ID is set', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_ID = 'ca-pub-TEST123';
      const { env } = await import('../env');
      expect(env.adsense.isEnabled).toBe(true);
      expect(env.adsense.id).toBe('ca-pub-TEST123');
    });
  });

  describe('env.app', () => {
    it('should have version property', async () => {
      const { env } = await import('../env');
      expect(env.app).toHaveProperty('version');
      expect(typeof env.app.version).toBe('string');
    });

    it('should default to "0.1.0" when APP_VERSION is not set', async () => {
      delete process.env.NEXT_PUBLIC_APP_VERSION;
      const { env } = await import('../env');
      expect(env.app.version).toBe('0.1.0');
    });

    it('should use custom version when APP_VERSION is set', async () => {
      process.env.NEXT_PUBLIC_APP_VERSION = '1.2.3';
      const { env } = await import('../env');
      expect(env.app.version).toBe('1.2.3');
    });
  });

  describe('Type Safety', () => {
    it('should have readonly structure', async () => {
      const { env } = await import('../env');
      // Verify the object structure exists and has expected properties
      expect(env).toHaveProperty('ga');
      expect(env).toHaveProperty('adsense');
      expect(env).toHaveProperty('app');
      // The 'as const' assertion provides type-level immutability
      // Runtime immutability would require Object.freeze
    });
  });
});
