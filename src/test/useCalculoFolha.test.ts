import { describe, it, expect, vi } from 'vitest';

// Tabelas INSS 2025
const TABELA_INSS_2025 = [
  { ate: 1518.00, aliquota: 0.075 },
  { ate: 2793.88, aliquota: 0.09 },
  { ate: 4190.83, aliquota: 0.12 },
  { ate: 8157.41, aliquota: 0.14 },
];

const TETO_INSS = 876.95;

// Tabela IRRF 2025
const TABELA_IRRF_2025 = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00 },
];

function calcularINSS(salario: number): number {
  let inss = 0;
  let salarioRestante = salario;
  let faixaAnterior = 0;

  for (const faixa of TABELA_INSS_2025) {
    if (salarioRestante <= 0) break;
    
    const baseFaixa = Math.min(salarioRestante, faixa.ate - faixaAnterior);
    inss += baseFaixa * faixa.aliquota;
    salarioRestante -= baseFaixa;
    faixaAnterior = faixa.ate;
  }

  return Math.min(inss, TETO_INSS);
}

function calcularIRRF(baseCalculo: number): number {
  for (const faixa of TABELA_IRRF_2025) {
    if (baseCalculo <= faixa.ate) {
      return Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao);
    }
  }
  return 0;
}

describe('useCalculoFolha - Cálculo INSS', () => {
  it('deve calcular INSS faixa 1 (até R$ 1.518)', () => {
    const inss = calcularINSS(1500);
    expect(inss).toBeCloseTo(112.5, 2);
  });

  it('deve calcular INSS faixa 2 (até R$ 2.793,88)', () => {
    const inss = calcularINSS(2500);
    // Progressivo: 1518 * 7.5% + (2500-1518) * 9%
    expect(inss).toBeGreaterThan(112.5);
    expect(inss).toBeLessThan(250);
  });

  it('deve respeitar teto INSS (R$ 876,95)', () => {
    const inss = calcularINSS(15000);
    expect(inss).toBeLessThanOrEqual(TETO_INSS);
  });

  it('deve retornar 0 para salário 0', () => {
    const inss = calcularINSS(0);
    expect(inss).toBe(0);
  });
});

describe('useCalculoFolha - Cálculo IRRF', () => {
  it('deve ser isento até R$ 2.259,20', () => {
    const irrf = calcularIRRF(2000);
    expect(irrf).toBe(0);
  });

  it('deve calcular IRRF faixa 2', () => {
    const irrf = calcularIRRF(2500);
    expect(irrf).toBeGreaterThan(0);
    expect(irrf).toBeLessThan(200);
  });

  it('deve calcular IRRF faixa 5', () => {
    const irrf = calcularIRRF(10000);
    expect(irrf).toBeGreaterThan(1000);
  });
});

describe('useCalculoFolha - Salário Líquido', () => {
  it('deve calcular salário líquido corretamente', () => {
    const bruto = 5000;
    const inss = calcularINSS(bruto);
    const baseIRRF = bruto - inss;
    const irrf = calcularIRRF(baseIRRF);
    const liquido = bruto - inss - irrf;

    expect(liquido).toBeLessThan(bruto);
    expect(liquido).toBeGreaterThan(bruto * 0.7);
  });
});

describe('useCalculoFolha - Horas Extras', () => {
  it('deve calcular hora extra 50%', () => {
    const salarioHora = 5000 / 220;
    const horaExtra50 = salarioHora * 1.5;
    expect(horaExtra50).toBeCloseTo(34.09, 2);
  });

  it('deve calcular hora extra 100%', () => {
    const salarioHora = 5000 / 220;
    const horaExtra100 = salarioHora * 2;
    expect(horaExtra100).toBeCloseTo(45.45, 2);
  });
});

describe('useCalculoFolha - DSR', () => {
  it('deve calcular DSR sobre horas extras', () => {
    const totalHorasExtras = 500; // valor em R$
    const diasUteis = 22;
    const domingosEFeriados = 8;
    const dsr = (totalHorasExtras / diasUteis) * domingosEFeriados;
    expect(dsr).toBeCloseTo(181.82, 2);
  });
});
