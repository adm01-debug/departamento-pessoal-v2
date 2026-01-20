// V18-T026: Testes Validador eSocial S-1000
import { describe, it, expect } from 'vitest';
import { validateS1000, DadosS1000 } from '../esocialS1000Validator';

describe('Validador eSocial S-1000', () => {
  const dadosValidos: DadosS1000 = {
    tpInsc: 1, nrInsc: '12345678000199', nmRazao: 'Empresa Teste',
    classTrib: '01', indDesFolha: 0, indOptRegEletron: 1,
    nmCtt: 'Contato Teste', cpfCtt: '12345678901'
  };

  it('deve validar dados completos', () => {
    const result = validateS1000(dadosValidos);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('deve rejeitar sem tipo inscricao', () => {
    const result = validateS1000({ ...dadosValidos, tpInsc: undefined });
    expect(result.valid).toBe(false);
  });

  it('deve validar CNPJ com 14 digitos', () => {
    const result = validateS1000({ ...dadosValidos, nrInsc: '123' });
    expect(result.errors).toContain('CNPJ deve ter 14 dígitos');
  });

  it('deve validar CPF com 11 digitos para tpInsc=2', () => {
    const result = validateS1000({ ...dadosValidos, tpInsc: 2, nrInsc: '123' });
    expect(result.errors).toContain('CPF deve ter 11 dígitos');
  });

  it('deve validar email', () => {
    const result = validateS1000({ ...dadosValidos, email: 'invalido' });
    expect(result.errors).toContain('Email inválido');
  });
});
