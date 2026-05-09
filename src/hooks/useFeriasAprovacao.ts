import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feriasService } from '@/services';
import { useAuth } from '@/contexts';
import { toast } from 'sonner';

export function useFeriasAprovacao() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: ['ferias'] });

  const aprovarGestor = useMutation({
    mutationFn: (id: string) => feriasService.aprovarGestor(id, user?.id),
    onSuccess: () => {
      invalidate();
      toast.success('Aprovação do gestor registrada com sucesso');
    },
    onError: (error: any) => toast.error(`Erro ao aprovar: ${error.message}`),
  });

  const aprovarRH = useMutation({
    mutationFn: (id: string) => feriasService.aprovarRH(id, user?.id),
    onSuccess: () => {
      invalidate();
      toast.success('Aprovação do RH registrada. Férias confirmadas!');
    },
    onError: (error: any) => toast.error(`Erro ao aprovar: ${error.message}`),
  });

  const enviarContabilidade = useMutation({
    mutationFn: (id: string) => feriasService.enviarContabilidade(id, user?.id),
    onSuccess: () => {
      invalidate();
      toast.success('Solicitação enviada para a contabilidade');
    },
    onError: (error: any) => toast.error(`Erro ao enviar: ${error.message}`),
  });

  const rejeitar = useMutation({
    mutationFn: (id: string) => feriasService.rejeitar(id),
    onSuccess: () => {
      invalidate();
      toast.warning('Solicitação de férias rejeitada');
    },
    onError: (error: any) => toast.error(`Erro ao rejeitar: ${error.message}`),
  });

  const cancelar = useMutation({
    mutationFn: (id: string) => feriasService.cancelar(id, user?.id),
    onSuccess: () => {
      invalidate();
      toast.info('Solicitação de férias cancelada');
    },
    onError: (error: any) => toast.error(`Erro ao cancelar: ${error.message}`),
  });

  return {
    aprovarGestor: aprovarGestor.mutateAsync,
    aprovarRH: aprovarRH.mutateAsync,
    enviarContabilidade: enviarContabilidade.mutateAsync,
    rejeitar: rejeitar.mutateAsync,
    cancelar: cancelar.mutateAsync,
    isLoading: 
      aprovarGestor.isPending || 
      aprovarRH.isPending || 
      enviarContabilidade.isPending || 
      rejeitar.isPending || 
      cancelar.isPending,
  };
}
