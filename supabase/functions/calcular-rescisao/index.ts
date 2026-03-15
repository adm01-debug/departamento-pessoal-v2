const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function calcINSS(s: number): number {
  const fx = [{ l: 1518, a: 0.075 }, { l: 2793.88, a: 0.09 }, { l: 5563.80, a: 0.12 }, { l: 7786.93, a: 0.14 }];
  let d = 0, r = s;
  for (let i = 0; i < fx.length; i++) { const la = i === 0 ? 0 : fx[i-1].l; const f = Math.min(r, fx[i].l - la); if (f <= 0) break; d += f * fx[i].a; r -= f; }
  return Math.round(d * 100) / 100;
}

function calcIRRF(b: number): number {
  const fx = [{ l: 2259.20, a: 0, d: 0 }, { l: 2826.65, a: 0.075, d: 169.44 }, { l: 3751.05, a: 0.15, d: 381.44 }, { l: 4664.68, a: 0.225, d: 662.77 }, { l: Infinity, a: 0.275, d: 896.00 }];
  if (b <= 0) return 0;
  for (const f of fx) { if (b <= f.l) return Math.max(0, Math.round((b * f.a - f.d) * 100) / 100); }
  return 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { salario_base, data_admissao, data_desligamento, tipo_rescisao = 'sem_justa_causa', saldo_fgts = 0, ferias_vencidas = false } = await req.json();
    if (!salario_base || !data_admissao || !data_desligamento) return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const adm = new Date(data_admissao), desl = new Date(data_desligamento);
    const totalDias = Math.floor((desl.getTime() - adm.getTime()) / 86400000);
    const totalMeses = Math.floor(totalDias / 30);
    const diasNoMes = desl.getDate();
    const mesAtual = desl.getMonth() + 1;
    const anos = Math.floor(totalMeses / 12);

    const saldoSalario = Math.round((salario_base / 30) * diasNoMes * 100) / 100;
    const d13 = tipo_rescisao !== 'com_justa_causa' ? Math.round((salario_base / 12) * mesAtual * 100) / 100 : 0;
    const mfp = totalMeses % 12;
    const fp = tipo_rescisao !== 'com_justa_causa' ? Math.round((salario_base / 12) * mfp * 100) / 100 : 0;
    const tfp = Math.round(fp / 3 * 100) / 100;
    const fvv = ferias_vencidas ? salario_base : 0;
    const tfv = Math.round(fvv / 3 * 100) / 100;
    const dap = tipo_rescisao === 'sem_justa_causa' ? Math.min(90, 30 + anos * 3) : 0;
    const ap = tipo_rescisao === 'sem_justa_causa' ? Math.round((salario_base / 30) * dap * 100) / 100
      : tipo_rescisao === 'acordo_mutuo' ? Math.round((salario_base / 30) * Math.min(90, 30 + anos * 3) * 0.5 * 100) / 100 : 0;
    const mf = tipo_rescisao === 'sem_justa_causa' ? Math.round(saldo_fgts * 0.40 * 100) / 100
      : tipo_rescisao === 'acordo_mutuo' ? Math.round(saldo_fgts * 0.20 * 100) / 100 : 0;

    const tb = saldoSalario + d13 + fp + tfp + fvv + tfv + ap;
    const inss = calcINSS(saldoSalario);
    const irrf = calcIRRF(saldoSalario - inss);
    const tl = Math.round((tb - inss - irrf) * 100) / 100;

    return new Response(JSON.stringify({
      success: true, tipo_rescisao, saldo_salario: saldoSalario, decimo13_proporcional: d13,
      ferias_proporcional: fp, terco_ferias_proporcional: tfp, ferias_vencidas: fvv, terco_ferias_vencidas: tfv,
      aviso_previo: ap, dias_aviso_previo: dap, multa_fgts: mf,
      total_bruto: Math.round(tb * 100) / 100, inss, irrf, total_liquido: tl,
      tempo_servico_meses: totalMeses, tempo_servico_anos: anos,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
