import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { webhookSchema } from '../_shared/schemas/common.ts';

async function verifySignature(payload: string, signature: string | null, secret: string | undefined): Promise<boolean> {
  if (!signature || !secret) return false;
  
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const sigHex = signature.startsWith('sha256=') ? signature.slice(7) : signature;
    const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(payload)
    );
  } catch (e) {
    console.error('Erro na verificação de assinatura:', e);
    return false;
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get('WEBHOOK_SECRET');
    const signature = req.headers.get('x-hub-signature-256');
    const payloadText = await req.clone().text();

    if (secret && !(await verifySignature(payloadText, signature, secret))) {
      return createErrorResponse('Assinatura inválida', 401, 'INVALID_SIGNATURE');
    }

    const { data, errorResponse } = await validateRequest(req, webhookSchema);
    if (errorResponse) return errorResponse;

    const webhookData = data!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Auditoria do recebimento
    await supabase.from('webhook_logs').insert({
      payload: webhookData,
      headers: Object.fromEntries(req.headers.entries()),
      status: 'received',
      version: webhookData.version
    });

    // Lógica de versionamento
    let result;
    if (webhookData.version === 'v2') {
      result = await processWebhookV2(webhookData, supabase);
    } else {
      result = await processWebhookV1(webhookData, supabase);
    }

    return new Response(
      JSON.stringify({ success: true, data: result, version: webhookData.version }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(message, 500, 'INTERNAL_SERVER_ERROR');
  }
});

async function processWebhookV1(body: any, supabase: any) {
  console.log('Processando Webhook V1:', body.event);
  return { status: 'processed_v1', event: body.event };
}

async function processWebhookV2(body: any, supabase: any) {
  console.log('Processando Webhook V2:', body.event);
  // V2 pode ter campos extras ou lógica diferente
  return { status: 'processed_v2', event: body.event, metadata: { processed_at: new Date().toISOString() } };
}
