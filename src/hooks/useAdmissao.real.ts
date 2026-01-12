// V17-H002: useAdmissao Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissaoServiceReal } from '@/services/admissaoService.real';
import { useToast } from '@/hooks/use-toast';
export function useAdmissaoReal(empresaId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const query = useQuery({ queryKey: ['admissoes', empresaId], queryFn: () => admissaoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: admissaoServiceReal.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admissoes'] }); toast({ title: 'Admissão iniciada!' }); } });
  const concluirMutation = useMutation({ mutationFn: admissaoServiceReal.concluir, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admissoes', 'colaboradores'] }); toast({ title: 'Admissão concluída!' }); } });
  return { ...query, create: createMutation.mutateAsync, concluir: concluirMutation.mutateAsync };
}
export default useAdmissaoReal;
