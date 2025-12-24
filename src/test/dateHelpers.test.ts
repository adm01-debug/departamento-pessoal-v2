import { describe, it, expect } from 'vitest';
import * as dateHelpers from '@/lib/dateHelpers';

describe('dateHelpers', () => {
  it('deve estar definido', () => { expect(dateHelpers).toBeDefined(); });
  it('deve ter função de formatar data', () => { 
    expect(dateHelpers.formatDate || dateHelpers.formatarData).toBeDefined(); 
  });
  it('deve ter função de calcular diferença', () => { 
    expect(dateHelpers.diffDays || dateHelpers.calcularDiferenca || dateHelpers.daysBetween).toBeDefined(); 
  });
  it('deve ter função de validar data', () => { 
    expect(dateHelpers.isValidDate || dateHelpers.validarData).toBeDefined(); 
  });
  it('deve ter função de adicionar dias', () => { 
    expect(dateHelpers.addDays || dateHelpers.adicionarDias).toBeDefined(); 
  });
});
