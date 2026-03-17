// Services Index - Complete
import { supabase } from '@/integrations/supabase/client';

export { authService } from './authService';
export { afastamentoService } from './afastamentoService';
export { cargoService } from './cargoService';
export { departamentoService } from './departamentoService';
export { contratoService } from './contratoService';
export { bancoHorasService } from './bancoHorasService';
export { desligamentoService } from './desligamentoService';
export { auditoriaService, notificacaoService } from './auditoriaService';
export { localTrabalhoService } from './localTrabalhoService';
export { historicoContratoService } from './historicoContratoService';
export { horaExtraService } from './horaExtraService';
export { intervaloService } from './intervaloService';
export { webhookService } from './webhookService';
export { pontoAbertoService } from './pontoAbertoService';
export { pesquisaService } from './pesquisaService';
export { workflowService } from './workflowService';
export { turnoService } from './turnoService';
export { comunicacaoService } from './comunicacaoService';
export { despesaService } from './despesaService';
export { controleAcessoService } from './controleAcessoService';
export { lgpdService } from './lgpdService';
export { catalogoCursoService } from './catalogoCursoService';
export { avaliacaoService } from './avaliacaoService';
export { batidasPontoService } from './batidasPontoService';
export { faltasService } from './faltasService';
export { medidasDisciplinaresService } from './medidasDisciplinaresService';
export { episService, episEntregasService } from './episService';
export { jornadaHorariosService } from './jornadaHorariosService';
export { bancoHorasConfigService } from './bancoHorasConfigService';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado pela operação.`);
  return data;
};

export const beneficioService = {
  async list(empresaId?: string) {
    let query = supabase.from('beneficios').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (empresaId?: string) => beneficioService.list(empresaId),
  async criar(d: any) {
    const { data, error } = await supabase.from('beneficios').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'benefício');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('beneficios').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'benefício');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('beneficios').delete().eq('id', id);
    if (error) throw error;
  },
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
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('colaboradores').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async getById(id: string) { return colaboradorService.buscarPorId(id); },
  async criar(d: any) {
    const { data, error } = await supabase.from('colaboradores').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'colaborador');
  },
  async create(d: any) { return colaboradorService.criar(d); },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('colaboradores').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'colaborador');
  },
  async update(id: string, d: any) { return colaboradorService.atualizar(id, d); },
  async excluir(id: string) {
    const { error } = await supabase.from('colaboradores').delete().eq('id', id);
    if (error) throw error;
  },
};

export const empresaService = {
  async list() {
    const { data, error } = await supabase.from('empresas').select('*').order('razao_social');
    if (error) throw error;
    return data || [];
  },
  listar: async () => empresaService.list(),
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('empresas').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('empresas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'empresa');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('empresas').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'empresa');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('empresas').delete().eq('id', id);
    if (error) throw error;
  },
};

export const feriasService = {
  async listSolicitacoes(empresaId?: string) {
    let query = supabase
      .from('ferias')
      .select('*, colaborador:colaboradores(nome_completo)')
      .order('data_inicio', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (empresaId?: string) => feriasService.listSolicitacoes(empresaId),
  async aprovar(id: string) {
    const { error } = await supabase.from('ferias').update({ status: 'aprovada' } as any).eq('id', id);
    if (error) throw error;
  },
  async aprovarGestor(id: string, userId?: string) {
    const { error } = await supabase.from('ferias').update({
      aprovado_gestor: true,
      aprovado_gestor_em: new Date().toISOString(),
      aprovado_gestor_por: userId || null,
    } as any).eq('id', id);
    if (error) throw error;
  },
  async aprovarRH(id: string, userId?: string) {
    const { error } = await supabase.from('ferias').update({
      aprovado_rh: true,
      aprovado_rh_em: new Date().toISOString(),
      aprovado_rh_por: userId || null,
      status: 'aprovada',
    } as any).eq('id', id);
    if (error) throw error;
  },
  async enviarContabilidade(id: string, userId?: string) {
    const { error } = await supabase.from('ferias').update({
      enviado_contabilidade: true,
      enviado_contabilidade_em: new Date().toISOString(),
      enviado_contabilidade_por: userId || null,
    } as any).eq('id', id);
    if (error) throw error;
  },
  async rejeitar(id: string) {
    const { error } = await supabase.from('ferias').update({ status: 'rejeitada' } as any).eq('id', id);
    if (error) throw error;
  },
  async cancelar(id: string, userId?: string) {
    const { error } = await supabase.from('ferias').update({
      cancelado: true,
      cancelado_em: new Date().toISOString(),
      cancelado_por: userId || null,
      status: 'cancelada',
    } as any).eq('id', id);
    if (error) throw error;
  },
};

export const folhaService = {
  async list(competencia?: string, empresaId?: string) {
    let query = supabase.from('folhas_pagamento').select('*').order('competencia', { ascending: false }).limit(500);
    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (competencia) query = query.eq('competencia', competencia);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  listar: async (competencia?: string, empresaId?: string) => folhaService.list(competencia, empresaId),
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('folhas_pagamento').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
};

export const pontoService = {
  async registrar(tipo: string, colaboradorId?: string) {
    if (!colaboradorId) throw new Error('Colaborador é obrigatório para registrar ponto.');
    const now = new Date();
    const data = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0].substring(0, 5);

    // Get colaborador by user id (auth.users.id)
    const { data: colab } = await supabase.from('colaboradores').select('id, empresa_id').eq('email', (await supabase.auth.getUser()).data.user?.email || '').maybeSingle();
    if (!colab) {
      // Fallback: register directly in registros_ponto
      const campo = tipo === 'entrada' ? 'entrada_1'
        : tipo === 'intervalo_saida' || tipo === 'saida_almoco' ? 'saida_intervalo'
        : tipo === 'intervalo_retorno' || tipo === 'retorno_almoco' ? 'retorno_intervalo'
        : 'saida_1';
      const { data: existing } = await supabase.from('registros_ponto').select('id').eq('data', data).eq('colaborador_id', colaboradorId).maybeSingle();
      if (existing) {
        const { data: result, error } = await supabase.from('registros_ponto').update({ [campo]: hora }).eq('id', existing.id).select().maybeSingle();
        if (error) throw error;
        return ensureSingleResult(result, 'registro de ponto');
      }
      const { data: result, error } = await supabase.from('registros_ponto').insert({ data, [campo]: hora, colaborador_id: colaboradorId }).select().maybeSingle();
      if (error) throw error;
      return ensureSingleResult(result, 'registro de ponto');
    }

    // Use batidas_ponto (triggers fn_consolidar_batidas automatically)
    const tipoMap: Record<string, string> = { entrada: 'entrada', saida_almoco: 'saida', retorno_almoco: 'entrada', saida: 'saida' };
    // Count existing batidas to determine order
    const { count } = await (supabase as any).from('batidas_ponto').select('*', { count: 'exact', head: true }).eq('colaborador_id', colab.id).eq('data', data);
    const ordem = (count || 0) + 1;

    const { data: batida, error } = await (supabase as any).from('batidas_ponto').insert({
      colaborador_id: colab.id,
      empresa_id: colab.empresa_id,
      data,
      hora,
      ordem,
      tipo: tipoMap[tipo] || 'entrada',
      origem: 'web',
    }).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(batida, 'batida de ponto');
  },

  async buscarRegistroHoje(colaboradorId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await (supabase as any).from('registros_ponto').select('*').eq('colaborador_id', colaboradorId).eq('data', today).maybeSingle();
    if (error) throw error;
    return data;
  },

  async buscarRegistrosSemana(colaboradorId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data, error } = await (supabase as any).from('registros_ponto').select('*').eq('colaborador_id', colaboradorId).gte('data', weekAgo.toISOString().split('T')[0]).order('data', { ascending: false });
    if (error) throw error;
    return data || [];
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
  async criar(d: any) {
    const { data, error } = await supabase.from('documentos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'documento');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('documentos').delete().eq('id', id);
    if (error) throw error;
  },
};

export const admissaoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('admissoes').select('*').order('data_prevista', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async getAll(empresaId?: string) { return admissaoService.listar(empresaId); },
  async getById(id: string) {
    const { data, error } = await supabase.from('admissoes').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async buscarPorId(id: string) { return admissaoService.getById(id); },
  async criar(d: any) {
    const { data, error } = await supabase.from('admissoes').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'admissão');
  },
  async create(d: any) { return admissaoService.criar(d); },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('admissoes').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'admissão');
  },
  async update(id: string, d: any) { return admissaoService.atualizar(id, d); },
  async concluir(id: string) { return admissaoService.atualizar(id, { etapa: 'concluida' }); },
  async cancelar(id: string) { return admissaoService.atualizar(id, { etapa: 'cancelada' }); },
};
