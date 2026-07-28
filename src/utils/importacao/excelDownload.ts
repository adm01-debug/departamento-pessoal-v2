import ExcelJS from 'exceljs';

export const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * Trigger a browser download of an ExcelJS workbook. Requires DOM (window + document).
 * Centralized here so every exporter (template, useExcelExport, desligamentos, …)
 * shares the exact same blob/mime/anchor logic.
 */
export async function downloadWorkbook(
  wb: ExcelJS.Workbook,
  filename: string
): Promise<void> {
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: XLSX_MIME });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Build a simple workbook from tabular data (headers + rows). Column widths auto-fit
 * to the widest cell content. Matches the layout of the import template so exports
 * and templates stay visually consistent.
 */
export function buildTabularWorkbook(
  sheetName: string,
  headers: string[],
  rows: unknown[][]
): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet((sheetName || 'Sheet1').substring(0, 31));
  ws.columns = headers.map((h) => ({
    header: h,
    key: h,
    width: Math.max(h.length, ...rows.map((r) => String(r[headers.indexOf(h)] ?? '').length)) + 2,
  }));
  // ws.columns already added the header row
  for (const r of rows) ws.addRow(r);
  return wb;
}
