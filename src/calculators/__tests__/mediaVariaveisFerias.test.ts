// V18-C005: Testes Media Variaveis Ferias
import { describe, it, expect } from 'vitest';
import { calcularMediaVariaveis } from '../mediaVariaveisFerias';

describe('Calculadora Media Variaveis Ferias', () => {
  it('deve calcular media de variaveis', () => {
    const meses = [
      { horasExtras: 500, comissoes: 200, adicionalNoturno: 0, outros: 100 },
      { horasExtras: 600, comissoes: 300, adicionalNoturno: 0, outros: 150 },
      { horasExtras: 550, comissoes: 250, adicionalNoturno: 0, outros: 120 }
    ];
    const resultado = calcularMediaVariaveis(meses, 3);
    expect(resultado.total).toBeGreaterThan(0);
  });

  it('deve retornar 0 para array vazio', () => {
    const resultado = calcularMediaVariaveis([]);
    expect(resultado.total).toBe(0);
  });
});
