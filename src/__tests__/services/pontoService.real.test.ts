// V16-050: Tests for PontoService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pontoServiceReal } from '@/services/pontoService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('pontoServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return ponto records', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      } as any);
      const result = await pontoServiceReal.getAll({ colaborador_id: '1' });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('registrar', () => {
    it('should register entrada', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
            })
          })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null })
          })
        })
      } as any);
      const result = await pontoServiceReal.registrar('colab-1', 'entrada');
      expect(result).toHaveProperty('id');
    });
  });
});
