export interface Reembolso { id: string; colaboradorId: string; tipo: "COMBUSTIVEL" | "ALIMENTACAO" | "TRANSPORTE" | "MATERIAL" | "OUTROS"; valor: number; data: Date; descricao: string; comprovante: string; status: "PENDENTE" | "APROVADO" | "PAGO" | "REJEITADO"; }
export function validarReembolso(reembolso: Reembolso, limites: Record<string, number>): boolean { return reembolso.valor <= (limites[reembolso.tipo] || Infinity); }
export default validarReembolso;
