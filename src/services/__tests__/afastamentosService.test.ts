import { afastamentosService } from '../afastamentosService';
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

describe('afastamentosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar afastamentos com sucesso', async () => {
      const mockData = [{ id: '1', tipo: 'doenca', status: 'ativo' }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await afastamentosService.listar();
      expect(result).toEqual(mockData);
    });

    it('deve filtrar por colaborador_id', async () => {
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      (supabase.from as jest.Mock).mockReturnValue(mockFrom);

      await afastamentosService.listar('colab-123');
      expect(mockFrom.eq).toHaveBeenCalledWith('colaborador_id', 'colab-123');
    });

    it('deve lançar erro quando falhar', async () => {
      const mockError = new Error('Database error');
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      });

      await expect(afastamentosService.listar()).rejects.toThrow();
    });
  });

  describe('criar', () => {
    it('deve criar afastamento com sucesso', async () => {
      const mockData = { id: '1', tipo: 'doenca', status: 'ativo' };
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await afastamentosService.criar({
        colaborador_id: 'colab-123',
        tipo: 'doenca',
        data_inicio: '2024-01-01',
        status: 'ativo',
      });
      expect(result).toEqual(mockData);
    });
  });
});
