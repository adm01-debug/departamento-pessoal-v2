import { describe, it, expect } from 'vitest';
import { folhaCalc } from '../folhaCalc';

describe('Motor de Cálculo de Folha (folhaCalc)', () => {
  it('deve processar uma folha simples corretamente', () => {
    const salarioBase = 3000.00;
    const resultado = folhaCalc.processar(salarioBase);

    expect(resultado.proventos).toBe(3000.00);
    expect(resultado.inss).toBeGreaterThan(0);
    expect(resultado.liquido).toBeLessThan(3000.00);
    expect(resultado.detalheEventos).toContainEqual(
      expect.objectContaining({ codigo: '1000', valor: 3000.00 })
    );
  });

  it('deve incluir horas extras e DSR no cálculo', () => {
    const salarioBase = 2000.00;
    const resultado = folhaCalc.processar(salarioBase, {
      horasExtras50: 10,
      diasUteis: 26,
      domingosFeriados: 4
    });

    expect(resultado.proventos).toBeGreaterThan(2000.00);
    expect(resultado.horasExtras).toBeGreaterThan(0);
    expect(resultado.dsr).toBeGreaterThan(0);
  });

  it('deve calcular 13º salário quando solicitado', () => {
    const salarioBase = 5000.00;
    const resultado = folhaCalc.processar(salarioBase, {
      meses13: 12,
      parcela13: 1
    });

    expect(resultado.decimoTerceiro).toBe(2500.00); // 1ª parcela é 50%
  });
});
