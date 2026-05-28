import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rescisaoService } from '../rescisaoService';
import { supabase } from '@/integrations/supabase/client';

// Mock dependências
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('@/utils/auditLogger', () => ({
  auditLogger: {
    log: vi.fn().mockResolvedValue({}),
  },
}));

describe('rescisaoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validarTransicao', () => {
    it('should block jumping more than one stage', async () => {
      (supabase.from as Record<string, unknown>).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { etapa: 'comunicacao', status: 'pendente' }, error: null }),
      });

      await expect(rescisaoService.validarTransicao('1', 'documentacao'))
        .resolves.toBe(true);
        
      await expect(rescisaoService.validarTransicao('1', 'homologacao'))
        .rejects.toThrow(/Transição bloqueada/);
    });

    it('should block homologation if status is not calculado', async () => {
       (supabase.from as Record<string, unknown>).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { etapa: 'calculo', status: 'pendente' }, error: null }),
      });

      await expect(rescisaoService.validarTransicao('1', 'homologacao'))
        .rejects.toThrow(/A rescisão precisa estar com status "calculado"/);
    });
  });

  describe('assinarDigitalmente', () => {
    it('should update correct fields for employer signature', async () => {
      const mockUpdate = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: { id: '1' }, error: null });

      (supabase.from as Record<string, unknown>).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await rescisaoService.assinarDigitalmente('1', 'empresa');

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        assinado_empresa: true,
        hash_assinatura_empresa: expect.any(String),
        data_assinatura_empresa: expect.any(String),
      }));
    });
  });
});
