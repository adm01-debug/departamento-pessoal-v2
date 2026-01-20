// V18-T003: Testes da Calculadora FGTS
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import {
  calcularFGTS,
  calcularFGTSRescisorio,
  calcularProjecaoFGTS,
  calcularCorrecaoFGTS,
  TipoRescisaoFGTS,
  ResultadoFGTS,
  ResultadoFGTSRescisorio
} from '../fgts';

describe('Calculadora FGTS', () => {
  describe('calcularFGTS', () => {
    it('deve retornar depósito zero para base zero ou negativa', () => {
      expect(calcularFGTS(0).deposito).toBe(0);
      expect(calcularFGTS(-1000).deposito).toBe(0);
    });

    it('deve calcular 8% do salário', () => {
      const resultado = calcularFGTS(3000);
      expect(resultado.deposito).toBe(240);
      expect(resultado.percentual).toBe(8);
    });

    it('deve arredondar corretamente para 2 casas decimais', () => {
      const resultado = calcularFGTS(1234.56);
      expect(resultado.deposito).toBe(98.76);
    });

    it('deve calcular FGTS para salário mínimo', () => {
      const resultado = calcularFGTS(1518);
      expect(resultado.deposito).toBe(121.44);
    });

    it('deve calcular FGTS para altos salários', () => {
      const resultado = calcularFGTS(50000);
      expect(resultado.deposito).toBe(4000);
    });
  });

  describe('calcularFGTSRescisorio', () => {
    const saldoFGTS = 10000;

    describe('Rescisão sem justa causa', () => {
      it('deve calcular multa de 40% e saque integral', () => {
        const resultado = calcularFGTSRescisorio(saldoFGTS, 'sem_justa_causa');
        expect(resultado.percentualMulta).toBe(40);
        expect(resultado.multa).toBe(4000);
        expect(resultado.totalSaque).toBe(14000);
        expect(resultado.percentualSaque).toBe(100);
        expect(resultado.podeSacar).toBe(true);
      });
    });

    describe('Rescisão por acordo (Reforma Trabalhista)', () => {
      it('deve calcular multa de 20% e saque de 80%', () => {
        const resultado = calcularFGTSRescisorio(saldoFGTS, 'acordo');
        expect(resultado.percentualMulta).toBe(20);
        expect(resultado.multa).toBe(2000);
        expect(resultado.percentualSaque).toBe(80);
        expect(resultado.totalSaque).toBe(10000); // 80% de 10000 + 2000
        expect(resultado.podeSacar).toBe(true);
      });
    });

    describe('Rescisão por justa causa', () => {
      it('não deve permitir saque nem multa', () => {
        const resultado = calcularFGTSRescisorio(saldoFGTS, 'justa_causa');
        expect(resultado.multa).toBe(0);
        expect(resultado.totalSaque).toBe(0);
        expect(resultado.podeSacar).toBe(false);
      });
    });

    describe('Pedido de demissão', () => {
      it('não deve permitir saque nem multa', () => {
        const resultado = calcularFGTSRescisorio(saldoFGTS, 'pedido_demissao');
        expect(resultado.multa).toBe(0);
        expect(resultado.totalSaque).toBe(0);
        expect(resultado.podeSacar).toBe(false);
      });
    });

    describe('Aposentadoria', () => {
      it('deve permitir saque integral sem multa', () => {
        const resultado = calcularFGTSRescisorio(saldoFGTS, 'aposentadoria');
        expect(resultado.multa).toBe(0);
        expect(resultado.totalSaque).toBe(10000);
        expect(resultado.percentualSaque).toBe(100);
        expect(resultado.podeSacar).toBe(true);
      });
    });

    describe('Falecimento', () => {
      it('deve permitir saque integral sem multa', () => {
        const resultado = calcularFGTSRescisorio(saldoFGTS, 'falecimento');
        expect(resultado.multa).toBe(0);
        expect(resultado.totalSaque).toBe(10000);
        expect(resultado.podeSacar).toBe(true);
      });
    });

    it('deve retornar saldo original', () => {
      const resultado = calcularFGTSRescisorio(saldoFGTS, 'sem_justa_causa');
      expect(resultado.saldoFGTS).toBe(saldoFGTS);
    });
  });

  describe('calcularProjecaoFGTS', () => {
    it('deve calcular projeção para 12 meses', () => {
      const projecao = calcularProjecaoFGTS(3000, 12);
      expect(projecao).toBe(2880); // 240 * 12
    });

    it('deve calcular projeção para 1 mês', () => {
      const projecao = calcularProjecaoFGTS(3000, 1);
      expect(projecao).toBe(240);
    });

    it('deve retornar 0 para 0 meses', () => {
      const projecao = calcularProjecaoFGTS(3000, 0);
      expect(projecao).toBe(0);
    });
  });

  describe('calcularCorrecaoFGTS', () => {
    it('deve aplicar correção de 3% a.a. sem TR', () => {
      const saldoCorrigido = calcularCorrecaoFGTS(10000, 12, 0);
      // 3% a.a. = ~3,04% com juros compostos
      expect(saldoCorrigido).toBeGreaterThan(10000);
      expect(saldoCorrigido).toBeCloseTo(10304.16, 0);
    });

    it('deve aplicar TR quando informada', () => {
      const semTR = calcularCorrecaoFGTS(10000, 12, 0);
      const comTR = calcularCorrecaoFGTS(10000, 12, 0.1); // 0.1% TR mensal
      expect(comTR).toBeGreaterThan(semTR);
    });

    it('deve retornar saldo original para 0 meses', () => {
      const saldoCorrigido = calcularCorrecaoFGTS(10000, 0, 0);
      expect(saldoCorrigido).toBe(10000);
    });
  });

  describe('Casos especiais', () => {
    it('deve manter precisão de 2 casas decimais', () => {
      const resultado = calcularFGTS(1234.567);
      const decimais = resultado.deposito.toString().split('.')[1]?.length || 0;
      expect(decimais).toBeLessThanOrEqual(2);
    });

    it('deve calcular corretamente para valores fracionados', () => {
      const resultado = calcularFGTSRescisorio(12345.67, 'sem_justa_causa');
      expect(resultado.multa).toBe(4938.27);
    });
  });
});
