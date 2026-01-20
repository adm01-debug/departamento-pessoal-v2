// V18-T025: Testes Integracao Calculadoras
import { describe, it, expect } from 'vitest';
import * as Calc from '../index';

describe('Index Calculadoras', () => {
  describe('Exports', () => {
    it('calcularINSS', () => expect(Calc.calcularINSS).toBeDefined());
    it('calcularIRRF', () => expect(Calc.calcularIRRF).toBeDefined());
    it('calcularFGTS', () => expect(Calc.calcularFGTS).toBeDefined());
    it('calcularFerias', () => expect(Calc.calcularFerias).toBeDefined());
    it('calcularRescisao', () => expect(Calc.calcularRescisao).toBeDefined());
  });

  describe('Fluxo Folha', () => {
    it('calcula folha completa', () => {
      const salario = 5000;
      const inss = Calc.calcularINSS(salario);
      const fgts = Calc.calcularFGTS(salario);
      expect(inss).toBeGreaterThan(0);
      expect(fgts.deposito).toBe(400);
    });
  });
});
