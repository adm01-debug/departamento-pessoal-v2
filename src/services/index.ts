// V24: Services Index - Clean & Active
import { supabase } from '@/integrations/supabase/client';

// Auth service
export { authService } from './authService';

// Real services
export const beneficioService = {
  async list(empresaId?: string) {
    let query = supabase.from('beneficios').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (empresaId?: string) => beneficioService.list(empresaId),
  async criar(d: any) { const { data, error } = await supabase.from('beneficios').insert(d).select().single(); if (error) throw error; return data; },
  async atualizar(id: string, d: any) { const { data, error } = await supabase.from('beneficios').update(d).eq('id', id).select().single(); if (error) throw error; return data; },
  async excluir(id: string) { const { error } = await supabase.from('beneficios').delete().eq('id', id); if (error) throw error; },
};

export const colaboradorService = {
  async list(empresaId?: string) {
    let query = supabase.from('colaboradores').select('*').order('nome_completo');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (empresaId?: string) => colaboradorService.list(empresaId),
  async buscarPorId(id: string) { const { data, error } = await supabase.from('colaboradores').select('*').eq('id', id).maybeSingle(); if (error) throw error; return data; },
  async getById(id: string) { return colaboradorService.buscarPorId(id); },
  async criar(d: any) { const { data, error } = await supabase.from('colaboradores').insert(d).select().single(); if (error) throw error; return data; },
  async create(d: any) { return colaboradorService.criar(d); },
  async atualizar(id: string, d: any) { const { data, error } = await supabase.from('colaboradores').update(d).eq('id', id).select().single(); if (error) throw error; return data; },
  async update(id: string, d: any) { return colaboradorService.atualizar(id, d); },
  async excluir(id: string) { const { error } = await supabase.from('colaboradores').delete().eq('id', id); if (error) throw error; },
};

export const empresaService = {
  async list() { const { data, error } = await supabase.from('empresas').select('*').order('razao_social'); if (error) throw error; return data || []; },
  listar: async () => empresaService.list(),
  async buscarPorId(id: string) { const { data, error } = await supabase.from('empresas').select('*').eq('id', id).maybeSingle(); if (error) throw error; return data; },
  async criar(d: any) { const { data, error } = await supabase.from('empresas').insert(d).select().single(); if (error) throw error; return data; },
  async atualizar(id: string, d: any) { const { data, error } = await supabase.from('empresas').update(d).eq('id', id).select().single(); if (error) throw error; return data; },
  async excluir(id: string) { const { error } = await supabase.from('empresas').delete().eq('id', id); if (error) throw error; },
};

export const feriasService = {
  async listSolicitacoes(empresaId?: string) {
    let query = supabase.from('ferias').select('*, colaborador:colaboradores(nome_completo)').order('data_inicio', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (empresaId?: string) => feriasService.listSolicitacoes(empresaId),
  async aprovar(id: string) { const { error } = await supabase.from('ferias').update({ status: 'aprovada' }).eq('id', id); if (error) throw error; },
  async rejeitar(id: string) { const { error } = await supabase.from('ferias').update({ status: 'rejeitada' }).eq('id', id); if (error) throw error; },
};

export const folhaService = {
  async list(competencia?: string) {
    let query = supabase.from('folhas_pagamento').select('*').order('competencia', { ascending: false });
    if (competencia) query = query.eq('competencia', competencia);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (competencia?: string) => folhaService.list(competencia),
  async buscarPorId(id: string) { const { data, error } = await supabase.from('folhas_pagamento').select('*').eq('id', id).maybeSingle(); if (error) throw error; return data; },
};

export const pontoService = {
  async registrar(tipo: string, colaboradorId?: string) {
    const now = new Date();
    const data = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0].substring(0, 5);
    const campo = tipo === 'entrada' ? 'entrada_1' : tipo === 'intervalo_saida' ? 'saida_intervalo' : tipo === 'intervalo_retorno' ? 'retorno_intervalo' : 'saida_1';
    
    const { data: existing } = await supabase.from('registros_ponto').select('id').eq('data', data).eq('colaborador_id', colaboradorId || '').maybeSingle();
    
    if (existing) {
      const { data: result, error } = await supabase.from('registros_ponto').update({ [campo]: hora }).eq('id', existing.id).select().single();
      if (error) throw error;
      return result;
    } else {
      const { data: result, error } = await supabase.from('registros_ponto').insert({ data, [campo]: hora, colaborador_id: colaboradorId }).select().single();
      if (error) throw error;
      return result;
    }
  },
};

export const fgtsService = { calcular: (salario: number) => salario * 0.08 };

export const documentoService = {
  async listar(colaboradorId?: string) {
    let query = supabase.from('documentos').select('*').order('created_at', { ascending: false });
    if (colaboradorId) query = query.eq('colaborador_id', colaboradorId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) { const { data, error } = await supabase.from('documentos').insert(d).select().single(); if (error) throw error; return data; },
  async excluir(id: string) { const { error } = await supabase.from('documentos').delete().eq('id', id); if (error) throw error; },
};

// authService is exported from ./authService above

export const admissaoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('admissoes').select('*').order('data_prevista', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async getAll(empresaId?: string) { return admissaoService.listar(empresaId); },
  async getById(id: string) { const { data, error } = await supabase.from('admissoes').select('*').eq('id', id).maybeSingle(); if (error) throw error; return data; },
  async buscarPorId(id: string) { return admissaoService.getById(id); },
  async criar(d: any) { const { data, error } = await supabase.from('admissoes').insert(d).select().single(); if (error) throw error; return data; },
  async create(d: any) { return admissaoService.criar(d); },
  async atualizar(id: string, d: any) { const { data, error } = await supabase.from('admissoes').update(d).eq('id', id).select().single(); if (error) throw error; return data; },
  async update(id: string, d: any) { return admissaoService.atualizar(id, d); },
  async concluir(id: string) { return admissaoService.atualizar(id, { etapa: 'concluida' }); },
  async cancelar(id: string) { return admissaoService.atualizar(id, { etapa: 'cancelada' }); },
};
