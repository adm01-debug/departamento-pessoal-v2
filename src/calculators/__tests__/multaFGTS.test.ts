// V18-T016: Testes da Calculadora Multa FGTS
import { describe, it, expect } from 'vitest';
import { calcularMultaFGTS } from '../multaFGTS';

describe('Calculadora Multa FGTS', () => {
  it('deve calcular multa de 40% para sem justa causa', () => {
    const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'sem_justa_causa' });
    expect(resultado.percentualMulta).toBe(40);
    expect(resultado.valorMulta).toBe(4000);
    expect(resultado.podeSacar).toBe(true);
  });

  it('deve calcular multa de 20% para acordo', () => {
    const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'acordo' });
    expect(resultado.percentualMulta).toBe(20);
    expect(resultado.valorMulta).toBe(2000);
    expect(resultado.percentualSaque).toBe(80);
  });

  it('não deve ter multa para justa causa', () => {
    const resultado = calcularMultaFGTS({ saldoFGTS: 10000, tipoRescisao: 'justa_causa' });
    expect(resultado.valorMulta).toBe(0);
    expect(resultado.podeSacar).toBe(false);
  });

  it('deve arredondar para 2 casas decimais', () => {
    const resultado = calcularMultaFGTS({ saldoFGTS: 12345.67, tipoRescisao: 'sem_justa_causa' });
    expect(resultado.valorMulta.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});
