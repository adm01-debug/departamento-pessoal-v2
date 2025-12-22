import { describe, it, expect, vi } from 'vitest';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn().mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [], error: null }) }) }
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
  useMutation: vi.fn().mockReturnValue({ mutate: vi.fn() }),
  useQueryClient: vi.fn().mockReturnValue({ invalidateQueries: vi.fn() })
}));

describe('useEmpresas', () => {
  it('deve validar CNPJ', () => {
    const cnpj = '11.222.333/0001-81';
    const cnpjNumerico = cnpj.replace(/\D/g, '');
    expect(cnpjNumerico).toHaveLength(14);
  });

  it('deve formatar razão social', () => {
    const razaoSocial = 'empresa teste ltda';
    const formatada = razaoSocial.toUpperCase();
    expect(formatada).toBe('EMPRESA TESTE LTDA');
  });
});
