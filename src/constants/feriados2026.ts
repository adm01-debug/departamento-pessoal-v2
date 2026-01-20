// V20-019: Feriados Nacionais Brasil 2026
export interface Feriado {
  data: string;
  nome: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'facultativo';
}

export const FERIADOS_2026: Feriado[] = [
  { data: '2026-01-01', nome: 'Confraternização Universal', tipo: 'nacional' },
  { data: '2026-02-16', nome: 'Carnaval', tipo: 'facultativo' },
  { data: '2026-02-17', nome: 'Carnaval', tipo: 'facultativo' },
  { data: '2026-02-18', nome: 'Quarta-feira de Cinzas', tipo: 'facultativo' },
  { data: '2026-04-03', nome: 'Sexta-feira Santa', tipo: 'nacional' },
  { data: '2026-04-05', nome: 'Páscoa', tipo: 'nacional' },
  { data: '2026-04-21', nome: 'Tiradentes', tipo: 'nacional' },
  { data: '2026-05-01', nome: 'Dia do Trabalho', tipo: 'nacional' },
  { data: '2026-06-04', nome: 'Corpus Christi', tipo: 'facultativo' },
  { data: '2026-09-07', nome: 'Independência do Brasil', tipo: 'nacional' },
  { data: '2026-10-12', nome: 'Nossa Senhora Aparecida', tipo: 'nacional' },
  { data: '2026-11-02', nome: 'Finados', tipo: 'nacional' },
  { data: '2026-11-15', nome: 'Proclamação da República', tipo: 'nacional' },
  { data: '2026-12-25', nome: 'Natal', tipo: 'nacional' }
];

export function isFeriado(data: Date | string): Feriado | undefined {
  const dataStr = typeof data === 'string' ? data : data.toISOString().split('T')[0];
  return FERIADOS_2026.find(f => f.data === dataStr);
}

export function getFeriadosMes(mes: number, ano: number = 2026): Feriado[] {
  const mesStr = String(mes).padStart(2, '0');
  return FERIADOS_2026.filter(f => f.data.startsWith(`${ano}-${mesStr}`));
}

export function contarDiasUteis(inicio: Date, fim: Date): number {
  let count = 0;
  const current = new Date(inicio);
  while (current <= fim) {
    const dia = current.getDay();
    const dataStr = current.toISOString().split('T')[0];
    if (dia !== 0 && dia !== 6 && !FERIADOS_2026.some(f => f.data === dataStr)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export default FERIADOS_2026;
