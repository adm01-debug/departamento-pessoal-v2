import { describe, it, expect } from 'vitest';
import { calculoFerias } from '../calculoFerias';

describe('calculoFerias', () => {
  it('deve calcular férias simples (30 dias) sem abono', () => {
    const params = {
      salarioBase: 3000,
      diasFerias: 30,
      diasAbono: 0,
      dependentesIrrf: 0
    };

    const result = calculoFerias.calcular(params);

    // Salário base 3000, 30 dias = 3000
    expect(result.valorFerias).toBe(3000);
    // 1/3 de 3000 = 1000
    expect(result.tercoConstitucional).toBe(1000);
    expect(result.valorAbono).toBe(0);
    expect(result.tercoAbono).toBe(0);
    expect(result.bruto).toBe(4000);
    
    // INSS 2026 (Progressivo)
    // 1518 * 0.075 = 113.85
    // (2793.88 - 1518) * 0.09 = 1275.88 * 0.09 = 114.83
    // (4000 - 2793.88) * 0.12 = 1206.12 * 0.12 = 144.73
    // Total INSS: 113.85 + 114.83 + 144.73 = 373.41
    expect(result.inss).toBe(373.41);
    
    // IRRF — usa a base mais benéfica (desconto simplificado vs. deduções legais).
    // Base legal:        4000 - 373.41 (INSS) = 3626.59 → imposto 162.55
    // Base simplificada: 4000 - 564.80 (desconto) = 3435.20 → imposto 133.84
    // A Receita aplica a MENOR (133.84), conforme regra 2026.
    expect(result.irrf).toBe(133.84);

    // Líquido: 4000 - 373.41 - 133.84 = 3492.75
    expect(result.liquido).toBe(3492.75);
  });

  it('deve calcular férias com abono pecuniário (20 dias férias + 10 dias abono)', () => {
    const params = {
      salarioBase: 3000,
      diasFerias: 20,
      diasAbono: 10,
      dependentesIrrf: 0
    };

    const result = calculoFerias.calcular(params);

    // Valor dia: 100
    // 20 dias férias: 2000
    expect(result.valorFerias).toBe(2000);
    // 1/3 de 2000: 666.67
    expect(result.tercoConstitucional).toBe(666.67);
    // 10 dias abono: 1000
    expect(result.valorAbono).toBe(1000);
    // 1/3 abono: 333.33
    expect(result.tercoAbono).toBe(333.33);
    
    expect(result.bruto).toBe(4000);
  });

  it('deve limitar o abono pecuniário a no máximo 10 dias', () => {
    const params = {
      salarioBase: 3000,
      diasFerias: 15,
      diasAbono: 15, // Tentando 15 dias de abono
      dependentesIrrf: 0
    };

    const result = calculoFerias.calcular(params);

    // Limite é 10 dias
    // Valor dia: 100
    expect(result.valorAbono).toBe(1000); 
  });
});
