// V18-T016: Testes da Calculadora Multa FGTS
import { describe, it, expect } from 'vitest';
import { calcularMultaFGTS, TipoRescisao, ParamsMultaFGTS } from '../multaFGTS';

describe('Calculadora Multa FGTS', () => {
  describe('calcularMultaFGTS', () => {
    describe('Sem justa causa', () => {
      it('deve calcular multa de 40%', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'sem_justa_causa' });
        expect(resultado.percentualMulta).toBe(40);
        expect(resultado.valorMulta).toBe(4000);
      });

      it('deve permitir saque integral', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'sem_justa_causa' });
        expect(resultado.saquePermitido).toBe(true);
        expect(resultado.percentualSaque).toBe(100);
      });
    });

    describe('Acordo (Reforma Trabalhista)', () => {
      it('deve calcular multa de 20%', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'acordo' });
        expect(resultado.percentualMulta).toBe(20);
        expect(resultado.valorMulta).toBe(2000);
      });

      it('deve permitir saque de 80%', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'acordo' });
        expect(resultado.percentualSaque).toBe(80);
      });
    });

    describe('Justa causa', () => {
      it('não deve ter multa', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'justa_causa' });
        expect(resultado.valorMulta).toBe(0);
      });

      it('não deve permitir saque', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'justa_causa' });
        expect(resultado.saquePermitido).toBe(false);
      });
    });

    describe('Pedido de demissão', () => {
      it('não deve ter multa', () => {
        const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'pedido_demissao' });
        expect(resultado.valorMulta).toBe(0);
      });
    });

    it('deve incluir depósitos do mês no saldo', () => {
      const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'sem_justa_causa', depositosMesRescisao: 500 });
      expect(resultado.saldoTotal).toBe(10500);
      expect(resultado.valorMulta).toBe(4200); // 40% de 10500
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularMultaFGTS({ saldoFGTS: 12345.67, tipoRescisao: 'sem_justa_causa' });
      expect(resultado.valorMulta.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
