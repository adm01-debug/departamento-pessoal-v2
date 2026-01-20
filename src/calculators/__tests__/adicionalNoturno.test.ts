// V18-T008: Testes da Calculadora Adicional Noturno
import { describe, it, expect } from 'vitest';
import { calcularAdicionalNoturno, ParamsNoturno, ResultNoturno } from '../adicionalNoturno';

describe('Calculadora Adicional Noturno', () => {
  const paramsBase: ParamsNoturno = { salarioBase: 2200, horasNoturnas: 40 };

  describe('calcularAdicionalNoturno', () => {
    it('deve calcular valor da hora normal', () => {
      const resultado = calcularAdicionalNoturno(paramsBase);
      expect(resultado.valorHoraNormal).toBe(10); // 2200/220
    });

    it('deve calcular valor da hora noturna com 20%', () => {
      const resultado = calcularAdicionalNoturno(paramsBase);
      expect(resultado.valorHoraNoturna).toBe(12); // 10 * 1.20
    });

    it('deve calcular adicional noturno total', () => {
      const resultado = calcularAdicionalNoturno(paramsBase);
      expect(resultado.adicionalNoturno).toBe(80); // 40 * 10 * 0.20
    });

    it('deve calcular horas noturnas reduzidas (52:30 = 60:00)', () => {
      const resultado = calcularAdicionalNoturno(paramsBase);
      expect(resultado.horasNoturnasReduzidas).toBeCloseTo(45.71, 1);
    });

    it('deve aceitar percentual customizado', () => {
      const params: ParamsNoturno = { ...paramsBase, percentualAdicional: 30 };
      const resultado = calcularAdicionalNoturno(params);
      expect(resultado.valorHoraNoturna).toBe(13); // 10 * 1.30
    });

    it('deve aceitar carga horária diferente', () => {
      const params: ParamsNoturno = { salarioBase: 1760, horasNoturnas: 20, cargaHorariaMensal: 176 };
      const resultado = calcularAdicionalNoturno(params);
      expect(resultado.valorHoraNormal).toBe(10);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const params: ParamsNoturno = { salarioBase: 3333.33, horasNoturnas: 17 };
      const resultado = calcularAdicionalNoturno(params);
      expect(resultado.adicionalNoturno.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
