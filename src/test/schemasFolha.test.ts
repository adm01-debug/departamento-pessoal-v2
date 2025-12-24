import { describe, it, expect } from 'vitest';
import * as schemasFolha from '@/lib/schemasFolha';

describe('schemasFolha', () => {
  it('deve estar definido', () => { expect(schemasFolha).toBeDefined(); });
  it('deve ter schema de folha', () => { 
    expect(schemasFolha.folhaSchema || schemasFolha.FolhaSchema).toBeDefined(); 
  });
  it('deve ter rubricas', () => { 
    expect(schemasFolha.rubricas || schemasFolha.RUBRICAS).toBeDefined(); 
  });
});
