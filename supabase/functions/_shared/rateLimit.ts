// Helper de rate limit in-process para edge functions sensíveis.
//
// Uso:
//   const rl = await checkRateLimit(admin, { key: `esocial:${userId}`, limit: 30, windowSec: 60 });
//   if (!rl.allowed) return rateLimitResponse(rl);
//
// A tabela `public.rate_limits` já existe (colunas: key TEXT, timestamp BIGINT).
// RLS bloqueia acesso não-service-role — sempre passe um client com service role.
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './contract.ts';

export interface RateLimitOptions {
  key: string;           // Deve incluir namespacing (ex: `esocial:<userId>`)
  limit: number;         // Máx requisições permitidas na janela
  windowSec: number;     // Janela em segundos
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;         // epoch seconds
  limit: number;
  windowSec: number;
}

export async function checkRateLimit(
  admin: SupabaseClient,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - opts.windowSec;

  // Cleanup best-effort — não bloqueia decisão
  admin.from('rate_limits').delete().lt('timestamp', windowStart).then(
    () => {}, (e: unknown) => console.warn('[rateLimit] cleanup falhou:', (e as Error)?.message),
  );

  const { count, error } = await admin
    .from('rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('key', opts.key)
    .gte('timestamp', windowStart);

  if (error) {
    // Fail-open — não bloqueia produção se a tabela estiver indisponível
    console.error('[rateLimit] check falhou (fail-open):', error.message);
    return { allowed: true, remaining: opts.limit, reset: windowStart + opts.windowSec, limit: opts.limit, windowSec: opts.windowSec };
  }

  const current = count ?? 0;
  const allowed = current < opts.limit;

  if (allowed) {
    const { error: insErr } = await admin.from('rate_limits').insert({ key: opts.key, timestamp: now });
    if (insErr) console.warn('[rateLimit] insert falhou:', insErr.message);
  }

  return {
    allowed,
    remaining: Math.max(0, opts.limit - current - (allowed ? 1 : 0)),
    reset: windowStart + opts.windowSec,
    limit: opts.limit,
    windowSec: opts.windowSec,
  };
}

export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Rate limit excedido',
      code: 'RATE_LIMIT_EXCEEDED',
      limit: result.limit,
      window_seconds: result.windowSec,
      reset: result.reset,
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': String(result.windowSec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.reset),
      },
    },
  );
}
