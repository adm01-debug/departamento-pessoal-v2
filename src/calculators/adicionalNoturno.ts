// V17-C002: Calculadora de Adicional Noturno
export interface ParamsNoturno {
  salarioBase: number;
  horasNoturnas: number;
  cargaHorariaMensal?: number;
  percentualAdicional?: number;
}

export interface ResultNoturno {
  valorHoraNormal: number;
  valorHoraNoturna: number;
  adicionalNoturno: number;
  horasNoturnasReduzidas: number;
}

export function calcularAdicionalNoturno(params: ParamsNoturno): ResultNoturno {
  const { salarioBase, horasNoturnas, cargaHorariaMensal = 220, percentualAdicional = 20 } = params;
  const valorHoraNormal = salarioBase / cargaHorariaMensal;
  const horasNoturnasReduzidas = horasNoturnas * (60 / 52.5);
  const valorHoraNoturna = valorHoraNormal * (1 + percentualAdicional / 100);
  const adicionalNoturno = Math.round(horasNoturnas * valorHoraNormal * (percentualAdicional / 100) * 100) / 100;
  return { valorHoraNormal: Math.round(valorHoraNormal * 100) / 100, valorHoraNoturna: Math.round(valorHoraNoturna * 100) / 100, adicionalNoturno, horasNoturnasReduzidas: Math.round(horasNoturnasReduzidas * 100) / 100 };
}
