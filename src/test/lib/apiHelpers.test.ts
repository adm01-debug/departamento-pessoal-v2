import { describe, it, expect, vi } from 'vitest';
import { handleApiError, withRetry, withTimeout } from '@/lib/apiHelpers';

describe('apiHelpers', () => {
  describe('handleApiError', () => {
    it('deve retornar mensagem de erro', () => {
      expect(handleApiError(new Error('Falha'))).toBe('Falha');
    });
    it('deve retornar string direto', () => {
      expect(handleApiError('Erro')).toBe('Erro');
    });
    it('deve retornar mensagem padrão', () => {
      expect(handleApiError({})).toBe('Ocorreu um erro inesperado');
    });
  });
  describe('withRetry', () => {
    it('deve executar função com sucesso', async () => {
      const fn = vi.fn().mockResolvedValue('ok');
      const result = await withRetry(fn);
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('deve retentar em caso de erro', async () => {
      const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('ok');
      const result = await withRetry(fn, 2, 10);
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
  describe('withTimeout', () => {
    it('deve resolver antes do timeout', async () => {
      const result = await withTimeout(Promise.resolve('ok'), 1000);
      expect(result).toBe('ok');
    });
  });
});
