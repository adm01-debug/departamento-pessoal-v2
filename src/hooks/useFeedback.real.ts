// V17-H057: useFeedback Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackServiceReal } from '@/services/feedbackService.real';
export function useFeedbackReal(empresaId?: string, colaboradorId?: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['feedbacks', empresaId], queryFn: () => feedbackServiceReal.getAll(empresaId!), enabled: !!empresaId });
  const enviarMutation = useMutation({ mutationFn: ({ tipo, mensagem, anonimo }: any) => feedbackServiceReal.enviar(colaboradorId!, tipo, mensagem, anonimo), onSuccess: () => qc.invalidateQueries({ queryKey: ['feedbacks'] }) });
  return { ...query, enviar: enviarMutation.mutateAsync };
}
export default useFeedbackReal;
