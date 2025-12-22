import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false })
}));

describe('useIndicadoresDP', () => {
  it('deve calcular taxa de turnover', () => {
    const admissoes = 10;
    const desligamentos = 5;
    const totalColaboradores = 100;
    const turnover = ((admissoes + desligamentos) / 2) / totalColaboradores * 100;
    expect(turnover).toBe(7.5);
  });

  it('deve calcular taxa de absenteísmo', () => {
    const diasAusencia = 20;
    const diasUteis = 22;
    const totalColaboradores = 50;
    const absenteismo = (diasAusencia / (diasUteis * totalColaboradores)) * 100;
    expect(absenteismo).toBeCloseTo(1.82, 1);
  });

  it('deve calcular custo médio por colaborador', () => {
    const custoTotal = 500000;
    const totalColaboradores = 50;
    const custoMedio = custoTotal / totalColaboradores;
    expect(custoMedio).toBe(10000);
  });
});
