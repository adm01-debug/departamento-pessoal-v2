import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { withMonitoring } from '../_shared/monitor.ts';

function calcINSS(s: number): number {
  const fx = [{ l: 1518, a: 0.075 }, { l: 2793.88, a: 0.09 }, { l: 5563.80, a: 0.12 }, { l: 7786.93, a: 0.14 }];
  let d = 0, r = s;
  for (let i = 0; i < fx.length; i++) { 
    const la = i === 0 ? 0 : fx[i-1].l; 
    const f = Math.min(r, fx[i].l - la); 
    if (f <= 0) break; 
    d += f * fx[i].a; 
    r -= f; 
  }
  return Math.round(d * 100) / 100;
}

function calcIRRF(b: number): number {
  const fx = [{ l: 2259.20, a: 0, d: 0 }, { l: 2826.65, a: 0.075, d: 169.44 }, { l: 3751.05, a: 0.15, d: 381.44 }, { l: 4664.68, a: 0.225, d: 662.77 }, { l: Infinity, a: 0.275, d: 896.00 }];
  if (b <= 0) return 0;
  for (const f of fx) { 
    if (b <= f.l) return Math.max(0, Math.round((b * f.a - f.d) * 100) / 100); 
  }
  return 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  return withMonitoring(req, 'calcular-ferias', async (supabase) => {
    const { salario_base, dias_ferias = 30, dias_abono = 0, colaborador_id } = await req.json();
    
    if (!salario_base || salario_base <= 0) {
      return createErrorResponse('salario_base obrigatório e maior que zero', 400, 'INVALID_INPUT');
    }

    const vd = salario_base / 30;
    const vf = Math.round(vd * dias_ferias * 100) / 100;
    const tc = Math.round(vf / 3 * 100) / 100;
    const va = Math.round(vd * dias_abono * 100) / 100;
    const ta = Math.round(va / 3 * 100) / 100;
    const bruto = vf + tc + va + ta;
    const inss = calcINSS(bruto);
    const irrf = calcIRRF(bruto - inss);
    const liquido = Math.round((bruto - inss - irrf) * 100) / 100;

    return new Response(
      JSON.stringify({ 
        success: true, 
        colaborador_id, 
        dias_ferias, 
        dias_abono, 
        valor_ferias: vf, 
        terco_constitucional: tc, 
        valor_abono: va, 
        terco_abono: ta, 
        bruto: Math.round(bruto * 100) / 100, 
        inss, 
        irrf, 
        liquido 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  });
});

