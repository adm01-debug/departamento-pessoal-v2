import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { contratacaoService } from '@/services/contratacaoService';

export function useContratacaoDigital() {
  const queryClient = useQueryClient();

  const atualizarEtapa = useMutation({
    mutationFn: async ({ tokenId, campos }: { tokenId: string, campos: any }) => {
      const { data, error } = await supabase
        .from('admissao_tokens')
        .update({
          ...campos,
          updated_at: new Date().toISOString()
        })
        .eq('id', tokenId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratacao-token'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const validarDocumento = useMutation({
    mutationFn: async ({ admissaoId, docType, status, observacao }: { 
      admissaoId: string, 
      docType: string, 
      status: 'validado' | 'rejeitado', 
      observacao?: string 
    }) => {
      return await contratacaoService.validarDocumento(admissaoId, docType, status, observacao);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      queryClient.invalidateQueries({ queryKey: ['contratacao-token'] });
      toast.success('Validação do documento atualizada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { atualizarEtapa, validarDocumento };
}
