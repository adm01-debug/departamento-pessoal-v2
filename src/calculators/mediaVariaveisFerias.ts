// V20-CALC001: Calculo Media Variaveis Ferias
export interface MediaVariaveis {
  horasExtras: number;
  comissoes: number;
  adicionalNoturno: number;
  outros: number;
  total: number;
}

export const calcularMediaVariaveis = (lancamentos: any[], meses: number = 12): MediaVariaveis => {
  const totais = lancamentos.reduce((acc, lanc) => {
    acc.horasExtras += lanc.horasExtras || 0;
    acc.comissoes += lanc.comissoes || 0;
    acc.adicionalNoturno += lanc.adicionalNoturno || 0;
    acc.outros += lanc.outros || 0;
    return acc;
  }, { horasExtras: 0, comissoes: 0, adicionalNoturno: 0, outros: 0 });

  return {
    horasExtras: totais.horasExtras / meses,
    comissoes: totais.comissoes / meses,
    adicionalNoturno: totais.adicionalNoturno / meses,
    outros: totais.outros / meses,
    total: Object.values(totais).reduce((a: number, b: number) => a + b, 0) / meses
  };
};
