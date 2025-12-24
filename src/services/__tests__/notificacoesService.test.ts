import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as notificacoesService from '../notificacoesService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        lt: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
}));

describe('notificacoesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listarNotificacoes', () => {
    it('should list notifications', async () => {
      const result = await notificacoesService.listarNotificacoes();
      expect(supabase.from).toHaveBeenCalledWith('notificacoes');
    });
  });

  describe('criarNotificacao', () => {
    it('should create a notification', async () => {
      const notificacao = { titulo: 'Test', mensagem: 'Test message', tipo: 'info' };
      await notificacoesService.criarNotificacao(notificacao);
      expect(supabase.from).toHaveBeenCalledWith('notificacoes');
    });
  });

  describe('marcarComoLida', () => {
    it('should mark notification as read', async () => {
      await notificacoesService.marcarComoLida('1');
      expect(supabase.from).toHaveBeenCalledWith('notificacoes');
    });
  });

  describe('marcarTodasComoLidas', () => {
    it('should mark all notifications as read', async () => {
      await notificacoesService.marcarTodasComoLidas();
      expect(supabase.from).toHaveBeenCalledWith('notificacoes');
    });
  });

  describe('excluirNotificacao', () => {
    it('should delete a notification', async () => {
      await notificacoesService.excluirNotificacao('1');
      expect(supabase.from).toHaveBeenCalledWith('notificacoes');
    });
  });

  describe('limparAntigas', () => {
    it('should delete old notifications', async () => {
      await notificacoesService.limparAntigas(30);
      expect(supabase.from).toHaveBeenCalledWith('notificacoes');
    });
  });
});
