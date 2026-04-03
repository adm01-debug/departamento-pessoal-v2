import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { action, data, password } = await req.json();
    const secret = password || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'default-key';

    if (action === 'encrypt') {
      if (!data) throw new Error('data é obrigatório');
      
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(secret, salt);
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(typeof data === 'string' ? data : JSON.stringify(data))
      );

      return new Response(JSON.stringify({
        success: true,
        data: {
          encrypted: arrayBufferToBase64(encrypted),
          salt: arrayBufferToBase64(salt.buffer),
          iv: arrayBufferToBase64(iv.buffer),
        },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else if (action === 'decrypt') {
      if (!data?.encrypted || !data?.salt || !data?.iv) {
        throw new Error('encrypted, salt e iv são obrigatórios');
      }

      const salt = new Uint8Array(base64ToArrayBuffer(data.salt));
      const iv = new Uint8Array(base64ToArrayBuffer(data.iv));
      const key = await deriveKey(secret, salt);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        base64ToArrayBuffer(data.encrypted)
      );

      const text = decoder.decode(decrypted);
      let parsed: any;
      try { parsed = JSON.parse(text); } catch { parsed = text; }

      return new Response(JSON.stringify({ success: true, data: parsed }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'hash') {
      if (!data) throw new Error('data é obrigatório');
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(typeof data === 'string' ? data : JSON.stringify(data)));
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

      return new Response(JSON.stringify({ success: true, data: { hash: hashHex, algorithm: 'SHA-256' } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'generate_token') {
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      const token = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

      return new Response(JSON.stringify({ success: true, data: { token, length: 64 } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Ação inválida. Use: encrypt, decrypt, hash, generate_token' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
