import { describe, it, expect } from "vitest";
import { feriasValidator, FeriasInput } from "./feriasValidator";

describe("feriasValidator", () => {
  const validFerias: FeriasInput = {
    colaboradorId: "123",
    dataInicio: "2025-02-01",
    dataFim: "2025-02-20",
    diasGozo: 20,
    diasAbono: 0,
    periodoAquisitivoInicio: "2024-01-01",
    periodoAquisitivoFim: "2024-12-31",
  };

  it("valida férias corretas", () => {
    const result = feriasValidator.safeParse(validFerias);
    expect(result.success).toBe(true);
  });

  it("rejeita dias de gozo menor que 5", () => {
    const result = feriasValidator.safeParse({ ...validFerias, diasGozo: 3 });
    expect(result.success).toBe(false);
  });

  it("rejeita dias de gozo maior que 30", () => {
    const result = feriasValidator.safeParse({ ...validFerias, diasGozo: 35 });
    expect(result.success).toBe(false);
  });

  it("rejeita dias de abono maior que 10", () => {
    const result = feriasValidator.safeParse({ ...validFerias, diasAbono: 15 });
    expect(result.success).toBe(false);
  });

  it("rejeita total de dias maior que 30", () => {
    const result = feriasValidator.safeParse({ ...validFerias, diasGozo: 25, diasAbono: 10 });
    expect(result.success).toBe(false);
  });

  it("rejeita data fim anterior a data início", () => {
    const result = feriasValidator.safeParse({
      ...validFerias,
      dataInicio: "2025-02-20",
      dataFim: "2025-02-01",
    });
    expect(result.success).toBe(false);
  });

  it("valida férias com abono pecuniário", () => {
    const result = feriasValidator.safeParse({
      ...validFerias,
      diasGozo: 20,
      diasAbono: 10,
    });
    expect(result.success).toBe(true);
  });
});
