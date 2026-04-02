import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { cep } = await req.json();
    if (!cep) {
      return new Response(JSON.stringify({ error: 'CEP obrigatório' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      return new Response(JSON.stringify({ error: 'CEP deve ter 8 dígitos' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    // ViaCEP
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (res.ok) {
      const data = await res.json();
      if (!data.erro) {
        return new Response(JSON.stringify({
          cep: data.cep, logradouro: data.logradouro || '', complemento: data.complemento || '',
          bairro: data.bairro || '', localidade: data.localidade || '', uf: data.uf || '',
          ibge: data.ibge || '', ddd: data.ddd || '',
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Fallback BrasilAPI
    const res2 = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
    if (res2.ok) {
      const d = await res2.json();
      return new Response(JSON.stringify({
        cep: d.cep, logradouro: d.street || '', complemento: '', bairro: d.neighborhood || '',
        localidade: d.city || '', uf: d.state || '', ibge: d.city_ibge || '', ddd: '',
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'CEP não encontrado' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
