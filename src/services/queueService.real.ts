// V17.2-S107: QueueService Real
import { supabase } from '@/integrations/supabase/client';
export const queueServiceReal = {
  async adicionar(fila: string, dados: any, prioridade: number = 5) { const { data } = await supabase.from('filas').insert({ fila, dados, prioridade, status: 'pendente' }).select().single(); return data; },
  async processar(fila: string) { const { data } = await supabase.from('filas').select('*').eq('fila', fila).eq('status', 'pendente').order('prioridade', { ascending: false }).limit(1).single(); if (data) { await supabase.from('filas').update({ status: 'processando' }).eq('id', data.id); } return data; },
  async concluir(id: string) { await supabase.from('filas').update({ status: 'concluido' }).eq('id', id); }
}; export default queueServiceReal;
