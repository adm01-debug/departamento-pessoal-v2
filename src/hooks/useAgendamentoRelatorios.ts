/**
 * @fileoverview Hook para agendamento de relatórios
 * @module hooks/useAgendamentoRelatorios
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export type Frequencia = "diario" | "semanal" | "mensal";
export type StatusEnvio = "sucesso" | "erro" | "pendente";

export interface RelatorioAgendado {
  id: string;
  nome: string;
  tipo_relatorio: string;
  formato: string;
  parametros: Json | null;
  email_destinatario: string;
  frequencia: Frequencia;
  dia_semana: number | null;
  dia_mes: number | null;
  hora_envio: string;
  ativo: boolean;
  ultimo_envio: string | null;
  proximo_envio: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

export interface LogEnvioRelatorio {
  id: string;
  agendamento_id: string;
  status: StatusEnvio;
  mensagem: string | null;
  created_at: string;
}

export interface NovoAgendamento {
  nome: string;
  tipo_relatorio: string;
  formato?: string;
  parametros?: Json;
  email_destinatario: string;
  frequencia: Frequencia;
  dia_semana?: number;
  dia_mes?: number;
  hora_envio?: string;
}


export function useAgendamentoRelatorios() {
  const queryClient = useQueryClient();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["relatorios-agendados"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("relatorios_agendados")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RelatorioAgendado[];
    },
  });

  const { data: logs = [] } = useQuery({
    queryKey: ["logs-envio-relatorios"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("log_envio_relatorios")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as LogEnvioRelatorio[];
    },
  });

  const criarAgendamento = useMutation({
    mutationFn: async (novoAgendamento: NovoAgendamento) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const insertData = {
        nome: novoAgendamento.nome,
        tipo_relatorio: novoAgendamento.tipo_relatorio,
        formato: novoAgendamento.formato || "PDF",
        email_destinatario: novoAgendamento.email_destinatario,
        frequencia: novoAgendamento.frequencia,
        dia_semana: novoAgendamento.dia_semana,
        dia_mes: novoAgendamento.dia_mes,
        hora_envio: novoAgendamento.hora_envio,
        parametros: novoAgendamento.parametros || null,
        created_by: userData.user?.id,
      };
      
      const { data, error } = await supabase
        .from("relatorios_agendados")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatorios-agendados"] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar agendamento: ${error.message}`);
    },
  });

  const atualizarAgendamento = useMutation({
    mutationFn: async ({ id, ...dados }: Partial<Omit<RelatorioAgendado, "id">> & { id: string }) => {
      const { data, error } = await supabase
        .from("relatorios_agendados")
        .update(dados)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatorios-agendados"] });
      toast.success("Agendamento atualizado!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  const excluirAgendamento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("relatorios_agendados")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatorios-agendados"] });
      toast.success("Agendamento excluído!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const alternarAtivo = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from("relatorios_agendados")
        .update({ ativo })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { ativo }) => {
      queryClient.invalidateQueries({ queryKey: ["relatorios-agendados"] });
      toast.success(ativo ? "Agendamento ativado!" : "Agendamento pausado!");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const criarAgendamentoFn = async (data: NovoAgendamento): Promise<RelatorioAgendado | null> => {
    try {
      const result = await criarAgendamento.mutateAsync(data);
      return result as RelatorioAgendado;
    } catch {
      return null;
    }
  };

  const excluirAgendamentoFn = async (id: string): Promise<boolean> => {
    try {
      await excluirAgendamento.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const alternarAtivoFn = async (id: string, ativo: boolean): Promise<boolean> => {
    try {
      await alternarAtivo.mutateAsync({ id, ativo });
      return true;
    } catch {
      return false;
    }
  };

  const executarAgoraFn = async (id: string): Promise<boolean> => {
    try {
      const agendamento = agendamentos?.find(a => a.id === id);
      if (!agendamento) return false;
      
      const { error } = await supabase.functions.invoke("enviar-relatorio", {
        body: {
          agendamentoId: agendamento.id,
          tipoRelatorio: agendamento.tipo_relatorio,
          formato: agendamento.formato,
          emailDestinatario: agendamento.email_destinatario,
          parametros: agendamento.parametros,
        },
      });

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["relatorios-agendados"] });
      queryClient.invalidateQueries({ queryKey: ["logs-envio-relatorios"] });
      toast.success("Relatório enviado!");
      return true;
    } catch (error) {
      toast.error(`Erro ao enviar: ${(error as Error).message}`);
      return false;
    }
  };

  return {
    agendamentos,
    logs,
    isLoading,
    criarAgendamento: criarAgendamentoFn,
    atualizarAgendamento: async () => true,
    excluirAgendamento: excluirAgendamentoFn,
    alternarAtivo: alternarAtivoFn,
    executarAgora: executarAgoraFn,
  };
}

// Tipos de relatórios disponíveis para agendamento
export const TIPOS_RELATORIO = [
  { value: "lista_colaboradores", label: "Lista de Colaboradores Ativos" },
  { value: "folha_resumo", label: "Resumo da Folha de Pagamento" },
  { value: "ferias_proximas", label: "Férias Próximas (30 dias)" },
  { value: "afastamentos_ativos", label: "Afastamentos Ativos" },
  { value: "indicadores_dp", label: "Indicadores do DP" },
  { value: "aniversariantes", label: "Aniversariantes do Mês" },
  { value: "admissoes_periodo", label: "Admissões do Período" },
  { value: "desligamentos_periodo", label: "Desligamentos do Período" },
];

export const DIAS_SEMANA = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];




