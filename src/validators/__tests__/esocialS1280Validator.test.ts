// V18: Testes Validador eSocial S1280
import { describe, it, expect } from 'vitest';
import { validateS1280 } from '../esocialS1280Validator';

describe('Validador eSocial S1280', () => {
  it('deve validar estrutura', () => {
    const result = validateS1280({});
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
  });
  it('deve retornar array de erros', () => {
    const result = validateS1280({});
    expect(Array.isArray(result.errors)).toBe(true);
  });
});
