// V18-H007: Hook de Impressao Formatada
import { useState, useCallback } from "react";

export interface ConfigPrint {
  titulo: string;
  orientacao?: "portrait" | "landscape";
  margens?: string;
}

export function usePrintReal() {
  const [isPrinting, setIsPrinting] = useState(false);

  const print = useCallback((config: ConfigPrint, conteudo: string) => {
    setIsPrinting(true);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`<!DOCTYPE html><html><head><title>${config.titulo}</title>
        <style>@media print{body{margin:${config.margens || "20px"}}}</style></head>
        <body>${conteudo}</body></html>`);
      win.document.close();
      win.print();
      win.close();
    }
    setIsPrinting(false);
  }, []);

  const printElement = useCallback((config: ConfigPrint, elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) print(config, el.innerHTML);
  }, [print]);

  return { print, printElement, isPrinting };
}

export default usePrintReal;
