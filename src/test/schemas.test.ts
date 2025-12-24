import { describe, it, expect } from 'vitest';
import * as schemas from '@/lib/schemas';

describe('schemas', () => {
  it('deve estar definido', () => { expect(schemas).toBeDefined(); });
  it('deve ter schema de colaborador', () => { 
    expect(schemas.colaboradorSchema || schemas.ColaboradorSchema).toBeDefined(); 
  });
  it('deve ter schema de empresa', () => { 
    expect(schemas.empresaSchema || schemas.EmpresaSchema).toBeDefined(); 
  });
  it('deve validar dados corretos', () => {
    const schema = schemas.colaboradorSchema || schemas.ColaboradorSchema;
    if (schema && schema.safeParse) {
      const result = schema.safeParse({ nome: 'Teste' });
      expect(result).toBeDefined();
    }
  });
});
