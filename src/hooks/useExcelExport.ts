import { useCallback } from 'react';
export function useExcelExport() {
  const exportToExcel = useCallback(async (data: any[], filename: string) => { console.log('Exporting to Excel:', filename, data.length, 'rows'); return { success: true, filename: `${filename}.xlsx` }; }, []);
  return { exportToExcel };
}
