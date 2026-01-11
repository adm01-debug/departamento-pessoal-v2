// V16-058: Tests for Dependente Validator
import { describe, it, expect } from 'vitest';

const parentescos = ['filho', 'filha', 'conjuge', 'companheiro', 'pai', 'mae', 'enteado', 'menor_guarda'];

const validateDependente = (data: any) => {
  const errors: string[] = [];
  if (!data.nome || data.nome.length < 2) errors.push('Nome deve ter pelo menos 2 caracteres');
  if (!data.data_nascimento) errors.push('Data de nascimento obrigatória');
  if (!data.parentesco || !parentescos.includes(data.parentesco)) errors.push('Parentesco inválido');
  if (data.cpf && !/^\d{11}$/.test(data.cpf.replace(/\D/g, ''))) errors.push('CPF inválido');
  
  // Validar idade para filho/filha (IR até 21 anos, ou 24 se universitário)
  if (['filho', 'filha'].includes(data.parentesco) && data.ir_dependente) {
    const idade = calcularIdade(data.data_nascimento);
    if (idade > 21 && !data.universitario) errors.push('Filho maior de 21 anos não pode ser dependente IR');
    if (idade > 24) errors.push('Filho maior de 24 anos não pode ser dependente IR');
  }
  
  return { valid: errors.length === 0, errors };
};

const calcularIdade = (dataNasc: string): number => {
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};

describe('dependenteValidator', () => {
  it('deve validar dependente válido', () => {
    const result = validateDependente({ nome: 'Maria', data_nascimento: '2015-05-10', parentesco: 'filha' });
    expect(result.valid).toBe(true);
  });

  it('deve rejeitar parentesco inválido', () => {
    const result = validateDependente({ nome: 'João', data_nascimento: '2000-01-01', parentesco: 'primo' });
    expect(result.errors).toContain('Parentesco inválido');
  });

  it('deve validar CPF quando informado', () => {
    const result = validateDependente({ nome: 'Ana', data_nascimento: '2010-01-01', parentesco: 'filha', cpf: '123' });
    expect(result.errors).toContain('CPF inválido');
  });
});
