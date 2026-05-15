import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as esocialService from '@/services/esocialService';
import { toast } from 'sonner';

export function useESocial() {
  const queryClient = useQueryClient();

  const eventosQuery = useQuery({
    queryKey: ['esocial-eventos'],
    queryFn: async () => {
      return await esocialService.listarEventos(null);
    },
  });

  const statsQuery = useQuery({
    queryKey: ['esocial-stats'],
    queryFn: async () => {
      return await esocialService.obterEstatisticas(null);
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['esocial-eventos'] });
    queryClient.invalidateQueries({ queryKey: ['esocial-stats'] });
  };

  const enviarMutation = useMutation({
    mutationFn: async ({ eventoId, empresaId }: { eventoId: string; empresaId: string }) => {
      return await esocialService.enviarEvento(eventoId, empresaId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(`Evento enviado — Protocolo: ${data.protocolo}`);
      } else {
        toast.error(`Falha no envio: ${data?.error}`);
      }
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reenviarMutation = useMutation({
    mutationFn: async ({ eventoId, empresaId }: { eventoId: string; empresaId: string }) => {
      return await esocialService.reenviarEvento(eventoId, empresaId);
    },
    onSuccess: (data) => {
      if (data?.success) toast.success('Evento reenviado com sucesso');
      else toast.error(`Falha ao reenviar: ${data?.error}`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const gerarEventosMutation = useMutation({
    mutationFn: async ({ empresaId, competencia }: { empresaId: string; competencia: string }) => {
      return await esocialService.gerarEventosPeriodo(empresaId, competencia);
    },
    onSuccess: (data) => {
      toast.success(`Geração concluída: ${data.criados} criados, ${data.pulados} já existentes.`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    eventos: eventosQuery.data || [],
    stats: statsQuery.data || { enviados: 0, pendentes: 0, erros: 0, conformidade: 100 },
    isLoading: eventosQuery.isLoading || statsQuery.isLoading,
    enviarEvento: enviarMutation.mutate,
    reenviarEvento: reenviarMutation.mutate,
    gerarEventosPeriodo: gerarEventosMutation.mutate,
    isSending: enviarMutation.isPending || reenviarMutation.isPending || gerarEventosMutation.isPending,
  };
}
