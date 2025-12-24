import { describe, it, expect } from 'vitest';
import * as schemasDesligamento from '@/lib/schemasDesligamento';

describe('schemasDesligamento', () => {
  it('deve estar definido', () => { expect(schemasDesligamento).toBeDefined(); });
  it('deve ter schema de desligamento', () => { 
    expect(schemasDesligamento.desligamentoSchema || schemasDesligamento.DesligamentoSchema).toBeDefined(); 
  });
  it('deve ter motivos de desligamento', () => { 
    expect(schemasDesligamento.motivosDesligamento || schemasDesligamento.MOTIVOS_DESLIGAMENTO).toBeDefined(); 
  });
});
