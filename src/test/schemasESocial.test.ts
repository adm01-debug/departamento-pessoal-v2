import { describe, it, expect } from 'vitest';
import * as schemasESocial from '@/lib/schemasESocial';

describe('schemasESocial', () => {
  it('deve estar definido', () => { expect(schemasESocial).toBeDefined(); });
  it('deve ter schema de evento', () => { 
    expect(schemasESocial.eventoSchema || schemasESocial.EventoSchema).toBeDefined(); 
  });
  it('deve ter tipos de evento', () => { 
    expect(schemasESocial.tiposEvento || schemasESocial.TIPOS_EVENTO).toBeDefined(); 
  });
});
