import { describe, it, expect } from "vitest";
import { jornadaValidator } from "./jornadaValidator";
describe("jornadaValidator", () => {
  it("valida jornada válida", () => {
    const result = jornadaValidator.validate({ codigo: "JOR001", descricao: "Comercial", horaInicio: "08:00", horaFim: "18:00", cargaHorariaDiaria: 8, tipo: "NORMAL", diasSemana: [1,2,3,4,5], ativo: true });
    expect(result.success).toBe(true);
  });
  it("rejeita jornada sem código", () => {
    const result = jornadaValidator.validate({ descricao: "Teste", horaInicio: "08:00", horaFim: "17:00" });
    expect(result.success).toBe(false);
  });
  it("calcula carga horária semanal", () => {
    const carga = jornadaValidator.calcularCargaSemanal(8, [1,2,3,4,5]);
    expect(carga).toBe(40);
  });
});
