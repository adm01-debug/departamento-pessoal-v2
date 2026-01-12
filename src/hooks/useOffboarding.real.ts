// V17-H044: useOffboarding Real
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offboardingServiceReal } from '@/services/offboardingService.real';
export function useOffboardingReal(colaboradorId: string) {
  const qc = useQueryClient();
  const iniciarMutation = useMutation({ mutationFn: () => offboardingServiceReal.iniciar(colaboradorId), onSuccess: () => qc.invalidateQueries({ queryKey: ['offboarding'] }) });
  const avancarMutation = useMutation({ mutationFn: (offboardingId: string) => offboardingServiceReal.avancarEtapa(offboardingId), onSuccess: () => qc.invalidateQueries({ queryKey: ['offboarding'] }) });
  return { iniciar: iniciarMutation.mutateAsync, avancar: avancarMutation.mutateAsync };
}
export default useOffboardingReal;
