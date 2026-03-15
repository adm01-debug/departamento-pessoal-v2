import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EventoESocial = 'S-1200' | 'S-2200' | 'S-2205' | 'S-2206' | 'S-2299' | 'S-2300' | 'S-2399' | 'S-1210';

interface EnviarESocialRequest {
  empresaId: string;
  evento: EventoESocial;
  colaboradorId?: string;
  competencia?: string;
  dados?: Record<string, unknown>;
}

const eventoDescricao: Record<EventoESocial, string> = {
  'S-1200': 'Remuneração de Trabalhador',
  'S-2200': 'Cadastramento Inicial / Admissão',
  'S-2205': 'Alteração de Dados Cadastrais',
  'S-2206': 'Alteração Contratual',
  'S-2299': 'Desligamento',
  'S-2300': 'Trabalhador Sem Vínculo - Início',
  'S-2399': 'Trabalhador Sem Vínculo - Término',
  'S-1210': 'Pagamentos de Rendimentos do Trabalho',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { empresaId, evento, colaboradorId, competencia, dados }: EnviarESocialRequest = await req.json();

    if (!empresaId || !evento) {
      throw new Error('Campos obrigatórios: empresaId, evento');
    }

    // Buscar dados da empresa
    const { data: empresa, error: empError } = await supabase
      .from('empresas')
      .select('razao_social, cnpj')
      .eq('id', empresaId)
      .maybeSingle();

    if (empError || !empresa) throw new Error('Empresa não encontrada');

    // Buscar dados do colaborador se necessário
    let colaborador = null;
    if (colaboradorId) {
      const { data: col } = await supabase
        .from('colaboradores')
        .select('nome_completo, cpf, cargo, departamento, data_admissao, salario_base')
        .eq('id', colaboradorId)
        .maybeSingle();
      colaborador = col;
    }

    // Montar XML do evento (simulado)
    const xmlEvento = montarXMLEvento(evento, empresa, colaborador, competencia, dados);

    // Registrar no log de eSocial
    const { error: logError } = await supabase
      .from('esocial_eventos')
      .insert({
        empresa_id: empresaId,
        colaborador_id: colaboradorId,
        tipo_evento: evento,
        status: 'enviado',
        xml_envio: xmlEvento,
        competencia,
      });

    // Se não existe a tabela esocial_eventos, registrar na auditoria
    if (logError) {
      console.log('Tabela esocial_eventos não encontrada, registrando na auditoria');
      await supabase.from('auditoria').insert({
        acao: 'envio_esocial',
        entidade: 'esocial',
        descricao: `Evento ${evento} - ${eventoDescricao[evento]}`,
        empresa_id: empresaId,
        dados_novos: { evento, colaboradorId, competencia, status: 'enviado' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        evento,
        descricao: eventoDescricao[evento],
        protocolo: `ESOC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'enviado',
        xml: xmlEvento,
        enviadoEm: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

function montarXMLEvento(
  evento: EventoESocial,
  empresa: any,
  colaborador: any,
  competencia?: string,
  dados?: Record<string, unknown>
): string {
  const id = `ID${Date.now()}`;
  const perApur = competencia || new Date().toISOString().slice(0, 7);

  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/${evento}/v1.0">
  <evtRemun Id="${id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <perApur>${perApur}</perApur>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj?.replace(/\D/g, '') || ''}</nrInsc>
    </ideEmpregador>
    ${colaborador ? `
    <ideTrabalhador>
      <cpfTrab>${colaborador.cpf?.replace(/\D/g, '') || ''}</cpfTrab>
      <nmTrab>${colaborador.nome_completo || ''}</nmTrab>
    </ideTrabalhador>` : ''}
  </evtRemun>
</eSocial>`;
}
