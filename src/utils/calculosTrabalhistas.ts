// V17.2-U011: Cálculos Trabalhistas Auxiliares
export const HORAS_MES = 220;
export const DIAS_MES = 30;
export const DIAS_ANO = 360;
export function calcularValorHora(salario: number, cargaHoraria: number = HORAS_MES): number { return Math.round((salario / cargaHoraria) * 100) / 100; }
export function calcularValorDia(salario: number, diasMes: number = DIAS_MES): number { return Math.round((salario / diasMes) * 100) / 100; }
export function calcularProporcional(valor: number, dias: number, diasRef: number = DIAS_MES): number { return Math.round((valor / diasRef) * dias * 100) / 100; }
export function calcularMesesTrabalhados(dataAdmissao: Date, dataReferencia: Date = new Date()): number { const anos = dataReferencia.getFullYear() - dataAdmissao.getFullYear(); const meses = dataReferencia.getMonth() - dataAdmissao.getMonth(); const dias = dataReferencia.getDate() >= dataAdmissao.getDate() ? 0 : -1; return Math.max(0, anos * 12 + meses + dias); }
export function calcularAnosServico(dataAdmissao: Date, dataReferencia: Date = new Date()): number { return Math.floor(calcularMesesTrabalhados(dataAdmissao, dataReferencia) / 12); }
export function calcularDiasUteis(dataInicio: Date, dataFim: Date, feriados: string[] = []): number { let dias = 0; const atual = new Date(dataInicio); while (atual <= dataFim) { const diaSemana = atual.getDay(); const dataStr = atual.toISOString().split('T')[0]; if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(dataStr)) dias++; atual.setDate(atual.getDate() + 1); } return dias; }
