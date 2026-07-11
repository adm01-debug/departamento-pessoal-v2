import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createErrorResponse, validateRequest } from '../_shared/contract.ts';
import { notificacaoSchema } from '../_shared/schemas/common.ts';
import { verifyCsrf } from '../_shared/csrf.ts';
import { captureException } from '../_shared/sentry.ts';

// Onda 22: hardening — auth JWT, CSRF, tenant scope, audit log e limites anti-abuso.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const MAX_DESTINATARIOS = 500;

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1) CSRF fail-closed
    const csrf = await verifyCsrf(req.clone());
    if (!csrf.ok) return csrf.response!;

    // 2) Auth JWT
    const authHeader = req.headers.get('Authorization') ?? '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!jwt) return createErrorResponse('Não autenticado', 401, 'UNAUTHORIZED');

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return createErrorResponse('Sessão inválida', 401, 'UNAUTHORIZED');
    }
    const user = userData.user;

    // 3) Validação
    const { data, errorResponse } = await validateRequest(req, notificacaoSchema);
    if (errorResponse) return errorResponse;
    const { action, empresaId, tipo, destinatarios, assunto, conteudo } = data!;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 4) Tenant scope se empresaId informado
    if (empresaId) {
      const { data: belongs } = await admin.rpc('user_belongs_to_empresa', {
        _user_id: user.id,
        _empresa_id: empresaId,
      });
      const { data: isAdmin } = belongs
        ? { data: true }
        : await admin.rpc('is_admin', { _user_id: user.id });
      if (!belongs && !isAdmin) {
        return createErrorResponse('Sem acesso a esta empresa', 403, 'FORBIDDEN');
      }
    }

    switch (action) {
      case 'enviar': {
        if (!destinatarios || destinatarios.length === 0) {
          return createErrorResponse('Destinatários são obrigatórios', 422, 'VALIDATION_ERROR');
        }
        if (destinatarios.length > MAX_DESTINATARIOS) {
          return createErrorResponse(
            `Máximo de ${MAX_DESTINATARIOS} destinatários por chamada`,
            422, 'PAYLOAD_TOO_LARGE',
          );
        }

        // Sanitização mínima de tamanho (evita abuso)
        const safeAssunto = (assunto ?? 'Notificação').slice(0, 200);
        const safeConteudo = (conteudo ?? '').slice(0, 5000);

        let enviadas = 0;
        for (const dest of destinatarios) {
          const { data: notif, error: notifErr } = await admin
            .from('notificacoes')
            .insert({
              user_id: dest.user_id,
              empresa_id: empresaId ?? null,
              tipo: tipo ?? 'info',
              titulo: safeAssunto,
              mensagem: safeConteudo,
              lida: false,
            })
            .select('id')
            .single();

          if (notifErr) {
            console.warn('notificacao insert falhou:', notifErr.message);
            continue;
          }

          await admin.from('fila_notificacoes').insert([
            {
              user_id: dest.user_id,
              tipo: 'email',
              titulo: safeAssunto,
              conteudo: safeConteudo,
              metadados: { notification_id: notif.id, empresa_id: empresaId ?? null },
            },
            {
              user_id: dest.user_id,
              tipo: 'push',
              titulo: safeAssunto,
              conteudo: safeConteudo,
              metadados: { notification_id: notif.id, empresa_id: empresaId ?? null },
            },
          ]);
          enviadas++;
        }

        // Audit
        await admin.from('audit_log').insert({
          user_id: user.id,
          empresa_id: empresaId ?? null,
          acao: 'SEND_NOTIFICATION',
          entidade: 'notificacao',
          dados_novos: { tipo, assunto: safeAssunto, total: enviadas },
        });

        return new Response(JSON.stringify({ success: true, enviadas }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'listar': {
        // Escopo obrigatório: usuário só vê suas notificações OU as de sua empresa
        let q = admin
          .from('notificacoes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (empresaId) {
          q = q.eq('empresa_id', empresaId);
        } else {
          q = q.eq('user_id', user.id);
        }
        const { data: list, error } = await q;
        if (error) throw error;
        return new Response(JSON.stringify({ notificacoes: list }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return createErrorResponse('Ação inválida', 400, 'INVALID_ACTION');
    }
  } catch (err) {
    await captureException(err, { function: 'notificacao' });
    return createErrorResponse('Erro interno', 500, 'INTERNAL_SERVER_ERROR');
  }
});
