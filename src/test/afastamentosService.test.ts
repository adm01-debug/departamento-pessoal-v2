import { describe, it, expect, vi, beforeEach } from 'vitest';
import { afastamentosService } from '@/services/afastamentosService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [
              { id: '1', colaborador_id: 'c1', tipo: 'doenca', data_inicio: '2024-01-10', data_fim: '2024-01-20' },
              { id: '2', colaborador_id: 'c2', tipo: 'licenca_maternidade', data_inicio: '2024-02-01', data_fim: '2024-06-01' },
            ],
            error: null,
          })),
          single: vi.fn(() => ({
            data: { id: '1', colaborador_id: 'c1', tipo: 'doenca' },
            error: null,
          })),
        })),
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '3', colaborador_id: 'c1', tipo: 'ferias' },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1' },
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  },
}));

describe('afastamentosService', () => {
  it('deve listar afastamentos', async () => {
    const result = await afastamentosService.listar();
    expect(result).toBeDefined();
  });

  it('deve buscar por colaborador', async () => {
    const result = await afastamentosService.buscarPorColaborador('c1');
    expect(result).toBeDefined();
  });

  it('deve criar afastamento', async () => {
    const result = await afastamentosService.criar({
      colaborador_id: 'c1',
      tipo: 'doenca',
      data_inicio: '2024-01-10',
    });
    expect(result).toBeDefined();
  });

  it('deve atualizar afastamento', async () => {
    const result = await afastamentosService.atualizar('1', { data_fim: '2024-01-25' });
    expect(result).toBeDefined();
  });

  it('deve deletar afastamento', async () => {
    const result = await afastamentosService.deletar('1');
    expect(result).toBeUndefined();
  });

  it('deve calcular dias de afastamento', () => {
    const dias = afastamentosService.calcularDias('2024-01-10', '2024-01-20');
    expect(dias).toBe(10);
  });
});
