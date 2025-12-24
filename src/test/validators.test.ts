import { describe, it, expect } from 'vitest';
import * as validators from '@/lib/validators';

describe('validators', () => {
  it('deve estar definido', () => { expect(validators).toBeDefined(); });
  it('deve ter validador de CPF', () => { 
    expect(validators.validateCPF || validators.validarCPF || validators.isCPFValid).toBeDefined(); 
  });
  it('deve ter validador de CNPJ', () => { 
    expect(validators.validateCNPJ || validators.validarCNPJ || validators.isCNPJValid).toBeDefined(); 
  });
  it('deve ter validador de email', () => { 
    expect(validators.validateEmail || validators.validarEmail || validators.isEmailValid).toBeDefined(); 
  });
  it('deve ter validador de telefone', () => { 
    expect(validators.validatePhone || validators.validarTelefone || validators.isPhoneValid).toBeDefined(); 
  });
});
