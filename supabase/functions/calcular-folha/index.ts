// Onda 25 — Hardening crítico do motor de folha:
// • JWT obrigatório + CSRF fail-closed
// • Tenant scope estrito (user_belongs_to_empresa + is_admin fallback)
// • Bloqueio de recálculo de folha FECHADA
// • Chunking (batches de 500 colaboradores) para evitar OOM
// • Precisão financeira via helper round2 + banker-safe
// • Auditoria PAYROLL_CALC em audit_log
// • Sem vazamento de PII em erros; captureException em falhas
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { calcularFolhaSchema } from '../_shared/schemas/common.ts';
import { verifyCsrf } from '../_shared/csrf.ts';
import { captureException } from '../_shared/sentry.ts';
import { beginIdempotency, completeIdempotency, failIdempotency, extractIdempotencyKey } from '../_shared/idempotency.ts';


const FAIXAS_INSS = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 4190.83, aliquota: 0.12 },
  { limite: 8157.41, aliquota: 0.14 },
];

const FAIXAS_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

const TETO_INSS = 8157.41;
const CHUNK_SIZE = 500;
const MAX_COLABORADORES = 50_000;

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

function calcINSS(salario: number): number {
  if (!Number.isFinite(salario) || salario <= 0) return 0;
  let desc = 0;
  const baseCalculo = Math.min(salario, TETO_INSS);
  let rest = baseCalculo;
  for (let i = 0; i < FAIXAS_INSS.length; i++) {
    const limAnt = i === 0 ? 0 : FAIXAS_INSS[i - 1].limite;
    const f = Math.min(rest, FAIXAS_INSS[i].limite - limAnt);
    if (f <= 0) break;
    desc += f * FAIXAS_INSS[i].aliquota;
    rest -= f;
  }
  return round2(desc);
}

