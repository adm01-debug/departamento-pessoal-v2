import ExcelJS from 'exceljs';
import { TEMPLATE_HEADERS, TEMPLATE_SAMPLE_ROW } from './columnMap';

export const TEMPLATE_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const TEMPLATE_FILENAME = 'modelo_importacao_colaboradores.xlsx';

/** Build the ExcelJS workbook for the import template (in-memory, no DOM). */
export async function buildTemplateWorkbook(): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Modelo');
  ws.addRow([...TEMPLATE_HEADERS]);
  ws.addRow([...TEMPLATE_SAMPLE_ROW]);
  return wb;
}

/** Serialize the template workbook to an .xlsx byte buffer. */
export async function buildTemplateBuffer(): Promise<ArrayBuffer> {
  const wb = await buildTemplateWorkbook();
  return wb.xlsx.writeBuffer();
}

/** Trigger a browser download of the import template. Requires DOM. */
export async function downloadTemplate(): Promise<void> {
  const buf = await buildTemplateBuffer();
  const blob = new Blob([buf], { type: TEMPLATE_MIME });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = TEMPLATE_FILENAME;
  a.click();
  URL.revokeObjectURL(url);
}
