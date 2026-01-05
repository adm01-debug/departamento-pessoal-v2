import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventoService, EventoData } from "@/services/eventoService";
import { useToast } from "@/hooks/use-toast";
export function useEvento(folhaId?: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: eventos = [], isLoading } = useQuery({ queryKey: ["eventos", folhaId], queryFn: () => folhaId ? eventoService.getByFolha(folhaId) : [], enabled: !!folhaId });
  const createMut = useMutation({ mutationFn: (d: Omit<EventoData, "id">) => eventoService.create(d), onSuccess: () => { qc.invalidateQueries({queryKey:["eventos"]}); toast({title:"Evento adicionado!"}); }});
  const updateMut = useMutation({ mutationFn: ({id, data}: {id: string; data: Partial<EventoData>}) => eventoService.update(id, data), onSuccess: () => { qc.invalidateQueries({queryKey:["eventos"]}); toast({title:"Evento atualizado!"}); }});
  const deleteMut = useMutation({ mutationFn: (id: string) => eventoService.delete(id), onSuccess: () => { qc.invalidateQueries({queryKey:["eventos"]}); toast({title:"Evento removido!"}); }});
  return { eventos, isLoading, create: useCallback((d: any) => createMut.mutateAsync(d), [createMut]), update: useCallback((id: string, d: any) => updateMut.mutateAsync({id, data: d}), [updateMut]), remove: useCallback((id: string) => deleteMut.mutateAsync(id), [deleteMut]) };
}
export default useEvento;
