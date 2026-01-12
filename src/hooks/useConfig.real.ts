// V17-H052: useConfig Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configServiceReal } from '@/services/configService.real';
export function useConfigReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['config', empresaId], queryFn: () => configServiceReal.get(empresaId), enabled: !!empresaId });
  const setMutation = useMutation({ mutationFn: (config: any) => configServiceReal.set(empresaId, config), onSuccess: () => qc.invalidateQueries({ queryKey: ['config'] }) });
  const setChaveMutation = useMutation({ mutationFn: ({ chave, valor }: any) => configServiceReal.setChave(empresaId, chave, valor), onSuccess: () => qc.invalidateQueries({ queryKey: ['config'] }) });
  return { ...query, set: setMutation.mutateAsync, setChave: setChaveMutation.mutateAsync };
}
export default useConfigReal;
