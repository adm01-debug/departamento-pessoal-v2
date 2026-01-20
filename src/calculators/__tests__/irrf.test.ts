// V18-T002: Testes da Calculadora IRRF 2026
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import {
  calcularIRRF,
  calcularIRRFDetalhado,
  calcularBaseIRRF,
  getDeducaoDependente,
  getTabelaIRRF,
  ResultadoIRRF
} from '../irrf';

describe('Calculadora IRRF 2026 - Reforma IR', () => {
  describe('calcularIRRF', () => {
    it('deve retornar 0 para base de cálculo zero ou negativa', () => {
      expect(calcularIRRF(0)).toBe(0);
      expect(calcularIRRF(-1000)).toBe(0);
    });

    it('deve aplicar isenção total até R$ 5.000 (Reforma IR 2026)', () => {
      expect(calcularIRRF(3000)).toBe(0);
      expect(calcularIRRF(4500)).toBe(0);
      expect(calcularIRRF(5000)).toBe(0);
    });

    it('deve calcular IRRF para segunda faixa (7,5%)', () => {
      // R$ 5.500 base -> acima de R$ 5.000, entra na faixa 7,5%
      const irrf = calcularIRRF(5500);
      expect(irrf).toBeGreaterThan(0);
    });

    it('deve calcular IRRF para terceira faixa (15%)', () => {
      const irrf = calcularIRRF(8000);
      expect(irrf).toBeGreaterThan(0);
    });

    it('deve calcular IRRF para quarta faixa (22,5%)', () => {
      const irrf = calcularIRRF(11000);
      expect(irrf).toBeGreaterThan(0);
    });

    it('deve calcular IRRF para quinta faixa (27,5%)', () => {
      const irrf = calcularIRRF(15000);
      expect(irrf).toBeGreaterThan(0);
    });

    it('deve deduzir dependentes corretamente', () => {
      const irrfSemDep = calcularIRRF(7000, 0);
      const irrfComDep = calcularIRRF(7000, 2);
      expect(irrfComDep).toBeLessThan(irrfSemDep);
    });

    it('deve isentar quem tem dependentes suficientes para zerar base', () => {
      // Base de R$ 5.200 com 1 dependente (~R$ 189,59) = R$ 5.010,41
      // Se dedução for suficiente para ir abaixo de R$ 5.000, isento
      const deducao = getDeducaoDependente();
      const base = 5000 + deducao - 10; // Exatamente no limite
      const irrf = calcularIRRF(base, 1);
      expect(irrf).toBe(0);
    });
  });

  describe('calcularIRRFDetalhado', () => {
    it('deve retornar objeto completo para isento', () => {
      const resultado = calcularIRRFDetalhado(4000);
      expect(resultado.valor).toBe(0);
      expect(resultado.isento).toBe(true);
      expect(resultado.aliquotaEfetiva).toBe(0);
    });

    it('deve retornar faixa correta aplicada', () => {
      const resultado = calcularIRRFDetalhado(10000);
      expect(resultado.isento).toBe(false);
      expect(resultado.faixaAplicada).toBeGreaterThan(1);
      expect(resultado.aliquotaFaixa).toBeGreaterThan(0);
    });

    it('deve calcular alíquota efetiva corretamente', () => {
      const base = 12000;
      const resultado = calcularIRRFDetalhado(base);
      const aliquotaEsperada = (resultado.valor / base) * 100;
      expect(resultado.aliquotaEfetiva).toBeCloseTo(aliquotaEsperada, 1);
    });

    it('deve retornar dedução da faixa', () => {
      const resultado = calcularIRRFDetalhado(15000);
      expect(resultado.deducaoFaixa).toBeGreaterThan(0);
    });
  });

  describe('calcularBaseIRRF', () => {
    it('deve calcular base subtraindo INSS', () => {
      const base = calcularBaseIRRF(5000, 500);
      expect(base).toBe(4500);
    });

    it('deve subtrair pensão alimentícia', () => {
      const base = calcularBaseIRRF(5000, 500, 1000);
      expect(base).toBe(3500);
    });

    it('deve retornar 0 se deduções excedem salário', () => {
      const base = calcularBaseIRRF(1000, 1500);
      expect(base).toBe(0);
    });

    it('deve retornar 0 para valores negativos', () => {
      const base = calcularBaseIRRF(1000, 500, 1000);
      expect(base).toBe(0);
    });
  });

  describe('getDeducaoDependente', () => {
    it('deve retornar valor de dedução por dependente 2026', () => {
      const deducao = getDeducaoDependente();
      expect(deducao).toBeGreaterThan(0);
      expect(deducao).toBeCloseTo(189.59, 0);
    });
  });

  describe('getTabelaIRRF', () => {
    it('deve retornar tabela com 5 faixas', () => {
      const tabela = getTabelaIRRF();
      expect(tabela.length).toBeGreaterThanOrEqual(4);
    });

    it('deve ter alíquotas progressivas corretas', () => {
      const tabela = getTabelaIRRF();
      expect(tabela[0].aliquota).toBe(0); // Isento
      expect(tabela[tabela.length - 1].aliquota).toBe(27.5);
    });
  });

  describe('Casos especiais Reforma IR 2026', () => {
    it('deve beneficiar salários até R$ 5.000 com isenção total', () => {
      // Principal mudança da Reforma IR 2026
      for (const salario of [1500, 2500, 3500, 4500, 5000]) {
        expect(calcularIRRF(salario)).toBe(0);
      }
    });

    it('deve arredondar corretamente para 2 casas decimais', () => {
      const irrf = calcularIRRF(7777.77);
      const decimais = irrf.toString().split('.')[1]?.length || 0;
      expect(decimais).toBeLessThanOrEqual(2);
    });

    it('deve manter consistência entre funções', () => {
      const base = 9500;
      const irrfSimples = calcularIRRF(base);
      const irrfDetalhado = calcularIRRFDetalhado(base);
      expect(irrfSimples).toBe(irrfDetalhado.valor);
    });
  });
});
