// V17-S089: OrganigramaService Real
import { supabase } from '@/integrations/supabase/client';
export const organigramaServiceReal = {
  async get(empresaId: string) { const { data: deps } = await supabase.from('departamentos').select('*').eq('empresa_id', empresaId); const { data: cols } = await supabase.from('colaboradores').select('id, nome, cargo:cargos(nome), departamento_id, gestor_id').eq('empresa_id', empresaId).eq('status', 'ativo'); return { departamentos: deps || [], colaboradores: cols || [] }; },
  async definirGestor(colaboradorId: string, gestorId: string) { await supabase.from('colaboradores').update({ gestor_id: gestorId }).eq('id', colaboradorId); }
}; export default organigramaServiceReal;
