import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { format } from 'date-fns';
import { toast } from 'sonner';

// ============================================
// TIPOS ESOCIAL
// ============================================

export type TipoEvento = 
  | 'S-2200' // Cadastramento Inicial / Admissão
  | 'S-2205' // Alteração de Dados Cadastrais
  | 'S-2206' // Alteração de Contrato
  | 'S-2230' // Afastamento Temporário
  | 'S-2299' // Desligamento
  | 'S-2300' // TSV - Início
  | 'S-2399' // TSV - Término
  | 'S-1200' // Remuneração
  | 'S-1210'; // Pagamentos

export type StatusEvento = 'pendente' | 'gerado' | 'enviado' | 'processado' | 'rejeitado' | 'erro';

export interface EventoESocial {
  id: string;
  tipo: TipoEvento;
  status: StatusEvento;
  colaborador_id: string;
  colaborador_nome?: string;
  data_evento: string;
  data_geracao?: string;
  data_envio?: string;
  data_retorno?: string;
  xml?: string;
  recibo?: string;
  protocolo?: string;
  erros?: string[];
  created_at: string;
}

export interface DadosS2200 {
  colaborador_id: string;
  cpf: string;
  nome: string;
  data_nascimento: string;
  sexo: 'M' | 'F';
  raca_cor: number;
  estado_civil: number;
  grau_instrucao: string;
  nome_mae: string;
  pais_nascimento: string;
  uf_nascimento: string;
  municipio_nascimento: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cep: string;
    uf: string;
    municipio: string;
  };
  ctps: { numero: string; serie: string; uf: string };
  rg: { numero: string; orgao: string; uf: string };
  pis: string;
  data_admissao: string;
  tipo_admissao: number;
  matricula: string;
  cargo_cbo: string;
  cargo_descricao: string;
  salario: number;
  unidade_salario: number;
  tipo_contrato: number;
  natureza_atividade: number;
  tipo_regime_jornada: number;
  tipo_regime_previdenciario: number;
}

// ============================================
// GERADOR S-2200 (ADMISSÃO)
// ============================================

const gerarXML_S2200 = (dados: DadosS2200): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmissao/v_S_01_02_00">
  <evtAdmissao Id="ID${dados.colaborador_id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>DP_PROMOBRINDES_1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc></nrInsc>
    </ideEmpregador>
    <trabalhador>
      <cpfTrab>${dados.cpf.replace(/\D/g, '')}</cpfTrab>
      <nmTrab>${dados.nome}</nmTrab>
      <sexo>${dados.sexo}</sexo>
      <racaCor>${dados.raca_cor}</racaCor>
      <estCiv>${dados.estado_civil}</estCiv>
      <grauInstr>${dados.grau_instrucao}</grauInstr>
      <nmMae>${dados.nome_mae}</nmMae>
      <paisNac>${dados.pais_nascimento}</paisNac>
      <nascimento>
        <dtNascto>${dados.data_nascimento}</dtNascto>
        <uf>${dados.uf_nascimento}</uf>
        <codMunic>${dados.municipio_nascimento}</codMunic>
      </nascimento>
      <endereco>
        <brasil>
          <tpLograd>R</tpLograd>
          <dscLograd>${dados.endereco.logradouro}</dscLograd>
          <nrLograd>${dados.endereco.numero}</nrLograd>
          <bairro>${dados.endereco.bairro}</bairro>
          <cep>${dados.endereco.cep.replace(/\D/g, '')}</cep>
          <codMunic>${dados.endereco.municipio}</codMunic>
          <uf>${dados.endereco.uf}</uf>
        </brasil>
      </endereco>
      <documentos>
        <CTPS>
          <nrCtps>${dados.ctps.numero}</nrCtps>
          <serieCtps>${dados.ctps.serie}</serieCtps>
          <ufCtps>${dados.ctps.uf}</ufCtps>
        </CTPS>
        <RG>
          <nrRg>${dados.rg.numero}</nrRg>
          <orgaoEmissor>${dados.rg.orgao}</orgaoEmissor>
          <dtExped></dtExped>
        </RG>
        <NIS>
          <nrNis>${dados.pis.replace(/\D/g, '')}</nrNis>
        </NIS>
      </documentos>
    </trabalhador>
    <vinculo>
      <matricula>${dados.matricula}</matricula>
      <tpRegTrab>1</tpRegTrab>
      <tpRegPrev>${dados.tipo_regime_previdenciario}</tpRegPrev>
      <cadIni>S</cadIni>
      <infoRegimeTrab>
        <infoCeletista>
          <dtAdm>${dados.data_admissao}</dtAdm>
          <tpAdmissao>${dados.tipo_admissao}</tpAdmissao>
          <indAdmissao>1</indAdmissao>
          <tpRegJor>${dados.tipo_regime_jornada}</tpRegJor>
          <natAtividade>${dados.natureza_atividade}</natAtividade>
        </infoCeletista>
      </infoRegimeTrab>
      <infoContrato>
        <nmCargo>${dados.cargo_descricao}</nmCargo>
        <CBOCargo>${dados.cargo_cbo}</CBOCargo>
        <remuneracao>
          <vrSalFx>${dados.salario.toFixed(2)}</vrSalFx>
          <undSalFixo>${dados.unidade_salario}</undSalFixo>
        </remuneracao>
        <duracao>
          <tpContr>${dados.tipo_contrato}</tpContr>
        </duracao>
      </infoContrato>
    </vinculo>
  </evtAdmissao>
