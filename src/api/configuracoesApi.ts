import { supabase } from "@/integrations/supabase/client";

const TABLE = "configuracoes";

export async function list(filters?: Record<string, any>) {
  let q = (supabase.from(TABLE) as any).select("*");
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v) q = q.eq(k, v);
    });
  }
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function getById(id: string) {
  const { data, error } = await (supabase.from(TABLE) as any).select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function getByChave(chave: string) {
  const { data, error } = await (supabase.from(TABLE) as any).select("*").eq("chave", chave).single();
  if (error) throw error;
  return data;
}

export async function create(data: any) {
  const { data: result, error } = await (supabase.from(TABLE) as any).insert([data]).select().single();
  if (error) throw error;
  return result;
}

export async function update(id: string, data: any) {
  const { data: result, error } = await (supabase.from(TABLE) as any).update(data).eq("id", id).select().single();
  if (error) throw error;
  return result;
}

export async function upsert(chave: string, valor: any) {
  const { data: result, error } = await (supabase.from(TABLE) as any)
    .upsert({ chave, valor, updated_at: new Date().toISOString() }, { onConflict: 'chave' })
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function remove(id: string) {
  const { error } = await (supabase.from(TABLE) as any).delete().eq("id", id);
  if (error) throw error;
  return true;
}

export default { list, getById, getByChave, create, update, upsert, remove };
