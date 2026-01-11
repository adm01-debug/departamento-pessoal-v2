// V16-FIX: Tests for Ponto Sequence Validator
import { describe, it, expect } from 'vitest';
import { validatePontoSequence, canRegister } from '@/validators/pontoSequenceValidator';

describe('pontoSequenceValidator', () => {
  describe('validatePontoSequence', () => {
    it('deve validar sequência correta', () => {
      const result = validatePontoSequence({
        entrada_1: '08:00',
        saida_1: '12:00',
        entrada_2: '13:00',
        saida_2: '17:00',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve detectar saída sem entrada', () => {
      const result = validatePontoSequence({
        saida_1: '12:00',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Saída 1 registrada sem entrada 1');
    });

    it('deve detectar ordem cronológica errada', () => {
      const result = validatePontoSequence({
        entrada_1: '12:00',
        saida_1: '08:00',
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Saída 1 deve ser após entrada 1');
    });

    it('deve alertar intervalo curto', () => {
      const result = validatePontoSequence({
        entrada_1: '08:00',
        saida_1: '12:00',
        entrada_2: '12:30', // só 30 min de intervalo
        saida_2: '17:00',
      });
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('deve identificar próxima batida esperada', () => {
      expect(validatePontoSequence({}).nextExpected).toBe('entrada');
      expect(validatePontoSequence({ entrada_1: '08:00' }).nextExpected).toBe('saida');
      expect(validatePontoSequence({ entrada_1: '08:00', saida_1: '12:00' }).nextExpected).toBe('entrada');
    });
  });

  describe('canRegister', () => {
    it('deve permitir entrada quando esperada', () => {
      const result = canRegister({}, 'entrada');
      expect(result.allowed).toBe(true);
    });

    it('deve negar saída quando entrada é esperada', () => {
      const result = canRegister({}, 'saida');
      expect(result.allowed).toBe(false);
    });

    it('deve negar quando dia completo', () => {
      const result = canRegister({
        entrada_1: '08:00', saida_1: '12:00',
        entrada_2: '13:00', saida_2: '17:00',
        entrada_3: '18:00', saida_3: '20:00',
      }, 'entrada');
      expect(result.allowed).toBe(false);
    });
  });
});
