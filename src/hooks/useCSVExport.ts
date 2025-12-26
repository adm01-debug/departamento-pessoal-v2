import { useCallback } from 'react';
export function useCSVExport() {
  const exportToCSV = useCallback((data: any[], filename: string) => { const csv = data.map(row => Object.values(row).join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click(); return { success: true }; }, []);
  return { exportToCSV };
}
