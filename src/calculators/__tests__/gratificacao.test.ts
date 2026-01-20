// V18-T018: Testes da Calculadora Gratificação
import { describe, it, expect } from 'vitest';
import { calcularGratificacao, ParamsGratificacao } from '../gratificacao';

describe('Calculadora Gratificação', () => {
  describe('calcularGratificacao', () => {
    it('deve calcular gratificação por percentual', () => {
      const resultado = calcularGratificacao({ salarioBase: 3000, percentual: 20 });
      expect(resultado).toBe(600); // 20% de 3000
    });

    it('deve usar valor fixo quando informado', () => {
      const resultado = calcularGratificacao({ salarioBase: 3000, valorFixo: 500 });
      expect(resultado).toBe(500);
    });

    it('deve priorizar valor fixo sobre percentual', () => {
      const resultado = calcularGratificacao({ salarioBase: 3000, percentual: 20, valorFixo: 400 });
      expect(resultado).toBe(400);
    });

    it('deve calcular proporcional aos meses trabalhados', () => {
      const resultado = calcularGratificacao({ salarioBase: 3000, percentual: 20, mesesTrabalhados: 6 });
      expect(resultado).toBe(300); // 600 * 6/12
    });

    it('deve usar 12 meses como padrão', () => {
      const resultado = calcularGratificacao({ salarioBase: 3000, percentual: 10 });
      expect(resultado).toBe(300);
    });

    it('deve retornar 0 sem percentual nem valor fixo', () => {
      const resultado = calcularGratificacao({ salarioBase: 3000 });
      expect(resultado).toBe(0);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularGratificacao({ salarioBase: 3333.33, percentual: 17, mesesTrabalhados: 7 });
      expect(resultado.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
