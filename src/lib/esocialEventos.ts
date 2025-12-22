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
