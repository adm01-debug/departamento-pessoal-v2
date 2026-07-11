import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const agora = new Date();
    console.log(`Processando agendamentos em: ${agora.toISOString()}`);

    // Buscar agendamentos ativos que precisam ser executados
    const { data: agendamentos, error } = await supabase
      .from("relatorios_agendados")
      .select("*")
      .eq("ativo", true)
      .or(`proximo_envio.is.null,proximo_envio.lte.${agora.toISOString()}`);

    if (error) {
      throw error;
    }

    console.log(`Encontrados ${agendamentos?.length || 0} agendamentos para processar`);

    // MP-013: concorrência controlada (Promise.all + limite manual de 5) em vez de loop síncrono
    const CONCURRENCY = 5;
    const lista = agendamentos ?? [];
    const resultados: unknown[] = [];

    const processarUm = async (agendamento: Record<string, unknown>) => {
      try {
        const deveExecutar = verificarExecucao(agendamento, agora);
        if (!deveExecutar) {
          return { id: agendamento.id, status: "skipped" };
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/enviar-relatorio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            agendamentoId: agendamento.id,
            tipoRelatorio: agendamento.tipo_relatorio,
            formato: agendamento.formato,
            emailDestinatario: agendamento.email_destinatario,
            parametros: agendamento.parametros,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha ao enviar relatório (${response.status}): ${errorText}`);
        }
        const resultado = await response.json();
        const proximoEnvio = calcularProximoEnvio(agendamento);

        await supabase
          .from("relatorios_agendados")
          .update({ proximo_envio: proximoEnvio.toISOString() })
          .eq("id", agendamento.id);

        return {
          id: agendamento.id,
          nome: agendamento.nome,
          status: "processado",
          resultado,
          proximo_envio: proximoEnvio,
        };
      } catch (agendamentoError) {
        const msg = agendamentoError instanceof Error ? agendamentoError.message : "Erro desconhecido";
        console.error(`Erro no agendamento ${agendamento.id}:`, msg);
        await supabase.from("log_envio_relatorios").insert({
          agendamento_id: agendamento.id,
          status: "erro",
          mensagem: msg,
        });
        return { id: agendamento.id, nome: agendamento.nome, status: "erro", erro: msg };
      }
    };

    for (let i = 0; i < lista.length; i += CONCURRENCY) {
      const batch = lista.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map(processarUm));
      resultados.push(...results);
    }

    return new Response(
      JSON.stringify({
        success: true,
        processados: resultados.length,
        resultados,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao processar agendamentos:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function verificarExecucao(agendamento: Record<string, unknown>, agora: Date): boolean {
  const horaEnvio = agendamento.hora_envio as string;
  const [hora, minuto] = horaEnvio.split(":").map(Number);
  
  // Verificar se está na hora certa (com margem de 30 minutos)
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  
  if (Math.abs(horaAtual - hora) > 0 || Math.abs(minutoAtual - minuto) > 30) {
    return false;
  }

  const frequencia = agendamento.frequencia as string;
  const diaSemana = agora.getDay();
  const diaMes = agora.getDate();

  switch (frequencia) {
    case "diario":
      return true;
    case "semanal":
      return diaSemana === (agendamento.dia_semana as number);
    case "mensal":
      return diaMes === (agendamento.dia_mes as number);
    default:
      return false;
  }
}

function calcularProximoEnvio(agendamento: Record<string, unknown>): Date {
  const agora = new Date();
  const horaEnvio = agendamento.hora_envio as string;
  const [hora, minuto] = horaEnvio.split(":").map(Number);
  
  const proximo = new Date(agora);
  proximo.setHours(hora, minuto, 0, 0);

  const frequencia = agendamento.frequencia as string;

  switch (frequencia) {
    case "diario":
      proximo.setDate(proximo.getDate() + 1);
      break;
    case "semanal":
      const diaSemanaAlvo = agendamento.dia_semana as number;
      const diasAteProximo = (diaSemanaAlvo - agora.getDay() + 7) % 7 || 7;
      proximo.setDate(proximo.getDate() + diasAteProximo);
      break;
    case "mensal":
      const diaMesAlvo = agendamento.dia_mes as number;
      proximo.setMonth(proximo.getMonth() + 1);
      proximo.setDate(diaMesAlvo);
      break;
  }

  return proximo;
}

serve(handler);
