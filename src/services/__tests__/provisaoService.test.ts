import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provisaoService } from '../provisaoService';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe('provisaoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('should call select with colaborador join', async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

      await provisaoService.list();
      expect(mockSelect).toHaveBeenCalledWith('*, colaborador:colaboradores(nome_completo, salario_base)');
    });

    it('should filter by empresa_id when provided', async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

      await provisaoService.list('empresa-123');
      expect(mockEq).toHaveBeenCalledWith('empresa_id', 'empresa-123');
    });

    it('should throw error if supabase fails', async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') });
      const mockOrder = vi.fn().mockReturnValue({ eq: mockEq });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

      // The service throws error if error exists
      await expect(provisaoService.list()).rejects.toThrow('DB Error');
    });
  });

  describe('calcular', () => {
    it('should invoke the correct edge function with parameters', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({ data: { success: true }, error: null } as any);
      const result = await provisaoService.calcular('empresa-123', '2026-05');
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('calcular-provisoes', {
        body: { empresa_id: 'empresa-123', competencia: '2026-05' }
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw error if function invocation fails', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({ data: null, error: new Error('Function Error') } as any);
      await expect(provisaoService.calcular('123', '2026-05')).rejects.toThrow('Function Error');
    });
  });
});
