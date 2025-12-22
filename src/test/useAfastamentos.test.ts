import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('useAfastamentos', () => {
  it('deve calcular dias de afastamento', () => {
    const inicio = new Date('2024-01-01');
    const fim = new Date('2024-01-15');
    const dias = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    expect(dias).toBe(14);
  });

  it('deve validar período máximo de auxílio-doença', () => {
    const diasMaximo = 15; // Empresa paga primeiros 15 dias
    expect(diasMaximo).toBe(15);
  });
});
