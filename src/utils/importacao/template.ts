import ExcelJS from 'exceljs';
import { TEMPLATE_HEADERS, TEMPLATE_SAMPLE_ROW } from './columnMap';
import { downloadWorkbook, XLSX_MIME } from './excelDownload';

export const TEMPLATE_MIME = XLSX_MIME;
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
  const wb = await buildTemplateWorkbook();
  await downloadWorkbook(wb, TEMPLATE_FILENAME);
}
