import { supabase } from '@/integrations/supabase/client';
import { validateUploadFile } from '@/utils/uploadValidation';

export type DespesaStatus = 'rascunho' | 'pendente' | 'aprovado' | 'rejeitado' | 'integrado_folha' | 'pago' | 'cancelado';
export type DespesaTipo = 'reembolso' | 'adiantamento' | 'despesa_viagem' | 'material' | 'alimentacao' | 'transporte' | 'outro';

export const despesaService = {
  async listar(empresaId: string, opts: { from?: number; to?: number; status?: DespesaStatus } = {}): Promise<any[]> {
    if (!empresaId) throw new Error('empresaId é obrigatório para listar despesas (multi-tenant).');
    const from = opts.from ?? 0;
    const to = opts.to ?? 499;
    let q = supabase
      .from('despesas')
      .select('*, colaborador:colaboradores(nome_completo)')
      .eq('empresa_id', empresaId)
      .order('data_despesa', { ascending: false })
      .range(from, to);
    if (opts.status) q = q.eq('status', opts.status);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async criar(d: Record<string, any>): Promise<any> {
    const payload: any = { ...d, status: d.status || 'pendente', tipo: d.tipo || 'reembolso' };
    const { data, error } = await supabase.from('despesas').insert(payload).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de despesa foi retornado.');
    return data;
  },


  async aprovar(id: string, observacoes?: string): Promise<any> {
    const { data, error } = await supabase.rpc('aprovar_despesa', { _despesa_id: id, _observacoes: observacoes ?? null });
    if (error) throw new Error(error.message || 'Falha ao aprovar despesa');
    return data;
  },

  async rejeitar(id: string, motivo: string): Promise<any> {
    if (!motivo || motivo.trim().length < 3) throw new Error('Informe o motivo da rejeição (mínimo 3 caracteres).');
    const { data, error } = await supabase.rpc('rejeitar_despesa', { _despesa_id: id, _motivo: motivo });
    if (error) throw new Error(error.message || 'Falha ao rejeitar despesa');
    return data;
  },

  async marcarPago(id: string): Promise<any> {
    const { data, error } = await supabase.from('despesas').update({ status: 'pago', updated_at: new Date().toISOString() }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  },

  async integrarFolha(id: string, folhaId: string): Promise<any> {
    const { data, error } = await supabase
      .from('despesas')
      .update({ status: 'integrado_folha', folha_id: folhaId, integrado_folha_em: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'aprovado')
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('despesas').delete().eq('id', id);
    if (error) throw error;
  },

  async uploadComprovante(empresaId: string, despesaId: string, file: File): Promise<string> {
    validateUploadFile(file);
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${empresaId}/${despesaId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('comprovantes-despesas').upload(path, file, { upsert: false });
    if (upErr) throw upErr;
    const { error: updErr } = await supabase.from('despesas').update({ comprovante_url: path, updated_at: new Date().toISOString() }).eq('id', despesaId);
    if (updErr) throw updErr;
    return path;
  },

  async getComprovanteUrl(path: string): Promise<string | null> {
    const { data, error } = await supabase.storage.from('comprovantes-despesas').createSignedUrl(path, 3600);
    if (error) return null;
    return data?.signedUrl ?? null;
  },

  async listarLog(despesaId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('despesas_aprovacoes_log')
      .select('*')
      .eq('despesa_id', despesaId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
