// V17.2-U015: Utilitários de Formatação Geral
export function formatarPercentual(valor: number, casas: number = 2): string { return `${valor.toFixed(casas)}%`; }
export function formatarHoras(minutos: number): string { const h = Math.floor(minutos / 60); const m = minutos % 60; return `${h}h${m.toString().padStart(2, '0')}min`; }
export function formatarCompetencia(competencia: string): string { const [ano, mes] = competencia.split('-'); const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; return `${meses[parseInt(mes) - 1]}/${ano}`; }
export function formatarMatricula(matricula: string | number): string { return String(matricula).padStart(6, '0'); }
export function formatarCTPS(numero: string, serie: string, uf: string): string { return `${numero} / ${serie} - ${uf}`; }
export function formatarBanco(codigo: string, agencia: string, conta: string, digito: string): string { return `Banco ${codigo} - Ag: ${agencia} - C/C: ${conta}-${digito}`; }
