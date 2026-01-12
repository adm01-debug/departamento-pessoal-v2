// V17-H030: useUsuarios Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioServiceReal } from '@/services/usuarioService.real';
export function useUsuariosReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['usuarios', empresaId], queryFn: () => usuarioServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: usuarioServiceReal.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: any) => usuarioServiceReal.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }) });
  const resetSenhaMutation = useMutation({ mutationFn: usuarioServiceReal.resetSenha });
  return { ...query, create: createMutation.mutateAsync, update: updateMutation.mutateAsync, resetSenha: resetSenhaMutation.mutateAsync };
}
export default useUsuariosReal;
