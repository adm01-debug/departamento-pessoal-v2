// V18-T020: Testes da Calculadora PLR
import { describe, it, expect } from 'vitest';
import { calcularPLR, simularPLR, getTabelaPLR, ParamsPLR, ResultPLR } from '../plr';

describe('Calculadora PLR 2026', () => {
  describe('calcularPLR', () => {
    it('deve calcular PLR integral (12 meses)', () => {
      const resultado = calcularPLR({ valorBruto: 6000 });
      expect(resultado.proporcional).toBe(6000);
    });

    it('deve calcular PLR proporcional', () => {
      const resultado = calcularPLR({ valorBruto: 6000, mesesTrabalhados: 6 });
      expect(resultado.proporcional).toBe(3000);
    });

    it('deve ser isento até R$ 8.000', () => {
      const resultado = calcularPLR({ valorBruto: 7000 });
      expect(resultado.irrf).toBe(0);
    });

    it('deve calcular IRRF acima da isenção', () => {
      const resultado = calcularPLR({ valorBruto: 12000 });
      expect(resultado.irrf).toBeGreaterThan(0);
    });

    it('deve deduzir dependentes', () => {
      const semDep = calcularPLR({ valorBruto: 15000, dependentesIR: 0 });
      const comDep = calcularPLR({ valorBruto: 15000, dependentesIR: 2 });
      expect(comDep.irrf).toBeLessThan(semDep.irrf);
    });

    it('deve calcular líquido = proporcional - IRRF', () => {
      const resultado = calcularPLR({ valorBruto: 10000 });
      expect(resultado.liquido).toBe(resultado.proporcional - resultado.irrf);
    });

    it('deve calcular alíquota efetiva', () => {
      const resultado = calcularPLR({ valorBruto: 20000 });
      const aliquotaEsperada = (resultado.irrf / resultado.proporcional) * 100;
      expect(resultado.aliquotaEfetiva).toBeCloseTo(aliquotaEsperada, 1);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularPLR({ valorBruto: 12345.67 });
      expect(resultado.liquido.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('simularPLR', () => {
    it('deve simular múltiplos valores', () => {
      const resultados = simularPLR([5000, 10000, 15000]);
      expect(resultados).toHaveLength(3);
    });

    it('deve aplicar dependentes em todas simulações', () => {
      const resultados = simularPLR([12000, 15000], 2);
      resultados.forEach(r => expect(r.irrf).toBeGreaterThanOrEqual(0));
    });
  });

  describe('getTabelaPLR', () => {
    it('deve retornar tabela com 5 faixas', () => {
      const tabela = getTabelaPLR();
      expect(tabela).toHaveLength(5);
    });

    it('deve ter isenção até R$ 8.000', () => {
      const tabela = getTabelaPLR();
      expect(tabela[0].ate).toBe(8000);
      expect(tabela[0].aliquota).toBe(0);
    });
  });
});
