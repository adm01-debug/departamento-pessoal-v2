/**
 * @fileoverview Eventos eSocial periódicos
 * @module lib/esocialEventosPeriodicos
 */
/**
 * Eventos Periódicos do eSocial
 * S-1200 a S-1299
 */

export interface EventoS1200 {
  ideEvento: { indRetif: '1' | '2'; perApur: string; tpAmb: '1' | '2'; procEmi: '1' | '2' | '3'; verProc: string };
  ideEmpregador: { tpInsc: '1' | '2'; nrInsc: string };
  ideTrabalhador: { cpfTrab: string; };
  dmDev: DemonstrativoValores[];
}

interface DemonstrativoValores {
  ideDmDev: string;
  codCateg: string;
  infoPerApur: { ideEstabLot: EstabelecimentoLotacao[] };
}

interface EstabelecimentoLotacao {
  tpInsc: string;
  nrInsc: string;
  codLotacao: string;
  detVerbas: { codRubr: string; ideTabRubr: string; vrRubr: number }[];
}

export function gerarEventoS1200(dados: Partial<EventoS1200>): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtRemun/v_S_01_02_00">
    <evtRemun Id="ID${dados.ideEmpregador?.nrInsc}${Date.now()}">
      <ideEvento><indRetif>${dados.ideEvento?.indRetif ?? '1'}</indRetif><perApur>${dados.ideEvento?.perApur ?? ''}</perApur></ideEvento>
      <ideEmpregador><tpInsc>${dados.ideEmpregador?.tpInsc ?? '1'}</tpInsc><nrInsc>${dados.ideEmpregador?.nrInsc ?? ''}</nrInsc></ideEmpregador>
      <ideTrabalhador><cpfTrab>${dados.ideTrabalhador?.cpfTrab ?? ''}</cpfTrab></ideTrabalhador>
    </evtRemun>
  </eSocial>`;
}

export function gerarEventoS1210(dados: { perApur: string; cpfTrab: string; vrLiq: number }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtPgtos/v_S_01_02_00">
    <evtPgtos><ideEvento><perApur>${dados.perApur}</perApur></ideEvento>
      <ideTrabalhador><cpfTrab>${dados.cpfTrab}</cpfTrab></ideTrabalhador>
      <infoPgto><vrLiq>${dados.vrLiq}</vrLiq></infoPgto>
    </evtPgtos>
  </eSocial>`;
}

export function gerarEventoS1260(dados: { perApur: string; nrInsc: string; vrTotCom: number }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtComProd/v_S_01_02_00">
    <evtComProd><ideEvento><perApur>${dados.perApur}</perApur></ideEvento>
      <ideEmpregador><nrInsc>${dados.nrInsc}</nrInsc></ideEmpregador>
      <infoComProd><vrTotCom>${dados.vrTotCom}</vrTotCom></infoComProd>
    </evtComProd>
  </eSocial>`;
}

export function gerarEventoS1270(dados: { perApur: string; nrInsc: string; cnpjPrestServ: string; vlrTotalBruto: number }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtContratAvNP/v_S_01_02_00">
    <evtContratAvNP><ideEvento><perApur>${dados.perApur}</perApur></ideEvento>
      <ideEmpregador><nrInsc>${dados.nrInsc}</nrInsc></ideEmpregador>
      <remunAvNP><cnpjPrestServ>${dados.cnpjPrestServ}</cnpjPrestServ><vlrTotalBruto>${dados.vlrTotalBruto}</vlrTotalBruto></remunAvNP>
    </evtContratAvNP>
  </eSocial>`;
}

export function gerarEventoS1280(dados: { perApur: string; nrInsc: string; qtdDiasTrab: number }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtInfoComplPer/v_S_01_02_00">
    <evtInfoComplPer><ideEvento><perApur>${dados.perApur}</perApur></ideEvento>
      <ideEmpregador><nrInsc>${dados.nrInsc}</nrInsc></ideEmpregador>
      <infoSubstPatr><qtdDiasTrab>${dados.qtdDiasTrab}</qtdDiasTrab></infoSubstPatr>
    </evtInfoComplPer>
  </eSocial>`;
}

export function gerarEventoS1298(dados: { perApur: string; nrInsc: string }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtReaworFch/v_S_01_02_00">
    <evtReaworFch><ideEvento><perApur>${dados.perApur}</perApur></ideEvento>
      <ideEmpregador><nrInsc>${dados.nrInsc}</nrInsc></ideEmpregador>
      <ideRespInf><nmResp>Sistema DP</nmResp></ideRespInf>
    </evtReaworFch>
  </eSocial>`;
}

export function gerarEventoS1299(dados: { perApur: string; nrInsc: string; indExistInfo: 'S' | 'N' }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtFechaEvPer/v_S_01_02_00">
    <evtFechaEvPer><ideEvento><perApur>${dados.perApur}</perApur></ideEvento>
      <ideEmpregador><nrInsc>${dados.nrInsc}</nrInsc></ideEmpregador>
      <infoFech><indExistInfo>${dados.indExistInfo}</indExistInfo></infoFech>
    </evtFechaEvPer>
  </eSocial>`;
}
