import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { assinarXMLEsocial } from './signer.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type EventoESocial = 'S-1000' | 'S-1005' | 'S-1010' | 'S-1020' | 'S-1200' | 'S-1210' | 'S-2200' | 'S-2205' | 'S-2206' | 'S-2210' | 'S-2220' | 'S-2230' | 'S-2240' | 'S-2299' | 'S-2300' | 'S-2306' | 'S-2399' | 'S-2400';

interface EnviarESocialRequest {
  empresaId: string;
  eventoId?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { empresaId, eventoId }: EnviarESocialRequest = await req.json();

    const { data: config } = await supabase
      .from('configuracoes_esocial')
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();

    const { data: evento, error: eError } = await supabase
      .from('esocial_eventos')
      .select('*, empresa:empresas(*)')
      .eq('id', eventoId)
      .maybeSingle();

    if (eError || !evento) throw new Error('Evento não encontrado');

    const ambiente = config?.ambiente || '2';
    const certificadoId = config?.certificado_id || evento.empresa.id;

    // Real-ish XML Generation and Signing
    const xmlBase = montarXMLEvento(evento.tipo_evento, evento.empresa, evento.dados, ambiente, evento.competencia);
    const { xmlAssinado, assinatura, hash } = await assinarXMLEsocial(xmlBase, certificadoId);

    // Simulation of transmission logic
    const transmissionTime = 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, transmissionTime));

    const success = Math.random() > 0.05; 
    
    const status = success ? 'enviado' : 'erro';
    const protocolo = success ? `REC-${Date.now()}` : null;
    const erroGov = success ? null : { 
      mensagem: 'Falha na recepção do evento. O servidor do eSocial retornou erro 401.',
      codigo: '401',
      detalhes: 'Assinatura inválida ou ambiente de transmissão incorreto.'
    };

    const { error: updError } = await supabase
      .from('esocial_eventos')
      .update({
        status,
        protocolo,
        assinatura_xml: assinatura,
        hash_seguranca: hash,
        xml_envio: xmlAssinado,
        xml_retorno: success ? `<retorno><status>200</status><protocolo>${protocolo}</protocolo></retorno>` : null,
        erros: erroGov,
        data_envio: success ? new Date().toISOString() : null,
      } as any)
      .eq('id', eventoId);

    if (updError) throw updError;

    return new Response(JSON.stringify({ 
        success, 
        protocolo, 
        error: erroGov?.mensagem,
        xml: xmlAssinado
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
    });
  }
});

function montarXMLEvento(tipo: string, empresa: any, dados: any, ambiente: string, competencia?: string): string {
  const perApur = competencia || new Date().toISOString().slice(0, 7);
  const id = `ID1${empresa.cnpj?.replace(/\D/g, '') || '00000000000000'}${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`;
  
  let conteudoEvento = '';
  
  switch(tipo) {
    case 'S-1000':
      conteudoEvento = `
      <infoEmpregador>
        <idePeriodo><iniValid>${perApur}</iniValid></idePeriodo>
        <infoCadastro>
          <nmRazao>${empresa.razao_social || ''}</nmRazao>
          <classTrib>01</classTrib><indCoop>0</indCoop><indConstr>0</indConstr><indDesFolha>0</indDesFolha><indOptRegEletr>1</indOptRegEletr>
          <contato><nmCtto>${empresa.responsavel || 'RH'}</nmCtto><cpfCtto>00000000000</cpfCtto></contato>
        </infoCadastro>
      </infoEmpregador>`;
      break;
    default:
      conteudoEvento = `<dados>${JSON.stringify(dados || {})}</dados>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/${tipo}/v_S_01_01_00">
  <evt${tipo.replace('-', '')} Id="${id}">
    <ideEvento><tpAmb>${ambiente}</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideEmpregador><tpInsc>1</tpInsc><nrInsc>${empresa.cnpj?.replace(/\D/g, '') || ''}</nrInsc></ideEmpregador>
    ${conteudoEvento}
  </evt${tipo.replace('-', '')}>
</eSocial>`;
}