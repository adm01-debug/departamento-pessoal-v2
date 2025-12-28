import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promocaoService } from '@/services/promocaoService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
  },
}));

describe('promocaoService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should getAll', async () => {
    const result = await promocaoService.getAll();
    expect(result).toBeDefined();
  });

  it('should getById', async () => {
    const result = await promocaoService.getById('1');
    expect(result).toBeDefined();
  });

  it('should create', async () => {
    const result = await promocaoService.create({});
    expect(result).toBeDefined();
  });

  it('should update', async () => {
    const result = await promocaoService.update('1', {});
    expect(result).toBeDefined();
  });

  it('should delete', async () => {
    await expect(promocaoService.delete('1')).resolves.not.toThrow();
  });
});
