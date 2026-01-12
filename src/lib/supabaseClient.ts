// V17.2-LIB002: Supabase Client Helper
import { supabase } from '@/integrations/supabase/client';
export { supabase };
export function handleSupabaseError(error: any): string { if (error?.message) return error.message; if (error?.code === 'PGRST116') return 'Registro não encontrado'; if (error?.code === '23505') return 'Registro duplicado'; if (error?.code === '23503') return 'Referência inválida'; return 'Erro desconhecido'; }
export async function checkConnection(): Promise<boolean> { try { await supabase.from('empresas').select('id').limit(1); return true; } catch { return false; } }
