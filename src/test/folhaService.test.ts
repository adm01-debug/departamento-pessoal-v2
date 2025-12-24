import { describe, it, expect, vi, beforeEach } from 'vitest';
import { folhaService } from '@/services/folhaService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({ data: [{ id: '1', competencia: '2024-01', total_bruto: 5000 }], error: null })),
        eq: vi.fn(() => ({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('folhaService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(folhaService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(folhaService.listar || folhaService.getAll).toBeDefined(); });
  it('deve ter método de calcular', () => { expect(folhaService.calcular || folhaService.calculate).toBeDefined(); });
  it('deve ter método de fechar', () => { expect(folhaService.fechar || folhaService.close).toBeDefined(); });
});
