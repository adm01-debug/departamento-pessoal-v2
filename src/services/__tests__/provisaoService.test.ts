import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provisaoService } from '../provisaoService';

// Mock supabase
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockInvoke = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
    })),
    functions: {
      invoke: mockInvoke,
    },
  },
}));

describe('provisaoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ eq: mockEq }); // Allow multiple eq calls
  });

  describe('list', () => {
    it('should call select with colaborador join', async () => {
      mockEq.mockResolvedValue({ data: [], error: null });
      await provisaoService.list();
      expect(mockSelect).toHaveBeenCalledWith('*, colaborador:colaboradores(nome_completo, salario_base)');
    });

    it('should filter by empresa_id when provided', async () => {
      mockEq.mockResolvedValue({ data: [], error: null });
      await provisaoService.list('empresa-123');
      expect(mockEq).toHaveBeenCalledWith('empresa_id', 'empresa-123');
    });

    it('should filter by competencia when provided', async () => {
      mockEq.mockResolvedValue({ data: [], error: null });
      await provisaoService.list(undefined, '2026-05');
      expect(mockEq).toHaveBeenCalledWith('competencia', '2026-05');
    });

    it('should throw error if supabase fails', async () => {
      mockEq.mockResolvedValue({ data: null, error: new Error('DB Error') });
      await expect(provisaoService.list()).rejects.toThrow('DB Error');
    });
  });

  describe('calcular', () => {
    it('should invoke the correct edge function with parameters', async () => {
      mockInvoke.mockResolvedValue({ data: { success: true }, error: null });
      const result = await provisaoService.calcular('empresa-123', '2026-05');
      
      expect(mockInvoke).toHaveBeenCalledWith('calcular-provisoes', {
        body: { empresa_id: 'empresa-123', competencia: '2026-05' }
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw error if function invocation fails', async () => {
      mockInvoke.mockResolvedValue({ data: null, error: new Error('Function Error') });
      await expect(provisaoService.calcular('123', '2026-05')).rejects.toThrow('Function Error');
    });
  });
});
