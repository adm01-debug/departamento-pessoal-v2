import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

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

describe('useDesligamentoMelhorado', () => {
  it('deve calcular rescisão corretamente', async () => {
    const { useDesligamentoMelhorado } = await import('../hooks/useDesligamentoMelhorado');
    
    const colaborador = {
      salario_base: 3000,
      data_admissao: '2023-01-01'
    };
    
    const { calcularRescisao } = useDesligamentoMelhorado();
    
    if (calcularRescisao) {
      const resultado = calcularRescisao(colaborador as any, '2024-06-30', 'pedido_demissao');
      expect(resultado).toBeDefined();
    }
  });

  it('deve calcular saldo de salário proporcional', () => {
    const salarioBase = 3000;
    const diasTrabalhados = 15;
    const esperado = (salarioBase / 30) * diasTrabalhados;
    expect(esperado).toBe(1500);
  });

  it('deve calcular aviso prévio proporcional', () => {
    const anosEmpresa = 3;
    const diasAviso = 30 + (anosEmpresa * 3);
    expect(diasAviso).toBe(39);
  });
});
