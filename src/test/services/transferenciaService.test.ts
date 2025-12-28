import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transferenciaService } from '@/services/transferenciaService';

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

describe('transferenciaService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should getAll', async () => {
    const result = await transferenciaService.getAll();
    expect(result).toBeDefined();
  });

  it('should getById', async () => {
    const result = await transferenciaService.getById('1');
    expect(result).toBeDefined();
  });

  it('should create', async () => {
    const result = await transferenciaService.create({});
    expect(result).toBeDefined();
  });

  it('should update', async () => {
    const result = await transferenciaService.update('1', {});
    expect(result).toBeDefined();
  });

  it('should delete', async () => {
    await expect(transferenciaService.delete('1')).resolves.not.toThrow();
  });
});
