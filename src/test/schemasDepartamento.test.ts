import { describe, it, expect } from 'vitest';
import * as schemasDepartamento from '@/lib/schemasDepartamento';

describe('schemasDepartamento', () => {
  it('deve estar definido', () => { expect(schemasDepartamento).toBeDefined(); });
  it('deve ter schema de departamento', () => { 
    expect(schemasDepartamento.departamentoSchema || schemasDepartamento.DepartamentoSchema).toBeDefined(); 
  });
});
