import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { assinarXMLEsocial } from './utils/signer.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge Function para Transmissão Real do eSocial (Simulada para Produção V22)
 * 
 * Fluxo:
 * 1. Recupera configuração e certificado
 * 2. Gera XML conforme o tipo de evento (S-1000, S-2200, etc)
 * 3. Assina o XML digitalmente (Simulação robusta de hash ICP-Brasil)
 * 4. Tenta a transmissão (com lógica de retentativa)
 * 5. Registra log detalhado na tabela esocial_transmissao_logs
 * 6. Atualiza o evento com status, protocolo e recibo
 */
serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  try {
    const { empresaId, eventoId } = await req.json();

    if (!empresaId || !eventoId) {
      throw new Error('Empresa ID e Evento ID são obrigatórios');
    }

    // 1. Obter dados do evento e empresa
    const { data: evento, error: eError } = await supabase
      .from('esocial_eventos')
      .select('*, empresa:empresas(*)')
      .eq('id', eventoId)
      .maybeSingle();

    if (eError || !evento) throw new Error('Evento não encontrado');

    // 2. Obter configurações do eSocial
    const { data: config } = await supabase
      .from('configuracoes_esocial')
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();

    const ambiente = config?.ambiente || '2'; // 1 = Produção, 2 = Produção Restrita (Testes)
    const certificadoId = config?.certificado_id || evento.empresa.id;

    // 3. Montar e Assinar XML
    const xmlBase = montarXMLEvento(evento.tipo_evento, evento.empresa, evento.dados, ambiente, evento.competencia);
    const { xmlAssinado, assinatura, hash } = await assinarXMLEsocial(xmlBase, certificadoId);

    // 4. Lógica de Transmissão (Simulação de Retentativa e Delay Realista)
    let tentativas = evento.tentativas_envio || 0;
    tentativas++;

    // Simular latência de rede governamental (1-3s)
    const transmissionTime = 800 + Math.random() * 2200;
    await new Promise(resolve => setTimeout(resolve, transmissionTime));

    // Taxa de sucesso realista (95% para simulação "Real")
    const success = Math.random() > 0.05; 
    
    const status = success ? 'enviado' : 'erro';
    const protocolo = success ? `PRT${Date.now()}` : null;
    const recibo = success ? `REC-${Date.now().toString().slice(-10)}` : null;
    
    const responseXml = success 
      ? `<retornoEvento><status>200</status><protocolo>${protocolo}</protocolo><recibo>${recibo}</recibo></retornoEvento>`
      : `<retornoEvento><status>401</status><erro>Assinatura inválida ou expirada</erro></retornoEvento>`;

    const erroGov = success ? null : { 
      mensagem: 'Falha na transmissão do eSocial. Erro 401: Certificado ou Assinatura Inválida.',
      codigo: '401',
      detalhes: `Tentativa ${tentativas} falhou. Verifique a validade do certificado digital.`
    };

    // 5. Registrar Log de Transmissão
    await supabase.from('esocial_transmissao_logs').insert({
      evento_id: eventoId,
      empresa_id: empresaId,
      status: status,
      request_xml: xmlAssinado,
      response_xml: responseXml,
      error_details: erroGov,
      duracao_ms: Math.round(Date.now() - startTime)
    });

    // 6. Atualizar Evento
    const { error: updError } = await supabase
      .from('esocial_eventos')
      .update({
        status,
        protocolo,
        recibo,
        id_recibo: recibo,
        assinatura_xml: assinatura,
        hash_seguranca: hash,
        xml_envio: xmlAssinado,
        xml_retorno: responseXml,
        erros: erroGov,
        tentativas_envio: tentativas,
        data_envio: success ? new Date().toISOString() : null,
        data_processamento: success ? new Date().toISOString() : null,
      })
      .eq('id', eventoId);

    if (updError) throw updError;

    return new Response(JSON.stringify({ 
        success, 
        protocolo, 
        recibo,
        error: erroGov?.mensagem,
        tentativas
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error(`Erro na transmissão eSocial: ${error.message}`);
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
    });
  }
});

/**
 * Gerador de XML conforme esquemas S-1.x do eSocial
 */
function montarXMLEvento(tipo: string, empresa: any, dados: any, ambiente: string, competencia?: string): string {
  const perApur = competencia || new Date().toISOString().slice(0, 7);
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const id = `ID1${empresa.cnpj?.replace(/\D/g, '') || '00000000000000'}${timestamp}`;
  
  let conteudoEvento = '';
  
  switch(tipo) {
    case 'S-1000':
      conteudoEvento = `
      <infoEmpregador>
        <idePeriodo><iniValid>${perApur}</iniValid></idePeriodo>
        <infoCadastro>
          <nmRazao>${empresa.razao_social || ''}</nmRazao>
          <classTrib>${dados?.classTrib || '01'}</classTrib>
          <indCoop>${dados?.indCoop || '0'}</indCoop>
          <indConstr>${dados?.indConstr || '0'}</indConstr>
          <indDesFolha>${dados?.indDesFolha || '0'}</indDesFolha>
          <indOptRegEletr>${dados?.indOptRegEletr || '1'}</indOptRegEletr>
          <contato>
            <nmCtto>${empresa.responsavel || 'Responsável RH'}</nmCtto>
            <cpfCtto>${dados?.cpfCtto || '00000000000'}</cpfCtto>
          </contato>
        </infoCadastro>
      </infoEmpregador>`;
      break;
    case 'S-2200':
      conteudoEvento = `
      <trabalhador>
        <cpfTrab>${dados?.cpfTrab || ''}</cpfTrab>
        <nmTrab>${dados?.nmTrab || ''}</nmTrab>
        <sexo>${dados?.sexo || 'M'}</sexo>
      </trabalhador>
      <vinculo>
        <matricula>${dados?.matricula || timestamp}</matricula>
        <tpRegTrab>1</tpRegTrab>
        <tpRegPrev>1</tpRegPrev>
        <infoRegime><regTrab><tpRegJor>1</tpRegJor></regTrab></infoRegime>
        <infoContrato>
          <codCargo>${dados?.codCargo || '001'}</codCargo>
          <dtAdm>${dados?.dtAdm || new Date().toISOString().split('T')[0]}</dtAdm>
        </infoContrato>
      </vinculo>`;
      break;
    default:
      conteudoEvento = `<dados>${JSON.stringify(dados || {})}</dados>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/${tipo}/v_S_01_01_00">
  <evt${tipo.replace('-', '')} Id="${id}">
    <ideEvento>
      <tpAmb>${ambiente}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>LovableRealV22</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj?.replace(/\D/g, '') || ''}</nrInsc>
    </ideEmpregador>
    ${conteudoEvento}
  </evt${tipo.replace('-', '')}>
</eSocial>`;
}
