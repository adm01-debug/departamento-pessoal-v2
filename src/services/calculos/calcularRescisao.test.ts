import { describe, it, expect } from "vitest";
import { calcularRescisao } from "./calcularRescisao";
describe("calcularRescisao", () => {
  const baseDados = { salario: 3000, dataAdmissao: "2023-01-01", dataDemissao: "2025-01-05", saldoFGTS: 5000, diasFerias: 30, meses13: 1, avisoPrevio: "INDENIZADO" as const };
  it("calcula sem justa causa", () => { const result = calcularRescisao({ ...baseDados, tipo: "SEM_JUSTA_CAUSA" }); expect(result.multaFGTS).toBe(2000); expect(result.avisoPrevio).toBe(3000); });
  it("calcula justa causa", () => { const result = calcularRescisao({ ...baseDados, tipo: "JUSTA_CAUSA" }); expect(result.multaFGTS).toBe(0); expect(result.avisoPrevio).toBe(0); });
  it("calcula acordo", () => { const result = calcularRescisao({ ...baseDados, tipo: "ACORDO" }); expect(result.multaFGTS).toBe(1000); });
});
