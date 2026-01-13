// V15-491
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

export function handleSupabaseError(error: any): string {
  if (error?.message) return error.message;
  if (error?.code === 'PGRST116') return 'Registro não encontrado';
  if (error?.code === '23505') return 'Registro duplicado';
  if (error?.code === '23503') return 'Referência inválida';
  if (error?.code === '42501') return 'Permissão negada';
  if (error?.code === '22P02') return 'Formato de dados inválido';
  return 'Erro desconhecido';
}
