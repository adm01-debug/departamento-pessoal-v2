export interface Afastamento { id: string; colaboradorId: string; tipo: "DOENCA" | "ACIDENTE_TRABALHO" | "MATERNIDADE" | "PATERNIDADE" | "SERVICO_MILITAR" | "MANDATO_SINDICAL" | "OUTROS"; dataInicio: Date; dataFim: Date; dias: number; inss: boolean; documentoId?: string; }
export function calcularDiasAfastamento(inicio: Date, fim: Date): number { return Math.ceil((fim.getTime() - inicio.getTime()) / 86400000) + 1; }
export function verificarCarenciaINSS(tipo: string, dias: number): boolean { return tipo === "DOENCA" && dias > 15; }
export default calcularDiasAfastamento;
