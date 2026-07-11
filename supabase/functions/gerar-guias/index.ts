import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { verifyCsrf } from '../_shared/csrf.ts';
import { captureException } from '../_shared/sentry.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BodySchema = z.object({
  empresaId: z.string().uuid(),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'competência deve estar no formato YYYY-MM'),
  tipo: z.enum(['GPS', 'DARF', 'FGTS', 'FGTS_DIGITAL', 'TODAS', 'GFD']),
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const calcularINSS = (base: number): number => {
  let inss = 0;
  if (base <= 1518) inss = base * 0.075;
  else if (base <= 2793.88) inss = 113.85 + (base - 1518) * 0.09;
  else if (base <= 4190.83) inss = 228.68 + (base - 2793.88) * 0.12;
  else inss = 396.31 + (Math.min(base, 8157.41) - 4190.83) * 0.14;
  return Number(Math.min(inss, 951.63).toFixed(2));
};

const calcularIRRF = (base: number): number => {
  if (base <= 2259.20) return 0;
  if (base <= 2826.65) return Number(Math.max(0, base * 0.075 - 169.44).toFixed(2));
  if (base <= 3751.05) return Number(Math.max(0, base * 0.15 - 381.44).toFixed(2));
  if (base <= 4664.68) return Number(Math.max(0, base * 0.225 - 662.77).toFixed(2));
  return Number(Math.max(0, base * 0.275 - 896.00).toFixed(2));
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ success: false, error: 'Method not allowed' }, 405);

  const csrf = await verifyCsrf(req);
  if (!csrf.ok) return csrf.response!;

  try {
    // Auth obrigatório
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse({ success: false, error: 'Autenticação obrigatória' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return jsonResponse({ success: false, error: 'Sessão inválida' }, 401);
    const userId = userData.user.id;

    const supabase = createClient(supabaseUrl, serviceKey);

    // Zod
    let raw: unknown;
    try { raw = await req.json(); } catch { return jsonResponse({ success: false, error: 'JSON inválido' }, 400); }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonResponse({ success: false, error: 'Payload inválido', details: parsed.error.flatten() }, 400);
    }
    const { empresaId, competencia, tipo } = parsed.data;

    // Tenant scope — dados fiscais são sensíveis
    const { data: belongs } = await supabase.rpc('user_belongs_to_empresa', {
      _user_id: userId, _empresa_id: empresaId,
    });
    const { data: isAdm } = await supabase.rpc('is_admin', { _user_id: userId });
    if (!belongs && !isAdm) return jsonResponse({ success: false, error: 'Sem acesso a esta empresa' }, 403);

    // Audit log
    await supabase.from('audit_log').insert({
      tabela: 'guias_fiscais', registro_id: empresaId, acao: 'GENERATE_GUIA',
      user_id: userId,
      dados_novos: { tipo, competencia, empresa_id: empresaId },
    });

    // Buscar colaboradores ativos da empresa
    const { data: colaboradores, error: colError } = await supabase
      .from('colaboradores')
      .select('id, nome_completo, salario_base, cpf')
      .eq('empresa_id', empresaId)
      .eq('status', 'ativo');

    if (colError) throw colError;


    const totalColaboradores = colaboradores?.length || 0;

    // Calcular totais
    let totalINSSEmpregado = 0;
    let totalINSSPatronal = 0;
    let totalRAT = 0;
    let totalIRRF = 0;
    let totalFGTS = 0;
    let totalSalarios = 0;

    for (const col of colaboradores || []) {
      const salario = col.salario_base;
      totalSalarios += salario;
      totalINSSEmpregado += calcularINSS(salario);
      totalINSSPatronal += Number((salario * 0.20).toFixed(2));
      totalRAT += Number((salario * 0.03).toFixed(2));
      totalIRRF += calcularIRRF(salario - calcularINSS(salario));
      totalFGTS += Number((salario * 0.08).toFixed(2));
    }

    const guias: any[] = [];

    // GPS - Guia da Previdência Social
    if (tipo === 'GPS' || tipo === 'TODAS') {
      const terceiros = Number((totalSalarios * 0.058).toFixed(2)); // Sistema S
      guias.push({
        tipo: 'GPS',
        descricao: 'Guia da Previdência Social',
        competencia,
        codigo: '2100',
        valores: {
          inssEmpregado: Number(totalINSSEmpregado.toFixed(2)),
          inssPatronal: Number(totalINSSPatronal.toFixed(2)),
          rat: Number(totalRAT.toFixed(2)),
          terceiros,
          total: Number((totalINSSEmpregado + totalINSSPatronal + totalRAT + terceiros).toFixed(2)),
        },
        vencimento: calcularVencimento(competencia, 20),
        status: 'pendente',
      });
    }

    // DARF - Imposto de Renda Retido na Fonte
    if (tipo === 'DARF' || tipo === 'TODAS') {
      guias.push({
        tipo: 'DARF',
        descricao: 'Documento de Arrecadação de Receitas Federais - IRRF',
        competencia,
        codigoReceita: '0561',
        valores: {
          irrf: Number(totalIRRF.toFixed(2)),
          total: Number(totalIRRF.toFixed(2)),
        },
        vencimento: calcularVencimento(competencia, 20),
        status: 'pendente',
      });
    }

    // FGTS - GRF
    if (tipo === 'FGTS' || tipo === 'TODAS') {
      guias.push({
        tipo: 'FGTS',
        descricao: 'Guia de Recolhimento do FGTS',
        competencia,
        valores: {
          fgts: Number(totalFGTS.toFixed(2)),
          total: Number(totalFGTS.toFixed(2)),
        },
        vencimento: calcularVencimento(competencia, 7),
        status: 'pendente',
      });
    }
    
    // FGTS Digital - Nova Guia GFD
    if (tipo === 'FGTS_DIGITAL' || tipo === 'GFD' || tipo === 'TODAS') {
      guias.push({
        tipo: 'FGTS_DIGITAL',
        descricao: 'FGTS Digital - Guia GFD',
        competencia,
        valores: {
          fgts: Number(totalFGTS.toFixed(2)),
          total: Number(totalFGTS.toFixed(2)),
        },
        vencimento: calcularVencimento(competencia, 20),
        status: 'pendente',
        canal: 'API_CAIXA',
        protocolo: `GFD-${Date.now()}`
      });
      
      // Integrar log de comunicação (Simulação API Caixa)
      await supabase.from('integracao_logs').insert({
        servico: 'fgts_digital',
        operacao: 'gerar_guia_gfd',
        status_code: 200,
        payload_envio: { competencia, empresaId, total_valor: totalFGTS },
        payload_retorno: { success: true, url_pdf: 'https://fgts.gov.br/guia_simulada.pdf' },
        duracao_ms: 1200
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        competencia,
        totalColaboradores,
        totalFolhaBruta: Number(totalSalarios.toFixed(2)),
        guias,
        geradoEm: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    captureException(error, { fn: 'gerar-guias' });
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

function calcularVencimento(competencia: string, dia: number): string {
  const [ano, mes] = competencia.split('-').map(Number);
  let vencMes = mes + 1;
  let vencAno = ano;
  if (vencMes > 12) { vencMes = 1; vencAno++; }
  return `${vencAno}-${String(vencMes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}
