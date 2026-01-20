// V20-003: Calculadora de Jornada de Trabalho
export interface JornadaParams {
  horaEntrada: string;
  horaSaida: string;
  intervalo: number; // minutos
  tolerancia?: number; // minutos
}

export interface ResultadoJornada {
  horasTrabalhadas: number;
  minutosExtras: number;
  minutosAtraso: number;
  jornadaCompleta: boolean;
  saldoMinutos: number;
}

export function calcularJornada(params: JornadaParams, jornadaPadrao = 480): ResultadoJornada {
  const { horaEntrada, horaSaida, intervalo, tolerancia = 10 } = params;
  
  const [hE, mE] = horaEntrada.split(':').map(Number);
  const [hS, mS] = horaSaida.split(':').map(Number);
  
  const minutosEntrada = hE * 60 + mE;
  const minutosSaida = hS * 60 + mS;
  
  const totalMinutos = minutosSaida - minutosEntrada - intervalo;
  const horasTrabalhadas = Math.round((totalMinutos / 60) * 100) / 100;
  
  const saldoMinutos = totalMinutos - jornadaPadrao;
  const minutosExtras = saldoMinutos > tolerancia ? saldoMinutos : 0;
  const minutosAtraso = saldoMinutos < -tolerancia ? Math.abs(saldoMinutos) : 0;
  
  return {
    horasTrabalhadas,
    minutosExtras,
    minutosAtraso,
    jornadaCompleta: Math.abs(saldoMinutos) <= tolerancia,
    saldoMinutos
  };
}

export function formatarHorasMinutos(minutos: number): string {
  const h = Math.floor(Math.abs(minutos) / 60);
  const m = Math.abs(minutos) % 60;
  const sinal = minutos < 0 ? '-' : '';
  return `${sinal}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function calcularBancoHoras(saldos: number[]): { saldo: number; formatado: string } {
  const total = saldos.reduce((a, b) => a + b, 0);
  return { saldo: total, formatado: formatarHorasMinutos(total) };
}
