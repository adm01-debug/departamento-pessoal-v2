import { describe, it, expect, vi, beforeEach } from 'vitest';
import { relatoriosService } from '@/services/relatoriosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ data: [], error: null })),
    })),
  },
}));

describe('relatoriosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(relatoriosService).toBeDefined(); });
  it('deve ter método de gerar relatório', () => { expect(relatoriosService.gerar || relatoriosService.generate).toBeDefined(); });
  it('deve ter método de exportar', () => { expect(relatoriosService.exportar || relatoriosService.export).toBeDefined(); });
  it('deve ter método de listar tipos', () => { expect(relatoriosService.listarTipos || relatoriosService.getTypes).toBeDefined(); });
});