</eSocial>`;
};

// ============================================
// GERADOR S-2299 (DESLIGAMENTO)
// ============================================

interface DadosS2299 {
  colaborador_id: string;
  cpf: string;
  matricula: string;
  data_desligamento: string;
  motivo_desligamento: string;
  data_aviso?: string | null;
  tipo_aviso: 'trabalhado' | 'indenizado' | 'dispensado';
  verbas: {
    saldo_salario: number;
    decimo_terceiro: number;
    ferias_proporcionais: number;
    ferias_vencidas: number;
    aviso_previo: number;
    multa_fgts: number;
    desconto_inss: number;
    desconto_irrf: number;
  };
}

const gerarXML_S2299 = (dados: DadosS2299): string => {
  const indPagtoAPI = dados.tipo_aviso === 'indenizado' ? 1 : (dados.tipo_aviso === 'trabalhado' ? 2 : 3);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtDeslig/v_S_01_02_00">
  <evtDeslig Id="ID${dados.colaborador_id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>DP_PROMOBRINDES_1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc></nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${dados.cpf.replace(/\D/g, '')}</cpfTrab>
      <matricula>${dados.matricula}</matricula>
    </ideVinculo>
    <infoDeslig>
      <mtvDeslig>${dados.motivo_desligamento}</mtvDeslig>
      <dtDeslig>${dados.data_desligamento}</dtDeslig>
      <indPagtoAPI>${indPagtoAPI}</indPagtoAPI>
      ${dados.data_aviso ? `<dtAviso>${dados.data_aviso}</dtAviso>` : ''}
      <verbasResc>
        <dmDev>
          <ideDmDev>1</ideDmDev>
          <infoPerApur>
            <ideEstabLot>
              <tpInsc>1</tpInsc>
              <nrInsc></nrInsc>
              <detVerbas>
                ${dados.verbas.saldo_salario > 0 ? `<codRubr>001</codRubr><vrRubr>${dados.verbas.saldo_salario.toFixed(2)}</vrRubr>` : ''}
                ${dados.verbas.decimo_terceiro > 0 ? `<codRubr>002</codRubr><vrRubr>${dados.verbas.decimo_terceiro.toFixed(2)}</vrRubr>` : ''}
                ${dados.verbas.ferias_proporcionais > 0 ? `<codRubr>003</codRubr><vrRubr>${dados.verbas.ferias_proporcionais.toFixed(2)}</vrRubr>` : ''}
                ${dados.verbas.aviso_previo > 0 ? `<codRubr>004</codRubr><vrRubr>${dados.verbas.aviso_previo.toFixed(2)}</vrRubr>` : ''}
                ${dados.verbas.multa_fgts > 0 ? `<codRubr>005</codRubr><vrRubr>${dados.verbas.multa_fgts.toFixed(2)}</vrRubr>` : ''}
              </detVerbas>
            </ideEstabLot>
          </infoPerApur>
        </dmDev>
      </verbasResc>
    </infoDeslig>
  </evtDeslig>
</eSocial>`;
};

// ============================================
// HOOK: useESocial
// ============================================

