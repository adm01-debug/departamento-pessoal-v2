// V18-T001: Testes da Calculadora INSS 2026
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import {
  calcularINSS,
  calcularINSSDetalhado,
  calcularAliquotaEfetivaINSS,
  getTetoINSS,
  getTabelaINSS,
  ResultadoINSS
} from '../inss';

describe('Calculadora INSS 2026', () => {
  describe('calcularINSS', () => {
    it('deve retornar 0 para salário zero ou negativo', () => {
      expect(calcularINSS(0)).toBe(0);
      expect(calcularINSS(-1000)).toBe(0);
    });

    it('deve calcular INSS para salário na primeira faixa (7,5%)', () => {
      // R$ 1.621,00 -> R$ 121,58
      expect(calcularINSS(1621)).toBe(121.58);
      expect(calcularINSS(1000)).toBe(75);
      expect(calcularINSS(1500)).toBe(112.5);
    });

    it('deve calcular INSS para salário na segunda faixa (9%)', () => {
      // R$ 2.000,00 -> R$ 155,69
      const inss2000 = calcularINSS(2000);
      expect(inss2000).toBeCloseTo(155.69, 1);
    });

    it('deve calcular INSS para salário na terceira faixa (12%)', () => {
      // R$ 3.000,00 -> R$ 248,60
      const inss3000 = calcularINSS(3000);
      expect(inss3000).toBeCloseTo(248.60, 0);
    });

    it('deve calcular INSS para salário na quarta faixa (14%)', () => {
      // R$ 5.000,00 -> R$ 501,51
      const inss5000 = calcularINSS(5000);
      expect(inss5000).toBeCloseTo(501.51, 0);
    });

    it('deve aplicar teto INSS para salários acima do limite', () => {
      // R$ 8.475,55 -> R$ 988,10 (máximo)
      const inssTeto = calcularINSS(8475.55);
      expect(inssTeto).toBeCloseTo(988.10, 0);
      
      // Salário acima do teto deve ter mesmo desconto
      const inssAcimaTeto = calcularINSS(15000);
      expect(inssAcimaTeto).toBeCloseTo(988.10, 0);
    });

    it('deve calcular corretamente para salário mínimo 2026', () => {
      // Salário mínimo 2026 estimado: R$ 1.518,00
      const inssSalarioMinimo = calcularINSS(1518);
      expect(inssSalarioMinimo).toBe(113.85);
    });
  });

  describe('calcularINSSDetalhado', () => {
    it('deve retornar objeto zerado para salário zero', () => {
      const resultado = calcularINSSDetalhado(0);
      expect(resultado.valor).toBe(0);
      expect(resultado.aliquotaEfetiva).toBe(0);
      expect(resultado.baseCalculo).toBe(0);
      expect(resultado.faixasAplicadas).toHaveLength(0);
    });

    it('deve retornar breakdown correto por faixa', () => {
      const resultado = calcularINSSDetalhado(3000);
      
      expect(resultado.faixasAplicadas.length).toBeGreaterThan(0);
      expect(resultado.baseCalculo).toBe(3000);
      expect(resultado.valor).toBeCloseTo(248.60, 0);
      
      // Verifica se soma das faixas bate com total
      const somaFaixas = resultado.faixasAplicadas.reduce((acc, f) => acc + f.valor, 0);
      expect(somaFaixas).toBeCloseTo(resultado.valor, 1);
    });

    it('deve calcular alíquota efetiva corretamente', () => {
      const resultado = calcularINSSDetalhado(5000);
      // Alíquota efetiva = INSS / Salário * 100
      const aliquotaEsperada = (resultado.valor / 5000) * 100;
      expect(resultado.aliquotaEfetiva).toBeCloseTo(aliquotaEsperada, 1);
    });

    it('deve limitar base de cálculo ao teto', () => {
      const resultado = calcularINSSDetalhado(20000);
      expect(resultado.baseCalculo).toBeLessThanOrEqual(8475.55);
    });
  });

  describe('calcularAliquotaEfetivaINSS', () => {
    it('deve retornar 0 para salário zero', () => {
      expect(calcularAliquotaEfetivaINSS(0)).toBe(0);
    });

    it('deve calcular alíquota efetiva corretamente', () => {
      // Para salário de R$ 5.000, INSS ~R$ 501,51 = ~10,03%
      const aliquota = calcularAliquotaEfetivaINSS(5000);
      expect(aliquota).toBeGreaterThan(9);
      expect(aliquota).toBeLessThan(11);
    });

    it('deve ter alíquota efetiva menor que alíquota máxima nominal', () => {
      // Alíquota efetiva nunca chega a 14% devido progressividade
      const aliquota = calcularAliquotaEfetivaINSS(8475.55);
      expect(aliquota).toBeLessThan(14);
    });
  });

  describe('getTetoINSS', () => {
    it('deve retornar teto INSS 2026', () => {
      const teto = getTetoINSS();
      expect(teto).toBe(8475.55);
    });
  });

  describe('getTabelaINSS', () => {
    it('deve retornar tabela com 4 faixas', () => {
      const tabela = getTabelaINSS();
      expect(tabela).toHaveLength(4);
    });

    it('deve ter alíquotas corretas 2026', () => {
      const tabela = getTabelaINSS();
      expect(tabela[0].aliquota).toBe(7.5);
      expect(tabela[1].aliquota).toBe(9);
      expect(tabela[2].aliquota).toBe(12);
      expect(tabela[3].aliquota).toBe(14);
    });
  });

  describe('Casos especiais', () => {
    it('deve arredondar corretamente para 2 casas decimais', () => {
      const resultado = calcularINSS(1234.56);
      const decimais = resultado.toString().split('.')[1]?.length || 0;
      expect(decimais).toBeLessThanOrEqual(2);
    });

    it('deve manter consistência entre funções', () => {
      const salario = 4500;
      const inssSimples = calcularINSS(salario);
      const inssDetalhado = calcularINSSDetalhado(salario);
      expect(inssSimples).toBe(inssDetalhado.valor);
    });
  });
});
