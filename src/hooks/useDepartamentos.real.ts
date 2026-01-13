// QA-FIX: useDepartamentos Real Implementation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  empresaId: string;
  responsavelId?: string;
  status: "ativo" | "inativo";
  createdAt: Date;
}

export function useDepartamentosReal(empresaId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["departamentos", empresaId],
    queryFn: async () => {
      let q = supabase.from("departamentos").select("*");
      if (empresaId) q = q.eq("empresa_id", empresaId);
      const { data, error } = await q.order("nome");
      if (error) throw error;
      return data || [];
    },
  });

  const create = useMutation({
    mutationFn: async (dept: Partial<Departamento>) => {
      const { data, error } = await supabase
        .from("departamentos")
        .insert(dept)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({ title: "Departamento criado!" });
    },
  });

  return {
    departamentos: query.data || [],
    isLoading: query.isLoading,
    create,
    refetch: query.refetch,
  };
}

export default useDepartamentosReal;
