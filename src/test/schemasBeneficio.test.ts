import { describe, it, expect } from 'vitest';
import * as schemasBeneficio from '@/lib/schemasBeneficio';

describe('schemasBeneficio', () => {
  it('deve estar definido', () => { expect(schemasBeneficio).toBeDefined(); });
  it('deve ter schema de benefício', () => { 
    expect(schemasBeneficio.beneficioSchema || schemasBeneficio.BeneficioSchema).toBeDefined(); 
  });
  it('deve ter tipos de benefício', () => { 
    expect(schemasBeneficio.tiposBeneficio || schemasBeneficio.TIPOS_BENEFICIO).toBeDefined(); 
  });
});
