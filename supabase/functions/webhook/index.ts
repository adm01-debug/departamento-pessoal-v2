import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

/**
 * Receptor de webhooks com verificação de segurança
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256',
};

async function verifySignature(payload: string, signature: string | null, secret: string | undefined): Promise<boolean> {
  if (!signature || !secret) return false;
  
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
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.text();
    const signature = req.headers.get('x-hub-signature-256');
    const secret = Deno.env.get('WEBHOOK_SECRET');

    // Validação de segurança OBRIGATÓRIA se o secret estiver configurado
    // Se o secret NÃO estiver configurado, emitir um aviso no log mas permitir (apenas em dev)
    if (secret) {
      if (!(await verifySignature(payload, signature, secret))) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    } else {
      console.warn('WEBHOOK_SECRET não configurado. Validação de assinatura pulada.');
    }

    const body = JSON.parse(payload);
    
    // Log do recebimento para auditoria
    await supabase.from('webhook_logs').insert({
      payload: body,
      headers: Object.fromEntries(req.headers.entries()),
      status: 'received'
    });

    const result = await processwebhook(body, supabase);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

async function processwebhook(body: any, supabase: any) {
  console.log('Processing webhook:', body);
  return { processed: true, timestamp: new Date().toISOString() };
}
