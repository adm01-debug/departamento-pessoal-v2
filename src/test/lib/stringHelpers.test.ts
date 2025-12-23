import { describe, it, expect } from 'vitest';
import { capitalizar, capitalizarPalavras, removerAcentos, slugify, truncar, extrairIniciais, formatarBytes } from '@/lib/stringHelpers';

describe('stringHelpers', () => {
  describe('capitalizar', () => {
    it('deve capitalizar primeira letra', () => {
      expect(capitalizar('teste')).toBe('Teste');
    });
  });
  describe('capitalizarPalavras', () => {
    it('deve capitalizar todas palavras', () => {
      expect(capitalizarPalavras('joao da silva')).toBe('Joao Da Silva');
    });
  });
  describe('removerAcentos', () => {
    it('deve remover acentos', () => {
      expect(removerAcentos('João é ótimo')).toBe('Joao e otimo');
    });
  });
  describe('slugify', () => {
    it('deve criar slug', () => {
      expect(slugify('Olá Mundo!')).toBe('ola-mundo');
    });
  });
  describe('truncar', () => {
    it('deve truncar texto longo', () => {
      expect(truncar('texto muito longo', 10)).toBe('texto m...');
    });
    it('não deve truncar texto curto', () => {
      expect(truncar('curto', 10)).toBe('curto');
    });
  });
  describe('extrairIniciais', () => {
    it('deve extrair iniciais', () => {
      expect(extrairIniciais('João Silva')).toBe('JS');
    });
  });
  describe('formatarBytes', () => {
    it('deve formatar bytes', () => {
      expect(formatarBytes(1024)).toBe('1.0 KB');
    });
  });
});
