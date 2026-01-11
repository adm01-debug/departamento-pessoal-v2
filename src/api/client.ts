// V15-290
import { supabase } from '@/integrations/supabase/client';
const API_URL = import.meta.env.VITE_API_URL || '/api';
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}), ...options.headers } });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || 'Erro na requisição'); }
  return res.json();
}
export const api = { get: <T>(url: string) => apiRequest<T>(url), post: <T>(url: string, data: any) => apiRequest<T>(url, { method: 'POST', body: JSON.stringify(data) }), put: <T>(url: string, data: any) => apiRequest<T>(url, { method: 'PUT', body: JSON.stringify(data) }), delete: <T>(url: string) => apiRequest<T>(url, { method: 'DELETE' }) };
