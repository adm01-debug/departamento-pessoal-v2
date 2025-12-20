import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ColaboradorDB, Dependente, HistoricoCargo, DocumentoColaborador } from '@/types/colaborador';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useEmpresas } from './useEmpresas';

export function useColaboradores() {
  const [colaboradores, setColaboradores] = useState<ColaboradorDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { empresaAtualId } = useEmpresas();

  const fetchColaboradores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('colaboradores')
        .select('*')
        .order('nome_completo', { ascending: true });

      // Filtrar por empresa se houver uma selecionada
      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      setColaboradores(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar colaboradores:', err);
      setError(err.message);
      toast({
        title: 'Erro ao carregar colaboradores',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [empresaAtualId]);

  useEffect(() => {
    if (user) {
      fetchColaboradores();
    }
  }, [user, fetchColaboradores]);

  const createColaborador = async (data: Omit<ColaboradorDB, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newColaborador, error } = await supabase
        .from('colaboradores')
        .insert([{ ...data, created_by: user?.id, empresa_id: empresaAtualId }])
        .select()
        .single();

      if (error) throw error;

      setColaboradores(prev => [...prev, newColaborador]);
      toast({
        title: 'Colaborador cadastrado!',
        description: `${data.nome_completo} foi adicionado com sucesso.`,
      });
      
      return newColaborador;
    } catch (err: any) {
      console.error('Erro ao criar colaborador:', err);
      toast({
        title: 'Erro ao cadastrar',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateColaborador = async (id: string, data: Partial<ColaboradorDB>) => {
    try {
      const { data: updated, error } = await supabase
        .from('colaboradores')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setColaboradores(prev => prev.map(c => c.id === id ? updated : c));
      toast({
        title: 'Colaborador atualizado!',
        description: 'Os dados foram salvos com sucesso.',
      });
      
      return updated;
    } catch (err: any) {
      console.error('Erro ao atualizar colaborador:', err);
      toast({
        title: 'Erro ao atualizar',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteColaborador = async (id: string) => {
    try {
      const colaborador = colaboradores.find(c => c.id === id);
      
      const { error } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setColaboradores(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Colaborador excluído',
        description: colaborador ? `${colaborador.nome_completo} foi removido.` : 'Registro removido com sucesso.',
      });
    } catch (err: any) {
      console.error('Erro ao excluir colaborador:', err);
      toast({
        title: 'Erro ao excluir',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const getColaboradorById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar colaborador:', err);
      throw err;
    }
  };

  return {
    colaboradores,
    loading,
    error,
    fetchColaboradores,
    createColaborador,
    updateColaborador,
    deleteColaborador,
    getColaboradorById,
  };
}

export function useDependentes(colaboradorId: string) {
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDependentes = useCallback(async () => {
    if (!colaboradorId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dependentes')
        .select('*')
        .eq('colaborador_id', colaboradorId)
        .order('nome', { ascending: true });

      if (error) throw error;
      setDependentes(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar dependentes:', err);
    } finally {
      setLoading(false);
    }
  }, [colaboradorId]);

  useEffect(() => {
    fetchDependentes();
  }, [fetchDependentes]);

  const addDependente = async (data: Omit<Dependente, 'id' | 'created_at'>) => {
    try {
      const { data: newDep, error } = await supabase
        .from('dependentes')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setDependentes(prev => [...prev, newDep]);
      toast({ title: 'Dependente adicionado!' });
      return newDep;
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const removeDependente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dependentes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDependentes(prev => prev.filter(d => d.id !== id));
      toast({ title: 'Dependente removido!' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  return { dependentes, loading, fetchDependentes, addDependente, removeDependente };
}

export function useHistoricoCargo(colaboradorId: string) {
  const [historico, setHistorico] = useState<HistoricoCargo[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchHistorico = useCallback(async () => {
    if (!colaboradorId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_cargo')
        .select('*')
        .eq('colaborador_id', colaboradorId)
        .order('data_alteracao', { ascending: false });

      if (error) throw error;
      setHistorico(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [colaboradorId]);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  const addHistorico = async (data: Omit<HistoricoCargo, 'id' | 'created_at'>) => {
    try {
      const { data: newHist, error } = await supabase
        .from('historico_cargo')
        .insert([{ ...data, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setHistorico(prev => [newHist, ...prev]);
      toast({ title: 'Histórico registrado!' });
      return newHist;
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  return { historico, loading, fetchHistorico, addHistorico };
}
