// V17-H028: useNotificacoes Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificacaoServiceReal } from '@/services/notificacaoService.real';
export function useNotificacoesReal(usuarioId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['notificacoes', usuarioId], queryFn: () => notificacaoServiceReal.getByUsuario(usuarioId), enabled: !!usuarioId, refetchInterval: 60000 });
  const naoLidasQuery = useQuery({ queryKey: ['notificacoes-nao-lidas', usuarioId], queryFn: () => notificacaoServiceReal.getNaoLidas(usuarioId), enabled: !!usuarioId, refetchInterval: 30000 });
  const marcarLidaMutation = useMutation({ mutationFn: notificacaoServiceReal.marcarLida, onSuccess: () => qc.invalidateQueries({ queryKey: ['notificacoes'] }) });
  const marcarTodasMutation = useMutation({ mutationFn: () => notificacaoServiceReal.marcarTodasLidas(usuarioId), onSuccess: () => qc.invalidateQueries({ queryKey: ['notificacoes'] }) });
  return { ...query, naoLidas: naoLidasQuery.data, marcarLida: marcarLidaMutation.mutateAsync, marcarTodas: marcarTodasMutation.mutateAsync };
}
export default useNotificacoesReal;
