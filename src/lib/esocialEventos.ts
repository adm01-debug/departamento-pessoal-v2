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
