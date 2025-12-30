/**
 * @fileoverview Hook para exportação PDF
 * @module hooks/usePDFExport
 */
import { useCallback, useState } from 'react';

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(async (elementId: string, filename: string = 'documento.pdf') => {
    setIsExporting(true);
    try {
      // Usar window.print() como fallback simples
      const content = document.getElementById(elementId);
      if (content) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>${filename}</title></head>
              <body>${content.innerHTML}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportToPDF, isExporting };
}

export default usePDFExport;
