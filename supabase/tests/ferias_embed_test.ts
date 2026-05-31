import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.test("Embed ferias with colaboradores should work with explicit FK and foto_url", async () => {
  // We don't need to insert data, just check if the query structure is valid
  // and doesn't return a 400 error about ambiguity or missing columns.
  const { data, error } = await supabase
    .from('ferias')
    .select('id, colaborador:colaboradores!fk_ferias_colaborador(nome_completo, foto_url)')
    .limit(1);

  if (error) {
    console.error("Query Error:", error);
  }

  assertEquals(error, null, `Query failed with error: ${error?.message}`);
  
  if (data && data.length > 0) {
    const item = data[0] as any;
    assertExists(item.colaborador, "Colaborador embed should exist");
    // Verify that it used the correct alias and didn't fail due to multiple relationships
    if (item.colaborador) {
        assertExists(item.colaborador.nome_completo, "Colaborador name should exist");
        // Note: foto_url can be null, that's fine, as long as it doesn't error
    }
  }
});

Deno.test("Embed batidas_ponto with colaboradores should work with explicit FK", async () => {
  const { data, error } = await supabase
    .from('batidas_ponto')
    .select('id, colaborador:colaboradores!fk_batidas_ponto_colaborador(nome_completo, foto_url)')
    .limit(1);

  assertEquals(error, null, `Query failed with error: ${error?.message}`);
});
