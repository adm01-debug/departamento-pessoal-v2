import { describe, it, expect } from "vitest";
import { calculoMediaSalarial } from "./calculoMediaSalarial";
describe("calculoMediaSalarial", () => {
  it("calcula média salarial simples", () => {
    const remuneracoes = [{ competencia: "2024-10", salarioBase: 3000 }, { competencia: "2024-11", salarioBase: 3000 }, { competencia: "2024-12", salarioBase: 3000 }];
    const result = calculoMediaSalarial({ remuneracoes, mesesParaMedia: 3 });
    expect(result.mediaSalarioBase).toBe(3000);
  });
  it("calcula média com variáveis", () => {
    const remuneracoes = [{ competencia: "2024-10", salarioBase: 3000, horasExtras: 500 }, { competencia: "2024-11", salarioBase: 3000, horasExtras: 300 }, { competencia: "2024-12", salarioBase: 3000, horasExtras: 200 }];
    const result = calculoMediaSalarial({ remuneracoes, mesesParaMedia: 3, incluirHorasExtras: true });
    expect(result.mediaVariaveis).toBeCloseTo(333.33, 2);
  });
});
