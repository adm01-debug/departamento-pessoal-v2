import { describe, it, expect } from 'vitest';
import * as esocialEventosSST from '@/lib/esocialEventosSST';

describe('esocialEventosSST', () => {
  it('deve estar definido', () => { expect(esocialEventosSST).toBeDefined(); });
  it('deve ter eventos S-2210 (CAT)', () => { 
    expect(esocialEventosSST.S2210 || esocialEventosSST.comunicacaoAcidente).toBeDefined(); 
  });
  it('deve ter eventos S-2220 (ASO)', () => { 
    expect(esocialEventosSST.S2220 || esocialEventosSST.monitoramentoSaude).toBeDefined(); 
  });
  it('deve ter eventos S-2240 (Condições Ambientais)', () => { 
    expect(esocialEventosSST.S2240 || esocialEventosSST.condicoesAmbientais).toBeDefined(); 
  });
});
