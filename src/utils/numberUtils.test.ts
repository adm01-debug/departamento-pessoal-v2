import { describe, it, expect } from "vitest";
import { numberUtils } from "@/utils/numberUtils";
describe("numberUtils", () => {
  it("arredonda corretamente", () => { expect(numberUtils.arredondar(3.456, 2)).toBe(3.46); });
  it("calcula percentual", () => { expect(numberUtils.percentual(25, 100)).toBe(25); });
  it("calcula variação percentual", () => { expect(numberUtils.variacaoPercentual(100, 120)).toBe(20); });
  it("limita valor no range", () => { expect(numberUtils.clamp(150, 0, 100)).toBe(100); });
  it("calcula média", () => { expect(numberUtils.media([10, 20, 30])).toBe(20); });
});
