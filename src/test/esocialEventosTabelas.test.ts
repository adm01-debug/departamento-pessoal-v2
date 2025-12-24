import { describe, it, expect } from 'vitest';
import * as esocialEventosTabelas from '@/lib/esocialEventosTabelas';

describe('esocialEventosTabelas', () => {
  it('deve estar definido', () => { expect(esocialEventosTabelas).toBeDefined(); });
  it('deve ter eventos S-1000 (Empregador)', () => { 
    expect(esocialEventosTabelas.S1000 || esocialEventosTabelas.empregador).toBeDefined(); 
  });
  it('deve ter eventos S-1005 (Estabelecimentos)', () => { 
    expect(esocialEventosTabelas.S1005 || esocialEventosTabelas.estabelecimentos).toBeDefined(); 
  });
  it('deve ter eventos S-1010 (Rubricas)', () => { 
    expect(esocialEventosTabelas.S1010 || esocialEventosTabelas.rubricas).toBeDefined(); 
  });
});
