import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY não configurada');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const hoje = new Date();
    const em7dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const em30dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const hojeStr = hoje.toISOString().split('T')[0];

    const alertas: { tipo: string; mensagem: string; urgencia: string; detalhes: any[] }[] = [];

    // 1. ASOs vencendo em 7 dias
    const { data: asosVencendo } = await supabase
      .from('asos')
      .select('*, colaborador:colaboradores(nome_completo, email)')
      .lte('data_validade', em7dias)
      .gte('data_validade', hojeStr);

    if (asosVencendo?.length) {
      alertas.push({
        tipo: '🏥 ASOs Vencendo',
        mensagem: `${asosVencendo.length} ASO(s) vencem nos próximos 7 dias`,
        urgencia: 'alta',
        detalhes: asosVencendo.map((a: any) => ({
          colaborador: a.colaborador?.nome_completo,
          tipo: a.tipo,
          validade: a.data_validade,
        })),
      });
    }

    // 2. ASOs já vencidos
    const { data: asosVencidos } = await supabase
      .from('asos')
      .select('*, colaborador:colaboradores(nome_completo)')
      .lt('data_validade', hojeStr);

    if (asosVencidos?.length) {
      alertas.push({
        tipo: '⚠️ ASOs Vencidos',
        mensagem: `${asosVencidos.length} ASO(s) estão vencidos!`,
        urgencia: 'critica',
        detalhes: asosVencidos.map((a: any) => ({
          colaborador: a.colaborador?.nome_completo,
          tipo: a.tipo,
          vencido_desde: a.data_validade,
        })),
      });
    }

    // 3. Férias vencendo em 30 dias (colaboradores com mais de 12 meses sem férias)
    const { data: colabAtivos } = await supabase
      .from('colaboradores')
      .select('id, nome_completo, data_admissao, email')
      .eq('status', 'ativo');

    const feriasVencendo = (colabAtivos || []).filter((c: any) => {
      if (!c.data_admissao) return false;
      const admissao = new Date(c.data_admissao);
      const mesesTrabalhados = (hoje.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return mesesTrabalhados >= 11 && mesesTrabalhados <= 12;
    });

    if (feriasVencendo.length) {
      alertas.push({
        tipo: '🏖️ Férias Próximas',
        mensagem: `${feriasVencendo.length} colaborador(es) completam período aquisitivo em breve`,
        urgencia: 'media',
        detalhes: feriasVencendo.map((c: any) => ({
          colaborador: c.nome_completo,
          admissao: c.data_admissao,
        })),
      });
    }

    // 4. Aniversariantes da semana
    const aniversariantes = (colabAtivos || []).filter((c: any) => {
      if (!c.data_admissao) return false;
      // Check birth date would require data_nascimento
      return false;
    });

    // 5. Contratos de experiência vencendo
    const em90dias = new Date(hoje.getTime() - 90 * 24 * 60 * 60 * 1000);
    const em83dias = new Date(hoje.getTime() - 83 * 24 * 60 * 60 * 1000);
    const contratosVencendo = (colabAtivos || []).filter((c: any) => {
      if (!c.data_admissao) return false;
      const admDate = new Date(c.data_admissao);
      return admDate >= em90dias && admDate <= em83dias;
    });

    if (contratosVencendo.length) {
      alertas.push({
        tipo: '📋 Contratos de Experiência',
        mensagem: `${contratosVencendo.length} contrato(s) de experiência vencem em breve`,
        urgencia: 'alta',
        detalhes: contratosVencendo.map((c: any) => ({
          colaborador: c.nome_completo,
          admissao: c.data_admissao,
        })),
      });
    }

    if (alertas.length === 0) {
      return new Response(JSON.stringify({ message: 'Nenhum alerta pendente', alertas: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build email HTML
    const alertasHTML = alertas.map(a => `
      <div style="margin-bottom:20px;padding:16px;border-radius:12px;border:1px solid ${a.urgencia === 'critica' ? '#ef4444' : a.urgencia === 'alta' ? '#f59e0b' : '#3b82f6'};background:${a.urgencia === 'critica' ? '#fef2f2' : a.urgencia === 'alta' ? '#fffbeb' : '#eff6ff'}">
        <h3 style="margin:0 0 8px;font-size:16px;color:#1f2937">${a.tipo}</h3>
        <p style="margin:0 0 12px;color:#6b7280;font-size:14px">${a.mensagem}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          ${a.detalhes.slice(0, 10).map(d => `
            <tr style="border-bottom:1px solid #e5e7eb">
              ${Object.values(d).map(v => `<td style="padding:6px 8px;color:#374151">${v || '—'}</td>`).join('')}
            </tr>
          `).join('')}
        </table>
        ${a.detalhes.length > 10 ? `<p style="color:#9ca3af;font-size:12px;margin-top:8px">+${a.detalhes.length - 10} mais</p>` : ''}
      </div>
    `).join('');

    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:system-ui,-apple-system,sans-serif">
        <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:24px;border-radius:16px 16px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">📊 Alertas do Departamento Pessoal</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px">${hoje.toLocaleDateString('pt-BR')} · ${alertas.length} alerta(s) ativo(s)</p>
        </div>
        <div style="padding:24px;background:#ffffff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 16px 16px">
          ${alertasHTML}
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center">
            <p style="color:#9ca3af;font-size:12px">Sistema de Departamento Pessoal · Alertas automáticos</p>
          </div>
        </div>
      </div>
    `;

    // Get admin emails from profiles
    const { data: admins } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    let recipientEmails: string[] = [];
    if (admins?.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email, user_id')
        .in('user_id', admins.map((a: any) => a.user_id));
      recipientEmails = (profiles || []).map((p: any) => p.email).filter(Boolean);
    }

    // Fallback: get from request body
    if (!recipientEmails.length) {
      try {
        const body = await req.json();
        if (body.email) recipientEmails = [body.email];
      } catch {}
    }

    if (!recipientEmails.length) {
      return new Response(JSON.stringify({ message: 'Alertas gerados mas sem destinatários configurados', alertas }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'DP Alertas <onboarding@resend.dev>',
        to: recipientEmails,
        subject: `⚡ ${alertas.length} Alerta(s) DP - ${hoje.toLocaleDateString('pt-BR')}`,
        html,
      }),
    });

    const emailResult = await emailRes.json();

    // Log alertas as notificações
    for (const alerta of alertas) {
      await supabase.from('notificacoes').insert({
        titulo: alerta.tipo,
        mensagem: alerta.mensagem,
        tipo: alerta.urgencia === 'critica' ? 'erro' : alerta.urgencia === 'alta' ? 'aviso' : 'info',
      }).catch(() => {});
    }

    return new Response(JSON.stringify({
      success: true,
      alertas_enviados: alertas.length,
      destinatarios: recipientEmails.length,
      email_result: emailResult,
      alertas,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
