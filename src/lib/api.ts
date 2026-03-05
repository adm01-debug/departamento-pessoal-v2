// @ts-nocheck
// V15-131: src/lib/api.ts
import { supabase } from '@/integrations/supabase/client';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

export const api = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.from(endpoint).select('*');
      return { data: data as T, error: error ? new Error(error.message) : null, status: error ? 400 : 200 };
    } catch (e) { return { data: null, error: e as Error, status: 500 }; }
  },

  async getById<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.from(endpoint).select('*').eq('id', id).single();
      return { data: data as T, error: error ? new Error(error.message) : null, status: error ? 404 : 200 };
    } catch (e) { return { data: null, error: e as Error, status: 500 }; }
  },

  async post<T>(endpoint: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.from(endpoint).insert(payload).select().single();
      return { data: data as T, error: error ? new Error(error.message) : null, status: error ? 400 : 201 };
    } catch (e) { return { data: null, error: e as Error, status: 500 }; }
  },

  async put<T>(endpoint: string, id: string, payload: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.from(endpoint).update(payload).eq('id', id).select().single();
      return { data: data as T, error: error ? new Error(error.message) : null, status: error ? 400 : 200 };
    } catch (e) { return { data: null, error: e as Error, status: 500 }; }
  },

  async delete(endpoint: string, id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from(endpoint).delete().eq('id', id);
      return { data: null, error: error ? new Error(error.message) : null, status: error ? 400 : 204 };
    } catch (e) { return { data: null, error: e as Error, status: 500 }; }
  },

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
};
