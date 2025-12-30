/**
 * @fileoverview Hook para exportação Excel
 * @module hooks/useExcelExport
 */
import { useCallback } from 'react';

export function useExcelExport() {
  const exportToExcel = useCallback((data: Record<string, any>[], filename: string = 'export.xlsx') => {
    // Implementação simplificada - usa CSV como fallback
    // Para Excel real, integrar com SheetJS/xlsx
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join('\t'),
      ...data.map(row => headers.map(h => String(row[h] ?? '')).join('\t'))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.xls');
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportToExcel };
}

export default useExcelExport;
