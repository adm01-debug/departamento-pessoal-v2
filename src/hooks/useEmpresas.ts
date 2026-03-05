// @ts-nocheck
/**
 * @fileoverview Hook para gerenciamento de empresas
 * @module hooks/useEmpresas
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export interface Empresa {
  id: string;
  cnpj: string | null;
  razao_social: string;
  nome_fantasia: string | null;
  inscricao_estadual: string | null;
  inscricao_municipal: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  telefone: string | null;
  email: string | null;
  logo_url: string | null;
  ativa: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserEmpresa {
  id: string;
  user_id: string;
  empresa_id: string;
  is_default: boolean;
  created_at: string;
  empresa?: Empresa;
}

interface EmpresaStore {
  empresaAtualId: string | null;
  setEmpresaAtual: (id: string | null) => void;
}

// Store para empresa selecionada (persiste no localStorage)
export const useEmpresaStore = create<EmpresaStore>()(
  persist(
    (set) => ({
      empresaAtualId: null,
      setEmpresaAtual: (id) => set({ empresaAtualId: id }),
    }),
    {
      name: "empresa-storage",
    }
  )
);

export interface UseEmpresasReturn {
  userEmpresas: UserEmpresa[] | undefined;
  todasEmpresas: Empresa[] | undefined;
  empresaAtual: Empresa | null;
  empresaAtualId: string | null;
  loadingEmpresas: boolean;
  loadingTodas: boolean;
  criarEmpresa: (empresa: Omit<Empresa, "id" | "created_at" | "updated_at">) => void;
  atualizarEmpresa: (params: { id: string; dados: Partial<Empresa> }) => void;
  associarUsuario: (params: { userId: string; empresaId: string }) => void;
  definirEmpresaPadrao: (params: { userEmpresaId: string; empresaId: string }) => void;
  trocarEmpresa: (empresaId: string) => void;
  temMultiplasEmpresas: boolean;
}

export function useEmpresas(): UseEmpresasReturn {
  const queryClient = useQueryClient();
  const { empresaAtualId, setEmpresaAtual } = useEmpresaStore();

  // Buscar empresas do usuário
  const { data: userEmpresas, isLoading: loadingEmpresas } = useQuery({
    queryKey: ["user-empresas"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data, error } = await supabase
        .from("user_empresas")
        .select(`
          *,
          empresa:empresas(*)
        `)
        .eq("user_id", userData.user.id);

      if (error) throw error;
      return data as (UserEmpresa & { empresa: Empresa })[];
    },
  });

  // Empresa atual
  const empresaAtual = userEmpresas?.find(
    (ue) => ue.empresa_id === empresaAtualId
  )?.empresa;

  // Se não há empresa selecionada, usar a padrão
  const empresaDefault = userEmpresas?.find((ue) => ue.is_default)?.empresa;
  const empresaEfetiva = empresaAtual || empresaDefault || userEmpresas?.[0]?.empresa;

  // Listar todas as empresas (para admin)
  const { data: todasEmpresas, isLoading: loadingTodas } = useQuery({
    queryKey: ["todas-empresas"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .order("razao_social");

      if (error) throw error;
      return data as Empresa[];
    },
  });

  // Criar empresa
  const criarEmpresa = useMutation({
    mutationFn: async (empresa: Partial<Empresa>) => {
      const insertData = {
        razao_social: empresa.razao_social || "",
        nome_fantasia: empresa.nome_fantasia,
        cnpj: empresa.cnpj,
        inscricao_estadual: empresa.inscricao_estadual,
        inscricao_municipal: empresa.inscricao_municipal,
        cep: empresa.cep,
        logradouro: empresa.logradouro,
        numero: empresa.numero,
        complemento: empresa.complemento,
        bairro: empresa.bairro,
        cidade: empresa.cidade,
        uf: empresa.uf,
        telefone: empresa.telefone,
        email: empresa.email,
        logo_url: empresa.logo_url,
        ativa: empresa.ativa ?? true,
      };
      
      const { data, error } = await supabase
        .from("empresas")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todas-empresas"] });
      queryClient.invalidateQueries({ queryKey: ["user-empresas"] });
      toast.success("Empresa criada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar empresa: ${error.message}`);
    },
  });

  // Atualizar empresa
  const atualizarEmpresa = useMutation({
    mutationFn: async ({ id, ...dados }: Partial<Empresa> & { id: string }) => {
      const { data, error } = await supabase
        .from("empresas")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todas-empresas"] });
      queryClient.invalidateQueries({ queryKey: ["user-empresas"] });
      toast.success("Empresa atualizada!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  // Associar usuário a empresa
  const associarUsuario = useMutation({
    mutationFn: async ({
      userId,
      empresaId,
      isDefault = false,
    }: {
      userId: string;
      empresaId: string;
      isDefault?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("user_empresas")
        .insert({
          user_id: userId,
          empresa_id: empresaId,
          is_default: isDefault,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-empresas"] });
      toast.success("Usuário associado à empresa!");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Definir empresa padrão
  const definirEmpresaPadrao = useMutation({
    mutationFn: async (empresaId: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      // Remover padrão de todas
      await supabase
        .from("user_empresas")
        .update({ is_default: false })
        .eq("user_id", userData.user.id);

      // Definir nova padrão
      const { error } = await supabase
        .from("user_empresas")
        .update({ is_default: true })
        .eq("user_id", userData.user.id)
        .eq("empresa_id", empresaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-empresas"] });
      toast.success("Empresa padrão atualizada!");
    },
  });

  // Trocar empresa atual
  const trocarEmpresa = (empresaId: string) => {
    setEmpresaAtual(empresaId);
    queryClient.invalidateQueries(); // Invalida todas as queries para recarregar com nova empresa
    toast.success("Empresa alterada!");
  };

  return {
    userEmpresas,
    todasEmpresas,
    empresaAtual: empresaEfetiva,
    empresaAtualId: empresaEfetiva?.id || null,
    loadingEmpresas,
    loadingTodas,
    criarEmpresa,
    atualizarEmpresa,
    associarUsuario,
    definirEmpresaPadrao,
    trocarEmpresa,
    temMultiplasEmpresas: (userEmpresas?.length ?? 0) > 1,
  };
}






