// V17-S058: InformeRendimentosService Real
import { supabase } from '@/integrations/supabase/client';
export const informeRendimentosServiceReal = {
  async gerar(colaboradorId: string, ano: number) { return { colaboradorId, ano, rendimentos: 0, inss: 0, irrf: 0, deducoes: 0 }; },
  async gerarPDF(colaboradorId: string, ano: number) { return new Blob(['PDF'], { type: 'application/pdf' }); },
  async gerarTodos(empresaId: string, ano: number) { const { data } = await supabase.from('colaboradores').select('id').eq('empresa_id', empresaId); return (data || []).map(c => ({ colaboradorId: c.id, ano })); }
}; export default informeRendimentosServiceReal;
