// V18-T011: Testes da Calculadora Pensão Alimentícia
import { describe, it, expect } from 'vitest';
import { calcularPensaoAlimenticia, ParamsPensao } from '../pensaoAlimenticia';

describe('Calculadora Pensão Alimentícia', () => {
  describe('calcularPensaoAlimenticia', () => {
    it('deve calcular pensão por percentual', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3000, percentual: 30 });
      expect(resultado.valorTotal).toBe(900);
    });

    it('deve usar valor fixo quando informado', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3000, valorFixo: 500 });
      expect(resultado.valorTotal).toBe(500);
    });

    it('deve priorizar valor fixo sobre percentual', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3000, percentual: 30, valorFixo: 400 });
      expect(resultado.valorTotal).toBe(400);
    });

    it('deve dividir entre beneficiários', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3000, percentual: 30, beneficiarios: 2 });
      expect(resultado.valorPorBeneficiario).toBe(450);
    });

    it('deve usar 1 beneficiário como padrão', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3000, percentual: 30 });
      expect(resultado.valorPorBeneficiario).toBe(resultado.valorTotal);
    });

    it('deve retornar base de cálculo', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 4500, percentual: 25 });
      expect(resultado.baseCalculo).toBe(4500);
    });

    it('deve retornar 0 sem percentual nem valor fixo', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3000 });
      expect(resultado.valorTotal).toBe(0);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularPensaoAlimenticia({ salarioLiquido: 3333.33, percentual: 33 });
      expect(resultado.valorTotal.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
