// @ts-nocheck
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
export function useSindicato() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: sindicatos = [], isLoading } = useQuery({ queryKey: ["sindicatos"], queryFn: async () => { const { data } = await supabase.from("sindicatos").select("*").order("nome"); return data || []; } });
  const createMut = useMutation({ mutationFn: async (d: any) => { const { data } = await supabase.from("sindicatos").insert(d).select().single(); return data; }, onSuccess: () => { qc.invalidateQueries({queryKey:["sindicatos"]}); toast({title:"Sindicato criado!"}); }});
  const updateMut = useMutation({ mutationFn: async ({id, data}: {id: string; data: any}) => { const { data: result } = await supabase.from("sindicatos").update(data).eq("id", id).select().single(); return result; }, onSuccess: () => { qc.invalidateQueries({queryKey:["sindicatos"]}); toast({title:"Sindicato atualizado!"}); }});
  const deleteMut = useMutation({ mutationFn: async (id: string) => { await supabase.from("sindicatos").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({queryKey:["sindicatos"]}); toast({title:"Sindicato excluído!"}); }});
  return { sindicatos, isLoading, create: useCallback((d: any) => createMut.mutateAsync(d), [createMut]), update: useCallback((id: string, d: any) => updateMut.mutateAsync({id, data: d}), [updateMut]), remove: useCallback((id: string) => deleteMut.mutateAsync(id), [deleteMut]) };
}
export default useSindicato;
