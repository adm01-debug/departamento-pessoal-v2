export interface MultaFGTSInput { saldoFGTS: number; tipoRescisao: "SEM_JUSTA_CAUSA" | "CULPA_RECIPROCA" | "FORCA_MAIOR" | "ACORDO" | "JUSTA_CAUSA" | "PEDIDO_DEMISSAO"; depositosMesRescisao?: number; }
export interface MultaFGTSResult { saldoBase: number; percentualMulta: number; valorMulta: number; totalSaque: number; sacaContaVinculada: boolean; descricao: string; }
const PERCENTUAIS: Record<string, { multa: number; saca: boolean; desc: string }> = {
  SEM_JUSTA_CAUSA: { multa: 40, saca: true, desc: "Dispensa sem justa causa - 40% de multa" },
  CULPA_RECIPROCA: { multa: 20, saca: true, desc: "Culpa recíproca - 20% de multa" },
  FORCA_MAIOR: { multa: 20, saca: true, desc: "Força maior - 20% de multa" },
  ACORDO: { multa: 20, saca: true, desc: "Acordo (reforma trabalhista) - 20% de multa, saque 80%" },
  JUSTA_CAUSA: { multa: 0, saca: false, desc: "Justa causa - sem multa, sem saque" },
  PEDIDO_DEMISSAO: { multa: 0, saca: false, desc: "Pedido de demissão - sem multa, sem saque" },
};
export function calcularMultaFGTS(input: MultaFGTSInput): MultaFGTSResult {
  const { saldoFGTS, tipoRescisao, depositosMesRescisao = 0 } = input;
  const config = PERCENTUAIS[tipoRescisao] || PERCENTUAIS.SEM_JUSTA_CAUSA;
  const saldoBase = saldoFGTS + depositosMesRescisao;
  const valorMulta = Number((saldoBase * (config.multa / 100)).toFixed(2));
  let totalSaque = config.saca ? saldoBase + valorMulta : 0;
  if (tipoRescisao === "ACORDO") totalSaque = saldoBase * 0.8 + valorMulta;
  return { saldoBase: Number(saldoBase.toFixed(2)), percentualMulta: config.multa, valorMulta, totalSaque: Number(totalSaque.toFixed(2)), sacaContaVinculada: config.saca, descricao: config.desc };
}
export function calcularDepositoRescisorio(remuneracaoMes: number, diasTrabalhados: number, diasMes: number = 30): number {
  const proporcional = (remuneracaoMes / diasMes) * diasTrabalhados;
  return Number((proporcional * 0.08).toFixed(2));
}
export default { calcularMultaFGTS, calcularDepositoRescisorio };
