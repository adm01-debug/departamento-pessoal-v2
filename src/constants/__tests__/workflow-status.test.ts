/**
 * @fileoverview Testes de sanidade — garantem que as constantes de workflow-status
 * permanecem sincronizadas com os CHECK constraints do banco (Melhoria #19).
 *
 * Se um valor for adicionado/removido aqui sem migração SQL correspondente,
 * este teste passará mas o INSERT falhará em runtime — por isso os testes
 * de integração e2e (`e2e/authenticated/`) devem cobrir os fluxos críticos.
 */
import { describe, it, expect } from 'vitest';
import {
  FERIAS_STATUS,
  FERIAS_STATUS_LABELS,
  FALTA_TIPO,
  NOTIFICACAO_TIPO,
  isValidStatus,
  getStatusLabel,
} from '../workflow-status';

describe('workflow-status constants', () => {
  it('mantém labels PT-BR para todos os status de férias', () => {
    for (const status of FERIAS_STATUS) {
      expect(FERIAS_STATUS_LABELS[status]).toBeDefined();
      expect(FERIAS_STATUS_LABELS[status].length).toBeGreaterThan(0);
    }
  });

  it('não contém duplicatas nos enums críticos', () => {
    expect(new Set(FERIAS_STATUS).size).toBe(FERIAS_STATUS.length);
    expect(new Set(FALTA_TIPO).size).toBe(FALTA_TIPO.length);
    expect(new Set(NOTIFICACAO_TIPO).size).toBe(NOTIFICACAO_TIPO.length);
  });

  describe('isValidStatus', () => {
    it('aceita valores válidos', () => {
      expect(isValidStatus('aprovada', FERIAS_STATUS)).toBe(true);
      expect(isValidStatus('atestado_medico', FALTA_TIPO)).toBe(true);
    });

    it('rejeita valores inválidos (typos, casing, tipos errados)', () => {
      expect(isValidStatus('Aprovada', FERIAS_STATUS)).toBe(false);
      expect(isValidStatus('aprovado', FERIAS_STATUS)).toBe(false);
      expect(isValidStatus(null, FERIAS_STATUS)).toBe(false);
      expect(isValidStatus(undefined, FERIAS_STATUS)).toBe(false);
      expect(isValidStatus(42, FERIAS_STATUS)).toBe(false);
      expect(isValidStatus({}, FERIAS_STATUS)).toBe(false);
    });
  });

  describe('getStatusLabel', () => {
    it('retorna label mapeado quando existe', () => {
      expect(getStatusLabel('aprovada', FERIAS_STATUS_LABELS)).toBe('Aprovada');
    });

    it('faz fallback para o valor bruto quando não mapeado (observabilidade)', () => {
      expect(getStatusLabel('desconhecido' as never, FERIAS_STATUS_LABELS)).toBe('desconhecido');
    });
  });
});
