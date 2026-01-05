import { describe, it, expect } from "vitest";
import { rubricaValidator } from "./rubricaValidator";
describe("rubricaValidator", () => {
  it("valida rubrica de provento", () => {
    const result = rubricaValidator.validate({ codigo: "1000", descricao: "Salário Base", tipo: "PROVENTO", natureza: "SALARIO", incideINSS: true, incideIRRF: true, incideFGTS: true, ativo: true });
    expect(result.success).toBe(true);
  });
  it("valida rubrica de desconto", () => {
    const result = rubricaValidator.validate({ codigo: "9001", descricao: "INSS", tipo: "DESCONTO", natureza: "CONTRIBUICAO", incideINSS: false, ativo: true });
    expect(result.success).toBe(true);
  });
  it("rejeita código inválido", () => {
    const result = rubricaValidator.validate({ codigo: "", descricao: "Teste", tipo: "PROVENTO" });
    expect(result.success).toBe(false);
  });
});
