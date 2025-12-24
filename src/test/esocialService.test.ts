import { describe, it, expect, vi, beforeEach } from 'vitest';
import { esocialService } from '@/services/esocialService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(() => ({ data: [{ id: '1', tipo_evento: 'S-2200', status: 'pendente' }], error: null })) })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('esocialService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(esocialService).toBeDefined(); });
  it('deve ter método de listar eventos', () => { expect(esocialService.listarEventos || esocialService.getAll).toBeDefined(); });
  it('deve ter método de enviar evento', () => { expect(esocialService.enviarEvento || esocialService.send).toBeDefined(); });
});
