import { describe, it, expect } from "vitest";
import { validators } from "@/utils/validators";
describe("validators", () => {
  it("valida CPF válido", () => { expect(validators.cpf("52998224725")).toBe(true); });
  it("rejeita CPF inválido", () => { expect(validators.cpf("11111111111")).toBe(false); });
  it("valida email válido", () => { expect(validators.email("test@example.com")).toBe(true); });
  it("rejeita email inválido", () => { expect(validators.email("invalid")).toBe(false); });
  it("valida telefone válido", () => { expect(validators.telefone("11999887766")).toBe(true); });
});
