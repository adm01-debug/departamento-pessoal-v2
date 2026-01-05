import { describe, it, expect } from "vitest";
import { formatters } from "@/utils/formatters";
describe("formatters", () => {
  it("formata CPF corretamente", () => { expect(formatters.cpf("12345678901")).toBe("123.456.789-01"); });
  it("formata CNPJ corretamente", () => { expect(formatters.cnpj("12345678000195")).toBe("12.345.678/0001-95"); });
  it("formata telefone celular", () => { expect(formatters.telefone("11999887766")).toBe("(11) 99988-7766"); });
  it("formata moeda", () => { expect(formatters.moeda(1234.56)).toBe("R$ 1.234,56"); });
  it("formata percentual", () => { expect(formatters.percentual(45.5)).toBe("45.50%"); });
});
