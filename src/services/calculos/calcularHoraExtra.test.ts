import { describe, it, expect } from "vitest";
import { calcularHoraExtra } from "./calcularHoraExtra";
describe("calcularHoraExtra", () => {
  it("calcula HE 50%", () => { const result = calcularHoraExtra(4400, 220, 10, 0); expect(result.total50).toBe(300); });
  it("calcula HE 100%", () => { const result = calcularHoraExtra(4400, 220, 0, 10); expect(result.total100).toBe(400); });
  it("calcula adicional noturno", () => { const result = calcularHoraExtra(4400, 220, 0, 0, 40); expect(result.adicionalNoturno).toBe(160); });
  it("soma todos os valores", () => { const result = calcularHoraExtra(4400, 220, 10, 5, 20); expect(result.total).toBe(300 + 200 + 80); });
});
