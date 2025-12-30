/**
 * @fileoverview Hook para preview de impressão
 * @module hooks/usePrintPreview
 */
import { useCallback, useState } from 'react';

export function usePrintPreview() {
  const [isPrinting, setIsPrinting] = useState(false);

  const print = useCallback((elementId?: string) => {
    setIsPrinting(true);
    if (elementId) {
      const content = document.getElementById(elementId);
      if (content) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Imprimir</title></head><body>');
          printWindow.document.write(content.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
        }
      }
    } else {
      window.print();
    }
    setIsPrinting(false);
  }, []);

  return { print, isPrinting };
}

export default usePrintPreview;
