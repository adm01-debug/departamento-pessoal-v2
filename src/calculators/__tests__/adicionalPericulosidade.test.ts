// V18-T009: Testes da Calculadora Adicional Periculosidade
import { describe, it, expect } from 'vitest';
import { calcularPericulosidade, calcularSalarioComPericulosidade, PERCENTUAL_PERICULOSIDADE } from '../adicionalPericulosidade';

describe('Calculadora Adicional Periculosidade', () => {
  describe('calcularPericulosidade', () => {
    it('deve calcular 30% do salário base', () => {
      const resultado = calcularPericulosidade({ salarioBase: 3000 });
      expect(resultado).toBe(900);
    });

    it('deve aceitar percentual customizado', () => {
      const resultado = calcularPericulosidade({ salarioBase: 3000, percentual: 25 });
      expect(resultado).toBe(750);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularPericulosidade({ salarioBase: 3333.33 });
      expect(resultado.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('deve calcular para salário mínimo', () => {
      const resultado = calcularPericulosidade({ salarioBase: 1518 });
      expect(resultado).toBe(455.4);
    });
  });

  describe('calcularSalarioComPericulosidade', () => {
    it('deve somar salário + 30%', () => {
      const resultado = calcularSalarioComPericulosidade(3000);
      expect(resultado).toBe(3900);
    });

    it('deve usar percentual padrão de 30%', () => {
      expect(PERCENTUAL_PERICULOSIDADE).toBe(30);
    });
  });
});
