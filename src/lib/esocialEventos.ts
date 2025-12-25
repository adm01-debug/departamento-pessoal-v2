/**
 * @fileoverview Eventos eSocial principais
 * @module lib/esocialEventos
 */
/**
 * Geradores de XML para eventos eSocial adicionais
 * S-2205: Alteração de Dados Cadastrais
 * S-2206: Alteração Contratual
 * S-2230: Afastamento Temporário
 */

// Tipos
export interface DadosS2205 {
  colaborador_id: string;
  cpf: string;
  matricula: string;
  data_alteracao: string;
  campo_alterado: string;
  valor_anterior: string;
  valor_novo: string;
}

export interface DadosS2206 {
  colaborador_id: string;
  cpf: string;
  matricula: string;
  data_alteracao: string;
  tipo_alteracao: 'cargo' | 'salario' | 'jornada' | 'departamento';
  cargo_cbo?: string;
  cargo_descricao?: string;
  novo_salario?: number;
  nova_jornada?: number;
}

export interface DadosS2230 {
  colaborador_id: string;
  cpf: string;
  matricula: string;
  data_inicio: string;
  data_fim?: string;
  cod_motivo: string;
  cid?: string;
  num_atestado?: string;
  nome_medico?: string;
  crm_medico?: string;
}

// Mapeamento de motivos de afastamento eSocial
export const MOTIVOS_AFASTAMENTO_ESOCIAL: Record<string, string> = {
  '01': 'Acidente/Doença do Trabalho',
  '03': 'Auxílio Doença',
  '17': 'Licença Maternidade',
  '18': 'Licença Paternidade',
  '23': 'Licença Gala (Casamento)',
  '24': 'Licença Nojo (Falecimento)',
  '99': 'Outros Motivos',
};

// S-2205: Alteração de Dados Cadastrais
export const gerarXML_S2205 = (dados: DadosS2205): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAltCadastral/v_S_01_02_00">
  <evtAltCadastral Id="ID${dados.colaborador_id}">
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
    <altCadastral>
      <dtAlteracao>${dados.data_alteracao}</dtAlteracao>
      <dadosTrabalhador>
        <!-- Campo alterado: ${dados.campo_alterado} -->
        <!-- De: ${dados.valor_anterior} -->
        <!-- Para: ${dados.valor_novo} -->
      </dadosTrabalhador>
    </altCadastral>
  </evtAltCadastral>
</eSocial>`;
};

// S-2206: Alteração Contratual
export const gerarXML_S2206 = (dados: DadosS2206): string => {
  let alteracaoContratual = '';
  
  if (dados.tipo_alteracao === 'cargo' && dados.cargo_cbo) {
    alteracaoContratual = `
      <cargo>
        <codCBO>${dados.cargo_cbo}</codCBO>
        ${dados.cargo_descricao ? `<nmCargo>${dados.cargo_descricao}</nmCargo>` : ''}
      </cargo>`;
  } else if (dados.tipo_alteracao === 'salario' && dados.novo_salario) {
    alteracaoContratual = `
      <remuneracao>
        <vrSalFx>${dados.novo_salario.toFixed(2)}</vrSalFx>
        <undSalFixo>5</undSalFixo>
      </remuneracao>`;
  } else if (dados.tipo_alteracao === 'jornada' && dados.nova_jornada) {
    alteracaoContratual = `
      <duracao>
        <qtdHrsSem>${dados.nova_jornada}</qtdHrsSem>
      </duracao>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAltContratual/v_S_01_02_00">
  <evtAltContratual Id="ID${dados.colaborador_id}">
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
    <altContratual>
      <dtAlteracao>${dados.data_alteracao}</dtAlteracao>
      <vinculo>${alteracaoContratual}
      </vinculo>
    </altContratual>
  </evtAltContratual>
