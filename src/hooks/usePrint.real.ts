// V18-H007: usePrint Real
import { useCallback } from "react";
export function usePrintReal() {
  const print = useCallback((elementId: string, titulo?: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>${titulo || "Impressão"}</title></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
    win.close();
  }, []);
  return { print };
}
export default usePrintReal;
