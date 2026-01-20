// V19-035: Testes para API Error Handler
import { describe, it, expect } from 'vitest';
import { APIError, handleAPIError, getErrorMessage, isRetryableError, withRetry } from '../apiErrorHandler';

describe('API Error Handler', () => {
  describe('APIError', () => {
    it('deve criar erro com status', () => {
      const error = new APIError(404, 'Not found');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
    });
  });

  describe('handleAPIError', () => {
    it('deve retornar APIError para APIError', () => {
      const original = new APIError(500, 'Server error');
      const result = handleAPIError(original);
      expect(result).toBe(original);
    });

    it('deve converter Error para APIError', () => {
      const result = handleAPIError(new Error('Test'));
      expect(result.status).toBe(500);
    });
  });

  describe('getErrorMessage', () => {
    it('deve retornar mensagem para status conhecido', () => {
      expect(getErrorMessage(404)).toBe('Não encontrado');
    });

    it('deve retornar mensagem padrao para status desconhecido', () => {
      expect(getErrorMessage(999)).toBe('Erro desconhecido');
    });
  });

  describe('isRetryableError', () => {
    it('deve retornar true para 500', () => {
      expect(isRetryableError(500)).toBe(true);
    });

    it('deve retornar false para 400', () => {
      expect(isRetryableError(400)).toBe(false);
    });
  });
});
