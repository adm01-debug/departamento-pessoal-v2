import { describe, it, expect } from 'vitest';
import * as esocialEventosTSV from '@/lib/esocialEventosTSV';

describe('esocialEventosTSV', () => {
  it('deve estar definido', () => { expect(esocialEventosTSV).toBeDefined(); });
  it('deve ter eventos S-2300 (TSV Início)', () => { 
    expect(esocialEventosTSV.S2300 || esocialEventosTSV.tsvInicio).toBeDefined(); 
  });
  it('deve ter eventos S-2306 (TSV Alteração)', () => { 
    expect(esocialEventosTSV.S2306 || esocialEventosTSV.tsvAlteracao).toBeDefined(); 
  });
  it('deve ter eventos S-2399 (TSV Término)', () => { 
    expect(esocialEventosTSV.S2399 || esocialEventosTSV.tsvTermino).toBeDefined(); 
  });
});
