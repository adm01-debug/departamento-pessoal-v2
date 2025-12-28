import { describe, it, expect, vi, beforeEach } from 'vitest';
import { faceRecognitionIntegration } from '@/integrations/faceRecognition';

describe('faceRecognitionIntegration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be defined', () => {
    expect(faceRecognitionIntegration).toBeDefined();
  });

  it('should have send/process method', () => {
    expect(typeof faceRecognitionIntegration.send === 'function' || typeof faceRecognitionIntegration.process === 'function').toBe(true);
  });

  it('should have configure method', () => {
    expect(typeof faceRecognitionIntegration.configure).toBe('function');
  });

  it('should configure correctly', async () => {
    await expect(faceRecognitionIntegration.configure({ enabled: true })).resolves.not.toThrow();
  });

  it('should handle validation', async () => {
    if (typeof faceRecognitionIntegration.validate === 'function') {
      const result = await faceRecognitionIntegration.validate();
      expect(typeof result).toBe('boolean');
    }
  });
});
