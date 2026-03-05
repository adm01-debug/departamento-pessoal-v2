// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { treinamentoService } from "@/services/treinamentoService";
import { useToast } from "@/hooks/use-toast";
export function useTreinamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: treinamentos = [], isLoading } = useQuery({ queryKey: ["treinamentos"], queryFn: treinamentoService.getAll });
  const createMut = useMutation({ mutationFn: treinamentoService.create, onSuccess: () => { qc.invalidateQueries({queryKey:["treinamentos"]}); toast({title:"Treinamento criado!"}); }});
  const updateMut = useMutation({ mutationFn: ({id, data}: any) => treinamentoService.update(id, data), onSuccess: () => { qc.invalidateQueries({queryKey:["treinamentos"]}); toast({title:"Treinamento atualizado!"}); }});
  const deleteMut = useMutation({ mutationFn: treinamentoService.delete, onSuccess: () => { qc.invalidateQueries({queryKey:["treinamentos"]}); toast({title:"Treinamento excluído!"}); }});
  return { treinamentos, isLoading, create: createMut.mutateAsync, update: (id: string, d: any) => updateMut.mutateAsync({id, data: d}), remove: deleteMut.mutateAsync };
}
export default useTreinamento;
