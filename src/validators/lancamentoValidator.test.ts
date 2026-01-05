import { describe, it, expect } from "vitest";
import { lancamentoSchema } from "@/validators/lancamentoValidator";
describe("lancamentoValidator", () => {
  it("valida lançamento válido", () => { const result = lancamentoSchema.safeParse({ colaboradorId: "123e4567-e89b-12d3-a456-426614174000", competencia: "01/2025", rubricaId: "1001", tipo: "PROVENTO", valor: 500 }); expect(result.success).toBe(true); });
  it("rejeita competência inválida", () => { const result = lancamentoSchema.safeParse({ colaboradorId: "123e4567-e89b-12d3-a456-426614174000", competencia: "2025-01", rubricaId: "1001", tipo: "PROVENTO", valor: 500 }); expect(result.success).toBe(false); });
});
