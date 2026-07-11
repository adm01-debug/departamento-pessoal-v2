import { useCallback } from 'react';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';

function downloadBuffer(buf: ArrayBuffer, filename: string) {
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useExcelExport() {
  const exportarExcel = useCallback(
    async (titulo: string, dados: any[], colunas: string[]) => {
      try {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet(titulo.substring(0, 31) || 'Sheet1');
        ws.addRow(colunas);
        for (const item of dados) {
          ws.addRow(colunas.map((c) => item?.[c] ?? ''));
        }
        const buf = await wb.xlsx.writeBuffer();
        downloadBuffer(buf, `${titulo.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
        toast.success('Excel exportado com sucesso!');
      } catch (e: any) {
        toast.error('Erro ao gerar Excel: ' + e.message);
      }
    },
    []
  );

  return { exportarExcel };
}
