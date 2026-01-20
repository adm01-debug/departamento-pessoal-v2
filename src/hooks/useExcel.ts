// V18-H005: Hook de Excel - Export Avancado
import { useState, useCallback } from "react";

export interface ConfigExcel {
  nomeArquivo: string;
  nomeAba?: string;
  cabecalhos?: string[];
  larguraColunas?: number[];
}

export interface DadosExcel {
  dados: (string | number | Date | null)[][];
  cabecalhos?: string[];
}

export function useExcel() {
  const [isExportando, setIsExportando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const exportarExcel = useCallback(async (config: ConfigExcel, dados: DadosExcel): Promise<boolean> => {
    setIsExportando(true);
    setErro(null);
    
    try {
      const csv = gerarCSV(dados);
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.nomeArquivo}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      setErro(String(err));
      return false;
    } finally {
      setIsExportando(false);
    }
  }, []);

  const gerarCSV = (dados: DadosExcel): string => {
    const linhas: string[] = [];
    if (dados.cabecalhos) {
      linhas.push(dados.cabecalhos.map(h => `"${h}"`).join(";"));
    }
    dados.dados.forEach(row => {
      linhas.push(row.map(cell => {
        if (cell === null) return "";
        if (cell instanceof Date) return cell.toLocaleDateString("pt-BR");
        return `"${String(cell).replace(/"/g, '""')}"`;
      }).join(";"));
    });
    return linhas.join("\n");
  };

  const exportarMultiplasAbas = useCallback(async (config: ConfigExcel, abas: Record<string, DadosExcel>): Promise<boolean> => {
    for (const [nomeAba, dados] of Object.entries(abas)) {
      await exportarExcel({ ...config, nomeArquivo: `${config.nomeArquivo}_${nomeAba}` }, dados);
    }
    return true;
  }, [exportarExcel]);

  return { exportarExcel, exportarMultiplasAbas, isExportando, erro };
}

export default useExcel;
