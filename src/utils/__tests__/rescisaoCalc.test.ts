import { describe, it, expect } from 'vitest';
import { calcINSS, calcIRRF, calcularRescisao, fmt } from '../rescisaoCalc';

describe('calcINSS', () => {
  it('should return 0 for salary 0', () => {
    expect(calcINSS(0)).toBe(0);
  });

  it('should calculate first bracket correctly (7.5%)', () => {
    const result = calcINSS(1518);
    expect(result).toBeCloseTo(1518 * 0.075, 2);
  });

  it('should calculate progressive brackets for salary 3000', () => {
    const result = calcINSS(3000);
    const expected = 1518 * 0.075 + (2793.88 - 1518) * 0.09 + (3000 - 2793.88) * 0.12;
    expect(result).toBeCloseTo(expected, 2);
  });

  it('should calculate all 4 brackets for high salary', () => {
    const result = calcINSS(8000);
    const expected =
      1518 * 0.075 +
      (2793.88 - 1518) * 0.09 +
      (4190.83 - 2793.88) * 0.12 +
      (8000 - 4190.83) * 0.14;
    expect(result).toBeCloseTo(expected, 2);
  });

  it('should cap at ceiling 8157.41', () => {
    const r1 = calcINSS(8157.41);
    const r2 = calcINSS(20000);
    expect(r2).toBeCloseTo(r1, 2);
  });
});

describe('calcIRRF', () => {
  it('should return 0 for base below threshold', () => {
    expect(calcIRRF(2000)).toBe(0);
    expect(calcIRRF(2259.20)).toBe(0);
  });

  it('should calculate 7.5% bracket', () => {
    const base = 2500;
    expect(calcIRRF(base)).toBeCloseTo(base * 0.075 - 169.44, 2);
  });

  it('should calculate 15% bracket', () => {
    const base = 3500;
    expect(calcIRRF(base)).toBeCloseTo(base * 0.15 - 381.44, 2);
  });

  it('should calculate 22.5% bracket', () => {
    const base = 4500;
    expect(calcIRRF(base)).toBeCloseTo(base * 0.225 - 662.77, 2);
  });

  it('should calculate 27.5% bracket', () => {
    const base = 10000;
    expect(calcIRRF(base)).toBeCloseTo(base * 0.275 - 896.00, 2);
  });
});

describe('calcularRescisao', () => {
  const baseParams = {
    salario: 5000,
    dataAdmissao: '2020-03-15',
    dataDesligamento: '2026-03-22',
    tipo: 'sem_justa_causa',
    avisoTrabalhado: false,
    feriasVencidas: false,
    saldoFGTS: 15000,
  };

  it('should return all required fields', () => {
    const result = calcularRescisao(baseParams);
    expect(result).toHaveProperty('saldoSalario');
    expect(result).toHaveProperty('avisoIndenizado');
    expect(result).toHaveProperty('feriasProporcionais');
    expect(result).toHaveProperty('tercoFerias');
    expect(result).toHaveProperty('decimoTerceiro');
    expect(result).toHaveProperty('multaFGTS');
    expect(result).toHaveProperty('totalProventos');
    expect(result).toHaveProperty('inss');
    expect(result).toHaveProperty('irrf');
    expect(result).toHaveProperty('totalDescontos');
    expect(result).toHaveProperty('totalLiquido');
    expect(result).toHaveProperty('diasTrabalhados');
    expect(result).toHaveProperty('diasAviso');
  });

  it('should calculate saldo salario correctly', () => {
    const result = calcularRescisao(baseParams);
    const diasNoMes = 31; // March
    const diasTrabalhados = 22;
    expect(result.saldoSalario).toBeCloseTo((5000 / diasNoMes) * diasTrabalhados, 2);
    expect(result.diasTrabalhados).toBe(22);
  });

  it('should calculate aviso proporcional for 6 years (30 + 18 = 48 dias)', () => {
    const result = calcularRescisao(baseParams);
    expect(result.diasAviso).toBe(48);
    expect(result.avisoIndenizado).toBeCloseTo((5000 / 30) * 48, 2);
  });

  it('should cap aviso prévio at 90 days', () => {
    const result = calcularRescisao({
      ...baseParams,
      dataAdmissao: '2000-01-01',
    });
    expect(result.diasAviso).toBe(90);
  });

  it('should not give aviso indenizado when aviso trabalhado', () => {
    const result = calcularRescisao({ ...baseParams, avisoTrabalhado: true });
    expect(result.avisoIndenizado).toBe(0);
  });

  it('should not give aviso for justa_causa', () => {
    const result = calcularRescisao({ ...baseParams, tipo: 'justa_causa' });
    expect(result.avisoIndenizado).toBe(0);
    expect(result.feriasProporcionais).toBe(0);
    expect(result.decimoTerceiro).toBe(0);
    expect(result.multaFGTS).toBe(0);
  });

  it('should not give multa FGTS for pedido_demissao', () => {
    const result = calcularRescisao({ ...baseParams, tipo: 'pedido_demissao' });
    expect(result.multaFGTS).toBe(0);
  });

  it('should include férias vencidas when flagged', () => {
    const result = calcularRescisao({ ...baseParams, feriasVencidas: true });
    expect(result.feriasVencidas).toBe(5000);
  });

  it('should calculate multa FGTS at 40%', () => {
    const result = calcularRescisao(baseParams);
    const expectedFgts = (result.saldoSalario + result.avisoIndenizado) * 0.08;
    expect(result.fgtsRescisao).toBeCloseTo(expectedFgts, 2);
    expect(result.multaFGTS).toBeCloseTo((15000 + expectedFgts) * 0.40, 2);
  });

  it('should have totalLiquido = totalProventos - totalDescontos + multaFGTS', () => {
    const result = calcularRescisao(baseParams);
    expect(result.totalLiquido).toBeCloseTo(
      result.totalProventos - result.totalDescontos + result.multaFGTS,
      2
    );
  });

  it('should calculate 13º proporcional based on months worked', () => {
    const result = calcularRescisao(baseParams);
    // March = month 3, so 3/12
    expect(result.meses13).toBe(3);
    expect(result.decimoTerceiro).toBeCloseTo((5000 / 12) * 3, 2);
  });
});

describe('fmt', () => {
  it('should format numbers with 2 decimal places', () => {
    expect(fmt(1234.5)).toBe('1.234,50');
  });

  it('should format 0 correctly', () => {
    expect(fmt(0)).toBe('0,00');
  });

  it('should format large numbers with thousands separator', () => {
    const result = fmt(123456.78);
    expect(result).toBe('123.456,78');
  });
});
