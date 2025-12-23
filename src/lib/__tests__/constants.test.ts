import { describe, it, expect } from 'vitest';
import { 
  CACHE_TIMES, 
  PAGINATION, 
  STATUS_COLORS, 
  TIPO_CONTRATO_OPTIONS,
  UF_OPTIONS 
} from '../constants';

describe('constants', () => {
  describe('CACHE_TIMES', () => {
    it('deve ter valores de cache definidos', () => {
      expect(CACHE_TIMES.STALE_TIME).toBeDefined();
      expect(CACHE_TIMES.GC_TIME).toBeDefined();
      expect(typeof CACHE_TIMES.STALE_TIME).toBe('number');
    });
  });

  describe('PAGINATION', () => {
    it('deve ter valores de paginação definidos', () => {
      expect(PAGINATION.DEFAULT_PAGE_SIZE).toBeDefined();
      expect(PAGINATION.PAGE_SIZE_OPTIONS).toBeInstanceOf(Array);
    });
  });

  describe('STATUS_COLORS', () => {
    it('deve ter cores para status', () => {
      expect(STATUS_COLORS).toBeDefined();
      expect(typeof STATUS_COLORS).toBe('object');
    });
  });

  describe('TIPO_CONTRATO_OPTIONS', () => {
    it('deve ter opções de tipo de contrato', () => {
      expect(TIPO_CONTRATO_OPTIONS).toBeInstanceOf(Array);
      expect(TIPO_CONTRATO_OPTIONS.length).toBeGreaterThan(0);
    });
  });

  describe('UF_OPTIONS', () => {
    it('deve ter 27 estados', () => {
      expect(UF_OPTIONS).toBeInstanceOf(Array);
      expect(UF_OPTIONS.length).toBe(27);
    });

    it('deve incluir todos os estados do Brasil', () => {
      const siglas = UF_OPTIONS.map(uf => uf.value);
      expect(siglas).toContain('SP');
      expect(siglas).toContain('RJ');
      expect(siglas).toContain('MG');
    });
  });
});
