export interface RegistroSPED { tipo: string; campos: string[]; }
export function gerarSPEDFiscal(empresa: any, periodo: string): string {
  const registros = [`|0000|${periodo}|SPED FISCAL|`, `|0001|0|`, `|9999|`];
  return registros.join('\n');
}
export function gerarSPEDContabil(empresa: any, periodo: string): string {
  return `|0000|LECD|${periodo}|\n|I001|0|\n|9999|`;
}
export default gerarSPEDFiscal;