</eSocial>`;
};

// S-2230: Afastamento Temporário
export const gerarXML_S2230 = (dados: DadosS2230): string => {
  let infoAtestado = '';
  
  if (dados.cid || dados.num_atestado || dados.nome_medico) {
    infoAtestado = `
      <infoAtestado>
        ${dados.cid ? `<codCID>${dados.cid}</codCID>` : ''}
        ${dados.num_atestado ? `<nrAtestado>${dados.num_atestado}</nrAtestado>` : ''}
        ${dados.nome_medico ? `
        <emitente>
          <nmEmit>${dados.nome_medico}</nmEmit>
          ${dados.crm_medico ? `<nrCRM>${dados.crm_medico}</nrCRM>` : ''}
        </emitente>` : ''}
      </infoAtestado>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAfastTemp/v_S_01_02_00">
  <evtAfastTemp Id="ID${dados.colaborador_id}">
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
    <infoAfastamento>
      <iniAfastamento>
        <dtIniAfast>${dados.data_inicio}</dtIniAfast>
        <codMotAfast>${dados.cod_motivo}</codMotAfast>${infoAtestado}
      </iniAfastamento>
      ${dados.data_fim ? `
      <fimAfastamento>
        <dtTermAfast>${dados.data_fim}</dtTermAfast>
      </fimAfastamento>` : ''}
    </infoAfastamento>
  </evtAfastTemp>
</eSocial>`;
};

export default {
  gerarXML_S2205,
  gerarXML_S2206,
  gerarXML_S2230,
  MOTIVOS_AFASTAMENTO_ESOCIAL,
};


// S-1000 - Informações do Empregador/Contribuinte
export interface DadosEmpregador {
  cnpjEmpregador: string;
  razaoSocial: string;
  nomeFantasia?: string;
  classTrib: string;
  natJurid: string;
  indCoop?: string;
  indConstr?: string;
  indDesFolha: string;
  indOpcCP?: string;
  indOptRegEletron: string;
  cnaePrep: string;
  contato: {
    nmCtt: string;
    cpfCtt: string;
    foneFixo?: string;
    foneCel?: string;
    email?: string;
  };
}

export function gerarXML_S1000(dados: DadosEmpregador): string {
  const id = gerarIdEvento('S1000', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtInfoEmpregador/v_S_01_02_00">
  <evtInfoEmpregador Id="${id}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoEmpregador>
      <inclusao>
        <idePeriodo>
          <iniValid>${new Date().toISOString().substring(0, 7).replace('-', '')}</iniValid>
        </idePeriodo>
        <infoCadastro>
          <classTrib>${dados.classTrib}</classTrib>
          <indCoop>${dados.indCoop || '0'}</indCoop>
          <indConstr>${dados.indConstr || '0'}</indConstr>
          <indDesFolha>${dados.indDesFolha}</indDesFolha>
          <indOptRegEletron>${dados.indOptRegEletron}</indOptRegEletron>
          <cnaePrep>${dados.cnaePrep}</cnaePrep>
          <dadosIsencao/>
          <contato>
            <nmCtt>${dados.contato.nmCtt}</nmCtt>
            <cpfCtt>${dados.contato.cpfCtt}</cpfCtt>
            ${dados.contato.foneFixo ? `<foneFixo>${dados.contato.foneFixo}</foneFixo>` : ''}
            ${dados.contato.foneCel ? `<foneCel>${dados.contato.foneCel}</foneCel>` : ''}
            ${dados.contato.email ? `<email>${dados.contato.email}</email>` : ''}
          </contato>
        </infoCadastro>
      </inclusao>
    </infoEmpregador>
  </evtInfoEmpregador>
</eSocial>`;
}

