import { describe, it, expect, vi, beforeEach } from 'vitest';
import { microsoftTeamsIntegration } from '@/integrations/microsoftTeams';

describe('microsoftTeamsIntegration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should be defined', () => {
    expect(microsoftTeamsIntegration).toBeDefined();
  });

  it('should have send/process method', () => {
    expect(typeof microsoftTeamsIntegration.send === 'function' || typeof microsoftTeamsIntegration.process === 'function').toBe(true);
  });

  it('should have configure method', () => {
    expect(typeof microsoftTeamsIntegration.configure).toBe('function');
  });

  it('should configure correctly', async () => {
    await expect(microsoftTeamsIntegration.configure({ enabled: true })).resolves.not.toThrow();
  });

  it('should handle validation', async () => {
    if (typeof microsoftTeamsIntegration.validate === 'function') {
      const result = await microsoftTeamsIntegration.validate();
      expect(typeof result).toBe('boolean');
    }
  });
});
