import { useCallback } from 'react';
import { toast } from 'sonner';

export function useExcelExport() {
  const exportarExcel = useCallback(async (titulo: string, dados: any[], colunas: string[]) => {
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(dados.map(item => {
        const row: Record<string, any> = {};
        colunas.forEach(col => { row[col] = item[col] ?? ''; });
        return row;
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, titulo.substring(0, 31));
      XLSX.writeFile(wb, `${titulo.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
      toast.success('Excel exportado com sucesso!');
    } catch (e: any) {
      toast.error('Erro ao gerar Excel: ' + e.message);
    }
  }, []);

  return { exportarExcel };
}
