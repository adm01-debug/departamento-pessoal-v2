import { Colaborador } from '@/types/colaborador';
import { Empresa } from '@/types/empresa';

// S-1005 - Tabela de Estabelecimentos
export function gerarEventoS1005(empresa: Empresa): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabEstab/v_S_01_02_00">
  <evtTabEstab Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <ideEmpregador><tpInsc>1</tpInsc><nrInsc>${empresa.cnpj?.slice(0, 8)}</nrInsc></ideEmpregador>
    <infoEstab>
      <inclusao>
        <ideEstab><tpInsc>1</tpInsc><nrInsc>${empresa.cnpj}</nrInsc></ideEstab>
        <dadosEstab>
          <cnaePrep>${empresa.cnae_principal ?? '0000000'}</cnaePrep>
          <endereco>
            <brasil><tpLograd>R</tpLograd><dscLograd>${empresa.endereco ?? ''}</dscLograd><nrLograd>${empresa.numero ?? 'SN'}</nrLograd><bairro>${empresa.bairro ?? ''}</bairro><cep>${empresa.cep ?? ''}</cep><codMunic>${empresa.cidade ?? ''}</codMunic><uf>${empresa.uf ?? ''}</uf></brasil>
          </endereco>
        </dadosEstab>
      </inclusao>
    </infoEstab>
  </evtTabEstab>
</eSocial>`;
}

// S-1030 - Tabela de Cargos
export function gerarEventoS1030(cargo: { codigo: string; nome: string; cbo: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabCargo/v_S_01_02_00">
  <evtTabCargo Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <infoCargo>
      <inclusao>
        <ideCargo><codCargo>${cargo.codigo}</codCargo><iniValid>2024-01</iniValid></ideCargo>
        <dadosCargo><nmCargo>${cargo.nome}</nmCargo><codCBO>${cargo.cbo}</codCBO></dadosCargo>
      </inclusao>
    </infoCargo>
  </evtTabCargo>
</eSocial>`;
}

// S-1040 - Tabela de Funções
export function gerarEventoS1040(funcao: { codigo: string; nome: string; cbo: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabFuncao/v_S_01_02_00">
  <evtTabFuncao Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <infoFuncao>
      <inclusao>
        <ideFuncao><codFuncao>${funcao.codigo}</codFuncao><iniValid>2024-01</iniValid></ideFuncao>
        <dadosFuncao><dscFuncao>${funcao.nome}</dscFuncao><codCBO>${funcao.cbo}</codCBO></dadosFuncao>
      </inclusao>
    </infoFuncao>
  </evtTabFuncao>
</eSocial>`;
}

// S-1050 - Tabela de Horários
export function gerarEventoS1050(horario: { codigo: string; entrada: string; saida: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabHorTur/v_S_01_02_00">
  <evtTabHorTur Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <infoHorContratual>
      <inclusao>
        <ideHorContratual><codHorContrat>${horario.codigo}</codHorContrat><iniValid>2024-01</iniValid></ideHorContratual>
        <dadosHorContratual>
          <hrEntr>${horario.entrada}</hrEntr>
          <hrSaida>${horario.saida}</hrSaida>
          <durJwornad>08:00</durJwornad>
          <perHorFlworx>N</perHorFlworx>
        </dadosHorContratual>
      </inclusao>
    </infoHorContratual>
  </evtTabHorTur>
</eSocial>`;
}

// S-1060 - Tabela de Ambientes de Trabalho
export function gerarEventoS1060(ambiente: { codigo: string; descricao: string; localAmb: number }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabAmbiente/v_S_01_02_00">
  <evtTabAmbiente Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <infoAmbiente>
      <inclusao>
        <ideAmbiente><codAmb>${ambiente.codigo}</codAmb><iniValid>2024-01</iniValid></ideAmbiente>
        <dadosAmbiente><dscAmb>${ambiente.descricao}</dscAmb><localAmb>${ambiente.localAmb}</localAmb><tpInsc>1</tpInsc></dadosAmbiente>
      </inclusao>
    </infoAmbiente>
  </evtTabAmbiente>
</eSocial>`;
}

// S-1070 - Tabela de Processos
export function gerarEventoS1070(processo: { nrProc: string; indSusp: number; codSusp?: string }): string {
  return `<?xml version="1.0"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabProcesso/v_S_01_02_00">
  <evtTabProcesso Id="ID${Date.now()}">
    <ideEvento><tpAmb>1</tpAmb><procEmi>1</procEmi><verProc>1.0</verProc></ideEvento>
    <infoProcesso>
      <inclusao>
        <ideProcesso><tpProc>1</tpProc><nrProc>${processo.nrProc}</nrProc><iniValid>2024-01</iniValid></ideProcesso>
        <dadosProc><indSusp>${processo.indSusp}</indSusp>${processo.codSusp ? `<codSusp>${processo.codSusp}</codSusp>` : ''}</dadosProc>
      </inclusao>
    </infoProcesso>
  </evtTabProcesso>
</eSocial>`;
}

export default {
  gerarEventoS1005,
  gerarEventoS1030,
  gerarEventoS1040,
  gerarEventoS1050,
  gerarEventoS1060,
  gerarEventoS1070,
};

