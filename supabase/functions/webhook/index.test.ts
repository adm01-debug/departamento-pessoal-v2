import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

/**
 * Testes Unitários de Lógica do Webhook
 * (Simulando a verificação de assinatura sem necessidade de servidor HTTP)
 */

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

async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.test("verifySignature: deve retornar true para assinatura válida", async () => {
  const payload = JSON.stringify({ event: "test" });
  const secret = "secret123";
  const signature = await generateSignature(payload, secret);
  
  const isValid = await verifySignature(payload, `sha256=${signature}`, secret);
  assertEquals(isValid, true);
});

Deno.test("verifySignature: deve retornar false para assinatura inválida", async () => {
  const payload = JSON.stringify({ event: "test" });
  const secret = "secret123";
  
  const isValid = await verifySignature(payload, `sha256=wrongsignature`, secret);
  assertEquals(isValid, false);
});

Deno.test("verifySignature: deve retornar false se o secret estiver ausente", async () => {
  const payload = JSON.stringify({ event: "test" });
  const isValid = await verifySignature(payload, `sha256=any`, undefined);
  assertEquals(isValid, false);
});

// Fail-closed: reflete a lógica do handler — sem WEBHOOK_SECRET => 503,
// com secret mas assinatura ruim => 401.
function statusForRequest(secret: string | undefined, signatureValid: boolean): number {
  if (!secret) return 503;
  if (!signatureValid) return 401;
  return 200;
}

Deno.test("fail-closed: sem WEBHOOK_SECRET retorna 503", () => {
  assertEquals(statusForRequest(undefined, false), 503);
  assertEquals(statusForRequest(undefined, true), 503);
});

Deno.test("fail-closed: com secret e assinatura inválida retorna 401", () => {
  assertEquals(statusForRequest("s3cr3t", false), 401);
});

Deno.test("fail-closed: com secret e assinatura válida retorna 200", () => {
  assertEquals(statusForRequest("s3cr3t", true), 200);
});
