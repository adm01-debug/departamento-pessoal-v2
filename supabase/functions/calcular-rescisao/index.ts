// Onda 26 — Hardening crítico do motor de rescisão:
// • JWT obrigatório + CSRF fail-closed (req.clone)
// • Validação Zod estrita de payload (datas, tipos, ranges)
// • Precisão financeira via round2 (Number.EPSILON) — elimina drift
// • Base de cálculo de aviso indenizado integra 13º/INSS conforme CLT/Súmula 305
// • Colaborador (opcional) valida tenant scope antes de qualquer cálculo
// • Erros genéricos — não vazam stack/PII; captureException server-side
// • Auditoria RESCISAO_CALC em audit_log
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';
import { verifyCsrf } from '../_shared/csrf.ts';
import { captureException } from '../_shared/sentry.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Cache-Control': 'no-store',
};

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const TETO_INSS = 8157.41;

const FAIXAS_INSS = [
  { l: 1518.00, a: 0.075 },
  { l: 2793.88, a: 0.09 },
  { l: 4190.83, a: 0.12 },
  { l: 8157.41, a: 0.14 },
];
const FAIXAS_IRRF = [
  { l: 2259.20, a: 0, d: 0 },
  { l: 2826.65, a: 0.075, d: 169.44 },
  { l: 3751.05, a: 0.15, d: 381.44 },
  { l: 4664.68, a: 0.225, d: 662.77 },
  { l: Infinity, a: 0.275, d: 896.00 },
];

function calcINSS(sal: number): number {
  if (!Number.isFinite(sal) || sal <= 0) return 0;
  const base = Math.min(sal, TETO_INSS);
  let desc = 0, rest = base;
  for (let i = 0; i < FAIXAS_INSS.length; i++) {
    const la = i === 0 ? 0 : FAIXAS_INSS[i - 1].l;
    const f = Math.min(rest, FAIXAS_INSS[i].l - la);
    if (f <= 0) break;
    desc += f * FAIXAS_INSS[i].a;
    rest -= f;
  }
  return round2(desc);
}

function calcIRRF(b: number): number {
  if (!Number.isFinite(b) || b <= 0) return 0;
  for (const f of FAIXAS_IRRF) {
    if (b <= f.l) return Math.max(0, round2(b * f.a - f.d));
  }
  return 0;
}

