export interface Plantao { id: string; colaboradorId: string; data: Date; horaInicio: string; horaFim: string; tipo: "DIURNO" | "NOTURNO" | "24H"; valor: number; }
export function calcularValorPlantao(tipo: string, valorBase: number): number { const multiplicadores = { DIURNO: 1, NOTURNO: 1.2, "24H": 2.4 }; return valorBase * (multiplicadores[tipo as keyof typeof multiplicadores] || 1); }
export default calcularValorPlantao;
