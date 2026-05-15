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
    queryFn: async () => {
      const res = await esocialService.listarEventos(empresaId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!user,
  });

  const statsQuery = useQuery({
    queryKey: ['esocial-stats', empresaId],
    queryFn: async () => {
      const res = await esocialService.obterEstatisticas(empresaId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!user,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['esocial-eventos'] });
    queryClient.invalidateQueries({ queryKey: ['esocial-stats'] });
  };

  const criarMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await esocialService.criarEvento(data);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      toast.success('Evento criado com sucesso');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const enviarMutation = useMutation({
    mutationFn: async ({ eventoId, empresaId }: { eventoId: string; empresaId: string }) => {
      const res = await esocialService.enviarEvento(eventoId, empresaId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
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
      const res = await esocialService.reenviarEvento(eventoId, empresaId);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
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
        results.push(res.ok ? res.value : { success: false, error: res.error.message });
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
    mutationFn: async ({ empresaId, competencia }: { empresaId: string; competencia: string }) => {
      const res = await esocialService.gerarEventosPeriodo(empresaId, competencia);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: (data) => {
      toast.success(`Geração concluída: ${data.criados} criados, ${data.pulados} já existentes.`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const configQuery = useQuery({
    queryKey: ['esocial-config', empresaId],
    queryFn: async () => {
      const res = await esocialService.getConfig(empresaId!);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
  });

  const certificadosQuery = useQuery({
    queryKey: ['esocial-certificados', empresaId],
    queryFn: async () => {
      const res = await esocialService.listarCertificados(empresaId!);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
  });

  const salvarConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const res = await esocialService.salvarConfig(config);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      toast.success('Configurações salvas');
      queryClient.invalidateQueries({ queryKey: ['esocial-config'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const addCertMutation = useMutation({
    mutationFn: async (cert: any) => {
      const res = await esocialService.adicionarCertificado(cert);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    onSuccess: () => {
      toast.success('Certificado adicionado');
      queryClient.invalidateQueries({ queryKey: ['esocial-certificados'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const logsQuery = useQuery({
    queryKey: ['esocial-logs', empresaId],
    queryFn: async () => {
      const res = await esocialService.listarTransmissaoLogs(empresaId!);
      if (!res.ok) throw new Error(res.error.message);
      return res.value;
    },
    enabled: !!empresaId,
  });

  return {
    eventos: eventosQuery.data || [],
    stats: statsQuery.data || { enviados: 0, pendentes: 0, erros: 0, conformidade: 100 },
    config: configQuery.data,
    certificados: certificadosQuery.data || [],
    logs: logsQuery.data || [],
    isLoading: eventosQuery.isLoading || configQuery.isLoading || logsQuery.isLoading,
    criarEvento: criarMutation.mutate,
    enviarEvento: enviarMutation.mutate,
    reenviarEvento: reenviarMutation.mutate,
    gerarEventosPeriodo: gerarEventosMutation.mutate,
    enviarLote: enviarLoteMutation.mutate,
    salvarConfig: salvarConfigMutation.mutate,
    adicionarCertificado: addCertMutation.mutate,
    isSending: enviarMutation.isPending || reenviarMutation.isPending || gerarEventosMutation.isPending || enviarLoteMutation.isPending,
    refreshLogs: () => queryClient.invalidateQueries({ queryKey: ['esocial-logs'] }),
  };
}

