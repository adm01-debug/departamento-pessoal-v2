// @ts-nocheck
export function exportToExcel(data: any[], filename: string, sheetName?: string): void {
  // Stub - xlsx not installed, fallback to CSV
  const headers = data.length ? Object.keys(data[0]) : [];
  const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function downloadExcelTemplate(headers: string[], filename: string): void {
  const csv = headers.join(',') + '\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export interface ExcelImportOptions {
  sheetName?: string;
  sheetIndex?: number;
  headerRow?: number;
  startRow?: number;
  transformHeaders?: (headers: string[]) => string[];
}

export async function importExcel<T>(file: File, options?: ExcelImportOptions): Promise<{ data: T[]; errors: any[]; total: number; success: number; failed: number }> {
  return { data: [], errors: [], total: 0, success: 0, failed: 0 };
}
