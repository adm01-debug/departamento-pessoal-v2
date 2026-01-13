// QA-FIX: usePonto Real Implementation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RegistroPonto {
  id: string;
  colaboradorId: string;
  data: string;
  entrada?: string;
  saidaAlmoco?: string;
  retornoAlmoco?: string;
  saida?: string;
  horasTrabalhadas?: number;
  horasExtras?: number;
  observacao?: string;
  status: "pendente" | "aprovado" | "rejeitado";
}

export function usePontoReal(colaboradorId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const registrosQuery = useQuery({
    queryKey: ["ponto", colaboradorId],
    queryFn: async () => {
      let query = supabase.from("registros_ponto").select("*");
      if (colaboradorId) {
        query = query.eq("colaborador_id", colaboradorId);
      }
      const { data, error } = await query.order("data", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!colaboradorId,
  });

  const registrarEntrada = useMutation({
    mutationFn: async (colaboradorId: string) => {
      const agora = new Date();
      const { data, error } = await supabase
        .from("registros_ponto")
        .insert({
          colaborador_id: colaboradorId,
          data: agora.toISOString().split("T")[0],
          entrada: agora.toTimeString().split(" ")[0],
          status: "pendente",
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ponto"] });
      toast({ title: "Entrada registrada com sucesso!" });
    },
  });

  const registrarSaida = useMutation({
    mutationFn: async (registroId: string) => {
      const agora = new Date();
      const { data, error } = await supabase
        .from("registros_ponto")
        .update({ saida: agora.toTimeString().split(" ")[0] })
        .eq("id", registroId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ponto"] });
      toast({ title: "Saída registrada com sucesso!" });
    },
  });

  const aprovarRegistro = useMutation({
    mutationFn: async (registroId: string) => {
      const { data, error } = await supabase
        .from("registros_ponto")
        .update({ status: "aprovado" })
        .eq("id", registroId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ponto"] });
      toast({ title: "Registro aprovado!" });
    },
  });

  return {
    registros: registrosQuery.data || [],
    isLoading: registrosQuery.isLoading,
    error: registrosQuery.error,
    registrarEntrada,
    registrarSaida,
    aprovarRegistro,
    refetch: registrosQuery.refetch,
  };
}

export default usePontoReal;
