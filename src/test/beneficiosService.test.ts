import { describe, it, expect, vi, beforeEach } from 'vitest';
import { beneficiosService } from '@/services/beneficiosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [{ id: '1', nome: 'VT', valor: 200 }], error: null })),
        eq: vi.fn(() => ({ data: [{ id: '1', nome: 'VT' }], error: null })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('beneficiosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve estar definido', () => { expect(beneficiosService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(beneficiosService.listar || beneficiosService.getAll).toBeDefined(); });
  it('deve ter método de criar', () => { expect(beneficiosService.criar || beneficiosService.create).toBeDefined(); });
  it('deve ter método de atualizar', () => { expect(beneficiosService.atualizar || beneficiosService.update).toBeDefined(); });
  it('deve ter método de excluir', () => { expect(beneficiosService.excluir || beneficiosService.delete).toBeDefined(); });
});
