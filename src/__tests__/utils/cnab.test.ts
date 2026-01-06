import { describe, it, expect } from 'vitest';
import { gerarArquivoCNAB240 } from '@/utils/cnab240';

describe('gerarArquivoCNAB240', () => {
  it('should generate valid CNAB file', () => {
    const result = gerarArquivoCNAB240({
      empresa: {
        cnpj: '12345678000199',
        nome: 'Empresa Teste',
        banco: '001',
        agencia: '1234',
        conta: '123456'
      },
      pagamentos: [{
        funcionario: 'João Silva',
        cpf: '12345678901',
        banco: '001',
        agencia: '1234',
        conta: '123456',
        valor: 5000
      }]
    });
    
    expect(result).toContain('001');
    expect(result.split('\n').length).toBeGreaterThan(2);
  });
});
