export interface Atestado { id: string; colaboradorId: string; dataInicio: Date; dataFim: Date; dias: number; cid?: string; medico: string; crm: string; validado: boolean; }
export function validarAtestado(atestado: Atestado): { valido: boolean; erros: string[] } { const erros: string[] = []; if (!atestado.crm) erros.push("CRM obrigatório"); if (atestado.dias <= 0) erros.push("Dias inválidos"); return { valido: erros.length === 0, erros }; }
export default validarAtestado;
