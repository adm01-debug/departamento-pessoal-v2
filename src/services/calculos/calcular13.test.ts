import { describe, it, expect } from "vitest";
import { calcular13 } from "./calcular13";
describe("calcular13", () => {
  it("calcula 13 integral", () => { const result = calcular13(3000, 12); expect(result.valor).toBe(3000); expect(result.proporcional).toBe(false); });
  it("calcula 13 proporcional", () => { const result = calcular13(3000, 6); expect(result.valor).toBe(1500); expect(result.proporcional).toBe(true); });
  it("divide em parcelas", () => { const result = calcular13(3000, 12); expect(result.parcela1).toBe(1500); expect(result.parcela2).toBe(1500); });
});
