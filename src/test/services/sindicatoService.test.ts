import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sindicatoService } from '@/services/sindicatoService';

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

describe('sindicatoService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should getAll', async () => {
    const result = await sindicatoService.getAll();
    expect(result).toBeDefined();
  });

  it('should getById', async () => {
    const result = await sindicatoService.getById('1');
    expect(result).toBeDefined();
  });

  it('should create', async () => {
    const result = await sindicatoService.create({});
    expect(result).toBeDefined();
  });

  it('should update', async () => {
    const result = await sindicatoService.update('1', {});
    expect(result).toBeDefined();
  });

  it('should delete', async () => {
    await expect(sindicatoService.delete('1')).resolves.not.toThrow();
  });
});
