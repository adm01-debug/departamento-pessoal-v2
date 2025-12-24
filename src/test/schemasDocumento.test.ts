import { describe, it, expect } from 'vitest';
import * as schemasDocumento from '@/lib/schemasDocumento';

describe('schemasDocumento', () => {
  it('deve estar definido', () => { expect(schemasDocumento).toBeDefined(); });
  it('deve ter schema de documento', () => { 
    expect(schemasDocumento.documentoSchema || schemasDocumento.DocumentoSchema).toBeDefined(); 
  });
  it('deve ter tipos de documento', () => { 
    expect(schemasDocumento.tiposDocumento || schemasDocumento.TIPOS_DOCUMENTO).toBeDefined(); 
  });
});
