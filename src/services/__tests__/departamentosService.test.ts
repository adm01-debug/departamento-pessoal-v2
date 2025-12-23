import { departamentosService } from '../departamentosService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

describe('departamentosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar departamentos com sucesso', async () => {
      const mockData = [{ id: '1', nome: 'TI', gestor_id: 'user-1' }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await departamentosService.listar();
      expect(result).toEqual(mockData);
    });

    it('deve filtrar por empresa_id', async () => {
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      (supabase.from as jest.Mock).mockReturnValue(mockFrom);

      await departamentosService.listar('empresa-123');
      expect(mockFrom.eq).toHaveBeenCalledWith('empresa_id', 'empresa-123');
    });
  });

  describe('criar', () => {
    it('deve criar departamento com sucesso', async () => {
      const mockData = { id: '1', nome: 'RH' };
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await departamentosService.criar({ nome: 'RH' });
      expect(result).toEqual(mockData);
    });
  });
});
