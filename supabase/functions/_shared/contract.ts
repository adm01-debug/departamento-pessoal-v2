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

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256, x-request-id',
};

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
