export interface HoraExtra { id: string; colaboradorId: string; data: Date; horaInicio: string; horaFim: string; minutos: number; tipo: "50%" | "100%" | "NOTURNA"; justificativa: string; aprovada: boolean; }
export function calcularMinutosHE(inicio: string, fim: string): number { const [hi, mi] = inicio.split(":").map(Number); const [hf, mf] = fim.split(":").map(Number); return (hf * 60 + mf) - (hi * 60 + mi); }
export default calcularMinutosHE;
