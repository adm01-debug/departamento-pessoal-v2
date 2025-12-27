export const calcularHorasExtras = (salarioHora: number, horas: number, tipo: '50' | '100'): number => { const adicional = tipo === '50' ? 1.5 : 2; return salarioHora * horas * adicional; };
