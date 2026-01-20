// V18-T022: Testes da Calculadora Auxílio Doença
import { describe, it, expect } from 'vitest';
import { 
  calcularAuxilioDoenca, 
  DIAS_EMPRESA, 
  PERCENTUAL_BENEFICIO 
} from '../auxilioDoenca';

describe('Calculadora Auxílio Doença', () => {
  describe('calcularAuxilioDoenca', () => {
    it('empresa paga primeiros 15 dias', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 30 });
      expect(resultado.diasEmpresa).toBe(15);
    });

    it('INSS paga a partir do 16º dia', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 30 });
      expect(resultado.diasINSS).toBe(15);
    });

    it('se afastamento <= 15 dias, tudo é empresa', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 10 });
      expect(resultado.diasEmpresa).toBe(10);
      expect(resultado.diasINSS).toBe(0);
    });

    it('deve calcular valor empresa corretamente', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 30 });
      expect(resultado.valorEmpresa).toBe(1500); // 3000/30 * 15
    });

    it('INSS paga 91% do salário', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 30 });
      const valorDia = 3000 / 30;
      const valorDiaINSS = valorDia * 0.91;
      expect(resultado.valorINSS).toBeCloseTo(valorDiaINSS * 15, 0);
    });

    it('deve calcular valor total', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 30 });
      expect(resultado.valorTotal).toBe(resultado.valorEmpresa + resultado.valorINSS);
    });

    it('sem carência, INSS não paga', () => {
      const resultado = calcularAuxilioDoenca({ salarioContribuicao: 3000, diasAfastamento: 30, carencia: false });
      expect(resultado.valorINSS).toBe(0);
    });
  });

  describe('Constantes', () => {
    it('empresa paga 15 dias', () => {
      expect(DIAS_EMPRESA).toBe(15);
    });

    it('INSS paga 91%', () => {
      expect(PERCENTUAL_BENEFICIO).toBe(91);
    });
  });
});
