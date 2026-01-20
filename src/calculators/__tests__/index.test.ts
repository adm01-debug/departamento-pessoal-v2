// V18-T025: Testes de Integracao das Calculadoras
import { describe, it, expect } from 'vitest';
import * as Calculators from '../index';

describe('Index Calculadoras - Integracao', () => {
  describe('Exports', () => {
    it('deve exportar calcularINSS', () => {
      expect(Calculators.calcularINSS).toBeDefined();
    });
    it('deve exportar calcularIRRF', () => {
      expect(Calculators.calcularIRRF).toBeDefined();
    });
    it('deve exportar calcularFGTS', () => {
      expect(Calculators.calcularFGTS).toBeDefined();
    });
    it('deve exportar calcularFerias', () => {
      expect(Calculators.calcularFerias).toBeDefined();
    });
    it('deve exportar calcularRescisao', () => {
      expect(Calculators.calcularRescisao).toBeDefined();
    });
  });

  describe('Fluxo Folha Completo', () => {
    it('deve calcular folha completa', () => {
      const salario = 5000;
      const inss = Calculators.calcularINSS(salario);
      const baseIRRF = salario - inss;
      const irrf = Calculators.calcularIRRF(baseIRRF);
      const fgts = Calculators.calcularFGTS(salario);
      
      expect(inss).toBeGreaterThan(0);
      expect(fgts.deposito).toBe(400);
      expect(irrf).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Constantes 2026', () => {
    it('deve exportar SALARIO_MINIMO_2026', () => {
      expect(Calculators.SALARIO_MINIMO_2026).toBeDefined();
    });
    it('deve exportar TETO_INSS_2026', () => {
      expect(Calculators.TETO_INSS_2026).toBeDefined();
    });
  });
});
