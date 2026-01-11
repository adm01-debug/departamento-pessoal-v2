// V16-051: Tests for EmpresaService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { empresaServiceReal } from '@/services/empresaService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('empresaServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return empresas list', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      } as any);
      const result = await empresaServiceReal.getAll({});
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getByCnpj', () => {
    it('should find empresa by CNPJ', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: '1', cnpj: '12345678000190' }, error: null })
          })
        })
      } as any);
      const result = await empresaServiceReal.getByCnpj('12.345.678/0001-90');
      expect(result?.cnpj).toBe('12345678000190');
    });

    it('should return null for invalid CNPJ', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
          })
        })
      } as any);
      const result = await empresaServiceReal.getByCnpj('00000000000000');
      expect(result).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return empresa statistics', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ count: 10, error: null })
        })
      } as any);
      const result = await empresaServiceReal.getStats('emp-1');
      expect(result).toHaveProperty('total_colaboradores');
      expect(result).toHaveProperty('total_departamentos');
    });
  });
});
