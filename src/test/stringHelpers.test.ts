import { describe, it, expect } from 'vitest';
import * as stringHelpers from '@/lib/stringHelpers';

describe('stringHelpers', () => {
  it('deve estar definido', () => { expect(stringHelpers).toBeDefined(); });
  it('deve ter função de formatar CPF', () => { 
    expect(stringHelpers.formatCPF || stringHelpers.formatarCPF).toBeDefined(); 
  });
  it('deve ter função de formatar CNPJ', () => { 
    expect(stringHelpers.formatCNPJ || stringHelpers.formatarCNPJ).toBeDefined(); 
  });
  it('deve ter função de remover acentos', () => { 
    expect(stringHelpers.removeAccents || stringHelpers.removerAcentos).toBeDefined(); 
  });
  it('deve ter função de capitalizar', () => { 
    expect(stringHelpers.capitalize || stringHelpers.capitalizar).toBeDefined(); 
  });
});
