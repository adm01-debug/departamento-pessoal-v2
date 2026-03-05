// @ts-nocheck
// V18-BUILD: useContratos Hook - Formatado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';

export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario' | 'intermitente';
export type StatusContrato = 'ativo' | 'encerrado' | 'suspenso';

export interface Contrato {
  id: string;
  colaborador_id: string;
  colaborador_nome?: string;
  tipo: TipoContrato;
  data_inicio: string;
  data_fim?: string;
  salario: number;
  jornada_semanal: number;
  experiencia_dias?: number;
  status: StatusContrato;
}

/**
 * Hook para gerenciar contratos
 */
export function useContratos(colaboradorId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery<Contrato[]>({
    queryKey: ['contratos', colaboradorId],
    queryFn: async () => {
      let q = supabase
        .from('contratos')
        .select('*, colaborador:colaboradores(nome)')
        .order('data_inicio', { ascending: false });

      if (colaboradorId) q = q.eq('colaborador_id', colaboradorId);

      const { data, error } = await q;
      if (error) throw new Error(handleSupabaseError(error));
      return (data || []).map((c: any) => ({
        ...c,
        colaborador_nome: c.colaborador?.nome,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const create = useMutation({
    mutationFn: async (contrato: Omit<Contrato, 'id' | 'colaborador_nome' | 'status'>) => {
      const { data, error } = await supabase
        .from('contratos')
        .insert({ ...contrato, status: 'ativo' })
        .select()
        .single();
      if (error) throw new Error(handleSupabaseError(error));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({ title: 'Contrato criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar contrato', description: error.message, variant: 'destructive' });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...contrato }: Partial<Contrato> & { id: string }) => {
      const { data, error } = await supabase
        .from('contratos')
        .update(contrato)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(handleSupabaseError(error));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({ title: 'Contrato atualizado!' });
    },
  });

  const encerrar = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contratos')
        .update({ status: 'encerrado', data_fim: new Date().toISOString().split('T')[0] })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(handleSupabaseError(error));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({ title: 'Contrato encerrado!' });
    },
  });

  return {
    contratos: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    create,
    update,
    encerrar,
    refetch: query.refetch,
  };
}

export default useContratos;
