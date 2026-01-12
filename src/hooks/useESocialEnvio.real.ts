// V17-H022: useESocialEnvio Real
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { esocialServiceReal } from '@/services/esocialService.real';
export function useESocialEnvioReal() {
  const qc = useQueryClient();
  const enviarMutation = useMutation({ mutationFn: esocialServiceReal.enviarEvento, onSuccess: () => qc.invalidateQueries({ queryKey: ['esocial-eventos'] }) });
  const enviarLoteMutation = useMutation({ mutationFn: async (eventoIds: string[]) => { for (const id of eventoIds) { await esocialServiceReal.enviarEvento(id); } }, onSuccess: () => qc.invalidateQueries({ queryKey: ['esocial-eventos'] }) });
  return { enviar: enviarMutation.mutateAsync, enviarLote: enviarLoteMutation.mutateAsync, isEnviando: enviarMutation.isPending || enviarLoteMutation.isPending };
}
export default useESocialEnvioReal;
