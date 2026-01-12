// V17-H043: useOnboarding Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingServiceReal } from '@/services/onboardingService.real';
export function useOnboardingReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['onboarding', colaboradorId], queryFn: () => onboardingServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const iniciarMutation = useMutation({ mutationFn: () => onboardingServiceReal.iniciar(colaboradorId), onSuccess: () => qc.invalidateQueries({ queryKey: ['onboarding'] }) });
  const avancarMutation = useMutation({ mutationFn: (onboardingId: string) => onboardingServiceReal.avancarEtapa(onboardingId), onSuccess: () => qc.invalidateQueries({ queryKey: ['onboarding'] }) });
  return { ...query, iniciar: iniciarMutation.mutateAsync, avancar: avancarMutation.mutateAsync };
}
export default useOnboardingReal;
