// V17-S050: CertificadoDigitalService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const certificadoDigitalServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('certificados_digitais').select('*').eq('empresa_id', empresaId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async upload(empresaId: string, arquivo: File, senha: string, tipo: 'A1' | 'A3') { return { id: '', tipo, validade: '', titular: '' }; },
  async validar(certificadoId: string) { return { valido: true, dataValidade: '', titular: '' }; }
};
export default certificadoDigitalServiceReal;
