// V17-H001: useAfastamentos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { afastamentoServiceReal } from '@/services/afastamentoService.real';
import { useToast } from '@/hooks/use-toast';
export function useAfastamentosReal(empresaId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const query = useQuery({ queryKey: ['afastamentos', empresaId], queryFn: () => afastamentoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: afastamentoServiceReal.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['afastamentos'] }); toast({ title: 'Afastamento registrado!' }); } });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: any) => afastamentoServiceReal.update(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['afastamentos'] }); } });
  return { ...query, create: createMutation.mutateAsync, update: updateMutation.mutateAsync, isCreating: createMutation.isPending };
}
export default useAfastamentosReal;
