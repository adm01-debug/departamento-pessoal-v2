// V18-T015: Testes da Calculadora Provisões Contábeis
import { describe, it, expect } from 'vitest';
import { calcularProvisoes, ParamsProvisao, ResultProvisoes } from '../provisoes';

describe('Calculadora Provisões Contábeis', () => {
  describe('calcularProvisoes', () => {
    it('deve calcular provisão de férias (1/12 + 1/3)', () => {
      const resultado = calcularProvisoes({ salarioBruto: 3000 });
      // 3000/12 * 1.3333 = 333.33
      expect(resultado.provisaoFerias).toBeCloseTo(333.33, 0);
    });

    it('deve calcular provisão de 13º (1/12)', () => {
      const resultado = calcularProvisoes({ salarioBruto: 3000 });
      expect(resultado.provisao13).toBe(250); // 3000/12
    });

    it('deve calcular encargos sobre férias (36.8% padrão)', () => {
      const resultado = calcularProvisoes({ salarioBruto: 3000 });
      expect(resultado.provisaoEncargosFerias).toBeGreaterThan(0);
    });

    it('deve calcular encargos sobre 13º', () => {
      const resultado = calcularProvisoes({ salarioBruto: 3000 });
      expect(resultado.provisaoEncargos13).toBeGreaterThan(0);
    });

    it('deve calcular total mensal', () => {
      const resultado = calcularProvisoes({ salarioBruto: 3000 });
      const esperado = resultado.provisaoFerias + resultado.provisao13 + 
                       resultado.provisaoEncargosFerias + resultado.provisaoEncargos13;
      expect(resultado.totalMensal).toBeCloseTo(esperado, 1);
    });

    it('deve aceitar percentual de encargos customizado', () => {
      const padrao = calcularProvisoes({ salarioBruto: 3000 });
      const custom = calcularProvisoes({ salarioBruto: 3000, encargos: 40 });
      expect(custom.provisaoEncargosFerias).toBeGreaterThan(padrao.provisaoEncargosFerias);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularProvisoes({ salarioBruto: 3333.33 });
      expect(resultado.totalMensal.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('deve usar 36.8% como encargos padrão', () => {
      const resultado = calcularProvisoes({ salarioBruto: 1000 });
      // Encargos 13º = (1000/12) * 0.368 = 30.67
      expect(resultado.provisaoEncargos13).toBeCloseTo(30.67, 0);
    });
  });
});
