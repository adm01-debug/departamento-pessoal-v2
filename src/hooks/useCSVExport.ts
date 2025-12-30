/**
 * @fileoverview Hook para exportação CSV
 * @module hooks/useCSVExport
 */
import { useCallback } from 'react';

export function useCSVExport() {
  const exportToCSV = useCallback((data: Record<string, any>[], filename: string = 'export.csv') => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const value = row[h];
        if (value === null || value === undefined) return '';
        const str = String(value);
        return str.includes(',') ? `"${str}"` : str;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportToCSV };
}

export default useCSVExport;
