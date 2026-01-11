// V16-052: Tests for AuditoriaService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditoriaServiceReal } from '@/services/auditoriaService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('auditoriaServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return audit logs', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null })
            })
          })
        })
      } as any);
      const result = await auditoriaServiceReal.getAll({ empresa_id: 'emp-1' });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('log', () => {
    it('should create audit log', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null })
      } as any);
      await expect(auditoriaServiceReal.log({
        usuarioId: 'user-1',
        acao: 'create',
        tabela: 'colaboradores',
      })).resolves.not.toThrow();
    });
  });

  describe('getResumoAcoes', () => {
    it('should return action summary', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({ data: [{ acao: 'create' }, { acao: 'update' }], error: null })
          })
        })
      } as any);
      const result = await auditoriaServiceReal.getResumoAcoes('emp-1', 30);
      expect(typeof result).toBe('object');
    });
  });
});
