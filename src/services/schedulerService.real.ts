// V17.2-S108: SchedulerService Real
import { supabase } from '@/integrations/supabase/client';
export const schedulerServiceReal = {
  async agendar(nome: string, cron: string, callback: string, dados?: any) { const { data } = await supabase.from('agendamentos').insert({ nome, cron, callback, dados, ativo: true }).select().single(); return data; },
  async getAtivos() { const { data } = await supabase.from('agendamentos').select('*').eq('ativo', true); return data || []; },
  async desativar(id: string) { await supabase.from('agendamentos').update({ ativo: false }).eq('id', id); }
}; export default schedulerServiceReal;
