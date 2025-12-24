import { describe, it, expect, vi, beforeEach } from 'vitest';
import { feriadosService } from '@/services/feriadosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(() => ({ data: [{ id: '1', nome: 'Natal', data: '2024-12-25' }], error: null })) })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('feriadosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(feriadosService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(feriadosService.listar || feriadosService.getAll).toBeDefined(); });
  it('deve ter método de criar', () => { expect(feriadosService.criar || feriadosService.create).toBeDefined(); });
});
