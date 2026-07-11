import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { cnpjSchema } from '../_shared/schemas/common.ts';
import { cachePublic } from '../_shared/cache.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { data, errorResponse } = await validateRequest(req, cnpjSchema);
  if (errorResponse) return errorResponse;

  const { cnpj } = data!;
  const clean = cnpj.replace(/\D/g, '');

  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`);
    if (!res.ok) {
      return createErrorResponse('CNPJ não encontrado', 404, 'NOT_FOUND');
    }

    const d = await res.json();
    return new Response(JSON.stringify({
      cnpj: d.cnpj, razao_social: d.razao_social || '', nome_fantasia: d.nome_fantasia || '',
      situacao_cadastral: d.descricao_situacao_cadastral || '', cnae_principal: d.cnae_fiscal?.toString() || '',
      cnae_descricao: d.cnae_fiscal_descricao || '', natureza_juridica: d.natureza_juridica || '',
      porte: d.descricao_porte || '', logradouro: d.logradouro || '', numero: d.numero || '',
      complemento: d.complemento || '', bairro: d.bairro || '', municipio: d.municipio || '',
      uf: d.uf || '', cep: d.cep || '', telefone: d.ddd_telefone_1 || '', email: d.email || '',
      capital_social: d.capital_social || 0, data_inicio_atividade: d.data_inicio_atividade || '',
      socios: (d.qsa || []).map((s: any) => ({ nome: s.nome_socio, qualificacao: s.qualificacao_socio })),
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        // MP-032: CNPJ raramente muda — cache CDN 24h com SWR de 1h.
        ...cachePublic(86400, 3600),
      },
    });


  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(message, 500, 'INTERNAL_SERVER_ERROR');
  }
});
