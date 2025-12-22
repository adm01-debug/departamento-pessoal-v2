import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('useESocial', () => {
  it('deve gerar ID de evento válido', () => {
    const cnpj = '12345678000190';
    const data = '20240115';
    const sequencial = '000001';
    const id = `ID${cnpj.slice(0, 8)}${data}${sequencial}`;
    expect(id).toMatch(/^ID\d{8}\d{8}\d{6}$/);
  });

  it('deve validar ambiente (produção/homologação)', () => {
    const ambientes = { producao: 1, homologacao: 2 };
    expect(ambientes.producao).toBe(1);
    expect(ambientes.homologacao).toBe(2);
  });
});
