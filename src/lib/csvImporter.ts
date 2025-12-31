import Papa from 'papaparse';
import { z } from 'zod';

/**
 * Resultado da importação CSV/Excel
 */
export interface ImportResult<T> {
  success: T[];
  errors: ImportError[];
  total: number;
  warnings: string[];
}

export interface ImportError {
  row: number;
  field: string;
  value: unknown;
  error: string;
}

export interface ImportOptions {
  skipFirstRow?: boolean;
  delimiter?: string;
  encoding?: string;
  transformHeaders?: (headers: string[]) => string[];
  validateRow?: (row: Record<string, unknown>, index: number) => string | null;
}

/**
 * Importa arquivo CSV e valida com schema Zod
 */
export async function importCSV<T>(
  file: File,
  schema: z.ZodSchema<T>,
  options: ImportOptions = {}
): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: options.delimiter ?? ',',
      encoding: options.encoding ?? 'UTF-8',
      transformHeader: (header: string) => {
        // Normaliza headers (remove espaços, acentos, etc.)
        return header
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');
      },
      complete: (results) => {
        const success: T[] = [];
        const errors: ImportError[] = [];
        const warnings: string[] = [];

        // Verificar se há dados
        if (!results.data || results.data.length === 0) {
          resolve({
            success: [],
            errors: [],
            total: 0,
            warnings: ['Arquivo vazio ou sem dados válidos'],
          });
          return;
        }

        // Processar cada linha
        results.data.forEach((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          
          // Pular linhas completamente vazias
          const hasData = Object.values(rowData).some(v => v !== null && v !== undefined && v !== '');
          if (!hasData) return;

          // Validação customizada
          if (options.validateRow) {
            const customError = options.validateRow(rowData, index);
            if (customError) {
              warnings.push(`Linha ${index + 2}: ${customError}`);
            }
          }

          try {
            // Limpar valores vazios
            const cleanedRow = Object.fromEntries(
              Object.entries(rowData).map(([key, value]) => [
                key,
                value === '' ? undefined : value
              ])
            );

            const validated = schema.parse(cleanedRow);
            success.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              error.errors.forEach((err) => {
                errors.push({
                  row: index + 2, // +2 porque linha 1 é header
                  field: err.path.join('.'),
                  value: rowData[err.path[0] as string],
                  error: err.message,
                });
              });
            }
          }
        });

        // Alertar sobre erros do Papa Parse
        if (results.errors && results.errors.length > 0) {
          results.errors.forEach((err) => {
            warnings.push(`Erro de parsing na linha ${err.row}: ${err.message}`);
          });
        }

        resolve({
          success,
          errors,
          total: results.data.length,
          warnings,
        });
      },
      error: (error) => {
        reject(new Error(`Erro ao processar CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Gera template CSV para download
 */
export function generateCSVTemplate(
  columns: { key: string; label: string; example?: string }[]
): string {
  const headers = columns.map(c => c.label).join(',');
  const examples = columns.map(c => c.example ?? '').join(',');
  
  return `${headers}\n${examples}`;
}

/**
 * Cria blob para download do template
 */
export function downloadCSVTemplate(
  columns: { key: string; label: string; example?: string }[],
  filename: string
): void {
  const content = generateCSVTemplate(columns);
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Schemas comuns para validação
 */
export const commonSchemas = {
  cpf: z.string().regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  cnpj: z.string().regex(/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().regex(/^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  data: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  valor: z.coerce.number().positive('Valor deve ser positivo'),
  porcentagem: z.coerce.number().min(0).max(100, 'Porcentagem deve estar entre 0 e 100'),
};

/**
 * Helper para transformar data BR para ISO
 */
export function parseDataBR(data: string): string {
  if (!data) return '';
  
  // Se já está em formato ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(data)) return data;
  
  // Formato BR: DD/MM/YYYY
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

/**
 * Helper para limpar CPF/CNPJ
 */
export function limparDocumento(doc: string): string {
  return doc.replace(/\D/g, '');
}

/**
 * Helper para formatar telefone
 */
export function limparTelefone(tel: string): string {
  return tel.replace(/\D/g, '');
}