// S-2200 - Cadastramento Inicial do Vínculo e Admissão/Ingresso de Trabalhador
export interface DadosAdmissaoS2200 {
  cpfTrabalhador: string;
  nomeTrabalhador: string;
  sexo: string;
  racaCor: string;
  estCiv: string;
  grauInstr: string;
  nmSoc?: string;
  nascimento: {
    dtNascto: string;
    codMunic?: string;
    uf?: string;
    paisNascto: string;
    paisNac: string;
    nmMae?: string;
    nmPai?: string;
  };
  endereco: {
    tipo: string;
    dscLograd: string;
    nrLograd: string;
    complemento?: string;
    bairro?: string;
    cep: string;
    codMunic: string;
    uf: string;
  };
  trabalhador: {
    nisTrab: string;
    dtAdm: string;
    tpRegTrab: string;
    tpRegPrev: string;
    codCateg: string;
  };
  vinculo: {
    matricula: string;
    tpRegJor: string;
    natAtividade: string;
    dtBase?: string;
    cnpjSindCategProf?: string;
  };
  infoContrato: {
    codCargo?: string;
    codFuncao?: string;
    codCBO: string;
    vrSalFx: number;
    undSalFixo: string;
    tpContr: string;
    dscSalVar?: string;
  };
  cnpjEmpregador: string;
}

