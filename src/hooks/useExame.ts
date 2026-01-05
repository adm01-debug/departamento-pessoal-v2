import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { exameService } from "@/services/exameService";
import { useToast } from "@/hooks/use-toast";
export function useExame(colaboradorId?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: exames = [], isLoading } = useQuery({ queryKey: ["exames", colaboradorId], queryFn: () => colaboradorId ? exameService.getByColaborador(colaboradorId) : exameService.getAll() });
  const { data: vencidos = [] } = useQuery({ queryKey: ["exames-vencidos"], queryFn: () => exameService.getVencidos() });
  const createMut = useMutation({ mutationFn: exameService.create, onSuccess: () => { qc.invalidateQueries({queryKey:["exames"]}); toast({title:"Exame registrado!"}); }});
  const updateMut = useMutation({ mutationFn: ({id, data}: any) => exameService.update(id, data), onSuccess: () => { qc.invalidateQueries({queryKey:["exames"]}); toast({title:"Exame atualizado!"}); }});
  return { exames, vencidos, isLoading, create: createMut.mutateAsync, update: (id: string, d: any) => updateMut.mutateAsync({id, data: d}) };
}
export default useExame;
