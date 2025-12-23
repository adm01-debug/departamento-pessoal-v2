import { describe, it, expect, vi, beforeEach } from 'vitest';
import { feriadosService } from '../feriadosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        gte: vi.fn(() => ({
          lte: vi.fn(() => ({
            or: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            })),
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error: null })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));

describe('feriadosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve listar feriados', async () => {
    const result = await feriadosService.listar(2024);
    expect(result).toEqual([]);
  });

  it('deve verificar se é feriado', async () => {
    const result = await feriadosService.isFeriado('2024-01-01');
    expect(result).toBe(false);
  });
});
