import { describe, it, expect } from "vitest";
import { calculoMultaFGTS } from "./calculoMultaFGTS";
describe("calculoMultaFGTS", () => {
  it("calcula multa 40% para demissão sem justa causa", () => {
    const result = calculoMultaFGTS({ saldoFGTS: 10000, tipoRescisao: "SEM_JUSTA_CAUSA" });
    expect(result.percentualMulta).toBe(40);
    expect(result.valorMulta).toBe(4000);
  });
  it("calcula multa 20% para acordo", () => {
    const result = calculoMultaFGTS({ saldoFGTS: 10000, tipoRescisao: "ACORDO" });
    expect(result.percentualMulta).toBe(20);
    expect(result.valorMulta).toBe(2000);
  });
  it("não calcula multa para justa causa", () => {
    const result = calculoMultaFGTS({ saldoFGTS: 10000, tipoRescisao: "JUSTA_CAUSA" });
    expect(result.percentualMulta).toBe(0);
    expect(result.valorMulta).toBe(0);
  });
});
