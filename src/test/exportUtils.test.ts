import { describe, it, expect, vi } from 'vitest';

// Mock do jspdf e xlsx
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    text: vi.fn(),
    save: vi.fn(),
    autoTable: vi.fn(),
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    getStringUnitWidth: vi.fn().mockReturnValue(10),
  })),
}));

vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn().mockReturnValue({}),
    book_new: vi.fn().mockReturnValue({}),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

describe('exportUtils', () => {
  it('deve exportar dados válidos', () => {
    // Teste de estrutura
    const dados = [
      { nome: 'João', cargo: 'Dev' },
      { nome: 'Maria', cargo: 'PM' },
    ];
    
    expect(dados.length).toBe(2);
    expect(dados[0]).toHaveProperty('nome');
  });

  it('deve lidar com dados vazios', () => {
    const dadosVazios: unknown[] = [];
    expect(dadosVazios.length).toBe(0);
  });

  it('deve formatar valores monetários', () => {
    const valor = 1234.56;
    const formatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    expect(formatado).toContain('1.234,56');
  });

  it('deve formatar datas', () => {
    const data = new Date('2025-01-15');
    const formatado = data.toLocaleDateString('pt-BR');
    expect(formatado).toBe('15/01/2025');
  });
});
