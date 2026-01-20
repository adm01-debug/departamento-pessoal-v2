// V18-T006: Testes da Calculadora Horas Extras
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import {
  calcularHoraExtra,
  calcularAdicionalNoturno,
  calcularDSR,
  calcularHorasExtrasComDSR,
  ResultadoHoraExtra,
  ResultadoAdicionalNoturno
} from '../horasExtras';

describe('Calculadora Horas Extras', () => {
  describe('calcularHoraExtra', () => {
    const salario = 2200; // R$ 2.200,00

    it('deve calcular valor da hora normal', () => {
      const resultado = calcularHoraExtra(salario, 10, 50);
      expect(resultado.valorHora).toBe(10); // 2200 / 220
    });

    it('deve calcular hora extra 50% (dias úteis)', () => {
      const resultado = calcularHoraExtra(salario, 10, 50);
      expect(resultado.valorHoraExtra).toBe(15); // 10 * 1.5
      expect(resultado.valorTotal).toBe(150); // 15 * 10
    });

    it('deve calcular hora extra 100% (domingos/feriados)', () => {
      const resultado = calcularHoraExtra(salario, 8, 100);
      expect(resultado.valorHoraExtra).toBe(20); // 10 * 2.0
      expect(resultado.valorTotal).toBe(160); // 20 * 8
    });

    it('deve aceitar percentuais customizados', () => {
      const resultado = calcularHoraExtra(salario, 5, 75);
      expect(resultado.percentualAdicional).toBe(75);
      expect(resultado.valorHoraExtra).toBe(17.5); // 10 * 1.75
    });

    it('deve calcular com carga horária diferente', () => {
      const resultado = calcularHoraExtra(1760, 10, 50, 176); // 8h/dia
      expect(resultado.valorHora).toBe(10);
    });

    it('deve retornar total de horas', () => {
      const resultado = calcularHoraExtra(salario, 15, 50);
      expect(resultado.totalHoras).toBe(15);
    });
  });

  describe('calcularAdicionalNoturno', () => {
    const salario = 2200;

    it('deve calcular adicional de 20%', () => {
      const resultado = calcularAdicionalNoturno(salario, 10);
      expect(resultado.valorAdicional).toBe(2); // 10 * 0.20
    });

    it('deve calcular valor total do adicional', () => {
      const resultado = calcularAdicionalNoturno(salario, 10);
      expect(resultado.valorTotal).toBe(20); // 2 * 10
    });

    it('deve calcular horas reduzidas (52:30 = 60:00)', () => {
      const resultado = calcularAdicionalNoturno(salario, 52.5);
      expect(resultado.horasReduzidas).toBeCloseTo(60, 0);
    });

    it('deve retornar horas noturnas informadas', () => {
      const resultado = calcularAdicionalNoturno(salario, 35);
      expect(resultado.horasNoturnas).toBe(35);
    });
  });

  describe('calcularDSR', () => {
    it('deve calcular DSR sobre variáveis', () => {
      const dsr = calcularDSR(600, 24, 6);
      expect(dsr).toBe(150); // (600/24) * 6
    });

    it('deve estimar domingos/feriados se não informado', () => {
      const dsr = calcularDSR(440, 22);
      expect(dsr).toBeGreaterThan(0);
    });

    it('deve retornar 0 para dias úteis zero', () => {
      const dsr = calcularDSR(600, 0);
      expect(dsr).toBe(0);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const dsr = calcularDSR(333.33, 22, 5);
      const decimais = dsr.toString().split('.')[1]?.length || 0;
      expect(decimais).toBeLessThanOrEqual(2);
    });
  });

  describe('calcularHorasExtrasComDSR', () => {
    const salario = 2200;

    it('deve retornar objeto com horas extras e DSR', () => {
      const resultado = calcularHorasExtrasComDSR(salario, 10, 50, 22, 8);
      expect(resultado.horasExtras).toBeDefined();
      expect(resultado.dsr).toBeDefined();
      expect(resultado.total).toBeDefined();
    });

    it('deve calcular total correto (HE + DSR)', () => {
      const resultado = calcularHorasExtrasComDSR(salario, 10, 50, 22, 8);
      const esperado = resultado.horasExtras.valorTotal + resultado.dsr;
      expect(resultado.total).toBeCloseTo(esperado, 1);
    });

    it('deve usar valores default se não informados', () => {
      const resultado = calcularHorasExtrasComDSR(salario, 10);
      expect(resultado.horasExtras.percentualAdicional).toBe(50);
    });
  });

  describe('Casos especiais', () => {
    it('deve manter precisão de 2 casas decimais', () => {
      const resultado = calcularHoraExtra(3333.33, 7, 50);
      expect(resultado.valorHora.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('deve calcular corretamente salário mínimo', () => {
      const resultado = calcularHoraExtra(1518, 10, 50, 220);
      expect(resultado.valorHora).toBeCloseTo(6.9, 1);
      expect(resultado.valorTotal).toBeCloseTo(103.5, 0);
    });

    it('deve calcular hora extra + adicional noturno combinados', () => {
      const salario = 2200;
      const he = calcularHoraExtra(salario, 10, 50);
      const noturno = calcularAdicionalNoturno(salario, 10);
      const totalCombinado = he.valorTotal + noturno.valorTotal;
      expect(totalCombinado).toBe(170); // 150 + 20
    });
  });
});
