import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentosService } from '../documentosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'http://test.com/doc.pdf' } })),
      })),
    },
  },
}));

vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));

describe('documentosService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('deve listar documentos', async () => {
    const result = await documentosService.listar('colab-1');
    expect(result).toEqual([]);
  });

  it('deve excluir documento', async () => {
    await expect(documentosService.excluir('1')).resolves.toBeUndefined();
  });
});
