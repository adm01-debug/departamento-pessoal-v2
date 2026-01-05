export interface Viagem { id: string; colaboradorId: string; destino: string; dataInicio: Date; dataFim: Date; motivo: string; diarias: number; valorDiaria: number; passagens: number; hospedagem: number; status: "SOLICITADA" | "APROVADA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA"; }
export function calcularCustoViagem(viagem: Viagem): number { return (viagem.diarias * viagem.valorDiaria) + viagem.passagens + viagem.hospedagem; }
export default calcularCustoViagem;
