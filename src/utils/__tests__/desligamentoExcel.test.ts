import { describe, it, expect, vi } from 'vitest';
import { exportarDesligamentosExcel } from '../desligamentoExcel';

// Mock xlsx
vi.mock('xlsx', () => ({
  default: {
    utils: {
      json_to_sheet: vi.fn(() => ({})),
      book_new: vi.fn(() => ({})),
      book_append_sheet: vi.fn(),
    },
    writeFile: vi.fn(),
  },
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

describe('exportarDesligamentosExcel', () => {
  it('should show error toast when array is empty', () => {
    exportarDesligamentosExcel([]);
    expect(toast.error).toHaveBeenCalledWith('Nenhum desligamento para exportar');
  });

  it('should export successfully with data', () => {
    const data = [
      {
        id: '1',
        colaborador: { nome_completo: 'João Silva' },
        data_desligamento: '2026-03-15',
        tipo: 'sem_justa_causa',
        status: 'concluido',
        motivo: 'Reestruturação',
        salario_base: 5000,
        valor_liquido: 12000,
        data_aviso_previo: '2026-02-15',
        saldo_salario: 2500,
        decimo_terceiro: 1250,
        ferias_proporcionais: 1000,
        multa_fgts: 4000,
        total_proventos: 15000,
        total_descontos: 3000,
      },
    ];
    exportarDesligamentosExcel(data);
    expect(toast.success).toHaveBeenCalledWith('Planilha exportada com sucesso!');
  });

  it('should handle null/undefined values gracefully', () => {
    const data = [
      {
        id: '2',
        colaborador: null,
        data_desligamento: null,
        tipo: null,
        status: null,
        motivo: null,
        salario_base: null,
        valor_liquido: null,
      },
    ];
    expect(() => exportarDesligamentosExcel(data)).not.toThrow();
  });
});
