import { describe, it, expect, vi, beforeEach } from 'vitest';
import { folhaPagamentoService } from '../folhaPagamentoService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock dynamic imports
vi.mock('@/utils/folha/validadorFolha', () => ({
  validadorFolha: {
    validarFolha: vi.fn().mockResolvedValue([]),
  },
}));

describe('folhaPagamentoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('assinarHolerite', () => {
    it('should call upsert with correct data and return hash', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ 
        data: { nome_completo: 'João Silva', cpf: '123', cargo: 'Dev' }, 
        error: null 
      });
      const mockUpsert = vi.fn().mockResolvedValue({ error: null });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'colaboradores') {
          return { select: mockSelect, eq: mockEq, single: mockSingle };
        }
        if (table === 'holerites') {
          return { upsert: mockUpsert };
        }
        return {};
      });

      const result = await folhaPagamentoService.assinarHolerite('folha-1', 'colab-1');
      if (!result.ok) throw new Error('Result failed');
      const hash = result.value;

      expect(hash).toBeDefined();
      expect(hash.length).toBe(32);
      expect(mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
        folha_id: 'folha-1',
        colaborador_id: 'colab-1',
        assinado: true,
      }));
    });
  });

  describe('fecharFolha', () => {
    it('should throw error if there are critical alerts', async () => {
      const { validadorFolha } = await import('@/utils/folha/validadorFolha');
      (validadorFolha.validarFolha as any).mockResolvedValueOnce([
        { gravidade: 'alta', mensagem: 'Erro crítico' }
      ]);

      const result = await folhaPagamentoService.fecharFolha('folha-1');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toMatch(/existem 1 alertas críticos/);
      }
    });

    it('should update folha status to fechada if no critical alerts', async () => {
      const { validadorFolha } = await import('@/utils/folha/validadorFolha');
      (validadorFolha.validarFolha as any).mockResolvedValueOnce([]);

      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null }); // For the competency fetch
      const mockInsert = vi.fn().mockResolvedValue({ error: null });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'folhas_pagamento') {
          return {
            update: mockUpdate,
            eq: mockEq,
            select: mockSelect,
            single: mockSingle,
          };
        }
        if (table === 'folha_itens') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        if (table === 'folha_auditoria') {
          return {
            insert: mockInsert,
          };
        }
        return {};
      });

      const result = await folhaPagamentoService.fecharFolha('folha-1');
      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'fechada' }));
    });
  });
});