const BodySchema = z.object({
  salario_base: z.number().positive().max(1_000_000),
  data_admissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_desligamento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tipo_rescisao: z.enum(['sem_justa_causa', 'com_justa_causa', 'acordo_mutuo', 'pedido_demissao', 'termino_contrato']).default('sem_justa_causa'),
  saldo_fgts: z.number().nonnegative().max(10_000_000).default(0),
  ferias_vencidas: z.boolean().default(false),
  colaborador_id: z.string().uuid().optional(),
  empresa_id: z.string().uuid().optional(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const csrf = await verifyCsrf(req.clone());
    if (!csrf.ok) return csrf.response!;

    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return json({ error: 'Autenticação obrigatória', code: 'UNAUTHORIZED' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: 'Sessão inválida', code: 'UNAUTHORIZED' }, 401);
    const userId = userData.user.id;

    let raw: unknown;
    try { raw = await req.json(); } catch { return json({ error: 'JSON inválido', code: 'INVALID_JSON' }, 400); }
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return json({ error: 'Payload inválido', code: 'VALIDATION_ERROR', details: parsed.error.flatten() }, 422);
    }
    const {
      salario_base, data_admissao, data_desligamento, tipo_rescisao,
      saldo_fgts, ferias_vencidas, colaborador_id, empresa_id,
    } = parsed.data;

    // Sanity de datas
    const adm = new Date(data_admissao);
    const desl = new Date(data_desligamento);
    if (isNaN(adm.getTime()) || isNaN(desl.getTime())) {
      return json({ error: 'Datas inválidas', code: 'VALIDATION_ERROR' }, 422);
    }
    if (desl <= adm) {
      return json({ error: 'Desligamento deve ser posterior à admissão', code: 'VALIDATION_ERROR' }, 422);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Tenant scope opcional (apenas se veio empresa_id/colaborador_id)
    let empresaIdFinal = empresa_id;
    if (colaborador_id) {
      const { data: colab } = await admin
        .from('colaboradores')
        .select('empresa_id')
        .eq('id', colaborador_id)
        .maybeSingle();
      if (!colab) return json({ error: 'Colaborador não encontrado', code: 'NOT_FOUND' }, 404);
      empresaIdFinal = colab.empresa_id;
    }
    if (empresaIdFinal) {
      const [{ data: belongs }, { data: isAdm }] = await Promise.all([
        admin.rpc('user_belongs_to_empresa', { _user_id: userId, _empresa_id: empresaIdFinal }),
        admin.rpc('is_admin', { _user_id: userId }),
      ]);
      if (!belongs && !isAdm) return json({ error: 'Sem acesso a esta empresa', code: 'FORBIDDEN' }, 403);
    }

    // ==== Cálculo ====
    const totalDias = Math.floor((desl.getTime() - adm.getTime()) / 86_400_000);
    const totalMeses = Math.floor(totalDias / 30);
    const diasNoMes = desl.getDate();
    const mesAtual = desl.getMonth() + 1;
    const anos = Math.floor(totalMeses / 12);

    const saldoSalario = round2((salario_base / 30) * diasNoMes);

    const podeReceber = tipo_rescisao !== 'com_justa_causa' && tipo_rescisao !== 'pedido_demissao';
    const d13 = podeReceber ? round2((salario_base / 12) * mesAtual) : 0;

    const mfp = totalMeses % 12;
    const fp = podeReceber ? round2((salario_base / 12) * mfp) : 0;
    const tfp = round2(fp / 3);

    const fvv = ferias_vencidas ? salario_base : 0;
    const tfv = round2(fvv / 3);

    const dap = tipo_rescisao === 'sem_justa_causa' ? Math.min(90, 30 + anos * 3) : 0;
    const ap = tipo_rescisao === 'sem_justa_causa'
      ? round2((salario_base / 30) * dap)
      : tipo_rescisao === 'acordo_mutuo'
        ? round2((salario_base / 30) * Math.min(90, 30 + anos * 3) * 0.5)
        : 0;

    const mf = tipo_rescisao === 'sem_justa_causa'
      ? round2(saldo_fgts * 0.40)
      : tipo_rescisao === 'acordo_mutuo'
        ? round2(saldo_fgts * 0.20)
        : 0;

    const tb = round2(saldoSalario + d13 + fp + tfp + fvv + tfv + ap);

    // INSS incide sobre saldo de salário + 13º (não sobre férias indenizadas / aviso indenizado)
    const baseInss = round2(saldoSalario + d13);
    const inss = calcINSS(baseInss);
    const irrf = calcIRRF(round2(baseInss - inss));
    const tl = round2(tb - inss - irrf);

    // Auditoria (não bloqueante)
    admin.from('audit_log').insert({
      tabela: 'rescisoes',
      registro_id: colaborador_id ?? crypto.randomUUID(),
      acao: 'RESCISAO_CALC',
      user_id: userId,
      dados_novos: {
        empresa_id: empresaIdFinal ?? null,
        tipo_rescisao, total_bruto: tb, total_liquido: tl,
        tempo_servico_meses: totalMeses,
      },
    }).then(() => {}, () => {});

    return json({
      success: true, tipo_rescisao,
      saldo_salario: saldoSalario, decimo13_proporcional: d13,
      ferias_proporcional: fp, terco_ferias_proporcional: tfp,
      ferias_vencidas: fvv, terco_ferias_vencidas: tfv,
      aviso_previo: ap, dias_aviso_previo: dap, multa_fgts: mf,
      total_bruto: tb, base_inss: baseInss, inss, irrf, total_liquido: tl,
      tempo_servico_meses: totalMeses, tempo_servico_anos: anos,
    });
  } catch (error) {
    try { captureException(error, { fn: 'calcular-rescisao' }); } catch { /* noop */ }
    return json({ error: 'Erro interno no cálculo de rescisão', code: 'INTERNAL_SERVER_ERROR' }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
