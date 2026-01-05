import { describe, it, expect } from "vitest";
import { lotacaoTransformer } from "./lotacaoTransformer";
describe("lotacaoTransformer", () => {
  it("transforma para API", () => {
    const data = { codigo: "CC001", descricao: "Administrativo", tipo: "CENTRO_CUSTO", codigoContabil: "1.1.01" };
    const result = lotacaoTransformer.toAPI(data);
    expect(result.codigo_contabil).toBe("1.1.01");
  });
  it("transforma de API", () => {
    const data = { id: "1", codigo: "CC001", descricao: "Administrativo", tipo: "CENTRO_CUSTO", codigo_contabil: "1.1.01" };
    const result = lotacaoTransformer.fromAPI(data);
    expect(result.codigoContabil).toBe("1.1.01");
  });
});
