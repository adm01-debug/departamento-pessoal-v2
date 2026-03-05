import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
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
