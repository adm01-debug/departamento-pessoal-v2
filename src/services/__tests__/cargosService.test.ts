import { cargosService } from '../cargosService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

describe('cargosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar cargos com sucesso', async () => {
      const mockData = [{ id: '1', nome: 'Desenvolvedor', cbo: '2124-05' }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await cargosService.listar();
      expect(result).toEqual(mockData);
    });
  });

  describe('criar', () => {
    it('deve criar cargo com sucesso', async () => {
      const mockData = { id: '1', nome: 'Analista', cbo: '2521-05' };
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await cargosService.criar({ nome: 'Analista', cbo: '2521-05' });
      expect(result).toEqual(mockData);
    });
  });

  describe('excluir', () => {
    it('deve excluir cargo com sucesso', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      await expect(cargosService.excluir('1')).resolves.not.toThrow();
    });
  });
});
