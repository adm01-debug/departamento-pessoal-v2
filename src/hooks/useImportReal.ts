// @ts-nocheck
// V18-H006: Hook de Import - Importacao CSV/Excel
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ConfigImport {
  tipo: "colaboradores" | "folha" | "ponto" | "beneficios";
  empresaId: string;
  mapeamento?: Record<string, string>;
}

export interface ResultadoImport {
  total: number;
  sucesso: number;
  erros: Array<{ linha: number; erro: string }>;
}

export function useImportReal() {
  const [isImportando, setIsImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState<ResultadoImport | null>(null);
  const queryClient = useQueryClient();

  const parseCSV = useCallback((conteudo: string): string[][] => {
    const linhas = conteudo.split("\n").filter(l => l.trim());
    return linhas.map(l => l.split(";").map(c => c.replace(/^"|"$/g, "").trim()));
  }, []);

  const importarMutation = useMutation({
    mutationFn: async ({ config, dados }: { config: ConfigImport; dados: string[][] }) => {
      const cabecalhos = dados[0];
      const registros = dados.slice(1);
      const erros: ResultadoImport["erros"] = [];
      let sucesso = 0;

      for (let i = 0; i < registros.length; i++) {
        setProgresso(Math.round((i / registros.length) * 100));
        
        try {
          const registro: Record<string, string> = {};
          cabecalhos.forEach((h, idx) => {
            const campo = config.mapeamento?.[h] || h.toLowerCase().replace(/\s/g, "_");
            registro[campo] = registros[i][idx] || "";
          });
          
          await supabase.from(config.tipo).insert({ ...registro, empresa_id: config.empresaId });
          sucesso++;
        } catch (err) {
          erros.push({ linha: i + 2, erro: String(err) });
        }
      }

      return { total: registros.length, sucesso, erros };
    },
    onSuccess: (data) => {
      setResultado(data);
      setProgresso(100);
      queryClient.invalidateQueries();
    }
  });

  const importarArquivo = useCallback(async (config: ConfigImport, arquivo: File) => {
    setIsImportando(true);
    setProgresso(0);
    setResultado(null);

    try {
      const conteudo = await arquivo.text();
      const dados = parseCSV(conteudo);
      await importarMutation.mutateAsync({ config, dados });
    } finally {
      setIsImportando(false);
    }
  }, [parseCSV, importarMutation]);

  return { importarArquivo, isImportando, progresso, resultado };
}

export default useImportReal;
