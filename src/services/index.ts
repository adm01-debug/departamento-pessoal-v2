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
export { pontoService } from './pontoService';

export { provisaoService } from './provisaoService';
// ... keep existing code

export const fgtsService = { calcular: (salario: number) => salario * 0.08 };

export const documentoService = {
  async listar(colaboradorId?: string, empresaId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from('documentos').select('*').order('created_at', { ascending: false }).limit(500);
    if (empresaId) query = query.eq('empresa_id', empresaId);
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
