import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const lgpdService = {
  async listarConsentimentos(empresaId?: string) {
    let q = supabase.from('lgpd_consentimentos').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarConsentimento(d: any) {
    const { data, error } = await supabase.from('lgpd_consentimentos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'consentimento');
  },
  async revogarConsentimento(id: string) {
    const { data, error } = await supabase.from('lgpd_consentimentos').update({ aceito: false, revogado_em: new Date().toISOString() }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'consentimento');
  },
  async listarSolicitacoes(empresaId?: string) {
    let q = supabase.from('lgpd_solicitacoes').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarSolicitacao(d: any) {
    const { data, error } = await supabase.from('lgpd_solicitacoes').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'solicitação LGPD');
  },
  async atualizarSolicitacao(id: string, d: any) {
    const { data, error } = await supabase.from('lgpd_solicitacoes').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'solicitação LGPD');
  },
};
