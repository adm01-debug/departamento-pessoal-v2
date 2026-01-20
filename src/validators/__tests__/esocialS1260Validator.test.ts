// V18: Testes Validador eSocial S1260
import { describe, it, expect } from 'vitest';
import { validateS1260 } from '../esocialS1260Validator';

describe('Validador eSocial S1260', () => {
  it('deve validar estrutura', () => {
    const result = validateS1260({});
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
  });
  it('deve retornar array de erros', () => {
    const result = validateS1260({});
    expect(Array.isArray(result.errors)).toBe(true);
  });
});
