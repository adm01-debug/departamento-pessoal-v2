// @ts-nocheck
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
export function usePensao() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: pensoes = [], isLoading } = useQuery({ queryKey: ["pensoes"], queryFn: async () => { const { data } = await supabase.from("pensoes").select("*").order("beneficiario"); return data || []; } });
  const createMut = useMutation({ mutationFn: async (d: any) => { const { data } = await supabase.from("pensoes").insert(d).select().single(); return data; }, onSuccess: () => { qc.invalidateQueries({queryKey:["pensoes"]}); toast({title:"Pensão cadastrada!"}); }});
  const updateMut = useMutation({ mutationFn: async ({id, data}: {id: string; data: any}) => { const { data: result } = await supabase.from("pensoes").update(data).eq("id", id).select().single(); return result; }, onSuccess: () => { qc.invalidateQueries({queryKey:["pensoes"]}); toast({title:"Pensão atualizada!"}); }});
  const deleteMut = useMutation({ mutationFn: async (id: string) => { await supabase.from("pensoes").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({queryKey:["pensoes"]}); toast({title:"Pensão excluída!"}); }});
  return { pensoes, isLoading, create: useCallback((d: any) => createMut.mutateAsync(d), [createMut]), update: useCallback((id: string, d: any) => updateMut.mutateAsync({id, data: d}), [updateMut]), remove: useCallback((id: string) => deleteMut.mutateAsync(id), [deleteMut]) };
}
export default usePensao;
