import { describe, it, expect } from "vitest";
import { calculoSalarioFamilia } from "./calculoSalarioFamilia";
describe("calculoSalarioFamilia", () => {
  it("retorna valor correto para salário dentro do limite", () => {
    const result = calculoSalarioFamilia({ salarioBruto: 1500, dependentes: [{ idade: 5, invalido: false }, { idade: 10, invalido: false }] });
    expect(result.temDireito).toBe(true);
    expect(result.totalDependentes).toBe(2);
  });
  it("não concede para salário acima do limite", () => {
    const result = calculoSalarioFamilia({ salarioBruto: 5000, dependentes: [{ idade: 5, invalido: false }] });
    expect(result.temDireito).toBe(false);
    expect(result.valorTotal).toBe(0);
  });
  it("não conta dependentes maiores de 14 anos", () => {
    const result = calculoSalarioFamilia({ salarioBruto: 1500, dependentes: [{ idade: 15, invalido: false }, { idade: 5, invalido: false }] });
    expect(result.totalDependentes).toBe(1);
  });
});
