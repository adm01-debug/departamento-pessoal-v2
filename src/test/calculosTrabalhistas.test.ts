import { describe, it, expect } from 'vitest';

// Funções simuladas (importar das reais quando disponíveis)
const calcularINSS = (salario: number): number => {
  if (salario <= 1412.00) return salario * 0.075;
  if (salario <= 2666.68) return 105.90 + (salario - 1412.00) * 0.09;
  if (salario <= 4000.03) return 218.71 + (salario - 2666.68) * 0.12;
  if (salario <= 7786.02) return 378.72 + (salario - 4000.03) * 0.14;
  return 908.85;
};

const calcularIRRF = (baseCalculo: number, dependentes: number = 0): number => {
  const deducaoPorDependente = 189.59;
  const base = baseCalculo - (dependentes * deducaoPorDependente);
  
  if (base <= 2259.20) return 0;
  if (base <= 2826.65) return (base * 0.075) - 169.44;
  if (base <= 3751.05) return (base * 0.15) - 381.44;
  if (base <= 4664.68) return (base * 0.225) - 662.77;
  return (base * 0.275) - 896.00;
};

describe('Cálculos Trabalhistas 2025', () => {
  describe('INSS', () => {
    it('deve calcular INSS para salário mínimo', () => {
      const inss = calcularINSS(1412.00);
      expect(inss).toBeCloseTo(105.90, 2);
    });

    it('deve calcular INSS para segunda faixa', () => {
      const inss = calcularINSS(2000);
      expect(inss).toBeCloseTo(158.82, 2);
    });

    it('deve aplicar teto do INSS', () => {
      const inss = calcularINSS(10000);
      expect(inss).toBeCloseTo(908.85, 2);
    });

    it('deve calcular INSS progressivo corretamente', () => {
      const inss = calcularINSS(5000);
      expect(inss).toBeGreaterThan(0);
      expect(inss).toBeLessThan(908.85);
    });
  });

  describe('IRRF', () => {
    it('deve retornar 0 para base abaixo da faixa de isenção', () => {
      const irrf = calcularIRRF(2000);
      expect(irrf).toBe(0);
    });

    it('deve calcular IRRF para segunda faixa (7.5%)', () => {
      const irrf = calcularIRRF(2500);
      expect(irrf).toBeGreaterThan(0);
    });

    it('deve deduzir dependentes', () => {
      const irrfSemDep = calcularIRRF(5000, 0);
      const irrfComDep = calcularIRRF(5000, 2);
      expect(irrfComDep).toBeLessThan(irrfSemDep);
    });

    it('deve calcular corretamente para salário alto', () => {
      const irrf = calcularIRRF(10000);
      expect(irrf).toBeGreaterThan(0);
    });
  });
});

describe('Cálculo de Férias', () => {
  const calcularFerias = (salario: number, diasGozo: number, diasAbono: number = 0) => {
    const valorDiario = salario / 30;
    const feriasBase = valorDiario * diasGozo;
    const tercoConstitucional = feriasBase / 3;
    const abono = valorDiario * diasAbono;
    const tercoAbono = abono / 3;
    
    return {
      feriasBase,
      tercoConstitucional,
      abono,
      tercoAbono,
      total: feriasBase + tercoConstitucional + abono + tercoAbono,
    };
  };

  it('deve calcular férias de 30 dias corretamente', () => {
    const result = calcularFerias(3000, 30);
    expect(result.feriasBase).toBe(3000);
    expect(result.tercoConstitucional).toBe(1000);
    expect(result.total).toBe(4000);
  });

  it('deve calcular férias parciais', () => {
    const result = calcularFerias(3000, 15);
    expect(result.feriasBase).toBe(1500);
    expect(result.tercoConstitucional).toBe(500);
  });

  it('deve calcular abono pecuniário', () => {
    const result = calcularFerias(3000, 20, 10);
    expect(result.abono).toBe(1000);
    expect(result.tercoAbono).toBeCloseTo(333.33, 2);
  });
});

describe('Cálculo de 13º Salário', () => {
  const calcular13Proporcional = (salario: number, mesesTrabalhados: number) => {
    return (salario / 12) * mesesTrabalhados;
  };

  it('deve calcular 13º integral', () => {
    const valor = calcular13Proporcional(3000, 12);
    expect(valor).toBe(3000);
  });

  it('deve calcular 13º proporcional', () => {
    const valor = calcular13Proporcional(3000, 6);
    expect(valor).toBe(1500);
  });

  it('deve calcular para 1 mês trabalhado', () => {
    const valor = calcular13Proporcional(3000, 1);
    expect(valor).toBe(250);
  });
});
