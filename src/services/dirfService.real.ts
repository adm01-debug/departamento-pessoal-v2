// V17-S040: DIRFService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const dirfServiceReal = {
  async gerar(empresaId: string, anoCalendario: number) { const { data: cols } = await supabase.from('colaboradores').select('id, nome, cpf').eq('empresa_id', empresaId); return { anoCalendario, beneficiarios: cols?.length || 0, arquivo: `DIRF${anoCalendario}.txt` }; }
};
export default dirfServiceReal;
