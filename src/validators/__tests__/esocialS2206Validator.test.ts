// V18-T041: Testes do Validador eSocial S-2206 (Alteração Contratual)
import { describe, it, expect } from 'vitest';
import { validateS2206, DadosS2206 } from '../esocialS2206Validator';

describe('Validador eSocial S-2206 (Alteração Contratual)', () => {
  const dadosValidos: DadosS2206 = {
    cpfTrab: '12345678901',
    matricula: 'MAT001',
    dtAlteracao: '2026-01-15',
    vrSalFx: 3500
  };

  describe('validateS2206', () => {
    it('deve validar dados completos', () => {
      const resultado = validateS2206(dadosValidos);
      expect(resultado.valid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it('deve exigir CPF do trabalhador', () => {
      const { cpfTrab, ...semCpf } = dadosValidos;
      const resultado = validateS2206(semCpf);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('CPF do trabalhador obrigatório');
    });

    it('deve exigir matrícula', () => {
      const { matricula, ...semMatricula } = dadosValidos;
      const resultado = validateS2206(semMatricula);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Matrícula obrigatória');
    });

    it('deve exigir data da alteração', () => {
      const { dtAlteracao, ...semData } = dadosValidos;
      const resultado = validateS2206(semData);
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Data da alteração obrigatória');
    });

    it('deve validar valor do salário maior que zero', () => {
      const resultado = validateS2206({ ...dadosValidos, vrSalFx: 0 });
      expect(resultado.valid).toBe(false);
      expect(resultado.errors).toContain('Valor do salário deve ser maior que zero');
    });

    it('deve aceitar campos opcionais', () => {
      const resultado = validateS2206({
        cpfTrab: '12345678901',
        matricula: 'MAT001',
        dtAlteracao: '2026-01-15'
      });
      expect(resultado.valid).toBe(true);
    });
  });
});
