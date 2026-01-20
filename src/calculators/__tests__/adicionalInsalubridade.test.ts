// V18-T010: Testes da Calculadora Adicional Insalubridade
import { describe, it, expect } from 'vitest';
import {
  calcularInsalubridade,
  calcularInsalubridadeDetalhado,
  getSalarioMinimoBase,
  getTabelaInsalubridade,
  PERCENTUAIS_INSALUBRIDADE,
  GrauInsalubridade
} from '../adicionalInsalubridade';

describe('Calculadora Adicional Insalubridade', () => {
  describe('calcularInsalubridade', () => {
    it('deve calcular grau mínimo (10%)', () => {
      const resultado = calcularInsalubridade({ grau: 'minimo' });
      expect(resultado).toBe(162.1); // 1621 * 10%
    });

    it('deve calcular grau médio (20%)', () => {
      const resultado = calcularInsalubridade({ grau: 'medio' });
      expect(resultado).toBe(324.2); // 1621 * 20%
    });

    it('deve calcular grau máximo (40%)', () => {
      const resultado = calcularInsalubridade({ grau: 'maximo' });
      expect(resultado).toBe(648.4); // 1621 * 40%
    });

    it('deve aceitar base de cálculo customizada', () => {
      const resultado = calcularInsalubridade({ grau: 'medio', baseCalculo: 2000 });
      expect(resultado).toBe(400); // 2000 * 20%
    });

    it('deve usar salário mínimo como base padrão', () => {
      const resultado = calcularInsalubridade({ grau: 'minimo' });
      const esperado = getSalarioMinimoBase() * 0.10;
      expect(resultado).toBe(esperado);
    });
  });

  describe('calcularInsalubridadeDetalhado', () => {
    it('deve retornar objeto completo', () => {
      const resultado = calcularInsalubridadeDetalhado({ grau: 'maximo' });
      expect(resultado.valor).toBe(648.4);
      expect(resultado.percentual).toBe(40);
      expect(resultado.grau).toBe('maximo');
      expect(resultado.baseCalculo).toBe(1621);
    });

    it('deve manter consistência com função simples', () => {
      const simples = calcularInsalubridade({ grau: 'medio' });
      const detalhado = calcularInsalubridadeDetalhado({ grau: 'medio' });
      expect(simples).toBe(detalhado.valor);
    });
  });

  describe('getSalarioMinimoBase', () => {
    it('deve retornar salário mínimo 2026', () => {
      expect(getSalarioMinimoBase()).toBe(1621);
    });
  });

  describe('getTabelaInsalubridade', () => {
    it('deve retornar tabela com 3 graus', () => {
      const tabela = getTabelaInsalubridade();
      expect(tabela.minimo).toBe(162.1);
      expect(tabela.medio).toBe(324.2);
      expect(tabela.maximo).toBe(648.4);
    });
  });

  describe('PERCENTUAIS_INSALUBRIDADE', () => {
    it('deve ter percentuais corretos', () => {
      expect(PERCENTUAIS_INSALUBRIDADE.minimo).toBe(10);
      expect(PERCENTUAIS_INSALUBRIDADE.medio).toBe(20);
      expect(PERCENTUAIS_INSALUBRIDADE.maximo).toBe(40);
    });
  });
});
