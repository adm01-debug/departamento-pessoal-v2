import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usuariosService } from '../usuariosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error: null })),
          })),
        })),
      })),
    })),
  },
}));

vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));

describe('usuariosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve listar usuários', async () => {
    const result = await usuariosService.listar();
    expect(result).toEqual([]);
  });

  it('deve ativar usuário', async () => {
    await expect(usuariosService.ativar('1')).resolves.toBeUndefined();
  });
});
