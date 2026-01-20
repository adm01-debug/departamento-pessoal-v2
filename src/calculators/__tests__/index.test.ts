// V18-T025: Testes de Integração das Calculadoras
import { describe, it, expect } from 'vitest';
import * as calculators from '../index';

describe('Calculadoras Index - Testes de Integração', () => {
  describe('Exports de funções', () => {
    it('deve exportar calcularINSS', () => {
      expect(typeof calculators.calcularINSS).toBe('function');
    });

    it('deve exportar calcularIRRF', () => {
      expect(typeof calculators.calcularIRRF).toBe('function');
    });

    it('deve exportar calcularFGTS', () => {
      expect(typeof calculators.calcularFGTS).toBe('function');
    });

    it('deve exportar calcularFerias', () => {
      expect(typeof calculators.calcularFerias).toBe('function');
    });

    it('deve exportar calcularRescisao', () => {
      expect(typeof calculators.calcularRescisao).toBe('function');
    });

    it('deve exportar calcularHoraExtra', () => {
      expect(typeof calculators.calcularHoraExtra).toBe('function');
    });

    it('deve exportar calcularSalarioFamilia', () => {
      expect(typeof calculators.calcularSalarioFamilia).toBe('function');
    });
  });

  describe('Exports de constantes 2026', () => {
    it('deve exportar SALARIO_MINIMO_2026', () => {
      expect(calculators.SALARIO_MINIMO_2026).toBe(1621);
    });

    it('deve exportar TETO_INSS_2026', () => {
      expect(calculators.TETO_INSS_2026).toBe(8475.55);
    });
  });

  describe('Integração: Cálculo de folha completa', () => {
    it('deve calcular folha simples corretamente', () => {
      const salario = 3000;
      
      const inss = calculators.calcularINSS(salario);
      expect(inss).toBeGreaterThan(0);
      
      const baseIRRF = salario - inss;
      const irrf = calculators.calcularIRRF(baseIRRF);
      expect(irrf).toBeGreaterThanOrEqual(0);
      
      const fgts = calculators.calcularFGTS(salario);
      expect(fgts.deposito).toBe(240);
      
      const liquido = salario - inss - irrf;
      expect(liquido).toBeLessThan(salario);
    });

    it('deve calcular férias + 1/3 corretamente', () => {
      const ferias = calculators.calcularFerias(3000, 30);
      expect(ferias.valorFerias).toBe(3000);
      expect(ferias.tercoConstitucional).toBe(1000);
      expect(ferias.totalBruto).toBe(4000);
    });
  });

  describe('Integração: Benefícios', () => {
    it('deve calcular salário família para baixa renda', () => {
      const resultado = calculators.calcularSalarioFamilia(1500, 2);
      expect(resultado).toBeGreaterThan(0);
    });

    it('não deve calcular salário família para alta renda', () => {
      const resultado = calculators.calcularSalarioFamilia(5000, 2);
      expect(resultado).toBe(0);
    });
  });

  describe('Integração: Rescisão completa', () => {
    it('deve integrar rescisão com FGTS', () => {
      const fgtsRescisorio = calculators.calcularFGTSRescisorio(10000, 'sem_justa_causa');
      expect(fgtsRescisorio.percentualMulta).toBe(40);
      expect(fgtsRescisorio.multa).toBe(4000);
      expect(fgtsRescisorio.sacaFGTS).toBe(true);
    });
  });
});
