// V17-H029: usePermissoes Real
import { useQuery, useMutation } from '@tanstack/react-query';
import { permissaoServiceReal } from '@/services/permissaoService.real';
export function usePermissoesReal(usuarioId?: string) {
  const rolesQuery = useQuery({ queryKey: ['roles'], queryFn: () => permissaoServiceReal.getRoles() });
  const verificarMutation = useMutation({ mutationFn: (permissao: string) => permissaoServiceReal.verificarPermissao(usuarioId!, permissao) });
  const temPermissao = async (permissao: string) => usuarioId ? await verificarMutation.mutateAsync(permissao) : false;
  return { roles: rolesQuery.data, temPermissao, verificando: verificarMutation.isPending };
}
export default usePermissoesReal;
