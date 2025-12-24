import { describe, it, expect } from 'vitest';
import * as schemasEmpresa from '@/lib/schemasEmpresa';

describe('schemasEmpresa', () => {
  it('deve estar definido', () => { expect(schemasEmpresa).toBeDefined(); });
  it('deve ter schema de empresa', () => { 
    expect(schemasEmpresa.empresaSchema || schemasEmpresa.EmpresaSchema).toBeDefined(); 
  });
  it('deve ter regimes tributários', () => { 
    expect(schemasEmpresa.regimesTributarios || schemasEmpresa.REGIMES_TRIBUTARIOS).toBeDefined(); 
  });
});
