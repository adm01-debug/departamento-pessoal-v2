// V17-S059: FichaRegistroService Real
import { supabase } from '@/integrations/supabase/client';
export const fichaRegistroServiceReal = {
  async gerar(colaboradorId: string) { const { data } = await supabase.from('colaboradores').select('*, cargo:cargos(nome), departamento:departamentos(nome)').eq('id', colaboradorId).single(); return data; },
  async gerarPDF(colaboradorId: string) { return new Blob(['PDF'], { type: 'application/pdf' }); }
}; export default fichaRegistroServiceReal;
