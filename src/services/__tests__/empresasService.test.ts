import { empresasService } from '../empresasService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

describe('empresasService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar empresas com sucesso', async () => {
      const mockData = [{ id: '1', razao_social: 'Empresa A', cnpj: '12345678000199' }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await empresasService.listar();
      expect(result).toEqual(mockData);
    });

    it('deve filtrar por status ativa', async () => {
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
      (supabase.from as jest.Mock).mockReturnValue(mockFrom);

      await empresasService.listar({ ativa: true });
      expect(mockFrom.eq).toHaveBeenCalledWith('ativa', true);
    });
  });

  describe('ativar/desativar', () => {
    it('deve ativar empresa', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      await expect(empresasService.ativar('1')).resolves.not.toThrow();
    });

    it('deve desativar empresa', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });

      await expect(empresasService.desativar('1')).resolves.not.toThrow();
    });
  });
});
