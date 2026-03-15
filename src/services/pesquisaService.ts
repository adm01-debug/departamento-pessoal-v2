import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const pesquisaService = {
  async listar(empresaId?: string) {
    let q = supabase.from('pesquisas').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('pesquisas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'pesquisa');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('pesquisas').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'pesquisa');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('pesquisas').delete().eq('id', id);
    if (error) throw error;
  },
  async listarPerguntas(pesquisaId: string) {
    const { data, error } = await supabase.from('pesquisas_perguntas').select('*').eq('pesquisa_id', pesquisaId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  async criarPergunta(d: any) {
    const { data, error } = await supabase.from('pesquisas_perguntas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'pergunta');
  },
  async excluirPergunta(id: string) {
    const { error } = await supabase.from('pesquisas_perguntas').delete().eq('id', id);
    if (error) throw error;
  },
  async enviarResposta(d: any) {
    const { data, error } = await supabase.from('pesquisas_respostas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'resposta');
  },
  async listarRespostas(pesquisaId: string) {
    const { data, error } = await supabase.from('pesquisas_respostas').select('*').eq('pesquisa_id', pesquisaId);
    if (error) throw error;
    return data || [];
  },
};
