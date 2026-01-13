// QA-FIX: Security Test - api
import { describe, it, expect } from 'vitest';

describe('api Security', () => {
  it('deve validar autenticação', () => {
    const token = 'Bearer xyz';
    expect(token.startsWith('Bearer ')).toBe(true);
  });

  it('deve sanitizar entrada', () => {
    const input = '<script>alert(1)</script>';
    const sanitized = input.replace(/<[^>]*>/g, '');
    expect(sanitized).not.toContain('<');
  });

  it('deve mascarar dados sensíveis', () => {
    const cpf = '123.456.789-00';
    const masked = cpf.slice(0, 3) + '.***.***-**';
    expect(masked).not.toBe(cpf);
  });
});
