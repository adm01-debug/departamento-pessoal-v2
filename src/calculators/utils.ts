// V18-C002-C008: Utils para Calculadoras
export const validarInput = (valor: number, nome: string): { valido: boolean; erro?: string } => {
  if (typeof valor !== "number" || isNaN(valor)) return { valido: false, erro: `${nome} deve ser um número válido` };
  if (valor < 0) return { valido: false, erro: `${nome} não pode ser negativo` };
  return { valido: true };
};

export const arredondar = (valor: number, casas: number = 2): number => {
  const fator = Math.pow(10, casas);
  return Math.round(valor * fator) / fator;
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
};

export const calcularProporcional = (valor: number, diasTrabalhados: number, diasMes: number = 30): number => {
  return arredondar((valor / diasMes) * diasTrabalhados);
};

export const calcularReflexoDSR = (valorVariaveis: number, diasUteis: number, diasDSR: number): number => {
  if (diasUteis === 0) return 0;
  return arredondar((valorVariaveis / diasUteis) * diasDSR);
};

export const calcularMedia = (valores: number[], ignorarZeros: boolean = false): number => {
  const filtrados = ignorarZeros ? valores.filter(v => v > 0) : valores;
  if (filtrados.length === 0) return 0;
  return arredondar(filtrados.reduce((a, b) => a + b, 0) / filtrados.length);
};

// Logging para auditoria
export const logCalculo = (tipo: string, entrada: Record<string, unknown>, saida: unknown): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[CALC] ${tipo}:`, { entrada, saida, timestamp: new Date().toISOString() });
  }
};

// Validação de período aquisitivo
export const calcularMesesTrabalhados = (dataAdmissao: string, dataReferencia: string): number => {
  const admissao = new Date(dataAdmissao);
  const referencia = new Date(dataReferencia);
  const diffTime = referencia.getTime() - admissao.getTime();
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
  return Math.floor(diffMonths);
};

// Cálculo de anos para aviso prévio
export const calcularAnosTrabalhados = (dataAdmissao: string, dataDemissao: string): number => {
  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);
  const diffTime = demissao.getTime() - admissao.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
};