export function gerarXML_S2200(dados: DadosAdmissaoS2200): string {
  const id = gerarIdEvento('S2200', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmissao/v_S_01_02_00">
  <evtAdmissao Id="${id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <trabalhador>
      <cpfTrab>${dados.cpfTrabalhador}</cpfTrab>
      <nmTrab>${dados.nomeTrabalhador}</nmTrab>
      <sexo>${dados.sexo}</sexo>
      <racaCor>${dados.racaCor}</racaCor>
      <estCiv>${dados.estCiv}</estCiv>
      <grauInstr>${dados.grauInstr}</grauInstr>
      <nascimento>
        <dtNascto>${dados.nascimento.dtNascto}</dtNascto>
        <paisNascto>${dados.nascimento.paisNascto}</paisNascto>
        <paisNac>${dados.nascimento.paisNac}</paisNac>
      </nascimento>
      <endereco>
        <brasil>
          <tpLograd>${dados.endereco.tipo}</tpLograd>
          <dscLograd>${dados.endereco.dscLograd}</dscLograd>
          <nrLograd>${dados.endereco.nrLograd}</nrLograd>
          <bairro>${dados.endereco.bairro || ''}</bairro>
          <cep>${dados.endereco.cep}</cep>
          <codMunic>${dados.endereco.codMunic}</codMunic>
          <uf>${dados.endereco.uf}</uf>
        </brasil>
      </endereco>
    </trabalhador>
    <vinculo>
      <matricula>${dados.vinculo.matricula}</matricula>
      <tpRegTrab>${dados.trabalhador.tpRegTrab}</tpRegTrab>
      <tpRegPrev>${dados.trabalhador.tpRegPrev}</tpRegPrev>
      <cadIni>N</cadIni>
      <infoRegimeTrab>
        <infoCeletista>
          <dtAdm>${dados.trabalhador.dtAdm}</dtAdm>
          <tpAdmissao>1</tpAdmissao>
          <indAdmissao>1</indAdmissao>
          <tpRegJor>${dados.vinculo.tpRegJor}</tpRegJor>
          <natAtividade>${dados.vinculo.natAtividade}</natAtividade>
          <dtBase>${dados.vinculo.dtBase || '01'}</dtBase>
          <cnpjSindCategProf>${dados.vinculo.cnpjSindCategProf || ''}</cnpjSindCategProf>
        </infoCeletista>
      </infoRegimeTrab>
      <infoContrato>
        <codCargo>${dados.infoContrato.codCargo || ''}</codCargo>
        <codCBO>${dados.infoContrato.codCBO}</codCBO>
        <remuneracao>
          <vrSalFx>${dados.infoContrato.vrSalFx.toFixed(2)}</vrSalFx>
          <undSalFixo>${dados.infoContrato.undSalFixo}</undSalFixo>
        </remuneracao>
      </infoContrato>
    </vinculo>
  </evtAdmissao>
</eSocial>`;
}

// S-2299 - Desligamento
export interface DadosDesligamento {
  cpfTrabalhador: string;
  matricula: string;
  dtDeslig: string;
  mtvDeslig: string;
  dtProjFimAPI?: string;
  pensAlim?: string;
  percAliment?: number;
  vrAlim?: number;
  cnpjEmpregador: string;
  observacao?: string;
}

export function gerarXML_S2299(dados: DadosDesligamento): string {
  const id = gerarIdEvento('S2299', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtDeslig/v_S_01_02_00">
  <evtDeslig Id="${id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${dados.cpfTrabalhador}</cpfTrab>
      <matricula>${dados.matricula}</matricula>
    </ideVinculo>
    <infoDeslig>
      <mtvDeslig>${dados.mtvDeslig}</mtvDeslig>
      <dtDeslig>${dados.dtDeslig}</dtDeslig>
      <indPagtoAPI>N</indPagtoAPI>
      ${dados.pensAlim ? `<pensAlim>${dados.pensAlim}</pensAlim>` : ''}
      ${dados.percAliment ? `<percAliment>${dados.percAliment}</percAliment>` : ''}
      ${dados.vrAlim ? `<vrAlim>${dados.vrAlim.toFixed(2)}</vrAlim>` : ''}
      ${dados.observacao ? `<observacoes>${dados.observacao}</observacoes>` : ''}
    </infoDeslig>
  </evtDeslig>
</eSocial>`;
}

// S-2210 - Comunicação de Acidente de Trabalho (CAT)
export interface DadosCAT {
  cpfTrabalhador: string;
  matricula: string;
  dtAcid: string;
  hrAcid?: string;
  tpAcid: string;
  tpCat: string;
  codSitGeradora: string;
  iniciatCAT: string;
  ultDiaTrab?: string;
  houveAfast: string;
  localAcidente: {
    tpLocal: string;
    dscLocal?: string;
    codAmb?: string;
    tpLograd?: string;
    dscLograd?: string;
    nrLograd?: string;
    bairro?: string;
    cep?: string;
    codMunic?: string;
    uf?: string;
    pais?: string;
  };
  parteAtingida: {
    codParteAting: string;
    lateralidade: string;
  };
  agenteCausador: {
    codAgntCausworker: string;
  };
  atestado?: {
    codCID: string;
    dtAtendimento: string;
    hrAtendimento?: string;
    indInternacao: string;
    durTrat: number;
    indAfast: string;
  };
  cnpjEmpregador: string;
}

export function gerarXML_S2210(dados: DadosCAT): string {
  const id = gerarIdEvento('S2210', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCAT/v_S_01_02_00">
  <evtCAT Id="${id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${dados.cpfTrabalhador}</cpfTrab>
      <matricula>${dados.matricula}</matricula>
    </ideVinculo>
    <cat>
      <dtAcid>${dados.dtAcid}</dtAcid>
      <tpAcid>${dados.tpAcid}</tpAcid>
      ${dados.hrAcid ? `<hrAcid>${dados.hrAcid}</hrAcid>` : ''}
      <tpCat>${dados.tpCat}</tpCat>
      <indCatObito>N</indCatObito>
      ${dados.ultDiaTrab ? `<ultDiaTrab>${dados.ultDiaTrab}</ultDiaTrab>` : ''}
      <houveAfast>${dados.houveAfast}</houveAfast>
      <localAcidente>
        <tpLocal>${dados.localAcidente.tpLocal}</tpLocal>
        ${dados.localAcidente.dscLocal ? `<dscLocal>${dados.localAcidente.dscLocal}</dscLocal>` : ''}
      </localAcidente>
      <parteAtingida>
        <codParteAting>${dados.parteAtingida.codParteAting}</codParteAting>
        <lateralidade>${dados.parteAtingida.lateralidade}</lateralidade>
      </parteAtingida>
      <agenteCausador>
        <codAgntCausador>${dados.agenteCausador.codAgntCausworker}</codAgntCausador>
      </agenteCausador>
      ${dados.atestado ? `
      <atestado>
        <codCID>${dados.atestado.codCID}</codCID>
        <dtAtendimento>${dados.atestado.dtAtendimento}</dtAtendimento>
        <indInternacao>${dados.atestado.indInternacao}</indInternacao>
        <durTrat>${dados.atestado.durTrat}</durTrat>
        <indAfast>${dados.atestado.indAfast}</indAfast>
      </atestado>` : ''}
    </cat>
  </evtCAT>
</eSocial>`;
}

// S-3000 - Exclusão de Eventos
export interface DadosExclusao {
  tpEvento: string;
  nrRecEvt: string;
  cnpjEmpregador: string;
}

export function gerarXML_S3000(dados: DadosExclusao): string {
  const id = gerarIdEvento('S3000', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtExclusao/v_S_01_02_00">
  <evtExclusao Id="${id}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoExclusao>
      <tpEvento>${dados.tpEvento}</tpEvento>
      <nrRecEvt>${dados.nrRecEvt}</nrRecEvt>
    </infoExclusao>
  </evtExclusao>
</eSocial>`;
}


// S-1010 - Tabela de Rubricas
export interface DadosRubrica {
  codRubr: string;
  ideTabRubr: string;
  dscRubr: string;
  natRubr: string;
  tpRubr: string;
  codIncCP: string;
  codIncIRRF: string;
  codIncFGTS: string;
  cnpjEmpregador: string;
}

export function gerarXML_S1010(dados: DadosRubrica): string {
  const id = gerarIdEvento('S1010', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabRubrica/v_S_01_02_00">
  <evtTabRubrica Id="${id}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoRubrica>
      <inclusao>
        <ideRubrica>
          <codRubr>${dados.codRubr}</codRubr>
          <ideTabRubr>${dados.ideTabRubr}</ideTabRubr>
          <iniValid>${new Date().toISOString().substring(0, 7).replace('-', '')}</iniValid>
        </ideRubrica>
        <dadosRubrica>
          <dscRubr>${dados.dscRubr}</dscRubr>
          <natRubr>${dados.natRubr}</natRubr>
          <tpRubr>${dados.tpRubr}</tpRubr>
          <codIncCP>${dados.codIncCP}</codIncCP>
          <codIncIRRF>${dados.codIncIRRF}</codIncIRRF>
          <codIncFGTS>${dados.codIncFGTS}</codIncFGTS>
        </dadosRubrica>
      </inclusao>
    </infoRubrica>
  </evtTabRubrica>
</eSocial>`;
}

// S-1020 - Tabela de Lotações Tributárias
export interface DadosLotacao {
  codLotacao: string;
  tpLotacao: string;
  tpInsc?: string;
  nrInsc?: string;
  fpas: string;
  codTercs: string;
  codTercsSusp?: string;
  cnpjEmpregador: string;
}

export function gerarXML_S1020(dados: DadosLotacao): string {
  const id = gerarIdEvento('S1020', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabLotacao/v_S_01_02_00">
  <evtTabLotacao Id="${id}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoLotacao>
      <inclusao>
        <ideLotacao>
          <codLotacao>${dados.codLotacao}</codLotacao>
          <iniValid>${new Date().toISOString().substring(0, 7).replace('-', '')}</iniValid>
        </ideLotacao>
        <dadosLotacao>
          <tpLotacao>${dados.tpLotacao}</tpLotacao>
          <fpasLotacao>
            <fpas>${dados.fpas}</fpas>
            <codTercs>${dados.codTercs}</codTercs>
          </fpasLotacao>
        </dadosLotacao>
      </inclusao>
    </infoLotacao>
  </evtTabLotacao>
</eSocial>`;
}

// S-2220 - Monitoramento da Saúde do Trabalhador
export interface DadosASO {
  cpfTrabalhador: string;
  matricula: string;
  dtAso: string;
  tpAso: string;
  resAso: string;
  exames: Array<{
    dtExm: string;
    procRealizado: string;
    obsProc?: string;
    ordExame: string;
    indResult?: string;
  }>;
  medico: {
    cpfMed?: string;
    nisMed?: string;
    nmMed: string;
    nrCRM: string;
    ufCRM: string;
  };
  cnpjEmpregador: string;
}

export function gerarXML_S2220(dados: DadosASO): string {
  const id = gerarIdEvento('S2220', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_02_00">
  <evtMonit Id="${id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${dados.cpfTrabalhador}</cpfTrab>
      <matricula>${dados.matricula}</matricula>
    </ideVinculo>
    <aso>
      <dtAso>${dados.dtAso}</dtAso>
      <tpAso>${dados.tpAso}</tpAso>
      <resAso>${dados.resAso}</resAso>
      ${dados.exames.map(ex => `
      <exame>
        <dtExm>${ex.dtExm}</dtExm>
        <procRealizado>${ex.procRealizado}</procRealizado>
        <ordExame>${ex.ordExame}</ordExame>
        ${ex.indResult ? `<indResult>${ex.indResult}</indResult>` : ''}
      </exame>`).join('')}
      <medico>
        <nmMed>${dados.medico.nmMed}</nmMed>
        <nrCRM>${dados.medico.nrCRM}</nrCRM>
        <ufCRM>${dados.medico.ufCRM}</ufCRM>
      </medico>
    </aso>
  </evtMonit>
</eSocial>`;
}

// S-2190 - Registro Preliminar de Admissão
export interface DadosAdmPreliminar {
  cpfTrab: string;
  dtNascto: string;
  dtAdm: string;
  cnpjEmpregador: string;
}

export function gerarXML_S2190(dados: DadosAdmPreliminar): string {
  const id = gerarIdEvento('S2190', dados.cnpjEmpregador);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmPrelim/v_S_01_02_00">
  <evtAdmPrelim Id="${id}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${dados.cnpjEmpregador.substring(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoRegPrelim>
      <cpfTrab>${dados.cpfTrab}</cpfTrab>
      <dtNascto>${dados.dtNascto}</dtNascto>
      <dtAdm>${dados.dtAdm}</dtAdm>
    </infoRegPrelim>
  </evtAdmPrelim>
</eSocial>`;
}


// S-2200: Cadastramento Inicial do Vínculo e Admissão/Ingresso de Trabalhador
export function gerarXML_S2200(colaborador: ColaboradorData, empresa: EmpresaData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAdmissao/v_S_01_02_00">
  <evtAdmissao Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <trabalhador>
      <cpfTrab>${colaborador.cpf.replace(/\D/g, '')}</cpfTrab>
      <nmTrab>${colaborador.nome_completo}</nmTrab>
      <sexo>${colaborador.sexo === 'masculino' ? 'M' : 'F'}</sexo>
      <racaCor>1</racaCor>
      <estCiv>${colaborador.estado_civil === 'solteiro' ? '1' : colaborador.estado_civil === 'casado' ? '2' : '5'}</estCiv>
      <grauInstr>09</grauInstr>
      <nmSoc>${colaborador.nome_completo}</nmSoc>
      <nascimento>
        <dtNascto>${colaborador.data_nascimento}</dtNascto>
        <paisNascto>105</paisNascto>
      </nascimento>
    </trabalhador>
    <vinculo>
      <matricula>${colaborador.matricula || ''}</matricula>
      <tpRegTrab>1</tpRegTrab>
      <tpRegPrev>1</tpRegPrev>
      <cadIni>S</cadIni>
      <infoContrato>
        <dtAdm>${colaborador.data_admissao}</dtAdm>
        <tpContr>1</tpContr>
      </infoContrato>
    </vinculo>
  </evtAdmissao>
</eSocial>`;
}

// S-2299: Desligamento
export function gerarXML_S2299(colaborador: ColaboradorData, empresa: EmpresaData, desligamento: DesligamentoData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtDeslig/v_S_01_02_00">
  <evtDeslig Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${colaborador.cpf.replace(/\D/g, '')}</cpfTrab>
      <matricula>${colaborador.matricula || ''}</matricula>
    </ideVinculo>
    <infoDeslig>
      <mtvDeslig>${desligamento.motivo_codigo || '01'}</mtvDeslig>
      <dtDeslig>${desligamento.data_desligamento}</dtDeslig>
      <indPagtoAPI>S</indPagtoAPI>
      <dtProjFimAPI>${desligamento.data_desligamento}</dtProjFimAPI>
    </infoDeslig>
  </evtDeslig>
</eSocial>`;
}

// S-2210: Comunicação de Acidente de Trabalho (CAT)
export function gerarXML_S2210(colaborador: ColaboradorData, empresa: EmpresaData, acidente: AcidenteData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCAT/v_S_01_02_00">
  <evtCAT Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${colaborador.cpf.replace(/\D/g, '')}</cpfTrab>
      <matricula>${colaborador.matricula || ''}</matricula>
    </ideVinculo>
    <cat>
      <dtAcid>${acidente.data_acidente}</dtAcid>
      <tpAcid>${acidente.tipo || '1'}</tpAcid>
      <hrAcid>${acidente.hora || '0800'}</hrAcid>
      <hrsTrabAntesAcid>0400</hrsTrabAntesAcid>
      <tpCat>1</tpCat>
      <indCatObito>N</indCatObito>
      <dtObito></dtObito>
      <indComunPolworkscia>N</indComunPolicia>
      <codSitGeradora>200004300</codSitGeradora>
      <iniciatCAT>1</iniciatCAT>
    </cat>
  </evtCAT>
</eSocial>`;
}

// S-2220: Monitoramento da Saúde do Trabalhador (ASO)
export function gerarXML_S2220(colaborador: ColaboradorData, empresa: EmpresaData, aso: ASOData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_02_00">
  <evtMonit Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${colaborador.cpf.replace(/\D/g, '')}</cpfTrab>
      <matricula>${colaborador.matricula || ''}</matricula>
    </ideVinculo>
    <exMedOcup>
      <tpExameOcup>${aso.tipo || '0'}</tpExameOcup>
      <aso>
        <dtAso>${aso.data}</dtAso>
        <resAso>${aso.resultado || '1'}</resAso>
      </aso>
    </exMedOcup>
  </evtMonit>
</eSocial>`;
}

// S-1000: Informações do Empregador
export function gerarXML_S1000(empresa: EmpresaData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtInfoEmpregador/v_S_01_02_00">
  <evtInfoEmpregador Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoEmpregador>
      <inclusao>
        <idePeriodo>
          <iniValid>${dataAtual.slice(0, 7).replace('-', '')}</iniValid>
        </idePeriodo>
        <infoCadastro>
          <nmRazao>${empresa.razao_social}</nmRazao>
          <classTrib>01</classTrib>
          <natJurid>2062</natJurid>
          <indCoop>0</indCoop>
          <indConstr>0</indConstr>
          <indDesFolha>0</indDesFolha>
          <indOpcCP>0</indOpcCP>
          <indOptRegEletron>0</indOptRegEletron>
        </infoCadastro>
      </inclusao>
    </infoEmpregador>
  </evtInfoEmpregador>
</eSocial>`;
}

// S-3000: Exclusão de Eventos
export function gerarXML_S3000(empresa: EmpresaData, eventoId: string, tipoEvento: string): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtExclusao/v_S_01_02_00">
  <evtExclusao Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoExclusao>
      <tpEvento>${tipoEvento}</tpEvento>
      <nrRecEvt>${eventoId}</nrRecEvt>
    </infoExclusao>
  </evtExclusao>
</eSocial>`;
}

// Tipos auxiliares
interface DesligamentoData {
  data_desligamento: string;
  motivo_codigo?: string;
}

interface AcidenteData {
  data_acidente: string;
  tipo?: string;
  hora?: string;
}

interface ASOData {
  data: string;
  tipo?: string;
  resultado?: string;
}


// S-1010: Tabela de Rubricas
export function gerarXML_S1010(empresa: EmpresaData, rubrica: RubricaData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabRubrica/v_S_01_02_00">
  <evtTabRubrica Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoRubrica>
      <inclusao>
        <ideRubrica>
          <codRubr>${rubrica.codigo}</codRubr>
          <ideTabRubr>1</ideTabRubr>
          <iniValid>${dataAtual.slice(0, 7).replace('-', '')}</iniValid>
        </ideRubrica>
        <dadosRubrica>
          <dscRubr>${rubrica.descricao}</dscRubr>
          <natRubr>${rubrica.natureza || '1000'}</natRubr>
          <tpRubr>${rubrica.tipo || '1'}</tpRubr>
          <codIncCP>${rubrica.incidencia_cp || '11'}</codIncCP>
          <codIncIRRF>${rubrica.incidencia_irrf || '11'}</codIncIRRF>
          <codIncFGTS>${rubrica.incidencia_fgts || '11'}</codIncFGTS>
        </dadosRubrica>
      </inclusao>
    </infoRubrica>
  </evtTabRubrica>
</eSocial>`;
}

// S-1020: Tabela de Lotações Tributárias
export function gerarXML_S1020(empresa: EmpresaData, lotacao: LotacaoData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabLotacao/v_S_01_02_00">
  <evtTabLotacao Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <infoLotacao>
      <inclusao>
        <ideLotacao>
          <codLotacao>${lotacao.codigo}</codLotacao>
          <iniValid>${dataAtual.slice(0, 7).replace('-', '')}</iniValid>
        </ideLotacao>
        <dadosLotacao>
          <tpLotacao>${lotacao.tipo || '01'}</tpLotacao>
          <fpasLotacao>
            <fpas>${lotacao.fpas || '515'}</fpas>
            <codTercs>${lotacao.cod_tercs || '0000'}</codTercs>
          </fpasLotacao>
        </dadosLotacao>
      </inclusao>
    </infoLotacao>
  </evtTabLotacao>
</eSocial>`;
}

// S-2240: Condições Ambientais do Trabalho - Agentes Nocivos
export function gerarXML_S2240(colaborador: ColaboradorData, empresa: EmpresaData, condicao: CondicaoAmbientalData): string {
  const dataAtual = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtExpRisco/v_S_01_02_00">
  <evtExpRisco Id="ID${empresa.cnpj}${dataAtual.replace(/-/g, '')}${Math.random().toString().slice(2, 8)}">
    <ideEvento>
      <indRetif>1</indRetif>
      <tpAmb>2</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${empresa.cnpj.replace(/\D/g, '').slice(0, 8)}</nrInsc>
    </ideEmpregador>
    <ideVinculo>
      <cpfTrab>${colaborador.cpf.replace(/\D/g, '')}</cpfTrab>
      <matricula>${colaborador.matricula || ''}</matricula>
    </ideVinculo>
    <infoExpRisco>
      <dtIniCondicao>${condicao.data_inicio}</dtIniCondicao>
      <infoAmb>
        <codAmb>${condicao.codigo_ambiente}</codAmb>
      </infoAmb>
      <infoAtiv>
        <dscAtivDes>${condicao.descricao_atividade}</dscAtivDes>
      </infoAtiv>
    </infoExpRisco>
  </evtExpRisco>
</eSocial>`;
}

// Tipos auxiliares adicionais
interface RubricaData {
  codigo: string;
  descricao: string;
  natureza?: string;
  tipo?: string;
  incidencia_cp?: string;
  incidencia_irrf?: string;
  incidencia_fgts?: string;
}

interface LotacaoData {
  codigo: string;
  tipo?: string;
  fpas?: string;
  cod_tercs?: string;
}

interface CondicaoAmbientalData {
  data_inicio: string;
  codigo_ambiente: string;
  descricao_atividade: string;
}
