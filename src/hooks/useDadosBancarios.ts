import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dadosBancariosService } from "@/services/dadosBancariosService";
import { useToast } from "@/hooks/use-toast";
export function useDadosBancarios(colaboradorId?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: contas = [], isLoading } = useQuery({ queryKey: ["dadosBancarios", colaboradorId], queryFn: () => colaboradorId ? dadosBancariosService.getByColaborador(colaboradorId) : [], enabled: !!colaboradorId });
  const createMut = useMutation({ mutationFn: dadosBancariosService.create, onSuccess: () => { qc.invalidateQueries({queryKey:["dadosBancarios"]}); toast({title:"Conta adicionada!"}); }});
  const updateMut = useMutation({ mutationFn: ({id, data}: any) => dadosBancariosService.update(id, data), onSuccess: () => { qc.invalidateQueries({queryKey:["dadosBancarios"]}); toast({title:"Conta atualizada!"}); }});
  const deleteMut = useMutation({ mutationFn: dadosBancariosService.delete, onSuccess: () => { qc.invalidateQueries({queryKey:["dadosBancarios"]}); toast({title:"Conta removida!"}); }});
  return { contas, isLoading, create: createMut.mutateAsync, update: (id: string, data: any) => updateMut.mutateAsync({id, data}), remove: deleteMut.mutateAsync };
}
export default useDadosBancarios;
