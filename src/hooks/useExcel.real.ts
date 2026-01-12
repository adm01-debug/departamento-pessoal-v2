// V18-H005: useExcel Real
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
export function useExcelReal() {
  const [exportando, setExportando] = useState(false);
  const { toast } = useToast();
  const exportarExcel = useCallback(async <T extends Record<string, unknown>>(dados: T[], nomeArquivo: string, colunas?: (keyof T)[]) => {
    setExportando(true);
    try {
      const cols = colunas || (dados[0] ? Object.keys(dados[0]) as (keyof T)[] : []);
      const csv = [cols.join(","), ...dados.map(r => cols.map(c => String(r[c] ?? "")).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${nomeArquivo}.csv`; a.click();
      toast({ title: "Exportado!", description: `${dados.length} registros` });
      return { sucesso: true };
    } finally { setExportando(false); }
  }, [toast]);
  return { exportando, exportarExcel };
}
export default useExcelReal;
