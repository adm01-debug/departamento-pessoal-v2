// @ts-nocheck
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface useOrientationData { id?: string; [key: string]: any; }
interface useOrientationState { data: useOrientationData[]; loading: boolean; error: string | null; }

export function useOrientation() {
  const [state, setState] = useState<useOrientationState>({ data: [], loading: false, error: null });
  const { toast } = useToast();

  const fetchAll = useCallback(async (filters?: Record<string, any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      let query = supabase.from("items").select("*");
      if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) query = query.eq(k, v); });
      const { data, error } = await query;
      if (error) throw error;
      setState(prev => ({ ...prev, data: data || [], loading: false }));
    } catch (e: any) {
      setState(prev => ({ ...prev, error: e.message, loading: false }));
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  }, [toast]);

  const create = useCallback(async (data: Omit<useOrientationData, "id">) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data: result, error } = await supabase.from("items").insert(data).select().single();
      if (error) throw error;
      setState(prev => ({ ...prev, data: [...prev.data, result], loading: false }));
      toast({ title: "Sucesso", description: "Criado com sucesso" });
      return result;
    } catch (e: any) {
      setState(prev => ({ ...prev, error: e.message, loading: false }));
      toast({ title: "Erro", description: e.message, variant: "destructive" });
      throw e;
    }
  }, [toast]);

  const update = useCallback(async (id: string, data: Partial<useOrientationData>) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data: result, error } = await supabase.from("items").update(data).eq("id", id).select().single();
      if (error) throw error;
      setState(prev => ({ ...prev, data: prev.data.map(i => i.id === id ? result : i), loading: false }));
      toast({ title: "Sucesso", description: "Atualizado com sucesso" });
      return result;
    } catch (e: any) {
      setState(prev => ({ ...prev, error: e.message, loading: false }));
      toast({ title: "Erro", description: e.message, variant: "destructive" });
      throw e;
    }
  }, [toast]);

  const remove = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
      setState(prev => ({ ...prev, data: prev.data.filter(i => i.id !== id), loading: false }));
      toast({ title: "Sucesso", description: "Removido com sucesso" });
    } catch (e: any) {
      setState(prev => ({ ...prev, error: e.message, loading: false }));
      toast({ title: "Erro", description: e.message, variant: "destructive" });
      throw e;
    }
  }, [toast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { ...state, fetchAll, create, update, remove, refresh: fetchAll };
}

export default useOrientation;
