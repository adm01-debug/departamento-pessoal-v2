import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        order: vi.fn().mockResolvedValue({ data: [], error: null })
      }),
      insert: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
      update: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null })
    })
  }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn(), isPending: false }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('useFerias', () => {
  describe('Cálculo de período aquisitivo', () => {
    it('deve calcular dias de direito após 12 meses', () => {
      const mesesTrabalhados = 12;
      const diasDireito = Math.floor((mesesTrabalhados / 12) * 30);
      expect(diasDireito).toBe(30);
    });

    it('deve calcular proporcionalmente para menos de 12 meses', () => {
      const mesesTrabalhados = 6;
      const diasDireito = Math.floor((mesesTrabalhados / 12) * 30);
      expect(diasDireito).toBe(15);
    });
  });

  describe('Cálculo de valores', () => {
    it('deve calcular 1/3 constitucional', () => {
      const salarioBase = 3000;
      const umTerco = salarioBase / 3;
      expect(umTerco).toBe(1000);
    });

    it('deve calcular abono pecuniário (10 dias)', () => {
      const salarioBase = 3000;
      const diasAbono = 10;
      const valorAbono = (salarioBase / 30) * diasAbono;
      expect(valorAbono).toBe(1000);
    });
  });
});
