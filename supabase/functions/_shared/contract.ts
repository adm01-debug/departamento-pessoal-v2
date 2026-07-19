import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';

export type StandardErrorResponse = {
  error: {
    code: string;
    message: string;
    fields?: Array<{
      field: string;
      message: string;
    }>;
  };
};

const ALLOWED_ORIGINS = [
  'https://sistema-dp.lovable.app',
  'https://unified-harmony-hub.lovable.app',
];
const LOVABLE_HOST_RE = /\.lovable\.(app|dev)$/;

function isOriginAllowed(origin: string): boolean {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return (
      ALLOWED_ORIGINS.includes(origin) ||
      LOVABLE_HOST_RE.test(host) ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

export const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function getCorsHeaders(req?: Request): Record<string, string> {
  const origin = req?.headers.get('origin') || '';
  const allowedOrigin = isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256, idempotency-key, x-csrf-token',
    'Access-Control-Expose-Headers': 'idempotent-replay',
    'Vary': 'Origin',
    ...securityHeaders,
  };
}

export const corsHeaders = getCorsHeaders();

export function createErrorResponse(
  message: string,
  status: number = 400,
  code: string = 'BAD_REQUEST',
  fields?: Array<{ field: string; message: string }>
): Response {
  return new Response(
    JSON.stringify({
      error: {
        code,
        message,
        fields,
      },
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

export function createValidationErrorResponse(zodError: z.ZodError): Response {
  const fields = zodError.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return createErrorResponse(
    'Erro de validação nos dados fornecidos',
    422,
    'VALIDATION_ERROR',
    fields
  );
}

export async function validateRequest<T>(
  req: Request,
  schema: z.Schema<T>
): Promise<{ data?: T; errorResponse?: Response }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return { errorResponse: createValidationErrorResponse(result.error) };
    }
    
    return { data: result.data };
  } catch (err) {
    return { 
      errorResponse: createErrorResponse(
        'JSON inválido ou corpo da requisição ausente',
        400,
        'INVALID_JSON'
      ) 
    };
  }
}
