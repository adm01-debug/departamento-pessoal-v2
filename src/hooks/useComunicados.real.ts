// V17-H055: useComunicados Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comunicadoServiceReal } from '@/services/comunicadoService.real';
export function useComunicadosReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['comunicados', empresaId], queryFn: () => comunicadoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: ({ titulo, conteudo, destinatarios }: any) => comunicadoServiceReal.criar(empresaId, titulo, conteudo, destinatarios), onSuccess: () => qc.invalidateQueries({ queryKey: ['comunicados'] }) });
  const publicarMutation = useMutation({ mutationFn: comunicadoServiceReal.publicar, onSuccess: () => qc.invalidateQueries({ queryKey: ['comunicados'] }) });
  return { ...query, create: createMutation.mutateAsync, publicar: publicarMutation.mutateAsync };
}
export default useComunicadosReal;
