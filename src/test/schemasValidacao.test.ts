import { describe, it, expect } from 'vitest';
import * as schemasValidacao from '@/lib/schemasValidacao';

describe('schemasValidacao', () => {
  it('deve estar definido', () => { expect(schemasValidacao).toBeDefined(); });
  it('deve ter schema de validação', () => { 
    expect(schemasValidacao.validacaoSchema || schemasValidacao.ValidacaoSchema).toBeDefined(); 
  });
  it('deve ter regras de validação', () => { 
    expect(schemasValidacao.regrasValidacao || schemasValidacao.REGRAS_VALIDACAO).toBeDefined(); 
  });
});
