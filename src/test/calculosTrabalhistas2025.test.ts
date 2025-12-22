import { describe, it, expect } from 'vitest';
import { 
  calcularINSS, 
  calcularIRRF, 
  calcularFGTS,
  calcularHolerite 
} from '../lib/calculosTrabalhistas2025';

describe('Cálculos Trabalhistas 2025', () => {
  describe('calcularINSS', () => {
    it('deve calcular INSS para salário até 1ª faixa', () => {
      const resultado = calcularINSS(1400);
      expect(resultado.valorINSS).toBeCloseTo(105, 2);
      expect(resultado.aliquotaEfetiva).toBeCloseTo(7.5, 1);
    });

    it('deve calcular INSS para salário na 2ª faixa', () => {
      const resultado = calcularINSS(3000);
      expect(resultado.valorINSS).toBeGreaterThan(200);
    });

    it('deve calcular INSS para salário na 3ª faixa', () => {
      const resultado = calcularINSS(4500);
      expect(resultado.valorINSS).toBeGreaterThan(400);
    });

    it('deve respeitar o teto do INSS', () => {
      const resultado = calcularINSS(10000);
      expect(resultado.valorINSS).toBeLessThanOrEqual(908.86);
    });
  });

  describe('calcularIRRF', () => {
    it('deve ser isento para base de cálculo até faixa de isenção', () => {
      const resultado = calcularIRRF(2000, 150, 0);
      expect(resultado.valorIRRF).toBe(0);
      expect(resultado.faixaIRRF).toBe('Isento');
    });

    it('deve calcular IRRF para 2ª faixa', () => {
      const resultado = calcularIRRF(4000, 350, 0);
      expect(resultado.valorIRRF).toBeGreaterThan(0);
    });

    it('deve deduzir dependentes corretamente', () => {
      const semDependentes = calcularIRRF(5000, 400, 0);
      const comDependentes = calcularIRRF(5000, 400, 2);
      expect(comDependentes.valorIRRF).toBeLessThan(semDependentes.valorIRRF);
    });
  });

  describe('calcularFGTS', () => {
    it('deve calcular 8% sobre o salário', () => {
      const resultado = calcularFGTS(3000, 0);
      expect(resultado.valorFGTS).toBeCloseTo(240, 2);
    });

    it('deve incluir horas extras na base', () => {
      const resultado = calcularFGTS(3000, 500);
      expect(resultado.valorFGTS).toBeCloseTo(280, 2);
    });
  });

  describe('calcularHolerite', () => {
    it('deve calcular holerite completo', () => {
      const resultado = calcularHolerite({
        salarioBase: 5000,
        horasExtras50: 10,
        horasExtras100: 0,
        adicionalNoturno: 0,
        faltas: 0,
        atrasos: 0,
        valeTransporte: 0,
        valeRefeicao: 0,
        planoSaude: 200,
        outrosDescontos: 0,
        dependentesIRRF: 1
      });

      expect(resultado.salarioBruto).toBeGreaterThan(5000);
      expect(resultado.totalDescontos).toBeGreaterThan(0);
      expect(resultado.salarioLiquido).toBeLessThan(resultado.salarioBruto);
      expect(resultado.inss).toBeGreaterThan(0);
      expect(resultado.fgts).toBeGreaterThan(0);
    });
  });
});
