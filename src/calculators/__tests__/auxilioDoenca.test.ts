// V18-T022: Testes Auxílio Doença
import { describe, it, expect } from "vitest";
import { calcularAuxilioDoenca } from "../auxilioDoenca";
describe("Calculadora Auxílio Doença", () => {
  it("empresa paga 15 primeiros dias", () => { const r = calcularAuxilioDoenca(3000, 20); expect(r.diasEmpresa).toBe(15); });
  it("INSS paga a partir do 16º dia", () => { const r = calcularAuxilioDoenca(3000, 30); expect(r.diasINSS).toBe(15); });
});
