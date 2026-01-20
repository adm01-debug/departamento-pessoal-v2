// V18-C005: Testes Media Variaveis Ferias
import { describe, it, expect } from 'vitest';
import { calcularMediaVariaveisFerias } from '../mediaVariaveisFerias';

describe('Calculadora Media Variaveis Ferias', () => {
  it('deve calcular media de variaveis', () => {
    const meses = [
      { horasExtras: 500, comissoes: 200, outros: 100 },
      { horasExtras: 600, comissoes: 300, outros: 150 },
      { horasExtras: 550, comissoes: 250, outros: 120 }
    ];
    const resultado = calcularMediaVariaveisFerias(meses);
    expect(resultado).toHaveProperty('mediaTotal');
    expect(resultado.mediaTotal).toBeGreaterThan(0);
  });

  it('deve retornar 0 para array vazio', () => {
    const resultado = calcularMediaVariaveisFerias([]);
    expect(resultado.mediaTotal).toBe(0);
  });
});
