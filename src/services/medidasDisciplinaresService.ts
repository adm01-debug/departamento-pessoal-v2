import { supabase } from '@/integrations/supabase/client';
export const medidasDisciplinaresService = {
  async listar(empresaId: string): Promise<any[]> {
    if (!empresaId) throw new Error('empresa_id obrigatório para isolamento de tenant');

    let q = (supabase as any).from('medidas_disciplinares').select('*, colaborador:colaboradores(nome_completo)').order('data_ocorrencia', { ascending: false });
    q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];

  },

  async buscarPorColaborador(colaboradorId: string, empresaId: string): Promise<any[]> {
    if (!empresaId) throw new Error('empresa_id obrigatório para isolamento de tenant');
    const { data, error } = await (supabase as any)
      .from('medidas_disciplinares')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .eq('empresa_id', empresaId)
      .order('data_ocorrencia', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async criar(d: any): Promise<any> {
    const { data, error } = await (supabase as any).from('medidas_disciplinares').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de medida disciplinar foi retornado.');
    return data;
  },

  async atualizar(id: string, d: any, empresaId: string): Promise<any> {
    if (!empresaId) throw new Error('empresa_id obrigatório para isolamento de tenant');
    const { data, error } = await (supabase as any)
      .from('medidas_disciplinares')
      .update(d)
      .eq('id', id)
      .eq('empresa_id', empresaId)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de medida disciplinar foi retornado.');
    return data;
  },

  async excluir(id: string, empresaId: string): Promise<void> {
    if (!empresaId) throw new Error('empresa_id obrigatório para isolamento de tenant');
    const { error } = await (supabase as any)
      .from('medidas_disciplinares')
      .delete()
      .eq('id', id)
      .eq('empresa_id', empresaId);
    if (error) throw error;
  },

  async sugerirProxima(colaboradorId: string, empresaId: string): Promise<{
    tipo_sugerido: string;
    justificativa: string;
    historico_12m: Record<string, number>;
  } | null> {
    if (!colaboradorId || !empresaId) return null;
    const { data, error } = await (supabase as any).rpc('sugerir_proxima_medida', {
      p_colaborador_id: colaboradorId,
      p_empresa_id: empresaId,
    });
    if (error) throw error;
    return Array.isArray(data) && data[0] ? data[0] : null;
  },

  async gerarPDF(medidaId: string): Promise<{ path: string; hash: string; signed_url: string }> {
    const { data, error } = await supabase.functions.invoke('gerar-medida-disciplinar-pdf', {
      body: { medida_id: medidaId },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error ?? 'Falha ao gerar documento');
    return { path: data.path, hash: data.hash, signed_url: data.signed_url };
  },

  async obterSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from('medidas-disciplinares')
      .createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  },

  // ============ Workflow CLT ============
  async enviarAprovacao(medidaId: string) {
    const { data, error } = await (supabase as any).rpc('medida_enviar_aprovacao', { _medida_id: medidaId });
    if (error) throw error;
    return data;
  },
  async aprovar(medidaId: string, observacao?: string) {
    const { data, error } = await (supabase as any).rpc('medida_aprovar', {
      _medida_id: medidaId,
      _observacao: observacao ?? null,
    });
    if (error) throw error;
    return data;
  },
  async rejeitar(medidaId: string, motivo: string) {
    const { data, error } = await (supabase as any).rpc('medida_rejeitar', {
      _medida_id: medidaId,
      _motivo: motivo,
    });
    if (error) throw error;
    return data;
  },
  async arquivar(medidaId: string, observacao?: string) {
    const { data, error } = await (supabase as any).rpc('medida_arquivar', {
      _medida_id: medidaId,
      _observacao: observacao ?? null,
    });
    if (error) throw error;
    return data;
  },
  async listarHistorico(medidaId: string) {
    const { data, error } = await (supabase as any)
      .from('medidas_disciplinares_workflow_log')
      .select('*')
      .eq('medida_id', medidaId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};
