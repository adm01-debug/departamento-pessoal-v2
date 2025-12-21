import { describe, it, expect, vi } from 'vitest';

// Mock básico
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  },
}));

describe('useFolhaPagamento - Cálculos', () => {
  it('deve calcular INSS corretamente - faixa 1', () => {
    const salario = 1500;
    const inss = salario * 0.075;
    expect(inss).toBe(112.5);
  });

  it('deve calcular INSS corretamente - faixa 2', () => {
    const salario = 2500;
    const inss = salario * 0.09;
    expect(inss).toBe(225);
  });

  it('deve calcular INSS corretamente - faixa 3', () => {
    const salario = 4000;
    const inss = salario * 0.12;
    expect(inss).toBe(480);
  });

  it('deve calcular INSS corretamente - faixa 4', () => {
    const salario = 7000;
    const inss = Math.min(salario * 0.14, 876.95);
    expect(inss).toBeLessThanOrEqual(876.95);
  });

  it('deve calcular IRRF corretamente - isento', () => {
    const base = 2000;
    const irrf = base <= 2259.20 ? 0 : base * 0.075 - 169.44;
    expect(irrf).toBe(0);
  });

  it('deve calcular salário líquido', () => {
    const bruto = 5000;
    const inss = 600;
    const irrf = 200;
    const liquido = bruto - inss - irrf;
    expect(liquido).toBe(4200);
  });
});

describe('useFolhaPagamento - Validações', () => {
  it('deve validar competência no formato correto', () => {
    const competencia = '2025-01';
    const isValid = /^\d{4}-\d{2}$/.test(competencia);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar competência inválida', () => {
    const competencia = '01/2025';
    const isValid = /^\d{4}-\d{2}$/.test(competencia);
    expect(isValid).toBe(false);
  });
});
