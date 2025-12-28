import { describe, it, expect, vi, beforeEach } from 'vitest';
import { acordoTrabalhistaService } from '@/services/acordoTrabalhistaService';

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

describe('acordoTrabalhistaService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should getAll', async () => {
    const result = await acordoTrabalhistaService.getAll();
    expect(result).toBeDefined();
  });

  it('should getById', async () => {
    const result = await acordoTrabalhistaService.getById('1');
    expect(result).toBeDefined();
  });

  it('should create', async () => {
    const result = await acordoTrabalhistaService.create({});
    expect(result).toBeDefined();
  });

  it('should update', async () => {
    const result = await acordoTrabalhistaService.update('1', {});
    expect(result).toBeDefined();
  });

  it('should delete', async () => {
    await expect(acordoTrabalhistaService.delete('1')).resolves.not.toThrow();
  });
});
