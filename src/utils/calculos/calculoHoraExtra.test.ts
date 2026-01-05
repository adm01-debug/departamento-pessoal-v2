import { describe, it, expect } from "vitest";
import { calculoHoraExtra } from "./calculoHoraExtra";
describe("calculoHoraExtra", () => {
  it("calcula hora extra 50% corretamente", () => {
    const result = calculoHoraExtra({ salarioBase: 3000, cargaHorariaMensal: 220, horasExtras50: 10, horasExtras100: 0, horasExtrasNoturnas: 0 });
    expect(result.valorHoraNormal).toBeCloseTo(13.64, 2);
    expect(result.valorHE50).toBeCloseTo(204.55, 2);
  });
  it("calcula hora extra 100% corretamente", () => {
    const result = calculoHoraExtra({ salarioBase: 3000, cargaHorariaMensal: 220, horasExtras50: 0, horasExtras100: 5, horasExtrasNoturnas: 0 });
    expect(result.valorHE100).toBeCloseTo(136.36, 2);
  });
  it("calcula total corretamente", () => {
    const result = calculoHoraExtra({ salarioBase: 3000, cargaHorariaMensal: 220, horasExtras50: 10, horasExtras100: 5, horasExtrasNoturnas: 2 });
    expect(result.totalHorasExtras).toBeGreaterThan(0);
  });
});
