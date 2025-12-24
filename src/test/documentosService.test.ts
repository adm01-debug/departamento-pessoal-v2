import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentosService } from '@/services/documentosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ data: [{ id: '1', tipo: 'RG', colaborador_id: 'c1' }], error: null })) })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    storage: { from: vi.fn(() => ({ upload: vi.fn(() => ({ data: {}, error: null })), download: vi.fn(() => ({ data: new Blob(), error: null })) })) },
  },
}));

describe('documentosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(documentosService).toBeDefined(); });
  it('deve ter método de listar por colaborador', () => { expect(documentosService.listarPorColaborador || documentosService.getByColaborador).toBeDefined(); });
  it('deve ter método de upload', () => { expect(documentosService.upload || documentosService.create).toBeDefined(); });
});
