export interface Competencia { id: string; colaboradorId: string; nome: string; nivel: "BASICO" | "INTERMEDIARIO" | "AVANCADO" | "ESPECIALISTA"; dataAvaliacao: Date; }
export interface MatrizCompetencias { cargoId: string; competencias: { nome: string; nivelMinimo: string }[]; }
export function avaliarGap(atual: Competencia[], requerido: MatrizCompetencias): { competencia: string; gap: number }[] { return []; }
export default avaliarGap;
