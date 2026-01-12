// V17-S105: TemplateService Real
import { supabase } from '@/integrations/supabase/client';
export const templateServiceReal = {
  async getAll(empresaId: string) { const { data } = await supabase.from('templates').select('*').or(`empresa_id.eq.${empresaId},empresa_id.is.null`); return data || []; },
  async getByTipo(tipo: string) { const { data } = await supabase.from('templates').select('*').eq('tipo', tipo); return data || []; },
  async renderizar(templateId: string, dados: Record<string, any>) { const { data: t } = await supabase.from('templates').select('conteudo').eq('id', templateId).single(); if (!t) return ''; let conteudo = t.conteudo; Object.entries(dados).forEach(([k, v]) => { conteudo = conteudo.replace(new RegExp(`{{\s*${k}\s*}}`, 'g'), String(v)); }); return conteudo; }
}; export default templateServiceReal;
