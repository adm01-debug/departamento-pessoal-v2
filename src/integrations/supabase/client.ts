/**
 * @fileoverview Cliente Supabase configurado
 * @module integrations/supabase/client
 * @version V8.1 - Melhorado por análise QA
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ============================================
// CONFIGURAÇÃO
// ============================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de configuração
if (!SUPABASE_URL) {
  console.error('[Supabase] VITE_SUPABASE_URL não configurada');
}

if (!SUPABASE_ANON_KEY) {
  console.error('[Supabase] VITE_SUPABASE_PUBLISHABLE_KEY não configurada');
}

// ============================================
// CLIENTE SUPABASE
// ============================================

/**
 * Cliente Supabase tipado para uso em toda a aplicação
 * 
 * @example
 * import { supabase } from "@/integrations/supabase/client";
 * 
 * const { data, error } = await supabase
 *   .from('colaboradores')
 *   .select('*');
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-application-name': 'departamento-pessoal',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// ============================================
// HELPERS
// ============================================

/**
 * Verifica se há sessão ativa
 */
export async function hasActiveSession(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

/**
 * Retorna o usuário atual
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Retorna o ID do usuário atual
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

/**
 * Wrapper para queries com retry automático
 */
export async function queryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<{ data: T | null; error: any }> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await queryFn();
    
    if (!result.error) {
      return result;
    }
    
    lastError = result.error;
    
    // Não retry para erros de autenticação ou validação
    if (result.error.code?.startsWith('PGRST') || result.error.code === '401') {
      return result;
    }
    
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  
  return { data: null, error: lastError };
}

/**
 * Listener para mudanças de autenticação
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// ============================================
// TIPOS EXPORTADOS
// ============================================

export type { Database } from './types';
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Atalhos para tipos de tabelas comuns
export type ColaboradorRow = Tables['colaboradores']['Row'];
export type ColaboradorInsert = Tables['colaboradores']['Insert'];
export type ColaboradorUpdate = Tables['colaboradores']['Update'];

export type EmpresaRow = Tables['empresas']['Row'];
export type EmpresaInsert = Tables['empresas']['Insert'];
export type EmpresaUpdate = Tables['empresas']['Update'];
