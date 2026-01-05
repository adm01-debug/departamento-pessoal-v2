import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { avaliacaoService } from "@/services/avaliacaoService";
import { useToast } from "@/hooks/use-toast";
export function useAvaliacao(colaboradorId?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: avaliacoes = [], isLoading } = useQuery({ queryKey: ["avaliacoes", colaboradorId], queryFn: () => colaboradorId ? avaliacaoService.getByColaborador(colaboradorId) : avaliacaoService.getAll() });
  const { data: pendentes = [] } = useQuery({ queryKey: ["avaliacoes-pendentes"], queryFn: avaliacaoService.getPendentes });
  const createMut = useMutation({ mutationFn: avaliacaoService.create, onSuccess: () => { qc.invalidateQueries({queryKey:["avaliacoes"]}); toast({title:"Avaliação criada!"}); }});
  const updateMut = useMutation({ mutationFn: ({id, data}: any) => avaliacaoService.update(id, data), onSuccess: () => { qc.invalidateQueries({queryKey:["avaliacoes"]}); toast({title:"Avaliação atualizada!"}); }});
  return { avaliacoes, pendentes, isLoading, create: createMut.mutateAsync, update: (id: string, d: any) => updateMut.mutateAsync({id, data: d}) };
}
export default useAvaliacao;
