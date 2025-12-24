import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificacoesService } from '@/services/notificacoesService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ order: vi.fn(() => ({ eq: vi.fn(() => ({ data: [{ id: '1', titulo: 'Alerta', lida: false }], error: null })) })) })),
      insert: vi.fn(() => ({ data: null, error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('notificacoesService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(notificacoesService).toBeDefined(); });
  it('deve ter método de listar', () => { expect(notificacoesService.listar || notificacoesService.getAll).toBeDefined(); });
  it('deve ter método de marcar como lida', () => { expect(notificacoesService.marcarComoLida || notificacoesService.markAsRead).toBeDefined(); });
  it('deve ter método de enviar', () => { expect(notificacoesService.enviar || notificacoesService.send).toBeDefined(); });
});
