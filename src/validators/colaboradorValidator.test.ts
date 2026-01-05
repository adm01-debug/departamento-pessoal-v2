import { describe, it, expect } from "vitest";
import { colaboradorSchema } from "@/validators/colaboradorValidator";
describe("colaboradorValidator", () => {
  it("valida colaborador válido", () => { const result = colaboradorSchema.safeParse({ nome: "João Silva", cpf: "12345678901", dataAdmissao: "2025-01-01", salarioBase: 5000 }); expect(result.success).toBe(true); });
  it("rejeita nome curto", () => { const result = colaboradorSchema.safeParse({ nome: "Jo", cpf: "12345678901", dataAdmissao: "2025-01-01", salarioBase: 5000 }); expect(result.success).toBe(false); });
  it("rejeita salário negativo", () => { const result = colaboradorSchema.safeParse({ nome: "João Silva", cpf: "12345678901", dataAdmissao: "2025-01-01", salarioBase: -100 }); expect(result.success).toBe(false); });
});
