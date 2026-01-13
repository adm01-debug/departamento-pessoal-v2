// QA-FIX: useEmpresas Real Implementation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  status: "ativa" | "inativa";
  createdAt: Date;
  updatedAt: Date;
}

export function useEmpresasReal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const empresasQuery = useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .order("razao_social", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const createEmpresa = useMutation({
    mutationFn: async (empresa: Partial<Empresa>) => {
      const { data, error } = await supabase
        .from("empresas")
        .insert(empresa)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
      toast({ title: "Empresa criada com sucesso!" });
    },
  });

  const updateEmpresa = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Empresa> & { id: string }) => {
      const { data: updated, error } = await supabase
        .from("empresas")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
      toast({ title: "Empresa atualizada!" });
    },
  });

  return {
    empresas: empresasQuery.data || [],
    isLoading: empresasQuery.isLoading,
    error: empresasQuery.error,
    createEmpresa,
    updateEmpresa,
    refetch: empresasQuery.refetch,
  };
}

export default useEmpresasReal;
