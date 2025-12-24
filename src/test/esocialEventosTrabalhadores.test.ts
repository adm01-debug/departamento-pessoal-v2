import { describe, it, expect } from 'vitest';
import * as esocialEventosTrabalhadores from '@/lib/esocialEventosTrabalhadores';

describe('esocialEventosTrabalhadores', () => {
  it('deve estar definido', () => { expect(esocialEventosTrabalhadores).toBeDefined(); });
  it('deve ter eventos S-2200 (Admissão)', () => { 
    expect(esocialEventosTrabalhadores.S2200 || esocialEventosTrabalhadores.admissao).toBeDefined(); 
  });
  it('deve ter eventos S-2206 (Alteração Contrato)', () => { 
    expect(esocialEventosTrabalhadores.S2206 || esocialEventosTrabalhadores.alteracaoContrato).toBeDefined(); 
  });
  it('deve ter eventos S-2299 (Desligamento)', () => { 
    expect(esocialEventosTrabalhadores.S2299 || esocialEventosTrabalhadores.desligamento).toBeDefined(); 
  });
});
