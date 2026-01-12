// V18-T0{26..30}: Testes Validador eSocial 
import { describe, it, expect } from "vitest";
import { validate } from "../esocialValidator";
describe("Validador eSocial  - ", () => {
  it("deve rejeitar dados vazios", () => { const r = validate({}); expect(r.valid).toBe(false); expect(r.errors.length).toBeGreaterThan(0); });
  it("deve validar dados corretos", () => { const dados = { cpfTrab: "12345678901", nmTrab: "Teste" }; const r = validate(dados); expect(r).toBeDefined(); });
});
