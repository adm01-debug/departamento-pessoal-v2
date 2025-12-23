/**
 * Eventos SST do eSocial
 * S-2210 a S-2240
 */

export function gerarEventoS2210(dados: { cpfTrab: string; dtAcid: string; hrAcid: string; tpAcid: string; codAgntCauswordr: string }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCAT/v_S_01_02_00">
    <evtCAT><ideVinculo><cpfTrab>${dados.cpfTrab}</cpfTrab></ideVinculo>
      <cat><dtAcid>${dados.dtAcid}</dtAcid><hrAcid>${dados.hrAcid}</hrAcid><tpAcid>${dados.tpAcid}</tpAcid>
        <codAgntCauswordr>${dados.codAgntCauswordr}</codAgntCauswordr>
      </cat>
    </evtCAT>
  </eSocial>`;
}

export function gerarEventoS2220(dados: { cpfTrab: string; dtExam: string; tpExameOcup: string; ordExame: string }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtMonit/v_S_01_02_00">
    <evtMonit><ideVinculo><cpfTrab>${dados.cpfTrab}</cpfTrab></ideVinculo>
      <exMedOcup><tpExameOcup>${dados.tpExameOcup}</tpExameOcup>
        <aso><dtAso>${dados.dtExam}</dtAso><ordExame>${dados.ordExame}</ordExame></aso>
      </exMedOcup>
    </evtMonit>
  </eSocial>`;
}

export function gerarEventoS2230(dados: { cpfTrab: string; dtIniAfast: string; codMotAfast: string; dtTermAfast?: string }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAfastTemp/v_S_01_02_00">
    <evtAfastTemp><ideVinculo><cpfTrab>${dados.cpfTrab}</cpfTrab></ideVinculo>
      <infoAfastamento><iniAfastamento><dtIniAfast>${dados.dtIniAfast}</dtIniAfast><codMotAfast>${dados.codMotAfast}</codMotAfast></iniAfastamento>
        ${dados.dtTermAfast ? `<fimAfastamento><dtTermAfast>${dados.dtTermAfast}</dtTermAfast></fimAfastamento>` : ''}
      </infoAfastamento>
    </evtAfastTemp>
  </eSocial>`;
}

export function gerarEventoS2240(dados: { cpfTrab: string; dtIniCondicao: string; codAgNoc: string; dscAgNoc: string }): string {
  return `<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtExpRisco/v_S_01_02_00">
    <evtExpRisco><ideVinculo><cpfTrab>${dados.cpfTrab}</cpfTrab></ideVinculo>
      <infoExpRisco><dtIniCondicao>${dados.dtIniCondicao}</dtIniCondicao>
        <agNoc><codAgNoc>${dados.codAgNoc}</codAgNoc><dscAgNoc>${dados.dscAgNoc}</dscAgNoc></agNoc>
      </infoExpRisco>
    </evtExpRisco>
  </eSocial>`;
}

export const TIPOS_EXAME_OCUPACIONAL = {
  '0': 'Exame admissional',
  '1': 'Exame periódico',
  '2': 'Exame de retorno ao trabalho',
  '3': 'Exame de mudança de riscos',
  '4': 'Exame demissional',
} as const;

export const MOTIVOS_AFASTAMENTO = {
  '01': 'Acidente/doença do trabalho',
  '03': 'Acidente/doença não relacionada ao trabalho',
  '06': 'Licença maternidade',
  '15': 'Gozo de férias',
  '17': 'Licença remunerada',
  '21': 'Licença não remunerada',
} as const;
