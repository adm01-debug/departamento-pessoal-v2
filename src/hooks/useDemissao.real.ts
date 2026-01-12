// V17-H003: useDemissao Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { demissaoServiceReal } from '@/services/demissaoService.real';
import { useToast } from '@/hooks/use-toast';
export function useDemissaoReal(empresaId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const query = useQuery({ queryKey: ['demissoes', empresaId], queryFn: () => demissaoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const createMutation = useMutation({ mutationFn: demissaoServiceReal.create, onSuccess: () => { qc.invalidateQueries({ queryKey: ['demissoes'] }); toast({ title: 'Demissão registrada!' }); } });
  const concluirMutation = useMutation({ mutationFn: demissaoServiceReal.concluir, onSuccess: () => { qc.invalidateQueries({ queryKey: ['demissoes', 'colaboradores'] }); toast({ title: 'Demissão concluída!' }); } });
  return { ...query, create: createMutation.mutateAsync, concluir: concluirMutation.mutateAsync };
}
export default useDemissaoReal;
