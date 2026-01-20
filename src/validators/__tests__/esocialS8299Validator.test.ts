// V18-T061: Testes do Validador eSocial S-8299 (Download)
import { describe, it, expect } from 'vitest';
import { validateS8299, DadosS8299 } from '../esocialS8299Validator';

describe('Validador eSocial S-8299 (Download)', () => {
  describe('validateS8299', () => {
    it('deve validar dados completos', () => {
      const resultado = validateS8299({ perApur: '2026-01' });
      expect(resultado.valid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it('deve exigir período de apuração', () => {
      const resultado = validateS8299({});
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Período de apuração obrigatório');
    });
  });
});
