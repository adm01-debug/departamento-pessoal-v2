// V17.2-C002: Constantes eSocial
export const AMBIENTE_ESOCIAL = { PRODUCAO: 1, PRODUCAO_RESTRITA: 2 };
export const TIPO_INSCRICAO = { CNPJ: 1, CPF: 2, CAEPF: 3, CNO: 4 };
export const TIPOS_EVENTO = {
  TABELAS: ['S-1000', 'S-1005', 'S-1010', 'S-1020', 'S-1070'],
  NAO_PERIODICOS: ['S-2190', 'S-2200', 'S-2205', 'S-2206', 'S-2210', 'S-2220', 'S-2230', 'S-2240', 'S-2250', 'S-2260', 'S-2298', 'S-2299', 'S-2300', 'S-2306', 'S-2399', 'S-2400', 'S-3000'],
  PERIODICOS: ['S-1200', 'S-1210', 'S-1260', 'S-1270', 'S-1280', 'S-1298', 'S-1299'],
  TOTALIZADORES: ['S-5001', 'S-5002', 'S-5003', 'S-5011', 'S-5012', 'S-5013'],
};
export const MOTIVOS_DESLIGAMENTO = {
  '01': 'Rescisão sem justa causa, por iniciativa do empregador',
  '02': 'Rescisão por término de contrato a termo',
  '03': 'Rescisão por pedido de demissão',
  '04': 'Rescisão por justa causa',
  '05': 'Rescisão indireta',
  '06': 'Rescisão por falecimento',
  '07': 'Rescisão por aposentadoria',
  '08': 'Rescisão por acordo (art. 484-A CLT)',
};
export const CATEGORIAS_TRABALHADOR = {
  '101': 'Empregado Geral',
  '102': 'Empregado Rural',
  '103': 'Empregado Aprendiz',
  '104': 'Empregado Doméstico',
  '105': 'Contrato a termo - Lei 9601/98',
  '106': 'Trabalhador Temporário',
  '107': 'Contrato intermitente',
  '108': 'Contrato trabalho verde e amarelo',
};
