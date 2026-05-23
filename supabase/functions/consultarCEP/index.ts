import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { cepSchema } from '../_shared/schemas/common.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { data, errorResponse } = await validateRequest(req, cepSchema);
  if (errorResponse) return errorResponse;

  const { cep } = data!;
  const clean = cep.replace(/\D/g, '');

  try {
    // ViaCEP
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (res.ok) {
      const viacep = await res.json();
      if (!viacep.erro) {
        return new Response(JSON.stringify({
          cep: viacep.cep, logradouro: viacep.logradouro || '', complemento: viacep.complemento || '',
          bairro: viacep.bairro || '', localidade: viacep.localidade || '', uf: viacep.uf || '',
          ibge: viacep.ibge || '', ddd: viacep.ddd || '',
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

    return createErrorResponse('CEP não encontrado', 404, 'NOT_FOUND');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(message, 500, 'INTERNAL_SERVER_ERROR');
  }
});
