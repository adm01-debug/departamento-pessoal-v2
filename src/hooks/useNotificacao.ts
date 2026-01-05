import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificacaoService } from "@/services/notificacaoService";
export function useNotificacao(usuarioId: string) {
  const qc = useQueryClient();
  const { data: notificacoes = [], isLoading } = useQuery({ queryKey: ["notificacoes", usuarioId], queryFn: () => notificacaoService.getByUsuario(usuarioId) });
  const { data: naoLidas = [] } = useQuery({ queryKey: ["notificacoes-nao-lidas", usuarioId], queryFn: () => notificacaoService.getNaoLidas(usuarioId) });
  const marcarLida = useMutation({ mutationFn: notificacaoService.marcarLida, onSuccess: () => qc.invalidateQueries({queryKey:["notificacoes"]}) });
  const marcarTodasLidas = useMutation({ mutationFn: () => notificacaoService.marcarTodasLidas(usuarioId), onSuccess: () => qc.invalidateQueries({queryKey:["notificacoes"]}) });
  return { notificacoes, naoLidas, isLoading, quantidadeNaoLidas: naoLidas.length, marcarLida: marcarLida.mutateAsync, marcarTodasLidas: marcarTodasLidas.mutateAsync };
}
export default useNotificacao;
