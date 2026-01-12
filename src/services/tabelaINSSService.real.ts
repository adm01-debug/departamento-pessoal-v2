-e // V19-S017: TabelaINSSService Real
import { TABELA_INSS_2026, TETO_INSS_2026 } from "@/constants/tabelas.constants";
export const tabelaINSSServiceReal = {
  getTabela: () => TABELA_INSS_2026,
  getTeto: () => TETO_INSS_2026,
  getHistorico: () => [{ ano: 2026, tabela: TABELA_INSS_2026, teto: TETO_INSS_2026 }],
  calcular(salario: number) {
    let inss = 0;
    let baseRestante = Math.min(salario, TETO_INSS_2026);
    for (const faixa of TABELA_INSS_2026) {
      if (baseRestante <= 0) break;
      const baseNaFaixa = Math.min(baseRestante, faixa.ate - (faixa.de || 0));
      inss += baseNaFaixa * (faixa.aliquota / 100);
      baseRestante -= baseNaFaixa;
    }
    return Math.round(inss * 100) / 100;
  }
};
export default tabelaINSSServiceReal;
