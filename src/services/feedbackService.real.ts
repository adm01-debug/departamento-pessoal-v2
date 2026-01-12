// V17-S079: FeedbackService Real
import { supabase } from '@/integrations/supabase/client';
export const feedbackServiceReal = {
  async enviar(colaboradorId: string, tipo: string, mensagem: string, anonimo: boolean = false) { const { data } = await supabase.from('feedbacks').insert({ colaborador_id: anonimo ? null : colaboradorId, tipo, mensagem, anonimo }).select().single(); return data; },
  async getAll(empresaId: string) { const { data } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false }); return data || []; }
}; export default feedbackServiceReal;
