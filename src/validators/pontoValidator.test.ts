import { describe, it, expect } from "vitest";
import { pontoSchema } from "@/validators/pontoValidator";
describe("pontoValidator", () => {
  it("valida ponto válido", () => { const result = pontoSchema.safeParse({ colaboradorId: "123e4567-e89b-12d3-a456-426614174000", data: "2025-01-05", entrada1: "08:00", saida1: "12:00", entrada2: "13:00", saida2: "17:00" }); expect(result.success).toBe(true); });
  it("rejeita horários inconsistentes", () => { const result = pontoSchema.safeParse({ colaboradorId: "123e4567-e89b-12d3-a456-426614174000", data: "2025-01-05", entrada1: "12:00", saida1: "08:00" }); expect(result.success).toBe(false); });
});
