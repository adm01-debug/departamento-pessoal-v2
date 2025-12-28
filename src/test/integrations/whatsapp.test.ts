import { describe, it, expect, vi, beforeEach } from 'vitest';
import { whatsappIntegration } from '@/integrations/whatsapp';

describe('whatsappIntegration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be defined', () => {
    expect(whatsappIntegration).toBeDefined();
  });

  it('should have send/process method', () => {
    expect(typeof whatsappIntegration.send === 'function' || typeof whatsappIntegration.process === 'function').toBe(true);
  });

  it('should have configure method', () => {
    expect(typeof whatsappIntegration.configure).toBe('function');
  });

  it('should configure correctly', async () => {
    await expect(whatsappIntegration.configure({ enabled: true })).resolves.not.toThrow();
  });

  it('should handle validation', async () => {
    if (typeof whatsappIntegration.validate === 'function') {
      const result = await whatsappIntegration.validate();
      expect(typeof result).toBe('boolean');
    }
  });
});
