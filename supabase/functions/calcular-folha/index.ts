import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FAIXAS_INSS = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 5563.80, aliquota: 0.12 },
  { limite: 7786.93, aliquota: 0.14 },
];

const FAIXAS_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

function calcINSS(salario: number): number {
  let desc = 0, rest = salario;
  for (let i = 0; i < FAIXAS_INSS.length; i++) {
    const limAnt = i === 0 ? 0 : FAIXAS_INSS[i - 1].limite;
    const f = Math.min(rest, FAIXAS_INSS[i].limite - limAnt);
    if (f <= 0) break;
    desc += f * FAIXAS_INSS[i].aliquota;
    rest -= f;
  }
  return Math.round(desc * 100) / 100;
}

function calcIRRF(base: number): number {
  if (base <= 0) return 0;
  for (const f of FAIXAS_IRRF) {
    if (base <= f.limite) return Math.max(0, Math.round((base * f.aliquota - f.deducao) * 100) / 100);
  }
  return 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { empresa_id, competencia } = await req.json();
    if (!empresa_id || !competencia) {
      return new Response(JSON.stringify({ error: 'empresa_id e competencia obrigatórios' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: colaboradores, error: colabErr } = await supabase
      .from('colaboradores').select('id, nome_completo, salario_base, cargo, departamento')
      .eq('empresa_id', empresa_id).eq('status', 'ativo');

    if (colabErr) throw colabErr;
    if (!colaboradores?.length) {
      return new Response(JSON.stringify({ error: 'Nenhum colaborador ativo' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const itens = colaboradores.map(c => {
      const bruto = c.salario_base || 0;
      const inss = calcINSS(bruto);
      const irrf = calcIRRF(bruto - inss);
      const fgts = Math.round(bruto * 0.08 * 100) / 100;
      const descontos = Math.round((inss + irrf) * 100) / 100;
      return { colaborador_id: c.id, nome: c.nome_completo, cargo: c.cargo, salario_bruto: bruto, inss, irrf, fgts, total_descontos: descontos, salario_liquido: Math.round((bruto - descontos) * 100) / 100 };
    });

    const totais = { bruto: 0, descontos: 0, liquido: 0, fgts: 0 };
    itens.forEach(i => { totais.bruto += i.salario_bruto; totais.descontos += i.total_descontos; totais.liquido += i.salario_liquido; totais.fgts += i.fgts; });

    await supabase.from('folhas_pagamento').upsert({
      empresa_id, competencia, status: 'calculada',
      total_bruto: Math.round(totais.bruto * 100) / 100,
      total_descontos: Math.round(totais.descontos * 100) / 100,
      total_liquido: Math.round(totais.liquido * 100) / 100,
      total_colaboradores: colaboradores.length,
    }, { onConflict: 'empresa_id,competencia' });

    return new Response(JSON.stringify({ success: true, competencia, total_colaboradores: colaboradores.length, ...Object.fromEntries(Object.entries(totais).map(([k, v]) => [`total_${k}`, Math.round(v * 100) / 100])), itens }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
