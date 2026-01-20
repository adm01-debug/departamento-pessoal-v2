// V18-T052: Testes do Validador eSocial S-2399 (TSV Término)
import { describe, it, expect } from 'vitest';
import { validateS2399, DadosS2399 } from '../esocialS2399Validator';

describe('Validador eSocial S-2399 (TSV Término)', () => {
  const dadosValidos: DadosS2399 = {
    cpfTrab: '12345678901',
    dtTerm: '2026-01-31',
    mtvDesligTSV: '01'
  };

  describe('validateS2399', () => {
    it('deve validar dados completos', () => {
      const resultado = validateS2399(dadosValidos);
      expect(resultado.valid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it('deve exigir CPF do trabalhador', () => {
      const { cpfTrab, ...semCpf } = dadosValidos;
      const resultado = validateS2399(semCpf);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('CPF do trabalhador obrigatório');
    });

    it('deve exigir data término', () => {
      const { dtTerm, ...semData } = dadosValidos;
      const resultado = validateS2399(semData);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Data término obrigatória');
    });

    it('deve exigir motivo desligamento TSV', () => {
      const { mtvDesligTSV, ...semMotivo } = dadosValidos;
      const resultado = validateS2399(semMotivo);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Motivo desligamento TSV obrigatório');
    });
  });
});
