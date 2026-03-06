// @ts-nocheck
// fgtsService - FGTS calculation wrapper
import { calcularFGTS, calcularFGTSRescisorio } from "@/calculators/fgts";

const fgtsService = {
  calcular: (salario: number) => salario * 0.08,
  calcularDeposito: (baseCalculo: number) => {
    try {
      return calcularFGTS(baseCalculo);
    } catch {
      return { deposito: baseCalculo * 0.08 };
    }
  },
  calcularRescisorio: (saldoFGTS: number, tipo: string) => {
    try {
      return calcularFGTSRescisorio(saldoFGTS, tipo as any);
    } catch {
      return { multa: saldoFGTS * 0.4 };
    }
  },
};

export default fgtsService;
