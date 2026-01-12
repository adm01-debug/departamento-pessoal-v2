// V17-H056: useTickets Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketServiceReal } from '@/services/ticketService.real';
export function useTicketsReal(empresaId: string, usuarioId?: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['tickets', empresaId], queryFn: () => ticketServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: ({ titulo, descricao, prioridade }: any) => ticketServiceReal.criar(empresaId, usuarioId!, titulo, descricao, prioridade), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
  const responderMutation = useMutation({ mutationFn: ({ ticketId, mensagem }: any) => ticketServiceReal.responder(ticketId, usuarioId!, mensagem), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
  const fecharMutation = useMutation({ mutationFn: ticketServiceReal.fechar, onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
  return { ...query, create: createMutation.mutateAsync, responder: responderMutation.mutateAsync, fechar: fecharMutation.mutateAsync };
}
export default useTicketsReal;
