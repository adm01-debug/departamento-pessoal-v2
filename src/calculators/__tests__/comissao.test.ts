// V18-T019: Testes da Calculadora Comissão
import { describe, it, expect } from 'vitest';
import { calcularComissao, ParamsComissao, ResultComissao } from '../comissao';

describe('Calculadora Comissão', () => {
  describe('calcularComissao', () => {
    it('deve calcular comissão base por percentual', () => {
      const resultado = calcularComissao({ valorVendas: 10000, percentual: 5 });
      expect(resultado.comissaoBase).toBe(500);
    });

    it('deve retornar total igual a base sem meta', () => {
      const resultado = calcularComissao({ valorVendas: 10000, percentual: 5 });
      expect(resultado.totalComissao).toBe(500);
    });

    it('deve indicar se atingiu meta', () => {
      const resultado = calcularComissao({ valorVendas: 15000, percentual: 5, metaMinima: 10000 });
      expect(resultado.atingiuMeta).toBe(true);
    });

    it('deve indicar se não atingiu meta', () => {
      const resultado = calcularComissao({ valorVendas: 8000, percentual: 5, metaMinima: 10000 });
      expect(resultado.atingiuMeta).toBe(false);
    });

    it('deve adicionar bônus quando atinge meta', () => {
      const resultado = calcularComissao({ valorVendas: 15000, percentual: 5, metaMinima: 10000, bonusMeta: 200 });
      expect(resultado.bonus).toBe(200);
      expect(resultado.totalComissao).toBe(950); // 750 + 200
    });

    it('não deve dar bônus se não atingir meta', () => {
      const resultado = calcularComissao({ valorVendas: 8000, percentual: 5, metaMinima: 10000, bonusMeta: 200 });
      expect(resultado.bonus).toBe(0);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularComissao({ valorVendas: 12345.67, percentual: 7.5 });
      expect(resultado.comissaoBase.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
