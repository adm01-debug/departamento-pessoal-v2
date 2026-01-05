export interface MultaFGTSInput { saldoFGTS: number; tipoRescisao: "SEM_JUSTA_CAUSA" | "CULPA_RECIPROCA" | "FORCA_MAIOR" | "ACORDO" | "JUSTA_CAUSA"; depositosMesRescisao?: number; }
export interface MultaFGTSResult { baseCalculo: number; percentualMulta: number; valorMulta: number; valorSaque: number; totalLiberado: number; }
export function calculoMultaFGTS(input: MultaFGTSInput): MultaFGTSResult {
  const baseCalculo = input.saldoFGTS + (input.depositosMesRescisao || 0);
  let percentualMulta = 0, valorSaque = 0;
  switch (input.tipoRescisao) {
    case "SEM_JUSTA_CAUSA": percentualMulta = 40; valorSaque = baseCalculo; break;
    case "CULPA_RECIPROCA": case "FORCA_MAIOR": percentualMulta = 20; valorSaque = baseCalculo; break;
    case "ACORDO": percentualMulta = 20; valorSaque = baseCalculo * 0.8; break;
    case "JUSTA_CAUSA": percentualMulta = 0; valorSaque = 0; break;
  }
  return { baseCalculo, percentualMulta, valorMulta: baseCalculo * percentualMulta / 100, valorSaque, totalLiberado: valorSaque + baseCalculo * percentualMulta / 100 };
}
export default calculoMultaFGTS;
