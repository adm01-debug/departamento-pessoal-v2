import { describe, it, expect } from 'vitest';
import * as schemasAfastamento from '@/lib/schemasAfastamento';

describe('schemasAfastamento', () => {
  it('deve estar definido', () => { expect(schemasAfastamento).toBeDefined(); });
  it('deve ter schema de afastamento', () => { 
    expect(schemasAfastamento.afastamentoSchema || schemasAfastamento.AfastamentoSchema).toBeDefined(); 
  });
  it('deve ter tipos de afastamento', () => { 
    expect(schemasAfastamento.tiposAfastamento || schemasAfastamento.TIPOS_AFASTAMENTO).toBeDefined(); 
  });
});
