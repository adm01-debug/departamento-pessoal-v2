// V15-EXPORT: Export utility functions
import { saveAs } from 'file-saver';

export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}.csv`);
}

export function exportToJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  saveAs(blob, `${filename}.json`);
}

export async function exportToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = imgData;
  link.click();
}

export function exportToExcel(data: any[], filename: string): void {
  // Simple CSV export as Excel alternative
  exportToCSV(data, filename);
}

export function exportTableToCSV(
  headers: string[],
  rows: any[][],
  filename: string
): void {
  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => JSON.stringify(cell ?? '')).join(',')),
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}.csv`);
}
