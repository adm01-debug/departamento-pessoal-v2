import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };


export const avaliacaoService = {
  // Ciclos
  async listarCiclos(empresaId?: string) {
    let q = supabase.from('ciclos_avaliacao').select('*').order('data_inicio', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarCiclo(d: any) {
    const { data, error } = await supabase.from('ciclos_avaliacao').insert(d).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'ciclos_avaliacao', registro_id: data.id, acao: 'INSERT', dados_novos: data });
    }
    return ensure(data, 'ciclo');
  },
  async atualizarCiclo(id: string, d: any) {
    const { data: anterior } = await supabase.from('ciclos_avaliacao').select('*').eq('id', id).single();
    const { data, error } = await supabase.from('ciclos_avaliacao').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'ciclos_avaliacao', registro_id: id, acao: 'UPDATE', dados_anteriores: anterior, dados_novos: data });
    }
    return ensure(data, 'ciclo');
  },
  async excluirCiclo(id: string) {
    const { data: anterior } = await supabase.from('ciclos_avaliacao').select('*').eq('id', id).single();
    const { error } = await supabase.from('ciclos_avaliacao').delete().eq('id', id);
    if (error) throw error;
    await auditLogger.log({ tabela: 'ciclos_avaliacao', registro_id: id, acao: 'DELETE', dados_anteriores: anterior });
  },


  // Metas/OKRs
  async listarMetas(empresaId?: string) {
    let q = supabase.from('metas_okrs').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarMeta(d: any) {
    const { data, error } = await supabase.from('metas_okrs').insert(d).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'metas_okrs', registro_id: data.id, acao: 'INSERT', dados_novos: data });
    }
    return ensure(data, 'meta');
  },
  async atualizarMeta(id: string, d: any) {
    const { data: anterior } = await supabase.from('metas_okrs').select('*').eq('id', id).single();
    const { data, error } = await supabase.from('metas_okrs').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'metas_okrs', registro_id: id, acao: 'UPDATE', dados_anteriores: anterior, dados_novos: data });
    }
    return ensure(data, 'meta');
  },
  async excluirMeta(id: string) {
    const { data: anterior } = await supabase.from('metas_okrs').select('*').eq('id', id).single();
    const { error } = await supabase.from('metas_okrs').delete().eq('id', id);
    if (error) throw error;
    await auditLogger.log({ tabela: 'metas_okrs', registro_id: id, acao: 'DELETE', dados_anteriores: anterior });
  },


  // Feedbacks 360
  async listarFeedbacks(empresaId?: string) {
    let q = supabase.from('feedbacks_360').select('*, avaliado:colaboradores!feedbacks_360_avaliado_id_fkey(nome_completo), avaliador:colaboradores!feedbacks_360_avaliador_id_fkey(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarFeedback(d: any) {
    const { data, error } = await supabase.from('feedbacks_360').insert(d).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'feedbacks_360', registro_id: data.id, acao: 'INSERT', dados_novos: data });
    }
    return ensure(data, 'feedback');
  },
  async excluirFeedback(id: string) {
    const { data: anterior } = await supabase.from('feedbacks_360').select('*').eq('id', id).single();
    const { error } = await supabase.from('feedbacks_360').delete().eq('id', id);
    if (error) throw error;
    await auditLogger.log({ tabela: 'feedbacks_360', registro_id: id, acao: 'DELETE', dados_anteriores: anterior });
  },


  // PDIs
  async listarPDIs(empresaId?: string) {
    let q = supabase.from('pdis').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarPDI(d: any) {
    const { data, error } = await supabase.from('pdis').insert(d).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'pdis', registro_id: data.id, acao: 'INSERT', dados_novos: data });
    }
    return ensure(data, 'PDI');
  },
  async atualizarPDI(id: string, d: any) {
    const { data: anterior } = await supabase.from('pdis').select('*').eq('id', id).single();
    const { data, error } = await supabase.from('pdis').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (data) {
      await auditLogger.log({ tabela: 'pdis', registro_id: id, acao: 'UPDATE', dados_anteriores: anterior, dados_novos: data });
    }
    return ensure(data, 'PDI');
  },
  async excluirPDI(id: string) {
    const { data: anterior } = await supabase.from('pdis').select('*').eq('id', id).single();
    const { error } = await supabase.from('pdis').delete().eq('id', id);
    if (error) throw error;
    await auditLogger.log({ tabela: 'pdis', registro_id: id, acao: 'DELETE', dados_anteriores: anterior });
  },


  // Competências
  async listarCompetencias(empresaId?: string) {
    let q = supabase.from('competencias_matriz').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarCompetencia(d: any) {
    const { data, error } = await supabase.from('competencias_matriz').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'competência');
  },
  async excluirCompetencia(id: string) {
    const { error } = await supabase.from('competencias_matriz').delete().eq('id', id);
    if (error) throw error;
  },
};
