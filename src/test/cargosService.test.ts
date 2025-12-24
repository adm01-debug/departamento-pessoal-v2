import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cargosService } from '@/services/cargosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [{ id: '1', nome: 'Analista', cbo: '2521-05' }], error: null })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('cargosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(cargosService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(cargosService.listar || cargosService.getAll).toBeDefined(); });
  it('deve ter método de criar', () => { expect(cargosService.criar || cargosService.create).toBeDefined(); });
  it('deve ter método de atualizar', () => { expect(cargosService.atualizar || cargosService.update).toBeDefined(); });
});
