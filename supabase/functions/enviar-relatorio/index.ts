import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Whitelist de relatórios permitidos. Qualquer valor fora daqui é recusado
// para evitar exfiltração arbitrária via este endpoint.
const RELATORIOS_PERMITIDOS = new Set([
  "lista_colaboradores",
  "folha_resumo",
  "ferias_proximas",
  "afastamentos_ativos",
  "indicadores_dp",
]);

const FORMATOS_PERMITIDOS = new Set(["json", "csv"]);
const BUCKET = "relatorios-privados";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24; // 24h

interface EnviarRelatorioRequest {
  agendamentoId?: string;
  tipoRelatorio: string;
  formato: string;
  emailDestinatario: string;
  parametros?: Record<string, unknown>;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function coletarDados(
  supabase: ReturnType<typeof createClient>,
  tipo: string,
  parametros?: Record<string, unknown>,
): Promise<{ dados: unknown; totalRegistros: number }> {
  switch (tipo) {
    case "lista_colaboradores": {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("id,nome_completo,email,status,cargo_id,departamento_id")
        .eq("status", "ativo");
      if (error) throw error;
      return { dados: data ?? [], totalRegistros: data?.length ?? 0 };
    }
    case "folha_resumo": {
      const competencia =
        (parametros?.competencia as string | undefined) ??
        new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase
        .from("folhas_pagamento")
        .select("id,competencia,total_liquido,total_proventos,total_descontos,status")
        .eq("competencia", competencia)
        .maybeSingle();
      if (error) throw error;
      return { dados: data, totalRegistros: data ? 1 : 0 };
    }
    case "ferias_proximas": {
      const inicio = new Date();
      const fim = new Date();
      fim.setDate(fim.getDate() + 30);
      const { data, error } = await supabase
        .from("ferias")
        .select("id,colaborador_id,data_inicio,data_fim,status")
        .gte("data_inicio", inicio.toISOString())
        .lte("data_inicio", fim.toISOString());
      if (error) throw error;
      return { dados: data ?? [], totalRegistros: data?.length ?? 0 };
    }
    case "afastamentos_ativos": {
      const { data, error } = await supabase
        .from("afastamentos")
        .select("id,colaborador_id,tipo,data_inicio,data_fim,status")
        .eq("status", "ativo");
      if (error) throw error;
      return { dados: data ?? [], totalRegistros: data?.length ?? 0 };
    }
    case "indicadores_dp": {
      const { count: ativos } = await supabase
        .from("colaboradores")
        .select("id", { count: "exact", head: true })
        .eq("status", "ativo");
      const { count: afastados } = await supabase
        .from("colaboradores")
        .select("id", { count: "exact", head: true })
        .eq("status", "afastado");
      return {
        dados: { total_ativos: ativos ?? 0, total_afastados: afastados ?? 0 },
        totalRegistros: 2,
      };
    }
    default:
      throw new Error(`Tipo de relatório não suportado: ${tipo}`);
  }
}

function toCsv(dados: unknown): string {
  const arr = Array.isArray(dados) ? dados : [dados];
  if (arr.length === 0 || !arr[0] || typeof arr[0] !== "object") return "";
  const headers = Object.keys(arr[0] as Record<string, unknown>);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...arr.map((r) =>
      headers.map((h) => escape((r as Record<string, unknown>)[h])).join(","),
    ),
  ].join("\n");
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = (await req.json()) as EnviarRelatorioRequest;
    const { agendamentoId, tipoRelatorio, formato, emailDestinatario, parametros } = body;

    // Validações de input (fail-closed).
    if (!tipoRelatorio || !RELATORIOS_PERMITIDOS.has(tipoRelatorio)) {
      return new Response(
        JSON.stringify({ error: "tipoRelatorio inválido ou não permitido" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }
    if (!formato || !FORMATOS_PERMITIDOS.has(formato)) {
      return new Response(
        JSON.stringify({ error: "formato inválido (use json ou csv)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }
    if (!emailDestinatario || !isEmail(emailDestinatario)) {
      return new Response(
        JSON.stringify({ error: "emailDestinatario inválido" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // 1. Coletar dados só das colunas necessárias (sem CPF, salário, etc).
    const { dados, totalRegistros } = await coletarDados(supabase, tipoRelatorio, parametros);

    // 2. Serializar e subir para bucket PRIVADO.
    const conteudo = formato === "csv" ? toCsv(dados) : JSON.stringify(dados, null, 2);
    const path = `${tipoRelatorio}/${crypto.randomUUID()}.${formato}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, new Blob([conteudo], { type: formato === "csv" ? "text/csv" : "application/json" }), {
        upsert: false,
      });
    if (upErr) throw new Error(`Falha ao subir relatório: ${upErr.message}`);

    // 3. Gerar signed URL de curta duração.
    const { data: signed, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
    if (signErr || !signed?.signedUrl) {
      throw new Error(`Falha ao gerar signed URL: ${signErr?.message}`);
    }

    // 4. E-mail com METADADOS APENAS — sem dump do conteúdo (LGPD).
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let statusEnvio: "sucesso" | "erro" | "simulado" = "simulado";
    let mensagemEnvio = "Envio simulado (RESEND_API_KEY não configurada)";

    if (resendApiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Sistema DP <onboarding@resend.dev>",
            to: [emailDestinatario],
            subject: `Relatório: ${tipoRelatorio} — ${new Date().toLocaleDateString("pt-BR")}`,
            html: `
              <h1>Relatório disponível</h1>
              <p><strong>Tipo:</strong> ${tipoRelatorio}</p>
              <p><strong>Formato:</strong> ${formato}</p>
              <p><strong>Total de registros:</strong> ${totalRegistros}</p>
              <p><strong>Gerado em:</strong> ${new Date().toLocaleString("pt-BR")}</p>
              <p><strong>Validade do link:</strong> 24 horas</p>
              <p>
                <a href="${signed.signedUrl}"
                   style="background:#84cc16;color:#111;padding:10px 16px;border-radius:6px;text-decoration:none;">
                  Baixar relatório
                </a>
              </p>
              <p style="color:#666;font-size:12px;">
                Este e-mail contém apenas metadados. Os dados sensíveis estão protegidos
                por link assinado e requerem acesso autorizado.
              </p>
            `,
          }),
        });
        if (!res.ok) throw new Error(`Resend API: ${res.status}`);
        statusEnvio = "sucesso";
        mensagemEnvio = "Email com link assinado enviado";
      } catch (e) {
        statusEnvio = "erro";
        mensagemEnvio = e instanceof Error ? e.message : "erro desconhecido no envio";
        console.error("Erro Resend:", mensagemEnvio);
      }
    }

    if (agendamentoId) {
      await supabase.from("log_envio_relatorios").insert({
        agendamento_id: agendamentoId,
        status: statusEnvio,
        mensagem: mensagemEnvio,
      });
      await supabase
        .from("relatorios_agendados")
        .update({ ultimo_envio: new Date().toISOString() })
        .eq("id", agendamentoId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: statusEnvio,
        mensagem: mensagemEnvio,
        metadados: {
          tipo: tipoRelatorio,
          formato,
          totalRegistros,
          expiresInSeconds: SIGNED_URL_TTL_SECONDS,
          path,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro enviar-relatorio:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
