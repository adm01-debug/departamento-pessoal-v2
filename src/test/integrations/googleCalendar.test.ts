import { describe, it, expect, vi, beforeEach } from 'vitest';
import { googleCalendarIntegration } from '@/integrations/googleCalendar';

describe('googleCalendarIntegration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be defined', () => {
    expect(googleCalendarIntegration).toBeDefined();
  });

  it('should have send/process method', () => {
    expect(typeof googleCalendarIntegration.send === 'function' || typeof googleCalendarIntegration.process === 'function').toBe(true);
  });

  it('should have configure method', () => {
    expect(typeof googleCalendarIntegration.configure).toBe('function');
  });

  it('should configure correctly', async () => {
    await expect(googleCalendarIntegration.configure({ enabled: true })).resolves.not.toThrow();
  });

  it('should handle validation', async () => {
    if (typeof googleCalendarIntegration.validate === 'function') {
      const result = await googleCalendarIntegration.validate();
      expect(typeof result).toBe('boolean');
    }
  });
});
