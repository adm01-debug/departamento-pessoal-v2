import { describe, it, expect } from 'vitest';
import * as schemasPonto from '@/lib/schemasPonto';

describe('schemasPonto', () => {
  it('deve estar definido', () => { expect(schemasPonto).toBeDefined(); });
  it('deve ter schema de ponto', () => { 
    expect(schemasPonto.pontoSchema || schemasPonto.PontoSchema).toBeDefined(); 
  });
  it('deve ter tipos de registro', () => { 
    expect(schemasPonto.tiposRegistro || schemasPonto.TIPOS_REGISTRO).toBeDefined(); 
  });
});
