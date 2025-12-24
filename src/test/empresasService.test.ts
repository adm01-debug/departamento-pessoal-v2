import { describe, it, expect, vi, beforeEach } from 'vitest';
import { empresasService } from '@/services/empresasService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(() => ({ data: [{ id: '1', razao_social: 'Empresa X', cnpj: '12345678000199' }], error: null })) })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('empresasService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(empresasService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(empresasService.listar || empresasService.getAll).toBeDefined(); });
  it('deve ter método de criar', () => { expect(empresasService.criar || empresasService.create).toBeDefined(); });
});
