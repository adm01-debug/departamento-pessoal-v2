// V18-T031: Testes do Validador eSocial S-1200 (Remuneração)
import { describe, it, expect } from 'vitest';
import { validateS1200, DadosS1200 } from '../esocialS1200Validator';

describe('Validador eSocial S-1200 (Remuneração)', () => {
  const dadosValidos: DadosS1200 = {
    cpfTrab: '12345678901',
    matricula: 'MAT001',
    perApur: '2026-01',
    dmDev: [{
      codCateg: 101,
      infoPerApur: {
        ideEstabLot: { codLotacao: 'LOT001' },
        detVerbas: [
          { codRubr: 'RUB001', ideTabRubr: 'TAB001', vrRubr: 3000 }
        ]
      }
    }]
  };

  describe('validateS1200', () => {
    it('deve validar dados completos', () => {
      const resultado = validateS1200(dadosValidos);
      expect(resultado.valid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it('deve exigir CPF do trabalhador', () => {
      const { cpfTrab, ...semCpf } = dadosValidos;
      const resultado = validateS1200(semCpf);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('CPF do trabalhador obrigatório');
    });

    it('deve exigir matrícula', () => {
      const { matricula, ...semMatricula } = dadosValidos;
      const resultado = validateS1200(semMatricula);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Matrícula obrigatória');
    });

    it('deve exigir período de apuração', () => {
      const { perApur, ...semPeriodo } = dadosValidos;
      const resultado = validateS1200(semPeriodo);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Período de apuração obrigatório');
    });

    it('deve exigir demonstrativo de valores', () => {
      const { dmDev, ...semDm } = dadosValidos;
      const resultado = validateS1200(semDm);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Demonstrativo de valores obrigatório');
    });

    it('deve exigir verbas no demonstrativo', () => {
      const semVerbas = {
        ...dadosValidos,
        dmDev: [{ ...dadosValidos.dmDev[0], infoPerApur: { ideEstabLot: { codLotacao: 'LOT001' }, detVerbas: [] } }]
      };
      const resultado = validateS1200(semVerbas);
      expect(resultado.valid).toBe(false);
    });
  });
});
