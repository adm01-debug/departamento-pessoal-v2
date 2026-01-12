// V17-H021: useESocial Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { esocialServiceReal } from '@/services/esocialService.real';
import { useToast } from '@/hooks/use-toast';
export function useESocialReal(empresaId: string, competencia?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const query = useQuery({ queryKey: ['esocial-eventos', empresaId, competencia], queryFn: () => esocialServiceReal.getEventos(empresaId, competencia), enabled: !!empresaId });
  const criarMutation = useMutation({ mutationFn: ({ tipoEvento, dados, comp }: any) => esocialServiceReal.criarEvento(empresaId, tipoEvento, dados, comp || competencia!), onSuccess: () => { qc.invalidateQueries({ queryKey: ['esocial-eventos'] }); toast({ title: 'Evento criado!' }); } });
  const enviarMutation = useMutation({ mutationFn: esocialServiceReal.enviarEvento, onSuccess: () => { qc.invalidateQueries({ queryKey: ['esocial-eventos'] }); toast({ title: 'Evento enviado!' }); } });
  return { ...query, criar: criarMutation.mutateAsync, enviar: enviarMutation.mutateAsync };
}
export default useESocialReal;
