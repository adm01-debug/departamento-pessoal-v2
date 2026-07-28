import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { parseRows, parseWorkbookBuffer } from '@/utils/importacao/parser';
import { validarCPF, parseDate, parseSalario, normalizarCPF } from '@/utils/importacao/validators';
import { mapColumns, normalizeHeader } from '@/utils/importacao/columnMap';

describe('validators', () => {
  it('valida CPFs corretos e rejeita inválidos', () => {
    expect(validarCPF('529.982.247-25')).toBe(true);
    expect(validarCPF('11111111111')).toBe(false);
    expect(validarCPF('123')).toBe(false);
    expect(validarCPF('')).toBe(false);
  });

  it('normalizarCPF remove máscara e preenche zeros', () => {
    expect(normalizarCPF('529.982.247-25')).toBe('52998224725');
    expect(normalizarCPF('123')).toBe('00000000123');
    expect(normalizarCPF(null)).toBe('');
  });

  it('parseDate lida com dd/mm/yyyy, ISO e serial Excel', () => {
    expect(parseDate('15/06/1990')).toBe('1990-06-15');
    expect(parseDate('1990-06-15')).toBe('1990-06-15');
    expect(parseDate(null)).toBeNull();
    expect(parseDate('xxx')).toBeNull();
    expect(parseDate(44927)).toBe('2023-01-01');
  });

  it('parseSalario aceita R$, vírgula e ponto', () => {
    expect(parseSalario('R$ 5.000,50')).toBeCloseTo(5000.5);
    expect(parseSalario('3000')).toBe(3000);
    expect(parseSalario('')).toBeUndefined();
    expect(parseSalario(null)).toBeUndefined();
  });
});

describe('columnMap', () => {
  it('normaliza cabeçalhos com acento e case', () => {
    expect(normalizeHeader('  Função  ')).toBe('funcao');
    expect(normalizeHeader('SALÁRIO')).toBe('salario');
  });

  it('mapeia sinônimos aceitos para campos canônicos', () => {
    const m = mapColumns(['Nome', 'CPF', 'Função', 'Celular', 'Salário']);
    expect(m).toEqual({ 0: 'nome_completo', 1: 'cpf', 2: 'cargo', 3: 'telefone', 4: 'salario_base' });
  });
});

describe('parseRows', () => {
  const headers = ['Nome', 'CPF', 'Email', 'Cargo', 'Salário', 'Admissão'];

  it('parseia linha válida', () => {
    const rows = parseRows([
      headers,
      ['Ana Souza', '529.982.247-25', 'ana@x.com', 'Dev', '5000', '01/03/2024'],
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe('valido');
    expect(rows[0].nome_completo).toBe('Ana Souza');
    expect(rows[0].cpf).toBe('52998224725');
    expect(rows[0].salario_base).toBe(5000);
    expect(rows[0].data_admissao).toBe('2024-03-01');
    expect(rows[0].erros).toEqual([]);
  });

  it('marca CPF inválido e nome faltante como erro', () => {
    const rows = parseRows([
      headers,
      ['', '11111111111', '', '', '', ''],
    ]);
    expect(rows[0].status).toBe('erro');
    expect(rows[0].erros).toContain('Nome obrigatório');
    expect(rows[0].erros).toContain('CPF inválido');
  });

  it('marca duplicado quando CPF já existe', () => {
    const rows = parseRows(
      [headers, ['Ana', '529.982.247-25', '', '', '', '']],
      { existingCPFs: new Set(['52998224725']) }
    );
    expect(rows[0].status).toBe('duplicado');
    expect(rows[0].erros).toContain('CPF já cadastrado');
  });

  it('ignora linhas totalmente vazias', () => {
    const rows = parseRows([
      headers,
      ['', '', '', '', '', ''],
      ['Ana Souza', '529.982.247-25', '', '', '', ''],
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].nome_completo).toBe('Ana Souza');
  });

  it('lança erro quando não há coluna "Nome"', () => {
    expect(() => parseRows([['CPF', 'Cargo'], ['123', 'Dev']])).toThrow(/Nome/);
  });

  it('lança erro quando a planilha está vazia', () => {
    expect(() => parseRows([])).toThrow(/vazia/i);
    expect(() => parseRows([headers])).toThrow(/vazia/i);
  });
});

describe('parseWorkbookBuffer (integração com ExcelJS)', () => {
  it('lê buffer .xlsx e retorna linhas parseadas', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Test');
    ws.addRow(['Nome', 'CPF', 'Cargo']);
    ws.addRow(['Ana Souza', '529.982.247-25', 'Dev']);
    ws.addRow(['', '11111111111', '']); // erro
    const buf = await wb.xlsx.writeBuffer();

    const parsed = await parseWorkbookBuffer(buf as ArrayBuffer);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].status).toBe('valido');
    expect(parsed[1].status).toBe('erro');
  });
});
