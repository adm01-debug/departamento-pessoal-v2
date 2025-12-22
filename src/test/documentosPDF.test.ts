import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    output: vi.fn().mockReturnValue('pdf-blob'),
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
    lastAutoTable: { finalY: 100 }
  }))
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn()
}));

describe('Documentos PDF', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Geração de Contratos', () => {
    it('deve criar contrato de trabalho com dados do colaborador', async () => {
      const colaborador = {
        nome_completo: 'João Silva',
        cpf: '123.456.789-00',
        data_nascimento: '1990-01-15',
        sexo: 'masculino',
        estado_civil: 'solteiro',
        cargo: 'Desenvolvedor',
        salario_base: 5000,
        data_admissao: '2024-01-01'
      };

      const { gerarContratoTrabalho } = await import('../lib/documentosPDF');
      
      expect(() => gerarContratoTrabalho(colaborador as any, {} as any))
        .not.toThrow();
    });
  });

  describe('Geração de Recibos', () => {
    it('deve gerar recibo de férias', async () => {
      const colaborador = {
        nome_completo: 'Maria Santos',
        cpf: '987.654.321-00',
        cargo: 'Analista',
        salario_base: 4000
      };

      const ferias = {
        data_inicio: '2024-02-01',
        data_fim: '2024-02-28',
        dias_gozo: 30
      };

      const { gerarReciboFerias } = await import('../lib/documentosPDF');
      
      expect(() => gerarReciboFerias(colaborador as any, ferias as any))
        .not.toThrow();
    });
  });

  describe('Geração de Termos', () => {
    it('deve gerar termo de rescisão', async () => {
      const colaborador = {
        nome_completo: 'Pedro Costa',
        cpf: '111.222.333-44',
        data_admissao: '2023-01-01'
      };

      const rescisao = {
        data_desligamento: '2024-06-30',
        motivo: 'Pedido de demissão'
      };

      const { gerarTermoRescisao } = await import('../lib/documentosPDF');
      
      expect(() => gerarTermoRescisao(colaborador as any, rescisao as any))
        .not.toThrow();
    });
  });
});
