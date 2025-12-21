import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock do React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }),
    useMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    }),
    useQueryClient: vi.fn().mockReturnValue({
      invalidateQueries: vi.fn(),
    }),
  };
});

describe('Hooks - Estrutura Básica', () => {
  describe('useFormValidation', () => {
    it('deve exportar hook useFormValidation', async () => {
      // Import dinâmico para evitar problemas de inicialização
      const module = await import('@/hooks/useFormValidation');
      expect(module.useFormValidation).toBeDefined();
    });

    it('deve exportar hooks pré-configurados', async () => {
      const module = await import('@/hooks/useFormValidation');
      expect(module.useColaboradorValidation).toBeDefined();
      expect(module.useFeriasValidation).toBeDefined();
      expect(module.useDesligamentoValidation).toBeDefined();
    });
  });
});

describe('Utilitários', () => {
  describe('formatarMinutos', () => {
    const formatarMinutos = (minutos: number): string => {
      const horas = Math.floor(Math.abs(minutos) / 60);
      const mins = Math.abs(minutos) % 60;
      const sinal = minutos < 0 ? '-' : '';
      return `${sinal}${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    it('deve formatar minutos positivos', () => {
      expect(formatarMinutos(90)).toBe('01:30');
      expect(formatarMinutos(60)).toBe('01:00');
      expect(formatarMinutos(150)).toBe('02:30');
    });

    it('deve formatar minutos negativos', () => {
      expect(formatarMinutos(-90)).toBe('-01:30');
      expect(formatarMinutos(-60)).toBe('-01:00');
    });

    it('deve formatar zero', () => {
      expect(formatarMinutos(0)).toBe('00:00');
    });
  });

  describe('calcularIdade', () => {
    const calcularIdade = (dataNascimento: string): number => {
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = nascimento.getMonth();
      
      if (mesAtual < mesNascimento || 
          (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return idade;
    };

    it('deve calcular idade corretamente', () => {
      const anoPassado = new Date();
      anoPassado.setFullYear(anoPassado.getFullYear() - 30);
      const idade = calcularIdade(anoPassado.toISOString().split('T')[0]);
      expect(idade).toBe(30);
    });
  });
});

describe('Máscaras', () => {
  const maskCPF = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskTelefone = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskCEP = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  it('deve mascarar CPF', () => {
    expect(maskCPF('12345678901')).toBe('123.456.789-01');
    expect(maskCPF('123')).toBe('123');
  });

  it('deve mascarar telefone', () => {
    expect(maskTelefone('11999887766')).toBe('(11) 99988-7766');
  });

  it('deve mascarar CEP', () => {
    expect(maskCEP('12345678')).toBe('12345-678');
  });
});