function calcIRRF(base: number): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  for (const f of FAIXAS_IRRF) {
    if (base <= f.limite) return Math.max(0, round2(base * f.aliquota - f.deducao));
  }
  return 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  let idempotencyId: string | undefined;
  let admin: ReturnType<typeof createClient> | undefined;

  try {
    const csrf = await verifyCsrf(req.clone());
    if (!csrf.ok) return csrf.response!;

    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return createErrorResponse('Autenticação obrigatória', 401, 'UNAUTHORIZED');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return createErrorResponse('Sessão inválida', 401, 'UNAUTHORIZED');
    const userId = userData.user.id;

    const idempotencyKey = extractIdempotencyKey(req);

    const { data, errorResponse } = await validateRequest(req, calcularFolhaSchema);
    if (errorResponse) return errorResponse;
    const { empresa_id, competencia } = data!;

    admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Tenant scope (antes de qualquer efeito colateral / idempotência)
    const [{ data: belongs }, { data: isAdm }] = await Promise.all([
      admin.rpc('user_belongs_to_empresa', { _user_id: userId, _empresa_id: empresa_id }),
      admin.rpc('is_admin', { _user_id: userId }),
    ]);
    if (!belongs && !isAdm) return createErrorResponse('Sem acesso a esta empresa', 403, 'FORBIDDEN');

    // Idempotência — Onda 41
    // Payload canonicalizado (empresa_id + competencia + userId) evita replay cruzado entre usuários.
    const idem = await beginIdempotency(admin, {
      endpoint: 'calcular-folha',
      key: idempotencyKey,
      requestBody: { empresa_id, competencia, user_id: userId },
      empresaId: empresa_id,
      userId,
    });
    if (idem.replay) return idem.replay;
    if (idem.conflict) return idem.conflict;
    idempotencyId = idem.id;

    // Bloqueia recálculo de folha em estados terminais (fechada / aprovada / transmitida ao eSocial).
    // Estes estados representam consolidação contábil ou envio externo — qualquer recálculo
    // exigiria reabrir a folha via fluxo auditado (`reabrir-folha`).
    const BLOCKED_STATUSES = new Set(['fechada', 'aprovada', 'transmitida', 'homologada']);
    const { data: folhaExistente } = await admin
      .from('folhas_pagamento')
      .select('id, status, version, esocial_status')
      .eq('empresa_id', empresa_id)
      .eq('competencia', competencia)
      .maybeSingle();

    if (folhaExistente && BLOCKED_STATUSES.has(String(folhaExistente.status))) {
      // Auditoria bloqueante (best-effort) — registra tentativa negada de recálculo.
      try {
        await admin.from('audit_log').insert({
          tabela: 'folhas_pagamento',
          registro_id: folhaExistente.id,
          acao: 'PAYROLL_CALC_BLOCKED',
          user_id: userId,
          dados_novos: {
            empresa_id,
            competencia,
            status_atual: folhaExistente.status,
            esocial_status: folhaExistente.esocial_status ?? null,
            version: folhaExistente.version ?? null,
            idempotency_id: idempotencyId ?? null,
            reason: 'PAYROLL_LOCKED',
          },
        });
      } catch { /* auditoria não-bloqueante para o retorno de erro */ }

      await failIdempotency(admin, idempotencyId);
      return new Response(
        JSON.stringify({
          error: `Folha em estado '${folhaExistente.status}' — recálculo bloqueado. Reabra a folha antes de recalcular.`,
          code: 'PAYROLL_LOCKED',
          folha_id: folhaExistente.id,
          status_atual: folhaExistente.status,
          competencia,
          reabrir_endpoint: 'reabrir-folha',
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }


    // Contagem prévia p/ hard-cap
    const { count: totalColabs } = await admin
      .from('colaboradores')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', empresa_id)
      .eq('status', 'ativo');

    if (!totalColabs) {
      await failIdempotency(admin, idempotencyId);
      return createErrorResponse('Nenhum colaborador ativo', 404, 'NOT_FOUND');
    }
    if (totalColabs > MAX_COLABORADORES) {
      await failIdempotency(admin, idempotencyId);
      return createErrorResponse(`Limite excedido (${MAX_COLABORADORES})`, 413, 'PAYLOAD_TOO_LARGE');
    }

    // Chunked fetch
    const itens: Array<Record<string, unknown>> = [];
    const totais = { bruto: 0, descontos: 0, liquido: 0, fgts: 0, inss: 0, irrf: 0 };

    for (let offset = 0; offset < totalColabs; offset += CHUNK_SIZE) {
      const { data: colabs, error: e } = await admin
        .from('colaboradores')
        .select('id, nome_completo, salario_base, cargo, departamento')
        .eq('empresa_id', empresa_id)
        .eq('status', 'ativo')
        .range(offset, offset + CHUNK_SIZE - 1);
      if (e) throw e;
      if (!colabs?.length) break;

      for (const c of colabs) {
        const bruto = Number(c.salario_base) || 0;
        const inss = calcINSS(bruto);
        const irrf = calcIRRF(bruto - inss);
        const fgts = round2(bruto * 0.08);
        const descontos = round2(inss + irrf);
        const liquido = round2(bruto - descontos);

        itens.push({
          colaborador_id: c.id,
          nome: c.nome_completo,
          cargo: c.cargo,
          salario_bruto: bruto,
          inss, irrf, fgts,
          total_descontos: descontos,
          salario_liquido: liquido,
        });

        totais.bruto = round2(totais.bruto + bruto);
        totais.descontos = round2(totais.descontos + descontos);
        totais.liquido = round2(totais.liquido + liquido);
        totais.fgts = round2(totais.fgts + fgts);
        totais.inss = round2(totais.inss + inss);
        totais.irrf = round2(totais.irrf + irrf);
      }
    }

    const { data: upserted, error: upErr } = await admin
      .from('folhas_pagamento')
      .upsert({
        empresa_id, competencia, status: 'calculada',
        total_bruto: totais.bruto,
        total_descontos: totais.descontos,
        total_liquido: totais.liquido,
        total_colaboradores: totalColabs,
        data_calculo: new Date().toISOString(),
      }, { onConflict: 'empresa_id,competencia' })
      .select('id')
      .single();
    if (upErr) throw upErr;

    // Auditoria
    await admin.from('audit_log').insert({
      tabela: 'folhas_pagamento',
      registro_id: upserted?.id ?? crypto.randomUUID(),
      acao: 'PAYROLL_CALC',
      user_id: userId,
      dados_novos: {
        empresa_id, competencia,
        total_colaboradores: totalColabs,
        idempotency_id: idempotencyId ?? null,
        ...Object.fromEntries(Object.entries(totais).map(([k, v]) => [`total_${k}`, v])),
      },
    });

    const responseBody = {
      success: true,
      folha_id: upserted?.id,
      competencia,
      total_colaboradores: totalColabs,
      ...Object.fromEntries(Object.entries(totais).map(([k, v]) => [`total_${k}`, v])),
      itens,
    };

    await completeIdempotency(admin, idempotencyId, 200, responseBody);

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    try { captureException(error, { fn: 'calcular-folha' }); } catch { /* noop */ }
    if (admin && idempotencyId) {
      try { await failIdempotency(admin, idempotencyId); } catch { /* noop */ }
    }
    return createErrorResponse('Erro interno no cálculo de folha', 500, 'INTERNAL_SERVER_ERROR');
  }
});

