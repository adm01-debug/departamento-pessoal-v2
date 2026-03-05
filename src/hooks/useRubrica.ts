// @ts-nocheck
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rubricaService, RubricaData } from "@/services/rubricaService";
import { useToast } from "@/hooks/use-toast";
export function useRubrica() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: rubricas = [], isLoading, refetch } = useQuery({ queryKey: ["rubricas"], queryFn: () => rubricaService.getAll() });
  const { data: proventos = [] } = useQuery({ queryKey: ["rubricas", "proventos"], queryFn: () => rubricaService.getProventos() });
  const { data: descontos = [] } = useQuery({ queryKey: ["rubricas", "descontos"], queryFn: () => rubricaService.getDescontos() });
  const createMut = useMutation({ mutationFn: (d: Omit<RubricaData,"id">) => rubricaService.create(d), onSuccess: () => { qc.invalidateQueries({queryKey:["rubricas"]}); toast({title:"Rubrica criada!"}); }});
  const updateMut = useMutation({ mutationFn: ({id,data}:{id:string;data:Partial<RubricaData>}) => rubricaService.update(id,data), onSuccess: () => { qc.invalidateQueries({queryKey:["rubricas"]}); toast({title:"Rubrica atualizada!"}); }});
  const deleteMut = useMutation({ mutationFn: (id:string) => rubricaService.delete(id), onSuccess: () => { qc.invalidateQueries({queryKey:["rubricas"]}); toast({title:"Rubrica excluída!"}); }});
  return { rubricas, proventos, descontos, isLoading, selectedId, setSelectedId, create: useCallback((d:any) => createMut.mutateAsync(d),[createMut]), update: useCallback((id:string,d:any) => updateMut.mutateAsync({id,data:d}),[updateMut]), remove: useCallback((id:string) => deleteMut.mutateAsync(id),[deleteMut]), refetch };
}
export default useRubrica;
