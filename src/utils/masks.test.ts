import { describe, it, expect } from "vitest";
import { masks } from "@/utils/masks";
describe("masks", () => {
  it("mascara CPF", () => { expect(masks.cpf("12345678901")).toBe("123.456.789-01"); });
  it("mascara telefone celular", () => { expect(masks.telefone("11999887766")).toBe("(11) 99988-7766"); });
  it("mascara CEP", () => { expect(masks.cep("01234567")).toBe("01234-567"); });
  it("mascara moeda", () => { expect(masks.moeda("150000")).toBe("R$ 1.500,00"); });
  it("remove caracteres não numéricos", () => { expect(masks.apenasNumeros("abc123def456")).toBe("123456"); });
});
