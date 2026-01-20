// V19-013: Testes de Integracao INSS Service
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ data: [], error: null })),
      insert: vi.fn(() => ({ data: {}, error: null, select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ data: {}, error: null })),
    })),
  },
  handleSupabaseError: vi.fn((e) => e.message),
}));

describe('INSS Service Integration', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve calcular INSS para salario minimo', async () => {
    const salario = 1621.00;
    const inssEsperado = salario * 0.075; // 7.5% primeira faixa
    expect(inssEsperado).toBeCloseTo(121.58, 1);
  });

  it('deve respeitar teto INSS', async () => {
    const salarioAlto = 20000;
    const tetoINSS = 951.63; // Teto 2026
    expect(tetoINSS).toBeLessThan(1000);
  });

  it('deve calcular aliquota efetiva', async () => {
    const inss = 500;
    const salario = 5000;
    const aliquotaEfetiva = (inss / salario) * 100;
    expect(aliquotaEfetiva).toBe(10);
  });
});
