// V18-H006: useImport Real
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
export function useImportReal<T>() {
  const [importando, setImportando] = useState(false);
  const [dados, setDados] = useState<T[]>([]);
  const { toast } = useToast();
  const importarCSV = useCallback(async (file: File) => {
    setImportando(true);
    try {
      const text = await file.text();
      const [header, ...rows] = text.split("\n").map(l => l.split(","));
      const parsed = rows.filter(r => r.length === header.length).map(r => header.reduce((obj, h, i) => ({ ...obj, [h.trim()]: r[i]?.trim() }), {} as T));
      setDados(parsed);
      toast({ title: "Importado!", description: `${parsed.length} registros` });
      return parsed;
    } finally { setImportando(false); }
  }, [toast]);
  return { importando, dados, importarCSV, limpar: () => setDados([]) };
}
export default useImportReal;
