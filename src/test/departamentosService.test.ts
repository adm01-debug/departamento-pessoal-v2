import { describe, it, expect, vi, beforeEach } from 'vitest';
import { departamentosService } from '@/services/departamentosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(() => ({ data: [{ id: '1', nome: 'RH' }], error: null })) })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('departamentosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(departamentosService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(departamentosService.listar || departamentosService.getAll).toBeDefined(); });
  it('deve ter método de criar', () => { expect(departamentosService.criar || departamentosService.create).toBeDefined(); });
});
