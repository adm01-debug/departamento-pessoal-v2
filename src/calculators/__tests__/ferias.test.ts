// V18-T004: Testes da Calculadora Férias
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import {
  calcularFerias,
  calcularDiasFerias,
  calcularPeriodoAquisitivo,
  calcularDiasFeriasPorFaltas,
  ResultadoFerias
} from '../ferias';

describe('Calculadora Férias', () => {
  describe('calcularFerias', () => {
    it('deve calcular férias de 30 dias corretamente', () => {
      const resultado = calcularFerias(3000, 30);
      expect(resultado.valorFerias).toBe(3000);
      expect(resultado.tercoConstitucional).toBe(1000);
      expect(resultado.valorAbono).toBe(0);
      expect(resultado.tercoAbono).toBe(0);
      expect(resultado.totalBruto).toBe(4000);
    });

    it('deve calcular férias com abono pecuniário', () => {
      const resultado = calcularFerias(3000, 20, 10);
      expect(resultado.valorFerias).toBe(2000); // 20 dias
      expect(resultado.valorAbono).toBe(1000); // 10 dias
      expect(resultado.tercoConstitucional).toBeCloseTo(666.67, 1);
      expect(resultado.tercoAbono).toBeCloseTo(333.33, 1);
    });

    it('deve incluir média de variáveis no cálculo', () => {
      const semVariaveis = calcularFerias(3000, 30, 0, 0);
      const comVariaveis = calcularFerias(3000, 30, 0, 500);
      expect(comVariaveis.totalBruto).toBeGreaterThan(semVariaveis.totalBruto);
    });

    it('deve calcular base INSS corretamente (exclui abono)', () => {
      const resultado = calcularFerias(3000, 20, 10);
      expect(resultado.baseINSS).toBe(resultado.valorFerias + resultado.tercoConstitucional);
    });

    it('deve calcular base IRRF incluindo tudo', () => {
      const resultado = calcularFerias(3000, 20, 10);
      expect(resultado.baseIRRF).toBe(resultado.totalBruto);
    });

    describe('Validações', () => {
      it('deve lançar erro para dias de gozo menor que 10', () => {
        expect(() => calcularFerias(3000, 9)).toThrow('Dias de gozo deve ser entre 10 e 30');
      });

      it('deve lançar erro para dias de gozo maior que 30', () => {
        expect(() => calcularFerias(3000, 31)).toThrow('Dias de gozo deve ser entre 10 e 30');
      });

      it('deve lançar erro para abono maior que 10 dias', () => {
        expect(() => calcularFerias(3000, 20, 11)).toThrow('Dias de abono deve ser entre 0 e 10');
      });

      it('deve lançar erro para abono negativo', () => {
        expect(() => calcularFerias(3000, 20, -1)).toThrow('Dias de abono deve ser entre 0 e 10');
      });

      it('deve lançar erro se total exceder 30 dias', () => {
        expect(() => calcularFerias(3000, 25, 10)).toThrow('Total de dias não pode exceder 30');
      });
    });
  });

  describe('calcularDiasFerias', () => {
    it('deve calcular diferença de dias corretamente', () => {
      const inicio = new Date('2026-01-01');
      const fim = new Date('2026-01-30');
      expect(calcularDiasFerias(inicio, fim)).toBe(30);
    });

    it('deve retornar 1 para mesmo dia', () => {
      const data = new Date('2026-01-15');
      expect(calcularDiasFerias(data, data)).toBe(1);
    });

    it('deve calcular período de 10 dias', () => {
      const inicio = new Date('2026-03-01');
      const fim = new Date('2026-03-10');
      expect(calcularDiasFerias(inicio, fim)).toBe(10);
    });
  });

  describe('calcularPeriodoAquisitivo', () => {
    it('deve calcular período de 1 ano a partir da admissão', () => {
      const admissao = new Date('2025-01-15');
      const periodo = calcularPeriodoAquisitivo(admissao);
      
      expect(periodo.inicio.getFullYear()).toBe(2025);
      expect(periodo.inicio.getMonth()).toBe(0); // Janeiro
      expect(periodo.inicio.getDate()).toBe(15);
    });

    it('deve indicar se período está completo', () => {
      const admissaoAntiga = new Date('2024-01-01');
      const periodoCompleto = calcularPeriodoAquisitivo(admissaoAntiga);
      expect(periodoCompleto.completo).toBe(true);
    });

    it('deve indicar período incompleto para admissão recente', () => {
      const admissaoRecente = new Date();
      admissaoRecente.setMonth(admissaoRecente.getMonth() - 6);
      const periodo = calcularPeriodoAquisitivo(admissaoRecente);
      expect(periodo.completo).toBe(false);
    });
  });

  describe('calcularDiasFeriasPorFaltas (CLT Art. 130)', () => {
    it('deve retornar 30 dias para até 5 faltas', () => {
      expect(calcularDiasFeriasPorFaltas(0)).toBe(30);
      expect(calcularDiasFeriasPorFaltas(5)).toBe(30);
    });

    it('deve retornar 24 dias para 6 a 14 faltas', () => {
      expect(calcularDiasFeriasPorFaltas(6)).toBe(24);
      expect(calcularDiasFeriasPorFaltas(14)).toBe(24);
    });

    it('deve retornar 18 dias para 15 a 23 faltas', () => {
      expect(calcularDiasFeriasPorFaltas(15)).toBe(18);
      expect(calcularDiasFeriasPorFaltas(23)).toBe(18);
    });

    it('deve retornar 12 dias para 24 a 32 faltas', () => {
      expect(calcularDiasFeriasPorFaltas(24)).toBe(12);
      expect(calcularDiasFeriasPorFaltas(32)).toBe(12);
    });

    it('deve retornar 0 dias para mais de 32 faltas (perde direito)', () => {
      expect(calcularDiasFeriasPorFaltas(33)).toBe(0);
      expect(calcularDiasFeriasPorFaltas(50)).toBe(0);
    });
  });

  describe('Casos especiais', () => {
    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularFerias(1234.56, 30);
      const decimais = resultado.totalBruto.toString().split('.')[1]?.length || 0;
      expect(decimais).toBeLessThanOrEqual(2);
    });

    it('deve calcular férias fracionadas (10 dias mínimo)', () => {
      const resultado = calcularFerias(3000, 10);
      expect(resultado.valorFerias).toBe(1000);
      expect(resultado.tercoConstitucional).toBeCloseTo(333.33, 1);
    });

    it('deve calcular férias do salário mínimo', () => {
      const resultado = calcularFerias(1518, 30);
      expect(resultado.valorFerias).toBe(1518);
      expect(resultado.tercoConstitucional).toBe(506);
      expect(resultado.totalBruto).toBe(2024);
    });
  });
});
