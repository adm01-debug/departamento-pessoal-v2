// V16-020: Tests for ColaboradorService
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { colaboradorServiceReal } from '@/services/colaboradorService.real';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          single: vi.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
        })),
        or: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1', nome: 'Test' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: '1', nome: 'Updated' }, error: null })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
  handleSupabaseError: vi.fn((e) => e?.message || 'Error'),
}));

describe('colaboradorServiceReal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('getAll', () => {
    it('should return colaboradores list', async () => {
      const result = await colaboradorServiceReal.getAll({ empresa_id: 'emp-1' });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter by status', async () => {
      await colaboradorServiceReal.getAll({ status: 'ativo' });
      expect(supabase.from).toHaveBeenCalledWith('colaboradores');
    });
  });

  describe('getById', () => {
    it('should return null when not found', async () => {
      const result = await colaboradorServiceReal.getById('invalid-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a colaborador', async () => {
      const newColab = { nome: 'Test', cpf: '12345678901', empresa_id: 'emp-1', data_nascimento: '1990-01-01', data_admissao: '2024-01-01', salario: 5000, tipo_contrato: 'clt' };
      const result = await colaboradorServiceReal.create(newColab as any);
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update a colaborador', async () => {
      const result = await colaboradorServiceReal.update('1', { nome: 'Updated' });
      expect(result.nome).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('should delete a colaborador', async () => {
      await expect(colaboradorServiceReal.delete('1')).resolves.not.toThrow();
    });
  });
});
