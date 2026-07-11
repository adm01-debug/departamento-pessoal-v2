import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { webhookSchema } from '../_shared/schemas/common.ts';
import { withMonitoring } from '../_shared/monitor.ts';

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

  return withMonitoring(req, 'webhook', async (supabase) => {
    const secret = Deno.env.get('WEBHOOK_SECRET');
    const signature = req.headers.get('x-hub-signature-256');
    const payloadText = await req.clone().text();

    // Fail-closed: sem secret configurado, recusa TODAS as requisições (503).
    if (!secret) {
      console.error('WEBHOOK_SECRET não configurado — recusando webhook (fail-closed)');
      return createErrorResponse(
        'Webhook não configurado no servidor',
        503,
        'WEBHOOK_NOT_CONFIGURED'
      );
    }

    // Assinatura ausente ou inválida => 401.
    if (!(await verifySignature(payloadText, signature, secret))) {
      return createErrorResponse('Assinatura inválida', 401, 'INVALID_SIGNATURE');
    }

    const { data, errorResponse } = await validateRequest(req, webhookSchema);
    if (errorResponse) return errorResponse;

    const webhookData = data!;

    // Idempotência: se event_id já foi processado, retornamos 200 com replay=true
    // sem re-executar side-effects (garante at-least-once → exactly-once semântica).
    const { data: existing } = await supabase
      .from('webhook_logs')
      .select('id, status')
      .eq('event_id', webhookData.event_id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ success: true, replay: true, event_id: webhookData.event_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Auditoria do recebimento (event_id UNIQUE serve como lock lógico contra corridas)
    const { error: insertErr } = await supabase.from('webhook_logs').insert({
      event_id: webhookData.event_id,
      payload: webhookData,
      headers: Object.fromEntries(req.headers.entries()),
      status: 'received',
      version: webhookData.version
    });

    // Se corrida entre 2 workers → conflito de UNIQUE → tratamos como replay
    if (insertErr && (insertErr.code === '23505' || /duplicate|unique/i.test(insertErr.message))) {
      return new Response(
        JSON.stringify({ success: true, replay: true, event_id: webhookData.event_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    if (insertErr) {
      console.error('Erro ao registrar webhook_log:', insertErr);
      return createErrorResponse('Erro ao registrar webhook', 500, 'LOG_ERROR');
    }

    // Lógica de versionamento
    let result;
    try {
      if (webhookData.version === 'v2') {
        result = await processWebhookV2(webhookData, supabase);
      } else {
        result = await processWebhookV1(webhookData, supabase);
      }
      await supabase.from('webhook_logs').update({ status: 'processed' }).eq('event_id', webhookData.event_id);
    } catch (procErr) {
      await supabase.from('webhook_logs').update({
        status: 'failed',
        erro: (procErr as Error).message
      }).eq('event_id', webhookData.event_id);
      throw procErr;
    }

    return new Response(
      JSON.stringify({ success: true, data: result, version: webhookData.version, event_id: webhookData.event_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  });
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
