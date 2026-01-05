import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emprestimoService, EmprestimoData } from "@/services/emprestimoService";
import { useToast } from "@/hooks/use-toast";
export function useEmprestimo() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: emprestimos = [], isLoading, refetch } = useQuery({ queryKey: ["emprestimos"], queryFn: () => emprestimoService.getAll() });
  const { data: ativos = [] } = useQuery({ queryKey: ["emprestimos", "ativos"], queryFn: () => emprestimoService.getAtivos() });
  const createMut = useMutation({ mutationFn: (d: Omit<EmprestimoData,"id">) => emprestimoService.create(d), onSuccess: () => { qc.invalidateQueries({queryKey:["emprestimos"]}); toast({title:"Empréstimo cadastrado!"}); }});
  const updateMut = useMutation({ mutationFn: ({id,data}:{id:string;data:Partial<EmprestimoData>}) => emprestimoService.update(id,data), onSuccess: () => { qc.invalidateQueries({queryKey:["emprestimos"]}); toast({title:"Empréstimo atualizado!"}); }});
  const deleteMut = useMutation({ mutationFn: (id:string) => emprestimoService.delete(id), onSuccess: () => { qc.invalidateQueries({queryKey:["emprestimos"]}); toast({title:"Empréstimo excluído!"}); }});
  const parcelaMut = useMutation({ mutationFn: (id:string) => emprestimoService.registrarParcela(id), onSuccess: () => { qc.invalidateQueries({queryKey:["emprestimos"]}); toast({title:"Parcela registrada!"}); }});
  return { emprestimos, ativos, isLoading, selectedId, setSelectedId, create: useCallback((d:any) => createMut.mutateAsync(d),[createMut]), update: useCallback((id:string,d:any) => updateMut.mutateAsync({id,data:d}),[updateMut]), remove: useCallback((id:string) => deleteMut.mutateAsync(id),[deleteMut]), registrarParcela: useCallback((id:string) => parcelaMut.mutateAsync(id),[parcelaMut]), refetch };
}
export default useEmprestimo;
