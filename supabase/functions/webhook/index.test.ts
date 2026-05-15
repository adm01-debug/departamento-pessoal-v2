import { assert, assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

const WEBHOOK_URL = "http://localhost:54321/functions/v1/webhook";

Deno.test("webhook: deve aceitar payload JSON válido", async () => {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "test", data: { foo: "bar" } }),
  });
  
  const data = await res.json();
  assertEquals(res.status, 200);
  assert(data.success === true);
  assert(data.data.processed === true);
});

Deno.test("webhook: deve falhar com status 400 para JSON inválido", async () => {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "invalid-json{",
  });
  
  const data = await res.json();
  assertEquals(res.status, 400);
  assert(data.success === false);
  assert(data.error !== undefined);
});

Deno.test("webhook: deve lidar com payloads vazios", async () => {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  
  const data = await res.json();
  assertEquals(res.status, 200);
  assert(data.success === true);
});
