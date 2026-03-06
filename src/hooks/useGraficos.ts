// @ts-nocheck
// V18-H003: Hook de Graficos - Recharts Integration
import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DadosGrafico {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ConfigGrafico {
  tipo: "line" | "bar" | "pie" | "area";
  titulo: string;
  dados: DadosGrafico[];
  cores?: string[];
}

export function useGraficos(empresaId: string) {
  const coresPadrao = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

  const { data: folhaMensal, isLoading: loadingFolha } = useQuery({
    queryKey: ["graficos-folha", empresaId],
    queryFn: async () => {
      const { data } = await supabase.from("folhas_pagamento")
        .select("competencia, valor_bruto, inss, irrf, fgts")
        .eq("empresa_id", empresaId)
        .order("competencia", { ascending: true })
        .limit(12);
      return data || [];
    }
  });

  const dadosFolhaMensal = useMemo((): DadosGrafico[] => {
    const agrupado = new Map<string, { bruto: number; inss: number; irrf: number }>();
    (folhaMensal || []).forEach(f => {
      const atual = agrupado.get(f.competencia) || { bruto: 0, inss: 0, irrf: 0 };
      atual.bruto += f.valor_bruto || 0;
      atual.inss += f.inss || 0;
      atual.irrf += f.irrf || 0;
      agrupado.set(f.competencia, atual);
    });
    return Array.from(agrupado.entries()).map(([name, vals]) => ({
      name,
      value: vals.bruto,
      bruto: vals.bruto,
      inss: vals.inss,
      irrf: vals.irrf
    }));
  }, [folhaMensal]);

  const { data: colaboradores } = useQuery({
    queryKey: ["graficos-colaboradores", empresaId],
    queryFn: async () => {
      const { data } = await supabase.from("colaboradores")
        .select("departamento, status")
        .eq("empresa_id", empresaId);
      return data || [];
    }
  });

  const dadosPorDepartamento = useMemo((): DadosGrafico[] => {
    const contagem = new Map<string, number>();
    (colaboradores || []).forEach(c => {
      const dept = c.departamento || "Sem departamento";
      contagem.set(dept, (contagem.get(dept) || 0) + 1);
    });
    return Array.from(contagem.entries()).map(([name, value]) => ({ name, value }));
  }, [colaboradores]);

  const dadosPorStatus = useMemo((): DadosGrafico[] => {
    const contagem = new Map<string, number>();
    (colaboradores || []).forEach(c => {
      const status = c.status || "ativo";
      contagem.set(status, (contagem.get(status) || 0) + 1);
    });
    return Array.from(contagem.entries()).map(([name, value]) => ({ name, value }));
  }, [colaboradores]);

  const gerarConfigGrafico = useCallback((tipo: ConfigGrafico["tipo"], titulo: string, dados: DadosGrafico[]): ConfigGrafico => ({
    tipo, titulo, dados, cores: coresPadrao
  }), [coresPadrao]);

  return {
    dadosFolhaMensal,
    dadosPorDepartamento,
    dadosPorStatus,
    isLoading: loadingFolha,
    gerarConfigGrafico,
    coresPadrao
  };
}

export default useGraficos;
