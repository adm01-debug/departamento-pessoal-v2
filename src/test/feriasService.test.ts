import { describe, it, expect, vi, beforeEach } from 'vitest';
import { feriasService } from '@/services/feriasService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [{ id: '1', colaborador_id: 'c1', data_inicio: '2024-07-01', dias: 30 }], error: null })),
        eq: vi.fn(() => ({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('feriasService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(feriasService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(feriasService.listar || feriasService.getAll).toBeDefined(); });
  it('deve ter método de solicitar', () => { expect(feriasService.solicitar || feriasService.create).toBeDefined(); });
  it('deve ter método de aprovar', () => { expect(feriasService.aprovar || feriasService.approve).toBeDefined(); });
});
