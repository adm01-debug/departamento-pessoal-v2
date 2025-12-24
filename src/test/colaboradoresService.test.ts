import { describe, it, expect, vi, beforeEach } from 'vitest';
import { colaboradoresService } from '@/services/colaboradoresService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [{ id: '1', nome: 'João Silva', cpf: '12345678901' }], error: null })),
        eq: vi.fn(() => ({ single: vi.fn(() => ({ data: { id: '1' }, error: null })) })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('colaboradoresService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(colaboradoresService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(colaboradoresService.listar || colaboradoresService.getAll).toBeDefined(); });
  it('deve ter método de buscar por id', () => { expect(colaboradoresService.buscarPorId || colaboradoresService.getById).toBeDefined(); });
  it('deve ter método de criar', () => { expect(colaboradoresService.criar || colaboradoresService.create).toBeDefined(); });
  it('deve ter método de atualizar', () => { expect(colaboradoresService.atualizar || colaboradoresService.update).toBeDefined(); });
});
