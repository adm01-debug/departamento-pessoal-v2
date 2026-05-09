import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified rates for provisions
const ALIQUOTA_INSS_PATRONAL = 0.278; // 20% + 2% RAT + 5.8% Terceiros
const ALIQUOTA_FGTS = 0.08;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { empresa_id, competencia } = await req.json();
    if (!empresa_id || !competencia) {
      return new Response(JSON.stringify({ error: 'empresa_id e competencia obrigatórios' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Get active employees for the company
    const { data: colaboradores, error: colabErr } = await supabase
      .from('colaboradores')
      .select('id, salario_base')
      .eq('empresa_id', empresa_id)
      .eq('status', 'Ativo'); // Capitalized based on common patterns, adjust if needed

    if (colabErr) throw colabErr;
    if (!colaboradores?.length) {
      return new Response(JSON.stringify({ message: 'Nenhum colaborador ativo encontrado para provisionamento.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const provisoes = [];

    for (const colab of colaboradores) {
      const salario = Number(colab.salario_base) || 0;
      if (salario <= 0) continue;

      // 1. Provisão de Férias
      // Base: (Salário / 12) * 1.3333
      const principalFerias = Math.round((salario / 12) * 1.333333 * 100) / 100;
      const inssFerias = Math.round(principalFerias * ALIQUOTA_INSS_PATRONAL * 100) / 100;
      const fgtsFerias = Math.round(principalFerias * ALIQUOTA_FGTS * 100) / 100;

      provisoes.push({
        empresa_id,
        colaborador_id: colab.id,
        competencia,
        tipo: 'ferias',
        valor_principal: principalFerias,
        encargos_inss: inssFerias,
        encargos_fgts: fgtsFerias,
      });

      // 2. Provisão de 13º Salário
      // Base: Salário / 12
      const principal13 = Math.round((salario / 12) * 100) / 100;
      const inss13 = Math.round(principal13 * ALIQUOTA_INSS_PATRONAL * 100) / 100;
      const fgts13 = Math.round(principal13 * ALIQUOTA_FGTS * 100) / 100;

      provisoes.push({
        empresa_id,
        colaborador_id: colab.id,
        competencia,
        tipo: '13_salario',
        valor_principal: principal13,
        encargos_inss: inss13,
        encargos_fgts: fgts13,
      });
    }

    // Delete existing provisions for the same competencia and empresa to avoid duplicates on recalculation
    const { error: delErr } = await supabase
      .from('provisoes_mensais')
      .delete()
      .eq('empresa_id', empresa_id)
      .eq('competencia', competencia);
    
    if (delErr) throw delErr;

    // Insert new provisions
    const { error: insErr } = await supabase
      .from('provisoes_mensais')
      .insert(provisoes);

    if (insErr) throw insErr;

    // Integrated Accounting: Create ledger entries for provisions if accounts exist
    const { data: plano } = await supabase
      .from('plano_contas')
      .select('id, codigo')
      .eq('empresa_id', empresa_id);

    if (plano?.length) {
      const contaDespesaProvisao = plano.find(c => c.codigo === '3.1.01.002' || c.codigo === '3.1.01.001');
      const contaPassivoProvisao = plano.find(c => c.codigo === '2.1.01.002');

      if (contaDespesaProvisao && contaPassivoProvisao) {
        const totalProvisions = provisoes.reduce((acc, p) => acc + p.valor_principal + p.encargos_inss + p.encargos_fgts, 0);
        
        await supabase.from('lancamentos_contabeis').insert({
          empresa_id,
          data_lancamento: new Date().toISOString().split('T')[0],
          descricao: `Provisão Mensal (Férias/13º) - ${competencia}`,
          valor: Math.round(totalProvisions * 100) / 100,
          conta_debito_id: contaDespesaProvisao.id,
          conta_credito_id: contaPassivoProvisao.id,
          origem: 'provisao',
          status: 'consolidado'
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: provisoes.length,
      message: `${provisoes.length} registros de provisão gerados para ${competencia}.` 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Erro no cálculo de provisões:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
