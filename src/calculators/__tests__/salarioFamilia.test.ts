// V18-T024: Testes da Calculadora Salário Família 2026
import { describe, it, expect } from 'vitest';
import { 
  calcularSalarioFamilia, 
  calcularSalarioFamiliaDetalhado, 
  getLimiteSalarioFamilia, 
  getValorCotaSalarioFamilia 
} from '../salarioFamilia';

describe('Calculadora Salário Família 2026', () => {
  describe('calcularSalarioFamilia', () => {
    it('deve calcular para 1 dependente', () => {
      const resultado = calcularSalarioFamilia(1500, 1);
      expect(resultado).toBe(67.54);
    });

    it('deve calcular para múltiplos dependentes', () => {
      const resultado = calcularSalarioFamilia(1500, 3);
      expect(resultado).toBe(202.62); // 67.54 * 3
    });

    it('não deve pagar se salário acima do limite', () => {
      const resultado = calcularSalarioFamilia(2500, 2);
      expect(resultado).toBe(0);
    });

    it('não deve pagar sem dependentes', () => {
      const resultado = calcularSalarioFamilia(1500, 0);
      expect(resultado).toBe(0);
    });

    it('deve pagar no limite exato', () => {
      const limite = getLimiteSalarioFamilia();
      const resultado = calcularSalarioFamilia(limite, 1);
      expect(resultado).toBe(67.54);
    });
  });

  describe('calcularSalarioFamiliaDetalhado', () => {
    it('deve retornar objeto completo com direito', () => {
      const resultado = calcularSalarioFamiliaDetalhado(1500, 2);
      expect(resultado.temDireito).toBe(true);
      expect(resultado.cotas).toBe(2);
      expect(resultado.valor).toBe(135.08);
    });

    it('deve retornar objeto sem direito', () => {
      const resultado = calcularSalarioFamiliaDetalhado(3000, 2);
      expect(resultado.temDireito).toBe(false);
      expect(resultado.valor).toBe(0);
    });

    it('deve informar limite de renda', () => {
      const resultado = calcularSalarioFamiliaDetalhado(1500, 1);
      expect(resultado.limiteRenda).toBe(1980.38);
    });

    it('deve informar valor da cota', () => {
      const resultado = calcularSalarioFamiliaDetalhado(1500, 1);
      expect(resultado.valorCota).toBe(67.54);
    });
  });

  describe('Funções auxiliares', () => {
    it('getLimiteSalarioFamilia deve retornar R$ 1.980,38', () => {
      expect(getLimiteSalarioFamilia()).toBe(1980.38);
    });

    it('getValorCotaSalarioFamilia deve retornar R$ 67,54', () => {
      expect(getValorCotaSalarioFamilia()).toBe(67.54);
    });
  });
});
