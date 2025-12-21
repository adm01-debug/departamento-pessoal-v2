import { describe, it, expect } from 'vitest';
import { escapeHtml, stripHtml, sanitizeString, sanitizeCpf, sanitizeCnpj, sanitizeTelefone, sanitizeEmail, sanitizeMonetario } from '../lib/sanitize';

describe('escapeHtml', () => {
  it('deve escapar caracteres HTML', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });
});

describe('stripHtml', () => {
  it('deve remover tags HTML', () => {
    expect(stripHtml('<p>Texto</p>')).toBe('Texto');
    expect(stripHtml('<script>evil()</script>Safe')).toBe('Safe');
  });
});

describe('sanitizeString', () => {
  it('deve limpar strings', () => {
    expect(sanitizeString('  texto  ')).toBe('texto');
    expect(sanitizeString('<b>bold</b>')).toBe('bold');
  });
});

describe('sanitizeCpf', () => {
  it('deve formatar CPF', () => {
    expect(sanitizeCpf('52998224725')).toBe('52998224725');
    expect(sanitizeCpf('529.982.247-25')).toBe('52998224725');
  });
});

describe('sanitizeCnpj', () => {
  it('deve formatar CNPJ', () => {
    expect(sanitizeCnpj('11.222.333/0001-81')).toBe('11222333000181');
  });
});

describe('sanitizeTelefone', () => {
  it('deve formatar telefone', () => {
    expect(sanitizeTelefone('(11) 99999-8888')).toBe('11999998888');
  });
});

describe('sanitizeEmail', () => {
  it('deve validar e limpar email', () => {
    expect(sanitizeEmail('  EMAIL@Test.COM  ')).toBe('email@test.com');
  });
});

describe('sanitizeMonetario', () => {
  it('deve converter para número', () => {
    expect(sanitizeMonetario('R$ 1.234,56')).toBe(1234.56);
    expect(sanitizeMonetario(100)).toBe(100);
  });
});
