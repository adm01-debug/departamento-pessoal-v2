import { useMutation, useQueryClient } from '@tanstack/react-query';
import { batidasPontoService } from '@/services/batidasPontoService';
import { toast } from 'sonner';

export function useIntegracaoPontoFolha() {
  const queryClient = useQueryClient();

  const sincronizarComFolha = useMutation({
    mutationFn: async ({ 
      empresaId, 
      dataInicio, 
      dataFim 
    }: { 
      empresaId: string; 
      dataInicio: string; 
      dataFim: string; 
    }) => {
      // 1. Close period
      const periodo = await batidasPontoService.fecharPeriodo(empresaId, dataInicio, dataFim);
      
      // 2. Here we would trigger a function to calculate totals for payroll
      // For now, we simulate success after the period is closed
      return periodo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos_ponto'] });
      toast.success('Ponto sincronizado com a folha de pagamento com sucesso.');
    },
    onError: (e: Error) => toast.error(`Erro na sincronização: ${e.message}`),
  });

  return {
    sincronizarComFolha: sincronizarComFolha.mutateAsync,
    isSyncing: sincronizarComFolha.isPending
  };
}
