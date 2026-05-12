import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useAuth } from '@/hooks/useAuth';
import * as esocialService from '@/services/esocialService';
import { toast } from 'sonner';

export function useESocial() {
  const { user } = useAuth();
  const { empresaAtual } = useEmpresas();
  const queryClient = useQueryClient();
  const empresaId = empresaAtual?.id || null;

  const eventosQuery = useQuery({
    queryKey: ['esocial-eventos', empresaId],
    queryFn: () => esocialService.listarEventos(empresaId),
    enabled: !!user,
  });

  const statsQuery = useQuery({
    queryKey: ['esocial-stats', empresaId],
    queryFn: () => esocialService.obterEstatisticas(empresaId),
    enabled: !!user,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['esocial-eventos'] });
    queryClient.invalidateQueries({ queryKey: ['esocial-stats'] });
  };

  const criarMutation = useMutation({
    mutationFn: esocialService.criarEvento,
    onSuccess: () => {
      toast.success('Evento criado com sucesso');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const enviarMutation = useMutation({
    mutationFn: ({ eventoId, empresaId }: { eventoId: string; empresaId: string }) =>
      esocialService.enviarEvento(eventoId, empresaId),
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
    mutationFn: ({ eventoId, empresaId }: { eventoId: string; empresaId: string }) =>
      esocialService.reenviarEvento(eventoId, empresaId),
    onSuccess: (data) => {
      if (data?.success) toast.success('Evento reenviado com sucesso');
      else toast.error(`Falha ao reenviar: ${data?.error}`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });


  const enviarLoteMutation = useMutation({
    mutationFn: async ({ eventoIds, empresaId }: { eventoIds: string[]; empresaId: string }) => {
      const results = [];
      for (const id of eventoIds) {
        const res = await esocialService.enviarEvento(id, empresaId);
        results.push(res);
      }
      return results;
    },
    onSuccess: (results) => {
      const successes = results.filter(r => r?.success).length;
      const total = results.length;
      if (successes === total) {
        toast.success(`${successes} eventos enviados com sucesso.`);
      } else {
        toast.warning(`${successes} de ${total} eventos enviados. Verifique os erros.`);
      }
      invalidate();
    },
    onError: (err: Error) => toast.error(`Erro no processamento do lote: ${err.message}`),
  });

  const gerarEventosMutation = useMutation({
    mutationFn: ({ empresaId, competencia }: { empresaId: string; competencia: string }) =>
      esocialService.gerarEventosPeriodo(empresaId, competencia),
    onSuccess: (data) => {
      toast.success(`Geração concluída: ${data.criados} criados, ${data.pulados} já existentes.`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    eventos: eventosQuery.data || [],
    stats: statsQuery.data || { enviados: 0, pendentes: 0, erros: 0, conformidade: 100 },
    isLoading: eventosQuery.isLoading,
    criarEvento: criarMutation.mutate,
    enviarEvento: enviarMutation.mutate,
    reenviarEvento: reenviarMutation.mutate,
    gerarEventosPeriodo: gerarEventosMutation.mutate,
    enviarLote: enviarLoteMutation.mutate,
    isSending: enviarMutation.isPending || reenviarMutation.isPending || gerarEventosMutation.isPending || enviarLoteMutation.isPending,
  };
}
