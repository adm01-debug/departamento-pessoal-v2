// Edge function: auth-login — server-side brute-force protection (H20).
//
// Centralises Supabase email/password login so that lockout checks are
// enforced before Supabase Auth is ever invoked — closing the bypass window
// that exists when the React UI calls signInWithPassword() directly.
//
// Flow:
//  1. IP-level rate limit (30 req / 5 min) — in-memory fallback (no RPC required)
//  2. Account lockout check via REST call to /rest/v1/check_login_lock
//  3. Forward email+password to Supabase Auth REST API
//  4. Return token on success / 429 or 401 on failure
//
// IMPORTANT: Does NOT use createClient RPC because Edge Runtime has limited
// Postgres connectivity. All DB access uses REST API (PostgREST) directly.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';
import { corsHeaders, createErrorResponse, parseJsonBody } from '../_shared/contract.ts';
import { checkRateLimit, rateLimitResponse } from '../_shared/rateLimit.ts';
import { captureException } from '../_shared/sentry.ts';

const BodySchema = z.object({
  email: z.string().email().max(254).toLowerCase(),
  password: z.string().min(1).max(128),
});

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const IP_RATE_LIMIT = 30;
const IP_WINDOW_SEC = 5 * 60;

function getClientIP(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
  };
}

async function checkLockout(email: string): Promise<{ locked: boolean; remaining: number }> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/rpc/check_login_lock`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
      body: JSON.stringify({ p_identifier: email, p_identifier_type: 'email' }),
    });
    if (!res.ok) return { locked: false, remaining: 0 };
    const data = await res.json();
    return {
      locked: data?.[0]?.is_locked ?? false,
      remaining: Number(data?.[0]?.remaining_seconds ?? 0),
    };
  } catch {
    return { locked: false, remaining: 0 };
  }
}

async function recordLoginAttempt(email: string, success: boolean, ip: string): Promise<void> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/rpc/record_failed_login`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` },
      body: JSON.stringify({ p_identifier: email, p_identifier_type: 'email' }),
    });
  } catch (e) {
    console.warn('[auth-login] record_failed_login falhou:', (e as Error)?.message);
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== 'POST') {
    return createErrorResponse('Método não permitido', 405, 'METHOD_NOT_ALLOWED', undefined, req);
  }

  const ip = getClientIP(req);

  const ipKey = `login:ip:${ip}`;
  const ipRL = await checkRateLimit(undefined as any, { key: ipKey, limit: IP_RATE_LIMIT, windowSec: IP_WINDOW_SEC });
  if (!ipRL.allowed) return rateLimitResponse(ipRL, req);

  const { body: pb, errorResponse } = await parseJsonBody(req);
  if (errorResponse) return errorResponse;
  const parsed = BodySchema.safeParse(pb ?? {});
  if (!parsed.success) {
    return createErrorResponse('Dados de login inválidos', 400, 'VALIDATION_ERROR', undefined, req);
  }
  const { email, password } = parsed.data;

  const emailKey = `login:email:${email}`;
  const emailRL = await checkRateLimit(undefined as any, { key: emailKey, limit: 10, windowSec: IP_WINDOW_SEC });
  if (!emailRL.allowed) return rateLimitResponse(emailRL, req);

  const { locked, remaining } = await checkLockout(email);
  if (locked) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Conta bloqueada. Tente novamente em ${Math.ceil(remaining / 60)} min.`,
        code: 'ACCOUNT_LOCKED',
        remaining_seconds: remaining,
      }),
      { status: 429, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' } },
    );
  }

  const authUrl = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
  const authRes = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
    body: JSON.stringify({ email, password }),
  });

  const authBody = await authRes.json().catch(() => ({}));
  const success = authRes.ok && !!(authBody as any)?.access_token;

  if (!success) {
    recordLoginAttempt(email, false, ip).catch(() => {});
    return new Response(
      JSON.stringify({ success: false, error: (authBody as any)?.error_description ?? 'Credenciais inválidas', code: 'INVALID_CREDENTIALS' }),
      { status: 401, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ success: true, session: authBody }),
    { status: 200, headers: { ...corsHeaders(req), 'Content-Type': 'application/json' } },
  );
});
