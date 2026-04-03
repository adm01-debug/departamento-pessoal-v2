import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache store (per edge function instance)
const cacheStore = new Map<string, { data: any; expiresAt: number }>();

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, key, ttlSeconds, table, query } = await req.json();

    if (action === 'get') {
      const cached = cacheStore.get(key);
      if (cached && cached.expiresAt > Date.now()) {
        return new Response(JSON.stringify({ success: true, hit: true, data: cached.data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: true, hit: false, data: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'set') {
      const ttl = (ttlSeconds || 300) * 1000;
      cacheStore.set(key, { data: query, expiresAt: Date.now() + ttl });
      return new Response(JSON.stringify({ success: true, key, expiresIn: ttlSeconds || 300 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'invalidate') {
      if (key === '*') {
        const size = cacheStore.size;
        cacheStore.clear();
        return new Response(JSON.stringify({ success: true, cleared: size }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const existed = cacheStore.delete(key);
      return new Response(JSON.stringify({ success: true, existed }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'query_cached') {
      // Query a table with caching
      if (!table) throw new Error('table é obrigatório para query_cached');
      const cacheKey = `table:${table}:${JSON.stringify(query || {})}`;
      const cached = cacheStore.get(cacheKey);
      
      if (cached && cached.expiresAt > Date.now()) {
        return new Response(JSON.stringify({ success: true, hit: true, data: cached.data, source: 'cache' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Query database
      let q = supabase.from(table).select(query?.select || '*');
      if (query?.limit) q = q.limit(query.limit);
      if (query?.orderBy) q = q.order(query.orderBy, { ascending: query.ascending ?? true });
      
      const { data, error } = await q;
      if (error) throw error;

      // Cache result
      const ttl = (ttlSeconds || 60) * 1000;
      cacheStore.set(cacheKey, { data, expiresAt: Date.now() + ttl });

      return new Response(JSON.stringify({ success: true, hit: false, data, source: 'database' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'stats') {
      // Clean expired entries
      const now = Date.now();
      let expired = 0;
      for (const [k, v] of cacheStore.entries()) {
        if (v.expiresAt <= now) { cacheStore.delete(k); expired++; }
      }
      return new Response(JSON.stringify({
        success: true,
        stats: { entries: cacheStore.size, expired_cleaned: expired, timestamp: new Date().toISOString() },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: false, error: 'Ação inválida. Use: get, set, invalidate, query_cached, stats' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
