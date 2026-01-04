import { supabase } from "@/integrations/supabase/client";
const TABLE = "integracoes";
export async function list(filters?: Record<string, any>) { let q = supabase.from(TABLE).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
export async function getById(id: string) { const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single(); if (error) throw error; return data; }
export async function create(data: any) { const { data: result, error } = await supabase.from(TABLE).insert([data]).select().single(); if (error) throw error; return result; }
export async function update(id: string, data: any) { const { data: result, error } = await supabase.from(TABLE).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
export async function remove(id: string) { const { error } = await supabase.from(TABLE).delete().eq("id", id); if (error) throw error; return true; }
export async function count(filters?: Record<string, any>) { let q = supabase.from(TABLE).select("*", { count: "exact", head: true }); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v) q = q.eq(k, v); }); const { count, error } = await q; if (error) throw error; return count || 0; }
export default { list, getById, create, update, remove, count };
