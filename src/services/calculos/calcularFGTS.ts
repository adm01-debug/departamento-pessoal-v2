const ALIQUOTA_FGTS = 0.08;
export function calcularFGTS(salarioBruto: number): { valor: number; aliquota: number } {
  if (salarioBruto <= 0) return { valor: 0, aliquota: 0 };
  const valor = salarioBruto * ALIQUOTA_FGTS;
  return { valor: Math.round(valor * 100) / 100, aliquota: ALIQUOTA_FGTS * 100 };
}
export function calcularMultaFGTS(saldoFGTS: number, tipo: "SEM_JUSTA_CAUSA" | "ACORDO" | "JUSTA_CAUSA"): number {
  if (tipo === "JUSTA_CAUSA") return 0;
  const percentual = tipo === "ACORDO" ? 0.20 : 0.40;
  return Math.round(saldoFGTS * percentual * 100) / 100;
}
export default calcularFGTS;
