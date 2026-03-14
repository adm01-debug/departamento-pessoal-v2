/**
 * @fileoverview Hook para gerenciamento de notificações
 * @module hooks/useNotificacoes
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, parseISO, addDays, format } from 'date-fns';


// Tipo para colaborador vindo de relacionamento
interface ColaboradorRelation {
  id: string;
  nome_completo: string;
  status: string;
  email?: string;
}


export interface Notificacao {
  id: string;
  user_id: string | null;
  tipo: string;
  titulo: string;
  mensagem: string;
  entidade_tipo: string | null;
  entidade_id: string | null;
  lida: boolean;
  data_referencia: string | null;
  created_at: string;
}

type TipoNotificacao = 'ferias_vencendo' | 'contrato_vencendo' | 'documento_vencendo' | 'periodo_aquisitivo';

interface AlertaConfig {
  tipo: TipoNotificacao;
  diasAntecedencia: number;
}

export function useNotificacoes() {
  const queryClient = useQueryClient();

  // Buscar notificações
  const { data: notificacoes = [], isLoading, refetch } = useQuery({
    queryKey: ['notificacoes'],
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('id, titulo, mensagem, lida, created_at, tipo')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notificacao[];
    },
  });

  // Marcar como lida
  const marcarComoLida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });

  // Marcar todas como lidas
  const marcarTodasComoLidas = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('lida', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });

  // Excluir notificação
  const excluirNotificacao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });

  // Limpar notificações antigas (mais de 30 dias)
  const limparAntigas = useMutation({
    mutationFn: async () => {
      const dataLimite = addDays(new Date(), -30).toISOString();
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .lt('created_at', dataLimite)
        .eq('lida', true);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });

  // Gerar notificações automáticas
  const gerarNotificacoesAutomaticas = useMutation({
    mutationFn: async () => {
      const hoje = new Date();
      const notificacoesParaCriar: Omit<Notificacao, 'id' | 'created_at'>[] = [];

      // 1. Verificar férias vencendo (períodos aquisitivos)
      const { data: periodos } = await supabase
        .from('periodos_aquisitivos')
        .select(`
          *,
          colaboradores:colaborador_id (id, nome_completo, status)
        `)
        .eq('status', 'adquirido');

      if (periodos) {
        for (const periodo of periodos) {
          const colaborador = periodo.colaboradores as ColaboradorRelation;
          if (!colaborador || colaborador.status !== 'ativo') continue;

          const dataFimConcessivo = addDays(parseISO(periodo.data_fim), 365);
          const diasRestantes = differenceInDays(dataFimConcessivo, hoje);

          if (diasRestantes <= 60 && diasRestantes > 0) {
            // Verificar se já existe notificação para este período
            const { data: existente } = await supabase
              .from('notificacoes')
              .select('id')
              .eq('tipo', 'periodo_aquisitivo')
              .eq('entidade_id', periodo.id)
              .maybeSingle();

            if (!existente) {
              notificacoesParaCriar.push({
                user_id: null,
                tipo: 'periodo_aquisitivo',
                titulo: 'Período de Férias Vencendo',
                mensagem: `O colaborador ${colaborador.nome_completo} tem férias vencendo em ${diasRestantes} dias (${format(dataFimConcessivo, "dd/MM/yyyy")}).`,
                entidade_tipo: 'colaborador',
                entidade_id: colaborador.id,
                lida: false,
                data_referencia: format(dataFimConcessivo, 'yyyy-MM-dd'),
              });
            }
          }
        }
      }

      // 2. Verificar contratos temporários vencendo
      const { data: colaboradores } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, tipo_contrato, data_admissao')
        .in('tipo_contrato', ['temporario', 'estagio', 'aprendiz'])
        .eq('status', 'ativo');

      if (colaboradores) {
        for (const colab of colaboradores) {
          // Assumindo contrato de 2 anos para temporários
          const duracaoContrato = colab.tipo_contrato === 'estagiario' ? 730 : 
                                  colab.tipo_contrato === 'aprendiz' ? 730 : 180;
          const dataFimContrato = addDays(parseISO(colab.data_admissao), duracaoContrato);
          const diasRestantes = differenceInDays(dataFimContrato, hoje);

          if (diasRestantes <= 30 && diasRestantes > 0) {
            const { data: existente } = await supabase
              .from('notificacoes')
              .select('id')
              .eq('tipo', 'contrato_vencendo')
              .eq('entidade_id', colab.id)
              .maybeSingle();

            if (!existente) {
              notificacoesParaCriar.push({
                user_id: null,
                tipo: 'contrato_vencendo',
                titulo: 'Contrato Vencendo',
                mensagem: `O contrato ${colab.tipo_contrato} de ${colab.nome_completo} vence em ${diasRestantes} dias (${format(dataFimContrato, "dd/MM/yyyy")}).`,
                entidade_tipo: 'colaborador',
                entidade_id: colab.id,
                lida: false,
                data_referencia: format(dataFimContrato, 'yyyy-MM-dd'),
              });
            }
          }
        }
      }

      // 3. Verificar documentos com validade próxima (CNH)
      const { data: colaboradoresDoc } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, cnh_validade')
        .not('cnh_validade', 'is', null)
        .eq('status', 'ativo');

      if (colaboradoresDoc) {
        for (const colab of colaboradoresDoc) {
          if (!colab.cnh_validade) continue;
          
          const dataValidade = parseISO(colab.cnh_validade);
          const diasRestantes = differenceInDays(dataValidade, hoje);

          if (diasRestantes <= 30 && diasRestantes > 0) {
            const { data: existente } = await supabase
              .from('notificacoes')
              .select('id')
              .eq('tipo', 'documento_vencendo')
              .eq('entidade_id', colab.id)
              .single();

            if (!existente) {
              notificacoesParaCriar.push({
                user_id: null,
                tipo: 'documento_vencendo',
                titulo: 'CNH Vencendo',
                mensagem: `A CNH de ${colab.nome_completo} vence em ${diasRestantes} dias (${format(dataValidade, "dd/MM/yyyy")}).`,
                entidade_tipo: 'colaborador',
                entidade_id: colab.id,
                lida: false,
                data_referencia: colab.cnh_validade,
              });
            }
          }
        }
      }

      // 4. Verificar férias programadas próximas
      const { data: feriasProgramadas } = await supabase
        .from('ferias')
        .select(`
          *,
          colaboradores:colaborador_id (id, nome_completo)
        `)
        .eq('status', 'aprovada');

      if (feriasProgramadas) {
        for (const ferias of feriasProgramadas) {
          const colaborador = ferias.colaboradores as ColaboradorRelation;
          if (!colaborador) continue;

          const dataInicio = parseISO(ferias.data_inicio);
          const diasAteInicio = differenceInDays(dataInicio, hoje);

          if (diasAteInicio <= 7 && diasAteInicio > 0) {
            const { data: existente } = await supabase
              .from('notificacoes')
              .select('id')
              .eq('tipo', 'ferias_vencendo')
              .eq('entidade_id', ferias.id)
              .single();

            if (!existente) {
              notificacoesParaCriar.push({
                user_id: null,
                tipo: 'ferias_vencendo',
                titulo: 'Férias Próximas',
                mensagem: `As férias de ${colaborador.nome_completo} começam em ${diasAteInicio} dias (${format(dataInicio, "dd/MM/yyyy")}).`,
                entidade_tipo: 'ferias',
                entidade_id: ferias.id,
                lida: false,
                data_referencia: ferias.data_inicio,
              });
            }
          }
        }
      }

      // Inserir todas as notificações de uma vez
      if (notificacoesParaCriar.length > 0) {
        const { error } = await supabase
          .from('notificacoes')
          .insert(notificacoesParaCriar);

        if (error) throw error;
      }

      return notificacoesParaCriar.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] });
    },
  });

  // Contadores
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  const porTipo = {
    ferias_vencendo: notificacoes.filter(n => n.tipo === 'ferias_vencendo' && !n.lida).length,
    contrato_vencendo: notificacoes.filter(n => n.tipo === 'contrato_vencendo' && !n.lida).length,
    documento_vencendo: notificacoes.filter(n => n.tipo === 'documento_vencendo' && !n.lida).length,
    periodo_aquisitivo: notificacoes.filter(n => n.tipo === 'periodo_aquisitivo' && !n.lida).length,
  };

  return {
    notificacoes,
    isLoading,
    naoLidas,
    porTipo,
    refetch,
    marcarComoLida: marcarComoLida.mutate,
    marcarTodasComoLidas: marcarTodasComoLidas.mutate,
    excluirNotificacao: excluirNotificacao.mutate,
    limparAntigas: limparAntigas.mutate,
    gerarNotificacoesAutomaticas: gerarNotificacoesAutomaticas.mutate,
    isGerando: gerarNotificacoesAutomaticas.isPending,
  };
}









