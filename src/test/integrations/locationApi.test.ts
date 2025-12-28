import { describe, it, expect, vi, beforeEach } from 'vitest';
import { locationApiIntegration } from '@/integrations/locationApi';

describe('locationApiIntegration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be defined', () => {
    expect(locationApiIntegration).toBeDefined();
  });

  it('should have send/process method', () => {
    expect(typeof locationApiIntegration.send === 'function' || typeof locationApiIntegration.process === 'function').toBe(true);
  });

  it('should have configure method', () => {
    expect(typeof locationApiIntegration.configure).toBe('function');
  });

  it('should configure correctly', async () => {
    await expect(locationApiIntegration.configure({ enabled: true })).resolves.not.toThrow();
  });

  it('should handle validation', async () => {
    if (typeof locationApiIntegration.validate === 'function') {
      const result = await locationApiIntegration.validate();
      expect(typeof result).toBe('boolean');
    }
  });
});
