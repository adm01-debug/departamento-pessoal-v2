import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export interface TipoBeneficio {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  operadora: string | null;
  valor_padrao: number;
  desconto_colaborador: number;
  ativo: boolean;
  created_at: string;
}

export interface BeneficioColaborador {
  id: string;
  colaborador_id: string;
  tipo_beneficio_id: string;
  valor: number;
  desconto: number;
  data_inicio: string;
  data_fim: string | null;
  ativo: boolean;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  tipo_beneficio?: TipoBeneficio;
  colaborador?: {
    id: string;
    nome_completo: string;
    cargo: string;
    departamento: string;
    salario_base: number;
  };
}

export interface ResumoBeneficios {
  totalMensal: number;
  totalDescontos: number;
  custoEmpresa: number;
  porTipo: {
    tipo: TipoBeneficio;
    quantidade: number;
    valorTotal: number;
  }[];
}

export function useBeneficios() {
  const queryClient = useQueryClient();

  // Buscar tipos de benefício
  const { data: tiposBeneficio = [], isLoading: loadingTipos } = useQuery({
    queryKey: ['tipos_beneficio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_beneficio')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return data as TipoBeneficio[];
    },
  });

  // Buscar benefícios de todos os colaboradores
  const { data: beneficiosColaboradores = [], isLoading: loadingBeneficios, refetch } = useQuery({
    queryKey: ['beneficios_colaborador'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beneficios_colaborador')
        .select(`
          *,
          tipo_beneficio:tipo_beneficio_id (*),
          colaborador:colaborador_id (id, nome_completo, cargo, departamento, salario_base)
        `)
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BeneficioColaborador[];
    },
  });

  // Buscar benefícios de um colaborador específico
  const useBeneficiosColaborador = (colaboradorId: string | null) => {
    return useQuery({
      queryKey: ['beneficios_colaborador', colaboradorId],
      queryFn: async () => {
        if (!colaboradorId) return [];
        
        const { data, error } = await supabase
          .from('beneficios_colaborador')
          .select(`
            *,
            tipo_beneficio:tipo_beneficio_id (*)
          `)
          .eq('colaborador_id', colaboradorId)
          .eq('ativo', true);

        if (error) throw error;
        return data as BeneficioColaborador[];
      },
      enabled: !!colaboradorId,
    });
  };

  // Adicionar benefício ao colaborador
  const adicionarBeneficio = useMutation({
    mutationFn: async (data: {
      colaborador_id: string;
      tipo_beneficio_id: string;
      valor: number;
      desconto?: number;
      data_inicio?: string;
      observacoes?: string;
    }) => {
      const { error } = await supabase
        .from('beneficios_colaborador')
        .upsert({
          ...data,
          data_inicio: data.data_inicio || new Date().toISOString().split('T')[0],
          ativo: true,
        }, {
          onConflict: 'colaborador_id,tipo_beneficio_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios_colaborador'] });
      toast({ title: 'Benefício adicionado com sucesso' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao adicionar benefício', description: error.message, variant: 'destructive' });
    },
  });

  // Remover benefício
  const removerBeneficio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('beneficios_colaborador')
        .update({ ativo: false, data_fim: new Date().toISOString().split('T')[0] })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios_colaborador'] });
      toast({ title: 'Benefício removido' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao remover benefício', description: error.message, variant: 'destructive' });
    },
  });

  // Atualizar valor do benefício
  const atualizarBeneficio = useMutation({
    mutationFn: async ({ id, valor, desconto }: { id: string; valor: number; desconto?: number }) => {
      const { error } = await supabase
        .from('beneficios_colaborador')
        .update({ valor, desconto })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios_colaborador'] });
      toast({ title: 'Benefício atualizado' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar benefício', description: error.message, variant: 'destructive' });
    },
  });

  // Calcular resumo
  const calcularResumo = (): ResumoBeneficios => {
    const porTipo = tiposBeneficio.map(tipo => {
      const beneficiosDoTipo = beneficiosColaboradores.filter(
        b => b.tipo_beneficio_id === tipo.id
      );
      return {
        tipo,
        quantidade: beneficiosDoTipo.length,
        valorTotal: beneficiosDoTipo.reduce((acc, b) => acc + Number(b.valor), 0),
      };
    }).filter(t => t.quantidade > 0);

    const totalMensal = beneficiosColaboradores.reduce((acc, b) => acc + Number(b.valor), 0);
    const totalDescontos = beneficiosColaboradores.reduce((acc, b) => acc + Number(b.desconto || 0), 0);
    const custoEmpresa = totalMensal - totalDescontos;

    return {
      totalMensal,
      totalDescontos,
      custoEmpresa,
      porTipo,
    };
  };

  return {
    tiposBeneficio,
    beneficiosColaboradores,
    loadingTipos,
    loadingBeneficios,
    refetch,
    useBeneficiosColaborador,
    adicionarBeneficio: adicionarBeneficio.mutate,
    removerBeneficio: removerBeneficio.mutate,
    atualizarBeneficio: atualizarBeneficio.mutate,
    calcularResumo,
    isAdding: adicionarBeneficio.isPending,
  };
}
