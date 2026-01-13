// QA-FIX: useCargos Real Implementation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  cbo?: string;
  departamentoId?: string;
  salarioBase?: number;
  status: "ativo" | "inativo";
  createdAt: Date;
}

export function useCargosReal(departamentoId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["cargos", departamentoId],
    queryFn: async () => {
      let q = supabase.from("cargos").select("*");
      if (departamentoId) q = q.eq("departamento_id", departamentoId);
      const { data, error } = await q.order("nome");
      if (error) throw error;
      return data || [];
    },
  });

  const create = useMutation({
    mutationFn: async (cargo: Partial<Cargo>) => {
      const { data, error } = await supabase
        .from("cargos")
        .insert(cargo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cargos"] });
      toast({ title: "Cargo criado!" });
    },
  });

  return {
    cargos: query.data || [],
    isLoading: query.isLoading,
    create,
    refetch: query.refetch,
  };
}

export default useCargosReal;
