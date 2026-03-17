import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEmpresas } from '@/hooks/useEmpresas';

export function useDocumentos(colaboradorId?: string) {
  const queryClient = useQueryClient();
  const { empresaAtualId } = useEmpresas();

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['documentos', empresaAtualId, colaboradorId],
    enabled: !!empresaAtualId,
    queryFn: async () => {
      const filters: Record<string, string> = {};
      if (empresaAtualId) filters.empresa_id = empresaAtualId;
      if (colaboradorId) filters.colaborador_id = colaboradorId;
      let query = supabase
        .from('documentos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);
      if (filters.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const criarDocumento = useMutation({
    mutationFn: async (doc: { nome: string; tipo: string; colaborador_id?: string; url?: string; observacoes?: string; data_validade?: string }) => {
      const { data, error } = await supabase
        .from('documentos')
        .insert({ ...doc, ...(empresaAtualId ? { empresa_id: empresaAtualId } : {}) } as any)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento criado!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const excluirDocumento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('documentos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento excluído');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { documentos, isLoading, criarDocumento, excluirDocumento };
}
