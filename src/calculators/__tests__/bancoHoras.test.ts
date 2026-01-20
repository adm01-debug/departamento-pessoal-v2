// V18-T013: Testes da Calculadora Banco de Horas
import { describe, it, expect } from 'vitest';
import { calcularSaldoBancoHoras, calcularValorPagamento, MovimentacaoBH, SaldoBH } from '../bancoHoras';

describe('Calculadora Banco de Horas', () => {
  describe('calcularSaldoBancoHoras', () => {
    it('deve calcular saldo positivo (créditos)', () => {
      const movs: MovimentacaoBH[] = [
        { tipo: 'credito', minutos: 60, data: '2026-01-01' },
        { tipo: 'credito', minutos: 30, data: '2026-01-02' }
      ];
      const resultado = calcularSaldoBancoHoras(movs);
      expect(resultado.saldoMinutos).toBe(90);
    });

    it('deve calcular saldo negativo (débitos > créditos)', () => {
      const movs: MovimentacaoBH[] = [
        { tipo: 'credito', minutos: 60, data: '2026-01-01' },
        { tipo: 'debito', minutos: 120, data: '2026-01-02' }
      ];
      const resultado = calcularSaldoBancoHoras(movs);
      expect(resultado.saldoMinutos).toBe(-60);
    });

    it('deve formatar saldo corretamente', () => {
      const movs: MovimentacaoBH[] = [
        { tipo: 'credito', minutos: 150, data: '2026-01-01' }
      ];
      const resultado = calcularSaldoBancoHoras(movs);
      expect(resultado.saldoFormatado).toBe('2h30min');
    });

    it('deve formatar saldo negativo com sinal', () => {
      const movs: MovimentacaoBH[] = [
        { tipo: 'debito', minutos: 90, data: '2026-01-01' }
      ];
      const resultado = calcularSaldoBancoHoras(movs);
      expect(resultado.saldoFormatado).toBe('-1h30min');
    });

    it('deve retornar zero para lista vazia', () => {
      const resultado = calcularSaldoBancoHoras([]);
      expect(resultado.saldoMinutos).toBe(0);
    });

    it('deve calcular saldo em horas (decimal)', () => {
      const movs: MovimentacaoBH[] = [
        { tipo: 'credito', minutos: 90, data: '2026-01-01' }
      ];
      const resultado = calcularSaldoBancoHoras(movs);
      expect(resultado.saldoHoras).toBe(1.5);
    });
  });

  describe('calcularValorPagamento', () => {
    it('deve calcular valor de pagamento', () => {
      const valor = calcularValorPagamento(120, 15); // 2h * R$15
      expect(valor).toBe(30);
    });

    it('deve calcular valor fracionado', () => {
      const valor = calcularValorPagamento(90, 20); // 1.5h * R$20
      expect(valor).toBe(30);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const valor = calcularValorPagamento(67, 13.33);
      expect(valor.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('deve retornar 0 para saldo zero', () => {
      expect(calcularValorPagamento(0, 15)).toBe(0);
    });
  });
});
