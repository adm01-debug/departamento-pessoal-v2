import { describe, it, expect } from "vitest";
import { stringUtils } from "@/utils/stringUtils";
describe("stringUtils", () => {
  it("capitaliza string", () => { expect(stringUtils.capitalize("teste")).toBe("Teste"); });
  it("capitaliza todas palavras", () => { expect(stringUtils.capitalizeWords("joao silva")).toBe("Joao Silva"); });
  it("cria slug", () => { expect(stringUtils.slugify("Olá Mundo!")).toBe("ola-mundo"); });
  it("trunca string", () => { expect(stringUtils.truncate("texto muito longo", 10)).toBe("texto m..."); });
  it("extrai iniciais", () => { expect(stringUtils.initials("João Silva")).toBe("JS"); });
});
