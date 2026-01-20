// V18-T017: Testes da Calculadora Aviso Prévio
import { describe, it, expect } from 'vitest';
import { calcularAvisoPrevio, TipoAviso, ParamsAviso } from '../avisoPrevio';

describe('Calculadora Aviso Prévio', () => {
  describe('calcularAvisoPrevio', () => {
    it('deve calcular 30 dias base', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'indenizado', anosServico: 0, salario: 3000 });
      expect(resultado.diasBase).toBe(30);
    });

    it('deve adicionar 3 dias por ano de serviço', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'indenizado', anosServico: 5, salario: 3000 });
      expect(resultado.diasAdicionais).toBe(15); // 5 * 3
      expect(resultado.diasAviso).toBe(45); // 30 + 15
    });

    it('deve limitar adicionais a 60 dias (máx 90 total)', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'indenizado', anosServico: 30, salario: 3000 });
      expect(resultado.diasAdicionais).toBe(60);
      expect(resultado.diasAviso).toBe(90);
    });

    it('deve calcular valor indenizado', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'indenizado', anosServico: 2, salario: 3000 });
      const valorDia = 3000 / 30;
      const esperado = valorDia * resultado.diasAviso;
      expect(resultado.valorIndenizado).toBeCloseTo(esperado, 1);
    });

    it('deve retornar 0 para aviso trabalhado', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'trabalhado', anosServico: 5, salario: 3000 });
      expect(resultado.valorIndenizado).toBe(0);
    });

    it('deve arredondar valor para 2 casas decimais', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'indenizado', anosServico: 3, salario: 3333.33 });
      expect(resultado.valorIndenizado.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('deve calcular para menos de 1 ano', () => {
      const resultado = calcularAvisoPrevio({ tipoAviso: 'indenizado', anosServico: 0.5, salario: 3000 });
      expect(resultado.diasAdicionais).toBe(0);
      expect(resultado.diasAviso).toBe(30);
    });
  });
});