export function useESocial() {
  const auditoria = useAuditoriaIntegration('esocial');
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Buscar eventos pendentes (simulado - tabela esocial_eventos não existe ainda)
  const { data: eventosPendentes, isLoading: loadingPendentes } = useQuery({
    queryKey: ['esocial-pendentes'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      // Simulando retorno vazio enquanto a tabela não existe
      return [] as EventoESocial[];
    },
  });

  // Buscar histórico de eventos
  const useHistoricoEventos = (colaboradorId?: string, limite = 50) => {
    return useQuery({
      queryKey: ['esocial-historico', colaboradorId],
      staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
        // Simulando retorno vazio
        return [] as EventoESocial[];
      },
    });
  };

  // Gerar evento S-2200 (Admissão)
  const gerarEventoAdmissao = useCallback(async (colaboradorId: string) => {
    setIsGenerating(true);
    try {
      // Buscar dados do colaborador
      const { data: colab, error } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('id', colaboradorId)
        .single();
      
      if (error || !colab) throw new Error('Colaborador não encontrado');

      // Montar dados para o XML
      const dadosS2200: DadosS2200 = {
        colaborador_id: colab.id,
        cpf: colab.cpf || '',
        nome: colab.nome_completo,
        data_nascimento: colab.data_nascimento || '',
        sexo: (colab.sexo as 'M' | 'F') || 'M',
        raca_cor: 1,
        estado_civil: 1,
        grau_instrucao: '07',
        nome_mae: colab.nome_mae || 'NÃO INFORMADO',
        pais_nascimento: '105',
        uf_nascimento: colab.uf || 'SP',
        municipio_nascimento: '3550308',
        endereco: {
          logradouro: colab.logradouro || 'NÃO INFORMADO',
          numero: colab.numero || 'S/N',
          bairro: colab.bairro || 'NÃO INFORMADO',
          cep: colab.cep || '00000000',
          uf: colab.uf || 'SP',
          municipio: '3550308',
        },
        ctps: {
          numero: colab.ctps_numero || '',
          serie: colab.ctps_serie || '',
          uf: colab.ctps_uf || 'SP',
        },
        rg: {
          numero: colab.rg || '',
          orgao: 'SSP',
          uf: colab.uf || 'SP',
        },
        pis: colab.pis_pasep || '',
        data_admissao: colab.data_admissao || '',
        tipo_admissao: 1,
        matricula: colab.matricula || colab.id.slice(0, 8),
        cargo_cbo: colab.cbo || '411010',
        cargo_descricao: colab.cargo || 'AUXILIAR',
        salario: colab.salario_base || 0,
        unidade_salario: 5,
        tipo_contrato: 1,
        natureza_atividade: 1,
        tipo_regime_jornada: 1,
        tipo_regime_previdenciario: 1,
      };

      const xml = gerarXML_S2200(dadosS2200);

      // Registrar auditoria
      await auditoria.registrarCriacao(colaboradorId, { 
        tipo: 'S-2200', 
        xml_preview: xml.substring(0, 200) 
      });
      
      toast.success('Evento S-2200 gerado com sucesso!');
      
      return { 
        id: crypto.randomUUID(), 
        tipo: 'S-2200' as TipoEvento, 
        xml,
        colaborador_id: colaboradorId,
        status: 'gerado' as StatusEvento,
        data_evento: colab.data_admissao || new Date().toISOString(),
        created_at: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao gerar evento: ${errorMessage}`);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [queryClient, auditoria]);

  // Gerar evento S-2299 (Desligamento)
  const gerarEventoDesligamento = useCallback(async (desligamentoId: string) => {
    setIsGenerating(true);
    try {
      // Buscar dados do desligamento
      const { data: deslig, error } = await supabase
        .from('desligamentos')
        .select('*, colaborador:colaboradores(*)')
        .eq('id', desligamentoId)
        .single();
      
      if (error || !deslig) throw new Error('Desligamento não encontrado');

      const colab = deslig.colaborador;

      // Mapear tipo para código eSocial
      const motivoMap: Record<string, string> = {
        'sem_justa_causa': '02',
        'justa_causa': '01',
        'pedido_demissao': '10',
        'acordo': '33',
        'aposentadoria': '21',
        'falecimento': '29',
        'fim_contrato': '09',
      };

      const dadosS2299: DadosS2299 = {
        colaborador_id: deslig.colaborador_id,
        cpf: colab.cpf || '',
        matricula: colab.matricula || colab.id.slice(0, 8),
        data_desligamento: deslig.data_desligamento,
        motivo_desligamento: motivoMap[deslig.tipo] || '99',
        data_aviso: deslig.data_aviso,
        tipo_aviso: 'indenizado',
        verbas: {
          saldo_salario: deslig.saldo_salario || 0,
          decimo_terceiro: deslig.decimo_terceiro || 0,
          ferias_proporcionais: (deslig.ferias_proporcionais || 0) + (deslig.terco_constitucional || 0),
          ferias_vencidas: deslig.ferias_vencidas || 0,
          aviso_previo: deslig.aviso_previo || 0,
          multa_fgts: deslig.multa_fgts || 0,
          desconto_inss: 0,
          desconto_irrf: 0,
        },
      };

      const xml = gerarXML_S2299(dadosS2299);

      // Registrar auditoria
      await auditoria.registrarCriacao(desligamentoId, { 
        tipo: 'S-2299', 
        xml_preview: xml.substring(0, 200) 
      });
      
      toast.success('Evento S-2299 gerado com sucesso!');
      
      return { 
        id: crypto.randomUUID(), 
        tipo: 'S-2299' as TipoEvento, 
        xml,
        colaborador_id: deslig.colaborador_id,
        status: 'gerado' as StatusEvento,
        data_evento: deslig.data_desligamento,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao gerar evento: ${errorMessage}`);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [queryClient, auditoria]);

  // Baixar XML
  const downloadXML = useCallback((evento: EventoESocial) => {
    if (!evento.xml) {
      toast.error('XML não disponível');
      return;
    }

    const blob = new Blob([evento.xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${evento.tipo}_${evento.colaborador_id}_${format(new Date(evento.data_evento), 'yyyyMMdd')}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('XML baixado!');
  }, []);

  // Marcar como enviado (simulação)
  const marcarEnviado = useCallback(async (eventoId: string, protocolo: string) => {
    // Simulação - tabela não existe ainda
    queryClient.invalidateQueries({ queryKey: ['esocial-pendentes'] });
    toast.success('Evento marcado como enviado!');
  }, [queryClient]);

  return {
    // Queries
    eventosPendentes,
    loadingPendentes,
    useHistoricoEventos,
    
    // Geradores
    gerarEventoAdmissao,
    gerarEventoDesligamento,
    isGenerating,
    
    // Ações
    downloadXML,
    marcarEnviado,
  };
}


