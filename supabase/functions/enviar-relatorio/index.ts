import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnviarRelatorioRequest {
  agendamentoId?: string;
  tipoRelatorio: string;
  formato: string;
  emailDestinatario: string;
  parametros?: Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { agendamentoId, tipoRelatorio, formato, emailDestinatario, parametros }: EnviarRelatorioRequest = await req.json();

    console.log(`Processando relatório: ${tipoRelatorio} para ${emailDestinatario}`);

    // Buscar dados do relatório baseado no tipo
    let dadosRelatorio: Record<string, unknown> = {};
    
    switch (tipoRelatorio) {
      case "lista_colaboradores":
        const { data: colaboradores } = await supabase
          .from("colaboradores")
          .select("*")
          .eq("status", "ativo");
        dadosRelatorio = { colaboradores, total: colaboradores?.length || 0 };
        break;
        
      case "folha_resumo":
        const competencia = parametros?.competencia || new Date().toISOString().slice(0, 7);
        const { data: folha } = await supabase
          .from("folhas_pagamento")
          .select("*")
          .eq("competencia", competencia)
          .single();
        dadosRelatorio = { folha };
        break;
        
      case "ferias_proximas":
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + 30);
        const { data: ferias } = await supabase
          .from("ferias")
          .select("*, colaboradores(nome_completo)")
          .gte("data_inicio", new Date().toISOString())
          .lte("data_inicio", dataLimite.toISOString());
        dadosRelatorio = { ferias, total: ferias?.length || 0 };
        break;
        
      case "afastamentos_ativos":
        const { data: afastamentos } = await supabase
          .from("afastamentos")
          .select("*, colaboradores(nome_completo)")
          .eq("status", "ativo");
        dadosRelatorio = { afastamentos, total: afastamentos?.length || 0 };
        break;
        
      case "indicadores_dp": {
        const { count: totalColaboradores, error: totalColaboradoresError } = await supabase
          .from("colaboradores")
          .select("id", { count: "exact", head: true })
          .eq("status", "ativo");

        if (totalColaboradoresError) throw totalColaboradoresError;

        const { count: totalAfastados, error: totalAfastadosError } = await supabase
          .from("colaboradores")
          .select("id", { count: "exact", head: true })
          .eq("status", "afastado");

        if (totalAfastadosError) throw totalAfastadosError;

        dadosRelatorio = {
          total_colaboradores: totalColaboradores ?? 0,
          total_afastados: totalAfastados ?? 0,
        };
        break;
      }
        
      default:
        dadosRelatorio = { mensagem: "Tipo de relatório não implementado" };
    }

    // Simular geração do relatório
    const relatorioGerado = {
      tipo: tipoRelatorio,
      formato,
      dados: dadosRelatorio,
      geradoEm: new Date().toISOString(),
    };

    // Log do envio (simulado - sem Resend configurado)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let statusEnvio = "sucesso";
    let mensagemEnvio = "";

    if (resendApiKey) {
      // Se tiver API key, tentar enviar email real
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Sistema DP <onboarding@resend.dev>",
            to: [emailDestinatario],
            subject: `Relatório: ${tipoRelatorio} - ${new Date().toLocaleDateString("pt-BR")}`,
            html: `
              <h1>Relatório Automático</h1>
              <p><strong>Tipo:</strong> ${tipoRelatorio}</p>
              <p><strong>Formato:</strong> ${formato}</p>
              <p><strong>Gerado em:</strong> ${new Date().toLocaleString("pt-BR")}</p>
              <hr/>
              <pre>${JSON.stringify(dadosRelatorio, null, 2)}</pre>
            `,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Resend API error: ${response.status}`);
        }
        mensagemEnvio = "Email enviado com sucesso";
      } catch (emailError: unknown) {
        console.error("Erro ao enviar email:", emailError);
        statusEnvio = "erro";
        mensagemEnvio = `Erro no envio: ${emailError instanceof Error ? emailError.message : "Erro desconhecido"}`;
      }
    } else {
      // Sem API key - apenas simular
      console.log("RESEND_API_KEY não configurada - simulando envio");
      mensagemEnvio = "Envio simulado (RESEND_API_KEY não configurada)";
    }

    // Registrar log se tiver agendamento associado
    if (agendamentoId) {
      await supabase.from("log_envio_relatorios").insert({
        agendamento_id: agendamentoId,
        status: statusEnvio,
        mensagem: mensagemEnvio,
      });

      // Atualizar último envio
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
        relatorio: relatorioGerado,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na função enviar-relatorio:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
