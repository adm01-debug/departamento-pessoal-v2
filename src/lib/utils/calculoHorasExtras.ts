export interface HoraExtra { horas: number; tipo: "50" | "100" | "noturna"; }
export interface ResultadoHE { valorHoraNormal: number; horas50: number; valor50: number; horas100: number; valor100: number; horasNoturnas: number; valorNoturno: number; adicionalNoturno: number; totalHoras: number; totalValor: number; }

export function calcularValorHora(salario: number, cargaHorariaMensal: number = 220): number { return salario / cargaHorariaMensal; }

export function calcularHorasExtras(salario: number, horasExtras: HoraExtra[], cargaHoraria: number = 220): ResultadoHE {
  const valorHora = calcularValorHora(salario, cargaHoraria);
  let horas50=0,valor50=0,horas100=0,valor100=0,horasNoturnas=0,valorNoturno=0,adicionalNoturno=0;
  
  for(const he of horasExtras) {
    switch(he.tipo) {
      case "50": horas50+=he.horas; valor50+=he.horas*valorHora*1.5; break;
      case "100": horas100+=he.horas; valor100+=he.horas*valorHora*2; break;
      case "noturna": horasNoturnas+=he.horas; valorNoturno+=he.horas*valorHora*1.5; adicionalNoturno+=he.horas*valorHora*0.2; break;
    }
  }
  
  return { valorHoraNormal: Math.round(valorHora*100)/100, horas50, valor50: Math.round(valor50*100)/100, horas100, valor100: Math.round(valor100*100)/100, horasNoturnas, valorNoturno: Math.round(valorNoturno*100)/100, adicionalNoturno: Math.round(adicionalNoturno*100)/100, totalHoras: horas50+horas100+horasNoturnas, totalValor: Math.round((valor50+valor100+valorNoturno+adicionalNoturno)*100)/100 };
}

export function calcularHoraNoturna(horasRelogio: number): number { return horasRelogio * (60/52.5); }
export function calcularAdicionalNoturno(salario: number, horasNoturnas: number): number { return (salario/220) * horasNoturnas * 0.2; }
export function calcularDSR(totalHE: number, diasUteis: number, diasDescanso: number): number { return (totalHE/diasUteis)*diasDescanso; }
export default { calcularHorasExtras, calcularValorHora, calcularHoraNoturna, calcularAdicionalNoturno, calcularDSR };
