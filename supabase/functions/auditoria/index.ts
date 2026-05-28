import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateRequest, corsHeaders, createErrorResponse } from '../_shared/contract.ts';
import { auditoriaSchema } from '../_shared/schemas/common.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { data: reqData, errorResponse } = await validateRequest(req, auditoriaSchema);
  if (errorResponse) return errorResponse;

  const { action, empresaId, data } = reqData!;

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    switch (action) {
      case 'registrar': {
        if (!data) return createErrorResponse('Dados são obrigatórios para registrar auditoria', 422, 'VALIDATION_ERROR');
        const { error } = await supabase.from('auditoria').insert({
          acao: data.acao, entidade: data.entidade, entidade_id: data.entidade_id,
          usuario_id: data.usuario_id, usuario_nome: data.usuario_nome, empresa_id: empresaId,
          descricao: data.descricao, dados_anteriores: data.dados_anteriores || null,
          dados_novos: data.dados_novos || null,
          ip_address: data.ip_address || req.headers.get('x-forwarded-for') || null,
        });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'listar': {
        let q = supabase.from('auditoria').select('*').order('created_at', { ascending: false }).limit(100);
        if (empresaId) q = q.eq('empresa_id', empresaId);
        if (data?.entidade) q = q.eq('entidade', data.entidade);
        if (data?.data_inicio) q = q.gte('created_at', data.data_inicio);
        if (data?.data_fim) q = q.lte('created_at', data.data_fim);
        const { data: logs, error } = await q;
        if (error) throw error;
        return new Response(JSON.stringify({ logs }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'resumo': {
        const { data: resLogs, error } = await supabase.from('auditoria').select('acao, entidade').eq('empresa_id', empresaId || '');
        if (error) throw error;
        const acoes: Record<string, number> = {};
        (resLogs || []).forEach((l: any) => { acoes[l.acao] = (acoes[l.acao] || 0) + 1; });
        return new Response(JSON.stringify({ total: resLogs?.length || 0, acoes }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      default:
        return createErrorResponse('Ação inválida', 400, 'INVALID_ACTION');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(message, 500, 'INTERNAL_SERVER_ERROR');
  }
});
