export interface Escala { id: string; nome: string; tipo: "5X2" | "6X1" | "12X36" | "PLANTAO" | "PERSONALIZADA"; turnos: { nome: string; horaInicio: string; horaFim: string; diasSemana: number[] }[]; }
export function gerarEscalaMensal(escala: Escala, mes: number, ano: number): { data: Date; turno: string; colaboradores: string[] }[] { return []; }
export default gerarEscalaMensal;
