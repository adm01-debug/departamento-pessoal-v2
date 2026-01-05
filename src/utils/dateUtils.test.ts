import { describe, it, expect } from "vitest";
import { dateUtils } from "@/utils/dateUtils";
describe("dateUtils", () => {
  it("adiciona dias corretamente", () => { const date = new Date("2025-01-01"); const result = dateUtils.adicionarDias(date, 5); expect(result.getDate()).toBe(6); });
  it("calcula diferença de dias", () => { const inicio = new Date("2025-01-01"); const fim = new Date("2025-01-10"); expect(dateUtils.diferencaDias(inicio, fim)).toBe(9); });
  it("identifica fim de semana", () => { const sabado = new Date("2025-01-04"); expect(dateUtils.isWeekend(sabado)).toBe(true); });
  it("formata competência", () => { const date = new Date("2025-01-15"); expect(dateUtils.formatCompetencia(date)).toBe("01/2025"); });
});
