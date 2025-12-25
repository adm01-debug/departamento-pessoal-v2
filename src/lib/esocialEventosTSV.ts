/**
 * @fileoverview Eventos eSocial TSV
 * @module lib/esocialEventosTSV
 */
// S-2300 - TSV Início
export function gerarEventoS2300(tsv: { cpf: string; nome: string; codCateg: number; dtInicio: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTSVInicio/v_S_01_02_00">
  <evtTSVInicio Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <trabalhador><cpfTrab>${tsv.cpf}</cpfTrab><nmTrab>${tsv.nome}</nmTrab></trabalhador>
    <infoTSVInicio><codCateg>${tsv.codCateg}</codCateg><dtInicio>${tsv.dtInicio}</dtInicio></infoTSVInicio>
  </evtTSVInicio>
</eSocial>`;}

// S-2306 - TSV Alteração Contratual
export function gerarEventoS2306(tsv: { cpf: string; dtAlteracao: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTSVAltContr/v_S_01_02_00">
  <evtTSVAltContr Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabSemVinculo><cpfTrab>${tsv.cpf}</cpfTrab></ideTrabSemVinculo>
    <infoTSVAlteracao><dtAlteracao>${tsv.dtAlteracao}</dtAlteracao></infoTSVAlteracao>
  </evtTSVAltContr>
</eSocial>`;}

// S-2399 - TSV Término
export function gerarEventoS2399(tsv: { cpf: string; dtTerm: string; mtvDesligTSV: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTSVTermino/v_S_01_02_00">
  <evtTSVTermino Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideTrabSemVinculo><cpfTrab>${tsv.cpf}</cpfTrab></ideTrabSemVinculo>
    <infoTSVTermino><dtTerm>${tsv.dtTerm}</dtTerm><mtvDesligTSV>${tsv.mtvDesligTSV}</mtvDesligTSV></infoTSVTermino>
  </evtTSVTermino>
</eSocial>`;}

// S-2400 - Cadastro de Benefícios
export function gerarEventoS2400(beneficio: { cpfBenef: string; tpBenef: number; dtIniBenef: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCdBenIn/v_S_01_02_00">
  <evtCdBenIn Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <beneficiario><cpfBenef>${beneficio.cpfBenef}</cpfBenef></beneficiario>
    <infoBenInicio><tpBenef>${beneficio.tpBenef}</tpBenef><dtIniBenef>${beneficio.dtIniBenef}</dtIniBenef></infoBenInicio>
  </evtCdBenIn>
</eSocial>`;}

// S-2405 - Alteração de Dados de Benefício
export function gerarEventoS2405(beneficio: { cpfBenef: string; dtAltBenef: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCdBenAlt/v_S_01_02_00">
  <evtCdBenAlt Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <beneficiario><cpfBenef>${beneficio.cpfBenef}</cpfBenef></beneficiario>
    <infoBenAlteracao><dtAltBenef>${beneficio.dtAltBenef}</dtAltBenef></infoBenAlteracao>
  </evtCdBenAlt>
</eSocial>`;}

// S-2410 - Cessação de Benefício  
export function gerarEventoS2410(beneficio: { cpfBenef: string; dtCessaBenef: string; mtvCessaBenef: number }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCdBenTerm/v_S_01_02_00">
  <evtCdBenTerm Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <beneficiario><cpfBenef>${beneficio.cpfBenef}</cpfBenef></beneficiario>
    <infoBenTermino><dtCessaBenef>${beneficio.dtCessaBenef}</dtCessaBenef><mtvCessaBenef>${beneficio.mtvCessaBenef}</mtvCessaBenef></infoBenTermino>
  </evtCdBenTerm>
</eSocial>`;}

export default { gerarEventoS2300, gerarEventoS2306, gerarEventoS2399, gerarEventoS2400, gerarEventoS2405, gerarEventoS2410 };
