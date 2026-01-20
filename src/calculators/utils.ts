// V18-C002/C003: Utils Calculadoras - Validacao e Logging
export interface LogCalculo { funcao: string; entrada: Record<string, unknown>; saida: unknown; timestamp: string; }
const logs: LogCalculo[] = [];
export function registrarCalculo(log: Omit<LogCalculo, 'timestamp'>): void {
  logs.push({ ...log, timestamp: new Date().toISOString() });
  if (logs.length > 1000) logs.shift();
}
export function getLogs(): LogCalculo[] { return [...logs]; }
export function validarPositivo(valor: number, campo: string): void {
  if (valor < 0) throw new Error(`${campo} nao pode ser negativo`);
}
export function arredondarMoeda(valor: number): number { return Math.round(valor * 100) / 100; }
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
