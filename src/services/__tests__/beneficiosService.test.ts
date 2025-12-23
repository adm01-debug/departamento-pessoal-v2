import { beneficiosService } from '../beneficiosService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

describe('beneficiosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar benefícios com sucesso', async () => {
      const mockData = [{ id: '1', tipo: 'vr', valor: 500 }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await beneficiosService.listar();
      expect(result).toEqual(mockData);
    });
  });

  describe('calcularTotal', () => {
    it('deve calcular total de benefícios ativos', async () => {
      const mockData = [
        { id: '1', tipo: 'vr', valor: 500, status: 'ativo' },
        { id: '2', tipo: 'vt', valor: 300, status: 'ativo' },
        { id: '3', tipo: 'va', valor: 200, status: 'inativo' },
      ];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await beneficiosService.calcularTotal('colab-123');
      expect(result).toBe(800);
    });
  });
});
