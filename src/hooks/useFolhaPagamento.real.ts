// V17-H011: useFolhaPagamento Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folhaPagamentoServiceReal } from '@/services/folhaPagamentoService.real';
import { useToast } from '@/hooks/use-toast';
export function useFolhaPagamentoReal(empresaId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const query = useQuery({ queryKey: ['folhas', empresaId], queryFn: () => folhaPagamentoServiceReal.getAll(empresaId), enabled: !!empresaId });
  const criarMutation = useMutation({ mutationFn: ({ competencia }: any) => folhaPagamentoServiceReal.criar(empresaId, competencia), onSuccess: () => { qc.invalidateQueries({ queryKey: ['folhas'] }); toast({ title: 'Folha criada!' }); } });
  const processarMutation = useMutation({ mutationFn: folhaPagamentoServiceReal.processar, onSuccess: () => { qc.invalidateQueries({ queryKey: ['folhas'] }); toast({ title: 'Folha processada!' }); } });
  const fecharMutation = useMutation({ mutationFn: folhaPagamentoServiceReal.fechar, onSuccess: () => { qc.invalidateQueries({ queryKey: ['folhas'] }); toast({ title: 'Folha fechada!' }); } });
  return { ...query, criar: criarMutation.mutateAsync, processar: processarMutation.mutateAsync, fechar: fecharMutation.mutateAsync };
}
export default useFolhaPagamentoReal;
