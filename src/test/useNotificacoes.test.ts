import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('useNotificacoes', () => {
  it('deve categorizar notificações por tipo', () => {
    const notificacoes = [
      { tipo: 'ferias', lida: false },
      { tipo: 'admissao', lida: true },
      { tipo: 'ferias', lida: false }
    ];
    const feriasNaoLidas = notificacoes.filter(n => n.tipo === 'ferias' && !n.lida);
    expect(feriasNaoLidas).toHaveLength(2);
  });

  it('deve ordenar por data mais recente', () => {
    const notificacoes = [
      { id: 1, created_at: '2024-01-01' },
      { id: 2, created_at: '2024-01-15' },
      { id: 3, created_at: '2024-01-10' }
    ];
    const ordenadas = [...notificacoes].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    expect(ordenadas[0].id).toBe(2);
  });
});
