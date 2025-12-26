import { useCallback } from 'react';
export function usePDFExport() {
  const exportToPDF = useCallback(async (elementId: string, filename: string) => { console.log('Exporting to PDF:', filename); return { success: true, filename: `${filename}.pdf` }; }, []);
  return { exportToPDF };
}
