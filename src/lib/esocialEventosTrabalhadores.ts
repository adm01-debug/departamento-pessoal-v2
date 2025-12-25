/**
 * @fileoverview Eventos eSocial trabalhadores
 * @module lib/esocialEventosTrabalhadores
 */
import { Colaborador } from '@/types/colaborador';

// S-2190 - Registro Preliminar de Trabalhador
export function gerarEventoS2190(colaborador: Colaborador): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmPrelim/v_S_01_02_00">
  <evtAdmPrelim Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <infoRegPrelim>
      <cpfTrab>${colaborador.cpf}</cpfTrab>
      <dtNascto>${colaborador.data_nascimento ?? ''}</dtNascto>
      <dtAdm>${colaborador.data_admissao}</dtAdm>
    </infoRegPrelim>
  </evtAdmPrelim>
</eSocial>`;
}

// S-2205 - Alteração de Dados Cadastrais
export function gerarEventoS2205(colaborador: Colaborador, alteracoes: Record<string, unknown>): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAltCadastral/v_S_01_02_00">
  <evtAltCadastral Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabalhador><cpfTrab>${colaborador.cpf}</cpfTrab></ideTrabalhador>
    <alteracao><dtAlteracao>${new Date().toISOString().split('T')[0]}</dtAlteracao></alteracao>
  </evtAltCadastral>
</eSocial>`;
}

// S-2206 - Alteração de Contrato de Trabalho
export function gerarEventoS2206(colaborador: Colaborador, alteracoes: { dtAlteracao: string; novoSalario?: number; novoCargo?: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAltContratual/v_S_01_02_00">
  <evtAltContratual Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabalhador><cpfTrab>${colaborador.cpf}</cpfTrab></ideTrabalhador>
    <alteracao>
      <dtAlteracao>${alteracoes.dtAlteracao}</dtAlteracao>
      ${alteracoes.novoSalario ? `<vrSalFx>${alteracoes.novoSalario.toFixed(2)}</vrSalFx>` : ''}
      ${alteracoes.novoCargo ? `<codCargo>${alteracoes.novoCargo}</codCargo>` : ''}
    </alteracao>
  </evtAltContratual>
</eSocial>`;
}

// S-2230 - Afastamento Temporário
export function gerarEventoS2230(colaborador: Colaborador, afastamento: { dtIniAfast: string; codMotAfast: string; dtTermAfast?: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAfastTemp/v_S_01_02_00">
  <evtAfastTemp Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabalhador><cpfTrab>${colaborador.cpf}</cpfTrab></ideTrabalhador>
    <infoAfastamento>
      <iniAfastamento>
        <dtIniAfast>${afastamento.dtIniAfast}</dtIniAfast>
        <codMotAfast>${afastamento.codMotAfast}</codMotAfast>
      </iniAfastamento>
      ${afastamento.dtTermAfast ? `<fimAfastamento><dtTermAfast>${afastamento.dtTermAfast}</dtTermAfast></fimAfastamento>` : ''}
    </infoAfastamento>
  </evtAfastTemp>
</eSocial>`;
}

// S-2250 - Aviso Prévio
export function gerarEventoS2250(colaborador: Colaborador, aviso: { dtAvPrv: string; tpAvPrv: number; dtPrevDeslig: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAvPrevio/v_S_01_02_00">
  <evtAvPrevio Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabalhador><cpfTrab>${colaborador.cpf}</cpfTrab></ideTrabalhador>
    <infoAvPrevio>
      <dtAvPrv>${aviso.dtAvPrv}</dtAvPrv>
      <tpAvPrv>${aviso.tpAvPrv}</tpAvPrv>
      <dtPrevDeslig>${aviso.dtPrevDeslig}</dtPrevDeslig>
    </infoAvPrevio>
  </evtAvPrevio>
</eSocial>`;
}

// S-2298 - Reintegração
export function gerarEventoS2298(colaborador: Colaborador, reintegracao: { dtReinteg: string; tpReinteg: number }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtReintegr/v_S_01_02_00">
  <evtReintegr Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabalhador><cpfTrab>${colaborador.cpf}</cpfTrab></ideTrabalhador>
    <infoReintegr>
      <tpReinteg>${reintegracao.tpReinteg}</tpReinteg>
      <dtReinteg>${reintegracao.dtReinteg}</dtReinteg>
    </infoReintegr>
  </evtReintegr>
</eSocial>`;
}

export default {
  gerarEventoS2190,
  gerarEventoS2205,
  gerarEventoS2206,
  gerarEventoS2230,
  gerarEventoS2250,
  gerarEventoS2298,
};

