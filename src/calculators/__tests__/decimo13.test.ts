// V18-T007: Testes da Calculadora 13º Salário
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import { calcular13Proporcional, calcular13Integral, Params13, Result13 } from '../decimo13';

describe('Calculadora 13º Salário', () => {
  describe('calcular13Proporcional', () => {
    it('deve calcular 13º proporcional corretamente', () => {
      const params: Params13 = {
        salarioBase: 3000,
        mesesTrabalhados: 6
      };
      const resultado = calcular13Proporcional(params);
      expect(resultado.bruto).toBe(1500); // (3000/12) * 6
    });

    it('deve incluir médias de variáveis no cálculo', () => {
      const semVariaveis = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 12 });
      const comVariaveis = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 12, mediasVariaveis: 500 });
      expect(comVariaveis.bruto).toBeGreaterThan(semVariaveis.bruto);
    });

    it('deve descontar meses por faltas (a cada 15 faltas = 1 mês)', () => {
      const semFaltas = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 12, faltas: 0 });
      const comFaltas = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 12, faltas: 15 });
      expect(comFaltas.bruto).toBeLessThan(semFaltas.bruto);
    });

    it('deve limitar meses entre 0 e 12', () => {
      const excedente = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 15 });
      const doze = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 12 });
      expect(excedente.bruto).toBe(doze.bruto);
    });

    it('deve calcular INSS sobre o bruto', () => {
      const resultado = calcular13Proporcional({ salarioBase: 5000, mesesTrabalhados: 12 });
      expect(resultado.inss).toBeGreaterThan(0);
    });

    it('deve calcular IRRF sobre (bruto - INSS)', () => {
      const resultado = calcular13Proporcional({ salarioBase: 8000, mesesTrabalhados: 12 });
      expect(resultado.irrf).toBeGreaterThan(0);
    });

    it('deve calcular líquido = bruto - INSS - IRRF', () => {
      const resultado = calcular13Proporcional({ salarioBase: 5000, mesesTrabalhados: 12 });
      const esperado = resultado.bruto - resultado.inss - resultado.irrf;
      expect(resultado.liquido).toBeCloseTo(esperado, 1);
    });

    it('deve calcular 1ª parcela = 50% do bruto', () => {
      const resultado = calcular13Proporcional({ salarioBase: 4000, mesesTrabalhados: 12 });
      expect(resultado.primeiraParcela).toBe(2000);
    });

    it('deve calcular 2ª parcela = bruto - 1ª parcela - descontos', () => {
      const resultado = calcular13Proporcional({ salarioBase: 4000, mesesTrabalhados: 12 });
      const esperado = resultado.bruto - resultado.primeiraParcela - resultado.inss - resultado.irrf;
      expect(resultado.segundaParcela).toBeCloseTo(esperado, 1);
    });

    it('deve considerar dependentes no cálculo do IRRF', () => {
      const semDep = calcular13Proporcional({ salarioBase: 8000, mesesTrabalhados: 12, dependentesIR: 0 });
      const comDep = calcular13Proporcional({ salarioBase: 8000, mesesTrabalhados: 12, dependentesIR: 3 });
      expect(comDep.irrf).toBeLessThanOrEqual(semDep.irrf);
    });
  });

  describe('calcular13Integral', () => {
    it('deve calcular 13º integral (12 meses)', () => {
      const resultado = calcular13Integral(3000);
      expect(resultado.bruto).toBe(3000);
    });

    it('deve ser equivalente a proporcional com 12 meses', () => {
      const integral = calcular13Integral(5000);
      const proporcional = calcular13Proporcional({ salarioBase: 5000, mesesTrabalhados: 12 });
      expect(integral.bruto).toBe(proporcional.bruto);
    });

    it('deve aceitar dependentes IRRF', () => {
      const resultado = calcular13Integral(6000, 2);
      expect(resultado.irrf).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Casos especiais', () => {
    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcular13Proporcional({ salarioBase: 3333.33, mesesTrabalhados: 7 });
      const decimais = resultado.bruto.toString().split('.')[1]?.length || 0;
      expect(decimais).toBeLessThanOrEqual(2);
    });

    it('deve calcular para salário mínimo', () => {
      const resultado = calcular13Integral(1518);
      expect(resultado.bruto).toBe(1518);
      expect(resultado.inss).toBeGreaterThan(0);
    });

    it('deve lidar com meses trabalhados = 0', () => {
      const resultado = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 0 });
      expect(resultado.bruto).toBe(0);
    });

    it('deve lidar com muitas faltas que zeram os meses', () => {
      const resultado = calcular13Proporcional({ salarioBase: 3000, mesesTrabalhados: 3, faltas: 60 });
      expect(resultado.bruto).toBe(0);
    });

    it('1ª parcela deve ser paga até 30/nov', () => {
      // Teste conceitual - verificar que 1ª parcela = metade do bruto
      const resultado = calcular13Proporcional({ salarioBase: 4000, mesesTrabalhados: 11 });
      expect(resultado.primeiraParcela).toBe(resultado.bruto / 2);
    });
  });
});
