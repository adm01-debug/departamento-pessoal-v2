// V18-C007: Testes Reflexos em Verbas
import { describe, it, expect } from 'vitest';
import { calcularReflexosVerbas } from '../reflexosVerbas';

describe('Calculadora Reflexos Verbas', () => {
  it('deve calcular reflexos com variaveis', () => {
    const resultado = calcularReflexosVerbas(500, 300, 3000, 12);
    expect(resultado.reflexoFerias).toBeGreaterThan(0);
    expect(resultado.reflexoDecimoTerceiro).toBeGreaterThan(0);
    expect(resultado.reflexoFGTS).toBeGreaterThan(0);
    expect(resultado.totalReflexos).toBeGreaterThan(0);
  });

  it('deve retornar 0 sem variaveis', () => {
    const resultado = calcularReflexosVerbas(0, 0, 3000, 12);
    expect(resultado.totalReflexos).toBe(0);
  });

  it('deve calcular FGTS 8% sobre reflexos', () => {
    const resultado = calcularReflexosVerbas(1000, 0, 3000, 12);
    const somaReflexos = resultado.reflexoFerias + resultado.reflexoDecimoTerceiro + resultado.reflexoAvisoPrevio;
    expect(resultado.reflexoFGTS).toBeCloseTo(somaReflexos * 0.08, 2);
  });
});
