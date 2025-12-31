import * as XLSX from 'xlsx';
import { z } from 'zod';
import { ImportResult, ImportError } from './csvImporter';

export interface ExcelImportOptions {
  sheetName?: string;
  sheetIndex?: number;
  headerRow?: number;
  startRow?: number;
  transformHeaders?: (headers: string[]) => string[];
}

/**
 * Importa arquivo Excel (.xlsx, .xls) e valida com schema Zod
 */
export async function importExcel<T>(
  file: File,
  schema: z.ZodSchema<T>,
  options: ExcelImportOptions = {}
): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        // Selecionar planilha
        let sheet: XLSX.WorkSheet;
        if (options.sheetName) {
          sheet = workbook.Sheets[options.sheetName];
          if (!sheet) {
            resolve({
              success: [],
              errors: [],
              total: 0,
              warnings: [`Planilha "${options.sheetName}" não encontrada`],
            });
            return;
          }
        } else {
          const sheetIndex = options.sheetIndex ?? 0;
          const sheetName = workbook.SheetNames[sheetIndex];
          sheet = workbook.Sheets[sheetName];
        }

        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: options.headerRow ?? 1,
          range: options.startRow ?? undefined,
          raw: false, // Converte datas e números para string
          defval: '', // Valor padrão para células vazias
        }) as Record<string, unknown>[];

        const success: T[] = [];
        const errors: ImportError[] = [];
        const warnings: string[] = [];

        if (!jsonData || jsonData.length === 0) {
          resolve({
            success: [],
            errors: [],
            total: 0,
            warnings: ['Planilha vazia ou sem dados válidos'],
          });
          return;
        }

        // Processar cada linha
        jsonData.forEach((row, index) => {
          // Pular linhas completamente vazias
          const hasData = Object.values(row).some(v => v !== null && v !== undefined && v !== '');
          if (!hasData) return;

          try {
            // Normalizar keys (remover espaços, acentos)
            const normalizedRow = Object.fromEntries(
              Object.entries(row).map(([key, value]) => {
                const normalizedKey = key
                  .trim()
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/\s+/g, '_')
                  .replace(/[^a-z0-9_]/g, '');

                // Limpar valores vazios
                const cleanValue = value === '' ? undefined : value;

                return [normalizedKey, cleanValue];
              })
            );

            const validated = schema.parse(normalizedRow);
            success.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              error.errors.forEach((err) => {
                errors.push({
                  row: index + 2, // +2 porque linha 1 é header
                  field: err.path.join('.'),
                  value: row[err.path[0] as string],
                  error: err.message,
                });
              });
            }
          }
        });

        resolve({
          success,
          errors,
          total: jsonData.length,
          warnings,
        });
      } catch (error) {
        reject(new Error(`Erro ao processar Excel: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Gera template Excel para download
 */
export function generateExcelTemplate(
  columns: { key: string; label: string; example?: string }[],
  sheetName: string = 'Dados'
): Blob {
  // Criar dados
  const headers = columns.map(c => c.label);
  const examples = columns.map(c => c.example ?? '');

  // Criar planilha
  const ws = XLSX.utils.aoa_to_sheet([headers, examples]);

  // Estilizar headers (largura das colunas)
  ws['!cols'] = columns.map(() => ({ wch: 20 }));

  // Criar workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Gerar arquivo
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * Download do template Excel
 */
export function downloadExcelTemplate(
  columns: { key: string; label: string; example?: string }[],
  filename: string,
  sheetName?: string
): void {
  const blob = generateExcelTemplate(columns, sheetName);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Listar planilhas disponíveis em um arquivo Excel
 */
export async function listExcelSheets(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Exportar dados para Excel
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  filename: string,
  sheetName: string = 'Dados'
): void {
  // Criar headers
  const headers = columns.map(c => c.label);

  // Criar linhas de dados
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      // Formatar valores especiais
      if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
      }
      if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
      }
      return value ?? '';
    })
  );

  // Criar planilha
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Ajustar largura das colunas
  ws['!cols'] = columns.map(() => ({ wch: 20 }));

  // Criar workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Download
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
