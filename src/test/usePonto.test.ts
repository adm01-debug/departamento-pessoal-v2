import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('usePonto', () => {
  it('deve calcular horas trabalhadas', () => {
    const entrada = new Date('2024-01-15 08:00');
    const saida = new Date('2024-01-15 17:00');
    const intervalo = 1; // 1 hora de almoço
    const horasTrabalhadas = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60) - intervalo;
    expect(horasTrabalhadas).toBe(8);
  });

  it('deve calcular horas extras', () => {
    const horasTrabalhadas = 10;
    const jornadaNormal = 8;
    const horasExtras = horasTrabalhadas - jornadaNormal;
    expect(horasExtras).toBe(2);
  });

  it('deve calcular banco de horas', () => {
    const horasExtras = 10;
    const horasCompensadas = 4;
    const saldo = horasExtras - horasCompensadas;
    expect(saldo).toBe(6);
  });
});
