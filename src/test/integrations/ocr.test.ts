import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ocrIntegration } from '@/integrations/ocr';

describe('ocrIntegration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be defined', () => {
    expect(ocrIntegration).toBeDefined();
  });

  it('should have send/process method', () => {
    expect(typeof ocrIntegration.send === 'function' || typeof ocrIntegration.process === 'function').toBe(true);
  });

  it('should have configure method', () => {
    expect(typeof ocrIntegration.configure).toBe('function');
  });

  it('should configure correctly', async () => {
    await expect(ocrIntegration.configure({ enabled: true })).resolves.not.toThrow();
  });

  it('should handle validation', async () => {
    if (typeof ocrIntegration.validate === 'function') {
      const result = await ocrIntegration.validate();
      expect(typeof result).toBe('boolean');
    }
  });
});
