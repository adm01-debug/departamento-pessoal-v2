import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pontoService } from '@/services/pontoService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn(() => ({ data: [{ id: '1', colaborador_id: 'c1', entrada: '08:00', saida: '17:00' }], error: null })) })) })),
      insert: vi.fn(() => ({ data: null, error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('pontoService', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('deve estar definido', () => { expect(pontoService).toBeDefined(); });
  it('deve ter método de registrar entrada', () => { expect(pontoService.registrarEntrada || pontoService.clockIn).toBeDefined(); });
  it('deve ter método de registrar saída', () => { expect(pontoService.registrarSaida || pontoService.clockOut).toBeDefined(); });
  it('deve ter método de listar registros', () => { expect(pontoService.listar || pontoService.getAll).toBeDefined(); });
});
