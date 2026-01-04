import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
interface FolhaData { colaboradorId: string; mes: number; ano: number; salarioBruto: number; descontos: number; liquido: number; }
export function useFolha() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FolhaData[]>([]);
  const fetchFolha = useCallback(async (mes: number, ano: number) => {
    setLoading(true); setError(null);
    try {
      const { data: result, error: err } = await supabase.from("folha_pagamento").select("*").eq("mes", mes).eq("ano", ano);
      if (err) throw err;
      setData(result || []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);
  const calcularFolha = useCallback(async (colaboradorId: string, mes: number, ano: number) => {
    setLoading(true);
    try {
      const { data: result } = await supabase.rpc("calcular_folha", { p_colaborador_id: colaboradorId, p_mes: mes, p_ano: ano });
      return result;
    } finally { setLoading(false); }
  }, []);
  return { loading, error, data, fetchFolha, calcularFolha };
}
export default useFolha;
