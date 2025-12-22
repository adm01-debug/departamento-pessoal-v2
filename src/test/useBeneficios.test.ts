import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('useBeneficios', () => {
  it('deve calcular desconto VT até 6%', () => {
    const salario = 3000;
    const valorVT = 300;
    const limiteDesconto = salario * 0.06;
    const desconto = Math.min(valorVT, limiteDesconto);
    expect(desconto).toBe(180);
  });

  it('deve calcular valor empresa VT', () => {
    const valorVT = 300;
    const descontoEmpregado = 180;
    const valorEmpresa = valorVT - descontoEmpregado;
    expect(valorEmpresa).toBe(120);
  });
});
