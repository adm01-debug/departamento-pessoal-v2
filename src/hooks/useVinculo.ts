// @ts-nocheck
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vinculoService, VinculoData } from "@/services/vinculoService";
import { useToast } from "@/hooks/use-toast";
export function useVinculo() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: vinculos = [], isLoading, refetch } = useQuery({ queryKey: ["vinculos"], queryFn: () => vinculoService.getAll() });
  const { data: vinculo } = useQuery({ queryKey: ["vinculo", selectedId], queryFn: () => selectedId ? vinculoService.getById(selectedId) : null, enabled: !!selectedId });
  const createMut = useMutation({ mutationFn: (d: Omit<VinculoData,"id">) => vinculoService.create(d), onSuccess: () => { qc.invalidateQueries({queryKey:["vinculos"]}); toast({title:"Vínculo criado!"}); }});
  const updateMut = useMutation({ mutationFn: ({id,data}:{id:string;data:Partial<VinculoData>}) => vinculoService.update(id,data), onSuccess: () => { qc.invalidateQueries({queryKey:["vinculos"]}); toast({title:"Vínculo atualizado!"}); }});
  const deleteMut = useMutation({ mutationFn: (id:string) => vinculoService.delete(id), onSuccess: () => { qc.invalidateQueries({queryKey:["vinculos"]}); toast({title:"Vínculo excluído!"}); }});
  return { vinculos, vinculo, isLoading, selectedId, setSelectedId, create: useCallback((d:any) => createMut.mutateAsync(d),[createMut]), update: useCallback((id:string,d:any) => updateMut.mutateAsync({id,data:d}),[updateMut]), remove: useCallback((id:string) => deleteMut.mutateAsync(id),[deleteMut]), refetch };
}
export default useVinculo;
