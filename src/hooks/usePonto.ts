import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { toast } from 'sonner';

export function usePonto(colaboradorId?: string) {
  const { empresaAtual } = useEmpresa();
  const queryClient = useQueryClient();

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['registros-ponto', empresaAtual?.id, colaboradorId],
    enabled: !!empresaAtual?.id,
    queryFn: async () => {
      let query = supabase.from('registros_ponto').select('*, colaborador:colaboradores(nome_completo)').order('data', { ascending: false }).limit(100);
      if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const registrarPonto = useMutation({
    mutationFn: async ({ tipo, colaboradorId: colId }: { tipo: string; colaboradorId: string }) => {
      const now = new Date();
      const data = now.toISOString().split('T')[0];
      const hora = now.toTimeString().split(' ')[0].substring(0, 5);
      const campo = tipo === 'entrada' ? 'entrada_1'
        : tipo === 'saida_almoco' ? 'saida_intervalo'
        : tipo === 'retorno_almoco' ? 'retorno_intervalo'
        : 'saida_1';

      const { data: existing } = await supabase.from('registros_ponto').select('id').eq('data', data).eq('colaborador_id', colId).maybeSingle();

      if (existing) {
        const { error } = await supabase.from('registros_ponto').update({ [campo]: hora }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('registros_ponto').insert({ data, [campo]: hora, colaborador_id: colId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registros-ponto'] });
      toast.success('Ponto registrado!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { registros, isLoading, registrarPonto };
}
