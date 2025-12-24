import { describe, it, expect } from 'vitest';
import * as esocialEventosPeriodicos from '@/lib/esocialEventosPeriodicos';

describe('esocialEventosPeriodicos', () => {
  it('deve estar definido', () => { expect(esocialEventosPeriodicos).toBeDefined(); });
  it('deve ter eventos S-1200', () => { 
    expect(esocialEventosPeriodicos.S1200 || esocialEventosPeriodicos.remuneracaoTrabalhador).toBeDefined(); 
  });
  it('deve ter eventos S-1210', () => { 
    expect(esocialEventosPeriodicos.S1210 || esocialEventosPeriodicos.pagamentoRendimentos).toBeDefined(); 
  });
  it('deve ter função de gerar XML', () => { 
    expect(esocialEventosPeriodicos.gerarXML || esocialEventosPeriodicos.toXML).toBeDefined(); 
  });
});
