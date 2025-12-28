import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seguroVidaService } from '@/services/seguroVidaService';

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

describe('seguroVidaService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should getAll', async () => {
    const result = await seguroVidaService.getAll();
    expect(result).toBeDefined();
  });

  it('should getById', async () => {
    const result = await seguroVidaService.getById('1');
    expect(result).toBeDefined();
  });

  it('should create', async () => {
    const result = await seguroVidaService.create({});
    expect(result).toBeDefined();
  });

  it('should update', async () => {
    const result = await seguroVidaService.update('1', {});
    expect(result).toBeDefined();
  });

  it('should delete', async () => {
    await expect(seguroVidaService.delete('1')).resolves.not.toThrow();
  });
});
