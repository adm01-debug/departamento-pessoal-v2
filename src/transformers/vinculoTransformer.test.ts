import { describe, it, expect } from "vitest";
import { vinculoTransformer } from "./vinculoTransformer";
describe("vinculoTransformer", () => {
  it("transforma para API corretamente", () => {
    const data = { colaboradorId: "123", matricula: "001", tipoVinculo: "CLT", salarioBase: 5000 };
    const result = vinculoTransformer.toAPI(data);
    expect(result.colaborador_id).toBe("123");
    expect(result.tipo_vinculo).toBe("CLT");
    expect(result.salario_base).toBe(5000);
  });
  it("transforma de API corretamente", () => {
    const data = { id: "1", colaborador_id: "123", matricula: "001", tipo_vinculo: "CLT", salario_base: 5000 };
    const result = vinculoTransformer.fromAPI(data);
    expect(result.colaboradorId).toBe("123");
    expect(result.tipoVinculo).toBe("CLT");
    expect(result.salarioBase).toBe(5000);
  });
});
