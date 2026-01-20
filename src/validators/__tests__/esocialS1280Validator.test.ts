// V18-T035: Testes do Validador eSocial S-1280 (Informações Complementares)
import { describe, it, expect } from 'vitest';
import { validateS1280, DadosS1280 } from '../esocialS1280Validator';

describe('Validador eSocial S-1280 (Informações Complementares)', () => {
  describe('validateS1280', () => {
    it('deve validar dados completos', () => {
      const resultado = validateS1280({ perApur: '2026-01', qtdDiasTrab: 22 });
      expect(resultado.valid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it('deve exigir período de apuração', () => {
      const resultado = validateS1280({});
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Período de apuração obrigatório');
    });

    it('deve aceitar qtdDiasTrab opcional', () => {
      const resultado = validateS1280({ perApur: '2026-01' });
      expect(resultado.valid).toBe(true);
    });
  });
});
