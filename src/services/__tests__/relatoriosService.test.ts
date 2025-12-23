import { relatoriosService } from '../relatoriosService';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          single: jest.fn(() => Promise.resolve({ data: { id: '1' }, error: null }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { id: '1' }, error: null }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

describe('relatoriosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('should return relatorios list', async () => {
      const result = await relatoriosService.listar('empresa-1');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('obter', () => {
    it('should return relatorio by id', async () => {
      const result = await relatoriosService.obter('rel-1');
      expect(result).toBeDefined();
    });
  });

  describe('excluir', () => {
    it('should delete relatorio', async () => {
      await expect(relatoriosService.excluir('rel-1')).resolves.not.toThrow();
    });
  });
});
