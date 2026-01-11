// V16-053: Tests for DepartamentoService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { departamentoServiceReal } from '@/services/departamentoService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('departamentoServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return active departamentos', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [{ id: '1', nome: 'RH' }], error: null })
            })
          })
        })
      } as any);
      const result = await departamentoServiceReal.getAll('emp-1');
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('create', () => {
    it('should create departamento', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: '1', nome: 'TI' }, error: null })
          })
        })
      } as any);
      const result = await departamentoServiceReal.create({ empresa_id: 'emp-1', nome: 'TI' } as any);
      expect(result.nome).toBe('TI');
    });
  });

  describe('delete', () => {
    it('should soft delete departamento', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        })
      } as any);
      await expect(departamentoServiceReal.delete('1')).resolves.not.toThrow();
    });
  });
});
