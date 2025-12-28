import { describe, it, expect, vi, beforeEach } from 'vitest';
import { valeAlimentacaoService } from '@/services/valeAlimentacaoService';

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

describe('valeAlimentacaoService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should getAll', async () => {
    const result = await valeAlimentacaoService.getAll();
    expect(result).toBeDefined();
  });

  it('should getById', async () => {
    const result = await valeAlimentacaoService.getById('1');
    expect(result).toBeDefined();
  });

  it('should create', async () => {
    const result = await valeAlimentacaoService.create({});
    expect(result).toBeDefined();
  });

  it('should update', async () => {
    const result = await valeAlimentacaoService.update('1', {});
    expect(result).toBeDefined();
  });

  it('should delete', async () => {
    await expect(valeAlimentacaoService.delete('1')).resolves.not.toThrow();
  });
});
