import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Afastamento, AfastamentoComColaborador, ConfigAfastamento, TipoAfastamento, StatusAfastamento } from '@/types/afastamento';
import { differenceInDays, parseISO, addDays, format } from 'date-fns';
import { useEmpresas } from './useEmpresas';

export const useAfastamentos = () => {
  const queryClient = useQueryClient();
  const { empresaAtualId } = useEmpresas();

  // Buscar configurações de afastamentos
  const useConfigAfastamentos = () => {
    return useQuery({
      queryKey: ['config-afastamentos'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('config_afastamentos')
          .select('*');
        
        if (error) throw error;
        return data as ConfigAfastamento[];
      }
    });
  };

  // Buscar todos os afastamentos (com filtros opcionais)
  const useAfastamentosQuery = (filtros?: { 
    colaboradorId?: string; 
    status?: StatusAfastamento; 
    tipo?: TipoAfastamento;
    ano?: number 
  }) => {
    return useQuery({
      queryKey: ['afastamentos', filtros, empresaAtualId],
      queryFn: async () => {
        let query = supabase
          .from('afastamentos')
          .select(`
            *,
            colaboradores!inner(nome_completo, cargo, departamento)
          `)
          .order('data_inicio', { ascending: false });
        
        if (empresaAtualId) {
          query = query.eq('empresa_id', empresaAtualId);
        }
        if (filtros?.colaboradorId) {
          query = query.eq('colaborador_id', filtros.colaboradorId);
        }
        if (filtros?.status) {
          query = query.eq('status', filtros.status);
        }
        if (filtros?.tipo) {
          query = query.eq('tipo', filtros.tipo);
        }
        if (filtros?.ano) {
          query = query.gte('data_inicio', `${filtros.ano}-01-01`)
                       .lte('data_inicio', `${filtros.ano}-12-31`);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        return data.map((a: any) => ({
          ...a,
          colaborador_nome: a.colaboradores?.nome_completo,
          colaborador_cargo: a.colaboradores?.cargo,
          colaborador_departamento: a.colaboradores?.departamento
        })) as AfastamentoComColaborador[];
      }
    });
  };

  // Buscar afastamento por ID
  const useAfastamento = (id: string | null) => {
    return useQuery({
      queryKey: ['afastamento', id],
      queryFn: async () => {
        if (!id) return null;
        const { data, error } = await supabase
          .from('afastamentos')
          .select(`
            *,
            colaboradores!inner(nome_completo, cargo, departamento, salario_base)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return {
          ...data,
          colaborador_nome: data.colaboradores?.nome_completo,
          colaborador_cargo: data.colaboradores?.cargo,
          colaborador_departamento: data.colaboradores?.departamento,
          colaborador_salario: data.colaboradores?.salario_base
        };
      },
      enabled: !!id
    });
  };

  // Calcular dias de afastamento
  const calcularDias = (
    dataInicio: string, 
    dataFim: string, 
    tipo: TipoAfastamento,
    config?: ConfigAfastamento[]
  ) => {
    const inicio = parseISO(dataInicio);
    const fim = parseISO(dataFim);
    const diasTotal = differenceInDays(fim, inicio) + 1;
    
    // Buscar configuração do tipo
    const tipoConfig = config?.find(c => c.tipo === tipo);
    const diasEmpresaMax = tipoConfig?.dias_empresa_maximo || 15;
    
    let diasEmpresa = 0;
    let diasINSS = 0;
    
    if (tipoConfig?.pago_empresa) {
      diasEmpresa = Math.min(diasTotal, diasEmpresaMax);
    }
    
    if (tipoConfig?.pago_inss && diasTotal > diasEmpresaMax) {
      diasINSS = diasTotal - diasEmpresaMax;
    } else if (tipoConfig?.pago_inss && !tipoConfig?.pago_empresa) {
      diasINSS = diasTotal;
    }
    
    return { diasTotal, diasEmpresa, diasINSS };
  };

  // Criar afastamento
  const criarAfastamentoMutation = useMutation({
    mutationFn: async (afastamento: Omit<Afastamento, 'id' | 'created_at' | 'updated_at' | 'dias_total'>) => {
      const { data, error } = await supabase
        .from('afastamentos')
        .insert({ ...afastamento, empresa_id: empresaAtualId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento registrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar afastamento: ' + error.message);
    }
  });

  // Atualizar afastamento
  const atualizarAfastamentoMutation = useMutation({
    mutationFn: async ({ id, ...dados }: Partial<Afastamento> & { id: string }) => {
      const { data, error } = await supabase
        .from('afastamentos')
        .update(dados)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar afastamento: ' + error.message);
    }
  });

  // Encerrar afastamento
  const encerrarAfastamentoMutation = useMutation({
    mutationFn: async ({ id, dataFimReal }: { id: string; dataFimReal: string }) => {
      const { data, error } = await supabase
        .from('afastamentos')
        .update({
          status: 'encerrado',
          data_fim_real: dataFimReal
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento encerrado!');
    },
    onError: (error) => {
      toast.error('Erro ao encerrar afastamento: ' + error.message);
    }
  });

  // Prorrogar afastamento
  const prorrogarAfastamentoMutation = useMutation({
    mutationFn: async ({ 
      afastamentoId, 
      diasAdicionais, 
      motivo,
      numeroBeneficio,
      dataPericia 
    }: { 
      afastamentoId: string; 
      diasAdicionais: number; 
      motivo?: string;
      numeroBeneficio?: string;
      dataPericia?: string;
    }) => {
      // Buscar afastamento atual
      const { data: afastamento, error: errFetch } = await supabase
        .from('afastamentos')
        .select('*')
        .eq('id', afastamentoId)
        .single();
      
      if (errFetch) throw errFetch;
      
      const dataFimAnterior = afastamento.data_fim_prevista;
      const novaDataFim = format(addDays(parseISO(dataFimAnterior), diasAdicionais), 'yyyy-MM-dd');
      
      // Criar registro de prorrogação
      const { error: errProrroga } = await supabase
        .from('prorrogacoes_afastamento')
        .insert({
          afastamento_id: afastamentoId,
          data_fim_anterior: dataFimAnterior,
          data_fim_nova: novaDataFim,
          dias_adicionais: diasAdicionais,
          motivo,
          numero_beneficio_novo: numeroBeneficio,
          data_pericia: dataPericia
        });
      
      if (errProrroga) throw errProrroga;
      
      // Atualizar afastamento
      const novosDiasINSS = (afastamento.dias_inss || 0) + diasAdicionais;
      
      const { data, error } = await supabase
        .from('afastamentos')
        .update({
          data_fim_prevista: novaDataFim,
          dias_inss: novosDiasINSS,
          status: 'prorrogado',
          numero_beneficio: numeroBeneficio || afastamento.numero_beneficio
        })
        .eq('id', afastamentoId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento prorrogado!');
    },
    onError: (error) => {
      toast.error('Erro ao prorrogar afastamento: ' + error.message);
    }
  });

  // Cancelar afastamento
  const cancelarAfastamentoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('afastamentos')
        .update({ status: 'cancelado' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afastamentos'] });
      toast.success('Afastamento cancelado!');
    },
    onError: (error) => {
      toast.error('Erro ao cancelar afastamento: ' + error.message);
    }
  });

  // Buscar afastamentos ativos (para alertas)
  const useAfastamentosAtivos = () => {
    return useQuery({
      queryKey: ['afastamentos-ativos', empresaAtualId],
      queryFn: async () => {
        let query = supabase
          .from('afastamentos')
          .select(`
            *,
            colaboradores!inner(nome_completo, cargo, departamento)
          `)
          .in('status', ['ativo', 'prorrogado'])
          .order('data_fim_prevista', { ascending: true });
        
        if (empresaAtualId) {
          query = query.eq('empresa_id', empresaAtualId);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data.map((a: any) => ({
          ...a,
          colaborador_nome: a.colaboradores?.nome_completo
        }));
      }
    });
  };

  return {
    useConfigAfastamentos,
    useAfastamentosQuery,
    useAfastamento,
    useAfastamentosAtivos,
    calcularDias,
    criarAfastamento: criarAfastamentoMutation.mutate,
    atualizarAfastamento: atualizarAfastamentoMutation.mutate,
    encerrarAfastamento: encerrarAfastamentoMutation.mutate,
    prorrogarAfastamento: prorrogarAfastamentoMutation.mutate,
    cancelarAfastamento: cancelarAfastamentoMutation.mutate,
    isCriando: criarAfastamentoMutation.isPending,
    isAtualizando: atualizarAfastamentoMutation.isPending,
    isProrrogando: prorrogarAfastamentoMutation.isPending
  };
};
