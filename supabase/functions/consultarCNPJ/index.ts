import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { cnpj } = await req.json();
    if (!cnpj) {
      return new Response(JSON.stringify({ error: 'CNPJ obrigatório' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) {
      return new Response(JSON.stringify({ error: 'CNPJ deve ter 14 dígitos' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'CNPJ não encontrado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404,
      });
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
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
