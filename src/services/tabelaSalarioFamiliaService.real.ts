-e // V19-S018: TabelaSalarioFamiliaService Real
import { LIMITE_SALARIO_FAMILIA_2026, VALOR_COTA_SALARIO_FAMILIA_2026 } from "@/constants/tabelas.constants";
export const tabelaSalarioFamiliaServiceReal = {
  getLimite: () => LIMITE_SALARIO_FAMILIA_2026,
  getValorCota: () => VALOR_COTA_SALARIO_FAMILIA_2026,
  temDireito: (salario: number) => salario <= LIMITE_SALARIO_FAMILIA_2026,
  calcular(salario: number, dependentes: number) {
    if (salario > LIMITE_SALARIO_FAMILIA_2026) return 0;
    return dependentes * VALOR_COTA_SALARIO_FAMILIA_2026;
  },
  getHistorico: () => [{ ano: 2026, limite: LIMITE_SALARIO_FAMILIA_2026, valor: VALOR_COTA_SALARIO_FAMILIA_2026 }]
};
export default tabelaSalarioFamiliaServiceReal;
