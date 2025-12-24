import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditoriaService } from '@/services/auditoriaService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            { id: '1', acao: 'CREATE', tabela: 'colaboradores', usuario_id: 'u1', created_at: '2024-01-01' },
            { id: '2', acao: 'UPDATE', tabela: 'ferias', usuario_id: 'u2', created_at: '2024-01-02' },
          ],
          error: null,
        })),
        eq: vi.fn(() => ({
          data: [{ id: '1', acao: 'CREATE', tabela: 'colaboradores' }],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
    })),
  },
}));

describe('auditoriaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(auditoriaService).toBeDefined();
  });

  it('deve ter método de listar logs', () => {
    expect(auditoriaService.listar || auditoriaService.getAll || auditoriaService.getLogs).toBeDefined();
  });

  it('deve ter método de registrar log', () => {
    expect(auditoriaService.registrar || auditoriaService.create || auditoriaService.log).toBeDefined();
  });

  it('deve ter método de filtrar por tabela', () => {
    expect(auditoriaService.filtrarPorTabela || auditoriaService.getByTable).toBeDefined();
  });
});
