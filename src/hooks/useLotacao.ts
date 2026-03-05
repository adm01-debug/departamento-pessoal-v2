// @ts-nocheck
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lotacaoService, LotacaoData } from "@/services/lotacaoService";
import { useToast } from "@/hooks/use-toast";
export function useLotacao() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: lotacoes = [], isLoading, refetch } = useQuery({ queryKey: ["lotacoes"], queryFn: () => lotacaoService.getAll() });
  const { data: lotacao } = useQuery({ queryKey: ["lotacao", selectedId], queryFn: () => selectedId ? lotacaoService.getById(selectedId) : null, enabled: !!selectedId });
  const createMut = useMutation({ mutationFn: (d: Omit<LotacaoData,"id">) => lotacaoService.create(d), onSuccess: () => { qc.invalidateQueries({queryKey:["lotacoes"]}); toast({title:"Lotação criada!"}); }});
  const updateMut = useMutation({ mutationFn: ({id,data}:{id:string;data:Partial<LotacaoData>}) => lotacaoService.update(id,data), onSuccess: () => { qc.invalidateQueries({queryKey:["lotacoes"]}); toast({title:"Lotação atualizada!"}); }});
  const deleteMut = useMutation({ mutationFn: (id:string) => lotacaoService.delete(id), onSuccess: () => { qc.invalidateQueries({queryKey:["lotacoes"]}); toast({title:"Lotação excluída!"}); }});
  return { lotacoes, lotacao, isLoading, selectedId, setSelectedId, create: useCallback((d:any) => createMut.mutateAsync(d),[createMut]), update: useCallback((id:string,d:any) => updateMut.mutateAsync({id,data:d}),[updateMut]), remove: useCallback((id:string) => deleteMut.mutateAsync(id),[deleteMut]), refetch };
}
export default useLotacao;
