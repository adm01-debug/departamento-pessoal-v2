import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.test("Embed ferias with colaboradores should work with explicit FK and foto_url", async () => {
  // Check if the query structure is valid and doesn't return a 400 error about ambiguity or missing columns.
  const { data, error } = await supabase
    .from('ferias')
    .select('id, colaborador:colaboradores!fk_ferias_colaborador(nome_completo, foto_url)')
    .limit(1);

  if (error) {
    console.error("Query Error Details:", JSON.stringify(error, null, 2));
  }

  assertEquals(error, null, `Query failed with error: ${error?.message}`);
  
  if (data && data.length > 0) {
    const item = data[0] as any;
    assertExists(item.colaborador, "Colaborador embed should exist if data is present");
    if (item.colaborador) {
        assertExists(item.colaborador.nome_completo, "nome_completo should exist in the embed");
        // We verify that foto_url is at least a key in the object (even if value is null)
        const hasFotoUrl = Object.keys(item.colaborador).includes('foto_url');
        assertEquals(hasFotoUrl, true, "foto_url key should be present in the embed");
    }
  } else {
    console.log("No data found in 'ferias' table, but query structure is valid.");
  }
});

Deno.test("Embed batidas_ponto with colaboradores should work with explicit FK", async () => {
  const { data, error } = await supabase
    .from('batidas_ponto')
    .select('id, colaborador:colaboradores!fk_batidas_ponto_colaborador(nome_completo, foto_url)')
    .limit(1);

  if (error) {
    console.error("Query Error Details (batidas_ponto):", JSON.stringify(error, null, 2));
  }

  assertEquals(error, null, `Query failed with error: ${error?.message}`);
});

Deno.test("Colaboradores table should have foto_url instead of avatar_url", async () => {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('id, nome_completo, foto_url')
    .limit(1);

  assertEquals(error, null, `Query failed with error: ${error?.message}`);
  
  if (data && data.length > 0) {
    const item = data[0] as any;
    const hasAvatarUrl = Object.keys(item).includes('avatar_url');
    assertEquals(hasAvatarUrl, false, "colaboradores should NOT have avatar_url (it should be foto_url)");
    const hasFotoUrl = Object.keys(item).includes('foto_url');
    assertEquals(hasFotoUrl, true, "colaboradores should have foto_url");
  }
});
