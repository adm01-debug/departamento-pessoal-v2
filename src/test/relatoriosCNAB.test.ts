import { describe, it, expect } from 'vitest';
import * as relatoriosCNAB from '@/lib/relatoriosCNAB';

describe('relatoriosCNAB', () => {
  it('deve estar definido', () => { expect(relatoriosCNAB).toBeDefined(); });
  it('deve ter função de gerar CNAB 240', () => { 
    expect(relatoriosCNAB.gerarCNAB240 || relatoriosCNAB.generateCNAB240).toBeDefined(); 
  });
  it('deve ter função de gerar CNAB 400', () => { 
    expect(relatoriosCNAB.gerarCNAB400 || relatoriosCNAB.generateCNAB400).toBeDefined(); 
  });
  it('deve ter função de validar layout', () => { 
    expect(relatoriosCNAB.validarLayout || relatoriosCNAB.validateLayout).toBeDefined(); 
  });
});
