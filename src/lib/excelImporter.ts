// @ts-nocheck
import { ImportResult, ImportError } from './csvImporter';

export interface ExcelImportOptions {
  sheetName?: string;
  sheetIndex?: number;
  headerRow?: number;
  startRow?: number;
  transformHeaders?: (headers: string[]) => string[];
}

export async function importExcel<T>(file: File, options?: ExcelImportOptions): Promise<ImportResult<T>> {
  // Stub - xlsx not installed
  return { data: [], errors: [], total: 0, success: 0, failed: 0 };
}
